<?php

namespace App\Services;

use App\Models\Holiday;
use App\Models\Sprint;
use App\Models\SprintUserN1Reservation;
use App\Models\User;
use App\Models\UserAvailability;
use App\Models\WorkItem;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class SprintCapacityCalculator
{
    /**
     * Source of truth for N1 reserve:
     * 1. If a WorkCadence is defined for the team, use its percentage of total capacity.
     * 2. If not, if sprint has member-based reserve enabled, sum per-user `reserved_n1`.
     * 3. Otherwise fall back to the sprint-level `capacity_reserved_n1`.
     */
    public function getReservedN1(Sprint $sprint): int
    {
        $cadence = $sprint->team?->workCadence;
        if ($cadence && $sprint->capacity_total > 0) {
            return (int) (($sprint->capacity_total * $cadence->n1_n2_split_percentage) / 100);
        }

        if ($sprint->use_member_n1_reserve) {
            return (int) (SprintUserN1Reservation::where('sprint_id', $sprint->id)->sum('reserved_n1') ?? 0);
        }

        return (int) ($sprint->capacity_reserved_n1 ?? 0);
    }

    /**
     * Calculate working days in the sprint period, excluding weekends and holidays
     */
    public function calculateWorkingDays(Sprint $sprint): int
    {
        $period = CarbonPeriod::create($sprint->start_date, $sprint->end_date);
        $holidays = $this->getHolidaysForPeriod($sprint);

        $workingDays = 0;
        foreach ($period as $date) {
            // Skip weekends
            if ($date->isWeekend()) {
                continue;
            }

            // Skip holidays
            if ($this->isHoliday($date, $holidays)) {
                continue;
            }

            $workingDays++;
        }

        return $workingDays;
    }

    /**
     * Calculate available capacity for a user in hours, considering absences and holidays
     */
    public function calculateAvailableCapacity(Sprint $sprint, User $user): float
    {
        $workingDays = $this->calculateWorkingDays($sprint);
        $hoursPerDay = 8; // Standard work day

        $totalCapacity = $workingDays * $hoursPerDay;

        // Adjust for user availability (absences, reduced availability)
        $availabilities = UserAvailability::where('user_id', $user->id)
            ->where('organization_id', $sprint->organization_id)
            ->where(function ($query) use ($sprint) {
                $query->whereBetween('start_date', [$sprint->start_date, $sprint->end_date])
                    ->orWhereBetween('end_date', [$sprint->start_date, $sprint->end_date])
                    ->orWhere(function ($q) use ($sprint) {
                        $q->where('start_date', '<=', $sprint->start_date)
                            ->where('end_date', '>=', $sprint->end_date);
                    });
            })
            ->get();

        if ($availabilities->isEmpty()) {
            return $totalCapacity;
        }

        // Calculate reduced capacity due to absences
        $period = CarbonPeriod::create($sprint->start_date, $sprint->end_date);
        $holidays = $this->getHolidaysForPeriod($sprint);
        $adjustedCapacity = 0;

        foreach ($period as $date) {
            // Skip weekends and holidays (already excluded from working days)
            if ($date->isWeekend() || $this->isHoliday($date, $holidays)) {
                continue;
            }

            // Check availability for this date
            $availabilityPercentage = 100;
            foreach ($availabilities as $availability) {
                if ($date->between($availability->start_date, $availability->end_date)) {
                    $availabilityPercentage = min($availabilityPercentage, $availability->availability_percentage);
                }
            }

            $adjustedCapacity += ($hoursPerDay * $availabilityPercentage) / 100;
        }

        return $adjustedCapacity;
    }

    /**
     * Calculate allocated capacity for a user in a sprint
     */
    public function calculateAllocatedCapacity(Sprint $sprint, User $user): float
    {
        $workItems = WorkItem::where('sprint_id', $sprint->id)
            ->whereHas('allocations', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with('allocations')
            ->get();

        $allocated = 0;
        foreach ($workItems as $item) {
            $allocation = $item->allocations->where('user_id', $user->id)->first();
            if ($allocation) {
                $allocated += $allocation->estimated_hours ?? 0;
            }
        }

        return $allocated;
    }

    /**
     * Calculate remaining capacity for a user
     */
    public function calculateRemainingCapacity(Sprint $sprint, User $user): float
    {
        $available = $this->calculateAvailableCapacity($sprint, $user);
        $allocated = $this->calculateAllocatedCapacity($sprint, $user);

        return max(0, $available - $allocated);
    }

    /**
     * Check if sprint is over-allocated
     */
    public function isOverallocated(Sprint $sprint): bool
    {
        // Get all users with allocations in this sprint
        $userIds = WorkItem::where('sprint_id', $sprint->id)
            ->whereHas('allocations')
            ->with('allocations')
            ->get()
            ->pluck('allocations')
            ->flatten()
            ->pluck('user_id')
            ->unique();

        foreach ($userIds as $userId) {
            $user = User::find($userId);
            if (! $user) {
                continue;
            }

            $remaining = $this->calculateRemainingCapacity($sprint, $user);
            if ($remaining < 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * Calculate effective N1 capacity considering buffer
     */
    public function calculateEffectiveN1Capacity(Sprint $sprint): float
    {
        $reserved = $this->getReservedN1($sprint);
        $bufferPercentage = $sprint->buffer_percentage_n1 ?? 20;

        return $reserved * (1 - ($bufferPercentage / 100));
    }

    /**
     * Get sprint capacity summary
     */
    public function getCapacitySummary(Sprint $sprint): array
    {
        $totalCapacity = $sprint->capacity_total ?? 0;
        $reservedN1 = $this->getReservedN1($sprint);
        $effectiveN1 = $this->calculateEffectiveN1Capacity($sprint);
        $bufferN1 = $reservedN1 - $effectiveN1;

        return [
            'total_capacity' => $totalCapacity,
            'reserved_n1' => $reservedN1,
            'effective_n1' => $effectiveN1,
            'buffer_n1' => $bufferN1,
            'available_for_planned' => $totalCapacity - $reservedN1,
            'working_days' => $this->calculateWorkingDays($sprint),
            'is_overallocated' => $this->isOverallocated($sprint),
        ];
    }

    /**
     * Get holidays for a sprint period
     */
    private function getHolidaysForPeriod(Sprint $sprint): array
    {
        $holidays = Holiday::where('organization_id', $sprint->organization_id)
            ->where(function ($query) use ($sprint) {
                $query->whereBetween('date', [$sprint->start_date, $sprint->end_date])
                    ->orWhere('is_recurring', true);
            })
            ->get();

        $dates = [];
        foreach ($holidays as $holiday) {
            if ($holiday->is_recurring) {
                // Add for each year in sprint period
                $startYear = $sprint->start_date->year;
                $endYear = $sprint->end_date->year;

                for ($year = $startYear; $year <= $endYear; $year++) {
                    $holidayDate = $holiday->getDateForYear($year);
                    if ($holidayDate->between($sprint->start_date, $sprint->end_date)) {
                        $dates[] = $holidayDate->format('Y-m-d');
                    }
                }
            } else {
                $dates[] = $holiday->date->format('Y-m-d');
            }
        }

        return $dates;
    }

    /**
     * Check if a date is a holiday
     */
    private function isHoliday(Carbon $date, array $holidays): bool
    {
        return in_array($date->format('Y-m-d'), $holidays);
    }
}
