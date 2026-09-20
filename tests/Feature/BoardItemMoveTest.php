<?php

use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\BoardItem;
use App\Models\Organization;
use App\Models\User;
use App\Models\WorkItem;

function makeOrgForBoardTest(User $user): Organization
{
    $org = Organization::create([
        'name' => 'Acme Board',
        'slug' => 'acme-board',
        'description' => null,
        'logo_path' => null,
    ]);

    $user->organizations()->attach($org->id, ['role' => 'admin']);
    $user->current_organization_id = $org->id;
    $user->current_project_id = null;
    $user->save();

    return $org;
}

test('moving an item within the same column without explicit order does not inflate its position', function () {
    $user = User::factory()->create();
    $org = makeOrgForBoardTest($user);

    $board = Board::create([
        'organization_id' => $org->id,
        'project_id' => null,
        'name' => 'Main Board',
        'description' => null,
        'context_type' => 'custom',
        'context_filter' => null,
    ]);

    $column = BoardColumn::create([
        'board_id' => $board->id,
        'name' => 'Geral',
        'kind' => 'grouping',
        'status_mapping' => null,
        'position' => 1,
    ]);

    $workItem = WorkItem::create([
        'organization_id' => $org->id,
        'project_id' => null,
        'title' => 'Card A',
        'tier' => 'N1',
        'type' => 'servico',
        'size' => 'rapido',
        'priority' => 'P2',
        'status' => 'backlog',
        'reporter_id' => $user->id,
    ]);

    $boardItem = BoardItem::create([
        'board_id' => $board->id,
        'column_id' => $column->id,
        'work_item_id' => $workItem->id,
        'position' => 1,
    ]);

    $this->actingAs($user)
        ->post(route('boards.items.move', ['board' => $board->id]), [
            'work_item_id' => $workItem->id,
            'from_column_id' => $column->id,
            'to_column_id' => $column->id,
        ])
        ->assertRedirect();

    expect($boardItem->fresh()->position)->toBe(1);
});
