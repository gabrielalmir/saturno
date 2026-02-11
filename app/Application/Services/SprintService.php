<?php

namespace App\Application\Services;

use App\Models\Sprint;
use App\Models\User;
use App\Models\WorkItem;
use App\Services\SprintCapacityCalculator;
use Illuminate\Validation\ValidationException;

class SprintService
{
    public function __construct(
        private SprintCapacityCalculator $capacityCalculator
    ) {}

    public function start(Sprint $sprint, User $user): void
    {
        if ($sprint->status !== 'planning') {
            throw ValidationException::withMessages(['start' => 'Sprint precisa estar em planejamento.']);
        }

        // Must have items
        $items = WorkItem::where('sprint_id', $sprint->id)->get();
        if ($items->isEmpty()) {
            throw ValidationException::withMessages(['start' => 'Não é possível iniciar sprint sem itens de trabalho.']);
        }

        // N2 commitment vs capacity
        $n2Commitment = $items->where('tier', 'N2')->sum('estimate') ?? 0;
        $reservedN1 = $this->capacityCalculator->getReservedN1($sprint);
        $availableCapacity = ($sprint->capacity_total ?? 0) - $reservedN1;
        if ($availableCapacity < 0) {
            $availableCapacity = 0;
        }
        if ($n2Commitment > $availableCapacity) {
            throw ValidationException::withMessages(['start' => 'Capacidade comprometida excede o disponível para N2.']);
        }

        $sprint->update([
            'status' => 'active',
            'started_at' => now(),
            'capacity_snapshot_total' => $sprint->capacity_total,
            'capacity_snapshot_reserved_n1' => $reservedN1,
            'commitment_snapshot' => $n2Commitment,
        ]);
    }

    public function complete(Sprint $sprint): array
    {
        if ($sprint->status !== 'active') {
            throw ValidationException::withMessages(['complete' => 'Apenas sprints ativas podem ser encerradas.']);
        }

        $items = WorkItem::where('sprint_id', $sprint->id)->get();
        $doneCount = $items->where('status', 'done')->count();
        $totalCount = $items->count();

        // carry over incomplete
        WorkItem::where('sprint_id', $sprint->id)
            ->whereNotIn('status', ['done'])
            ->update(['sprint_id' => null, 'status' => 'backlog']);

        $sprint->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return [
            'done' => $doneCount,
            'total' => $totalCount,
        ];
    }
}
