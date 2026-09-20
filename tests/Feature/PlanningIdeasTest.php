<?php

use App\Application\Services\SprintService;
use App\Models\Holiday;
use App\Models\Organization;
use App\Models\Sprint;
use App\Models\Team;
use App\Models\User;
use App\Models\UserAvailability;
use App\Models\WorkItem;
use App\Services\SprintCapacityCalculator;
use Illuminate\Validation\ValidationException;

function planningIdeasOrgFor(User $user): Organization
{
    $org = Organization::create([
        'name' => 'Planning Org',
        'slug' => 'planning-org',
        'description' => null,
        'logo_path' => null,
    ]);

    $user->organizations()->attach($org->id, ['role' => 'admin']);
    $user->forceFill(['current_organization_id' => $org->id])->save();

    Team::create([
        'organization_id' => $org->id,
        'name' => 'Core Team',
    ]);

    return $org;
}

test('completing a sprint carries unfinished tasks to backlog', function () {
    $user = User::factory()->create();
    $org = planningIdeasOrgFor($user);

    $sprint = Sprint::create([
        'organization_id' => $org->id,
        'name' => 'Sprint Carry Over',
        'status' => 'active',
        'start_date' => now()->subDays(3)->toDateString(),
        'end_date' => now()->addDays(7)->toDateString(),
    ]);

    $teamId = Team::where('organization_id', $org->id)->value('id');

    $doneTask = WorkItem::create([
        'organization_id' => $org->id,
        'team_id' => $teamId,
        'sprint_id' => $sprint->id,
        'title' => 'Done task',
        'tier' => 'N2',
        'type' => 'servico',
        'size' => 'padrao',
        'priority' => 'P2',
        'status' => 'done',
        'reporter_id' => $user->id,
    ]);

    $unfinishedTask = WorkItem::create([
        'organization_id' => $org->id,
        'team_id' => $teamId,
        'sprint_id' => $sprint->id,
        'title' => 'Pending task',
        'tier' => 'N2',
        'type' => 'servico',
        'size' => 'padrao',
        'priority' => 'P2',
        'status' => 'in_progress',
        'reporter_id' => $user->id,
    ]);

    $summary = app(SprintService::class)->complete($sprint);

    expect($summary['done'])->toBe(1)
        ->and($summary['total'])->toBe(2);

    expect($doneTask->fresh()->sprint_id)->toBe($sprint->id)
        ->and($doneTask->fresh()->status)->toBe('done');

    expect($unfinishedTask->fresh()->sprint_id)->toBeNull()
        ->and($unfinishedTask->fresh()->status)->toBe('backlog');
});

test('starting sprint blocks N2 commitment above capacity available for planned work', function () {
    $user = User::factory()->create();
    $org = planningIdeasOrgFor($user);

    $sprint = Sprint::create([
        'organization_id' => $org->id,
        'name' => 'Sprint Capacity',
        'status' => 'planning',
        'start_date' => now()->toDateString(),
        'end_date' => now()->addDays(10)->toDateString(),
        'capacity_total' => 10,
        'capacity_reserved_n1' => 4,
    ]);

    $teamId = Team::where('organization_id', $org->id)->value('id');

    WorkItem::create([
        'organization_id' => $org->id,
        'team_id' => $teamId,
        'sprint_id' => $sprint->id,
        'title' => 'N2 planned task',
        'tier' => 'N2',
        'type' => 'servico',
        'size' => 'padrao',
        'priority' => 'P2',
        'status' => 'ready',
        'estimate' => 7,
        'assignee_id' => $user->id,
        'reporter_id' => $user->id,
    ]);

    expect(fn () => app(SprintService::class)->start($sprint, $user))
        ->toThrow(ValidationException::class);

    expect($sprint->fresh()->status)->toBe('planning');
});

test('capacity calculation considers holidays and partial analyst availability', function () {
    $user = User::factory()->create();
    $org = planningIdeasOrgFor($user);

    $sprint = Sprint::create([
        'organization_id' => $org->id,
        'name' => 'Sprint Calendar Rules',
        'status' => 'planning',
        'start_date' => '2026-02-02', // monday
        'end_date' => '2026-02-06',   // friday
        'capacity_total' => 40,
        'capacity_reserved_n1' => 8,
    ]);

    Holiday::create([
        'organization_id' => $org->id,
        'name' => 'Org Holiday',
        'date' => '2026-02-04',
        'is_recurring' => false,
    ]);

    UserAvailability::create([
        'organization_id' => $org->id,
        'user_id' => $user->id,
        'start_date' => '2026-02-03',
        'end_date' => '2026-02-03',
        'availability_percentage' => 50,
        'reason' => 'N1 urgent support load',
    ]);

    $calculator = app(SprintCapacityCalculator::class);

    expect($calculator->calculateWorkingDays($sprint))->toBe(4)
        ->and($calculator->calculateAvailableCapacity($sprint, $user))->toBe(28.0);
});
