<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAvailability extends Model
{
    protected $table = 'user_availability';

    protected $fillable = [
        'user_id',
        'organization_id',
        'start_date',
        'end_date',
        'availability_percentage',
        'reason',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'availability_percentage' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Check if this availability period overlaps with given dates
     */
    public function overlaps($startDate, $endDate): bool
    {
        return $this->start_date <= $endDate && $this->end_date >= $startDate;
    }

    /**
     * Get availability percentage for a specific date
     */
    public function getAvailabilityForDate($date): int
    {
        if ($date >= $this->start_date && $date <= $this->end_date) {
            return $this->availability_percentage;
        }

        return 100; // Full availability if outside period
    }
}
