<?php

use App\Models\Organization;
use App\Models\Sprint;
use App\Models\User;
use App\Models\WorkItem;

function makeOrgFor(User $user): Organization
{
    $org = Organization::create([
        'name' => 'Acme',
        'slug' => 'acme',
        'description' => null,
        'logo_path' => null,
    ]);

    $user->organizations()->attach($org->id, ['role' => 'admin']);
    $user->current_organization_id = $org->id;
    $user->save();

    return $org;
}

test('work item cannot exceed sprint WIP limit when moving to in_progress', function () {
    $user = User::factory()->create();
    $org = makeOrgFor($user);

    $sprint = Sprint::create([
        'organization_id' => $org->id,
        'name' => 'Sprint 1',
        'goal' => null,
        'status' => 'active',
        'start_date' => now()->subDays(2)->toDateString(),
        'end_date' => now()->addDays(12)->toDateString(),
        'capacity_total' => 20,
        'capacity_reserved_n1' => 5,
        'wip_limit' => 2,
        'started_at' => now(),
    ]);

    WorkItem::create([
        'organization_id' => $org->id,
        'title' => 'Already in progress #1',
        'tier' => 'N2',
        'type' => 'servico',
        'size' => 'padrao',
        'priority' => 'P2',
        'status' => 'in_progress',
        'assignee_id' => $user->id,
        'reporter_id' => $user->id,
        'estimate' => 3,
        'sprint_id' => $sprint->id,
        'started_at' => now()->subHours(2),
    ]);

    WorkItem::create([
        'organization_id' => $org->id,
        'title' => 'Already in progress #2',
        'tier' => 'N2',
        'type' => 'servico',
        'size' => 'padrao',
        'priority' => 'P2',
        'status' => 'in_progress',
        'assignee_id' => $user->id,
        'reporter_id' => $user->id,
        'estimate' => 5,
        'sprint_id' => $sprint->id,
        'started_at' => now()->subHours(1),
    ]);

    $candidate = WorkItem::create([
        'organization_id' => $org->id,
        'title' => 'Candidate',
        'tier' => 'N2',
        'type' => 'servico',
        'size' => 'padrao',
        'priority' => 'P2',
        'status' => 'ready',
        'assignee_id' => $user->id,
        'reporter_id' => $user->id,
        'estimate' => 2,
        'sprint_id' => $sprint->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->withHeader('Accept', 'application/json')
        ->put("/work-items/{$candidate->id}", [
            'status' => 'in_progress',
        ]);

    $response->assertStatus(422)->assertJsonValidationErrors(['status']);
});

test('work item cannot jump from backlog to done', function () {
    $user = User::factory()->create();
    $org = makeOrgFor($user);

    $item = WorkItem::create([
        'organization_id' => $org->id,
        'title' => 'Backlog item',
        'tier' => 'N1',
        'type' => 'servico',
        'size' => 'rapido',
        'priority' => 'P2',
        'status' => 'backlog',
        'reporter_id' => $user->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->withHeader('Accept', 'application/json')
        ->put("/work-items/{$item->id}", [
            'status' => 'done',
        ]);

    $response->assertStatus(422)->assertJsonValidationErrors(['status']);
});
