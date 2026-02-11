<?php

use App\Models\Organization;
use App\Models\Sprint;
use App\Models\User;
use App\Models\WorkItem;
use Inertia\Testing\AssertableInertia as Assert;

test('sprint planning lists N2 ready and backlog work items', function () {
    $org = Organization::factory()->create();
    $user = User::factory()->create([
        'current_organization_id' => $org->id,
    ]);
    $user->organizations()->attach($org->id, ['role' => 'admin']);

    $readyItem = WorkItem::create([
        'organization_id' => $org->id,
        'title' => 'Ready N2',
        'tier' => 'N2',
        'type' => 'service',
        'size' => 'standard',
        'priority' => 'P2',
        'status' => 'ready',
    ]);

    $backlogItem = WorkItem::create([
        'organization_id' => $org->id,
        'title' => 'Backlog N2',
        'tier' => 'N2',
        'type' => 'service',
        'size' => 'standard',
        'priority' => 'P2',
        'status' => 'backlog',
    ]);

    WorkItem::create([
        'organization_id' => $org->id,
        'title' => 'Ready N1',
        'tier' => 'N1',
        'type' => 'service',
        'size' => 'standard',
        'priority' => 'P2',
        'status' => 'ready',
    ]);

    $response = $this->actingAs($user)->get(route('sprint-planning'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('sprint-planning')
        ->has('readyItems', 1)
        ->has('backlogItems', 1)
        ->where('readyItems.0.id', $readyItem->id)
        ->where('backlogItems.0.id', $backlogItem->id)
    );
});

test('creating sprint with item_ids assigns work items to sprint', function () {
    $org = Organization::factory()->create();
    $user = User::factory()->create([
        'current_organization_id' => $org->id,
    ]);
    $user->organizations()->attach($org->id, ['role' => 'admin']);

    $item = WorkItem::create([
        'organization_id' => $org->id,
        'title' => 'Work item for sprint',
        'tier' => 'N2',
        'type' => 'service',
        'size' => 'standard',
        'priority' => 'P2',
        'status' => 'ready',
    ]);

    $response = $this->actingAs($user)->post(route('sprints.store'), [
        'name' => 'Sprint 1',
        'start_date' => now()->toDateString(),
        'end_date' => now()->addWeek()->toDateString(),
        'item_ids' => [$item->id],
    ]);

    $response->assertRedirect();

    $sprint = Sprint::first();

    expect($sprint)->not->toBeNull();
    expect($item->fresh()->sprint_id)->toBe($sprint->id);
});
