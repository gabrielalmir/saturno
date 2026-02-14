<?php

use App\Models\Holiday;
use App\Models\Organization;
use App\Models\Sprint;
use App\Models\User;
use App\Models\WorkItem;
use Illuminate\Support\Facades\DB;

function makeUserInOrg(string $role = 'user'): array
{
    $organization = Organization::factory()->create();
    $user = User::factory()->create([
        'current_organization_id' => $organization->id,
        'current_project_id' => null,
    ]);

    $user->organizations()->attach($organization->id, ['role' => $role]);

    return [$user, $organization];
}

it('blocks cross-organization holiday updates', function () {
    [$user] = makeUserInOrg('admin');
    $otherOrg = Organization::factory()->create();
    $holiday = Holiday::create([
        'organization_id' => $otherOrg->id,
        'date' => now()->toDateString(),
        'name' => 'Other Org Holiday',
        'is_recurring' => false,
    ]);

    $this->actingAs($user)
        ->put("/api/holidays/{$holiday->id}", [
            'name' => 'Updated Name',
        ])
        ->assertStatus(404);
});

it('blocks non-managers from creating availability for other users', function () {
    [$user, $organization] = makeUserInOrg('user');
    $otherUser = User::factory()->create();
    $otherUser->organizations()->attach($organization->id, ['role' => 'user']);

    $this->actingAs($user)
        ->post('/api/availability', [
            'user_id' => $otherUser->id,
            'start_date' => now()->toDateString(),
            'end_date' => now()->addDay()->toDateString(),
            'availability_percentage' => 50,
        ])
        ->assertStatus(403);
});

it('blocks cross-organization work item allocation access', function () {
    [$user] = makeUserInOrg('admin');
    $otherOrg = Organization::factory()->create();
    $workItem = WorkItem::create([
        'organization_id' => $otherOrg->id,
        'project_id' => null,
        'title' => 'Other org work item',
        'tier' => 'N1',
        'type' => 'servico',
        'size' => 'rapido',
        'priority' => 'P2',
        'status' => 'backlog',
    ]);

    $this->actingAs($user)
        ->get("/api/work-items/{$workItem->id}/allocations")
        ->assertStatus(404);
});

it('blocks cross-organization sprint capacity access', function () {
    [$user] = makeUserInOrg('admin');
    $otherOrg = Organization::factory()->create();
    $sprint = Sprint::create([
        'organization_id' => $otherOrg->id,
        'project_id' => null,
        'name' => 'Other Org Sprint',
        'status' => 'planning',
        'start_date' => now()->toDateString(),
        'end_date' => now()->addDays(14)->toDateString(),
        'capacity_total' => 40,
        'capacity_reserved_n1' => 10,
        'wip_limit' => 5,
    ]);

    $this->actingAs($user)
        ->get("/api/sprints/{$sprint->id}/capacity")
        ->assertStatus(404);
});

it('requires manager role to start sprints', function () {
    [$user, $organization] = makeUserInOrg('user');
    $sprint = Sprint::create([
        'organization_id' => $organization->id,
        'project_id' => null,
        'name' => 'Scoped Sprint',
        'status' => 'planning',
        'start_date' => now()->toDateString(),
        'end_date' => now()->addDays(14)->toDateString(),
        'capacity_total' => 40,
        'capacity_reserved_n1' => 10,
        'wip_limit' => 5,
    ]);

    WorkItem::create([
        'organization_id' => $organization->id,
        'project_id' => null,
        'title' => 'Sprint item',
        'tier' => 'N2',
        'type' => 'servico',
        'size' => 'padrao',
        'priority' => 'P2',
        'status' => 'ready',
        'reporter_id' => $user->id,
        'assignee_id' => $user->id,
        'estimate' => 3,
        'sprint_id' => $sprint->id,
    ]);

    $this->actingAs($user)
        ->post("/sprints/{$sprint->id}/start")
        ->assertStatus(403);
});

it('prevents maintainer from escalating member to admin', function () {
    [$maintainer, $organization] = makeUserInOrg('maintainer');
    $member = User::factory()->create();
    $organization->users()->attach($member->id, ['role' => 'user']);

    $this->actingAs($maintainer)
        ->put("/settings/organization/members/{$member->id}", [
            'role' => 'admin',
        ])
        ->assertStatus(403);

    $role = DB::table('organization_user')
        ->where('organization_id', $organization->id)
        ->where('user_id', $member->id)
        ->value('role');

    expect($role)->toBe('user');
});

it('restricts integration configuration to managers', function () {
    [$user] = makeUserInOrg('user');

    $this->actingAs($user)
        ->post('/settings/integrations', [
            'provider' => 'jira',
            'direction' => 'pull',
            'frequency' => 'manual',
            'conflict_policy' => 'manual_review',
            'config' => [
                'base_url' => 'https://example.atlassian.net',
                'token' => 'test-token',
                'email' => 'dev@example.com',
            ],
        ])
        ->assertStatus(403);
});

