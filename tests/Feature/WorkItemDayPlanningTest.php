<?php

use App\Models\Organization;
use App\Models\User;
use App\Models\WorkItem;

function makeOrgForPlanning(User $user): Organization
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

test('work item can be planned for a given date', function () {
    $user = User::factory()->create();
    $org = makeOrgForPlanning($user);

    $item = WorkItem::create([
        'organization_id' => $org->id,
        'title' => 'Plan me',
        'tier' => 'N2',
        'type' => 'servico',
        'size' => 'padrao',
        'priority' => 'P2',
        'status' => 'ready',
        'assignee_id' => $user->id,
        'reporter_id' => $user->id,
        'estimate' => 3,
    ]);

    $response = $this
        ->actingAs($user)
        ->withHeader('Accept', 'application/json')
        ->put("/work-items/{$item->id}", [
            'planned_for' => now()->toDateString(),
        ]);

    $response->assertStatus(302);
    expect($item->fresh()->planned_for?->toDateString())->toBe(now()->toDateString());
});

test('done work items cannot be deleted', function () {
    $user = User::factory()->create();
    $org = makeOrgForPlanning($user);

    $item = WorkItem::create([
        'organization_id' => $org->id,
        'title' => 'Done item',
        'tier' => 'N1',
        'type' => 'servico',
        'size' => 'rapido',
        'priority' => 'P2',
        'status' => 'done',
        'reporter_id' => $user->id,
        'completed_at' => now(),
    ]);

    $response = $this
        ->actingAs($user)
        ->withHeader('Accept', 'application/json')
        ->delete("/work-items/{$item->id}");

    $response->assertStatus(422)->assertJsonValidationErrors(['delete']);
    expect(WorkItem::query()->whereKey($item->id)->exists())->toBeTrue();
});
