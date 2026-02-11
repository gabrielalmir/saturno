<?php

use App\Models\Organization;
use App\Models\User;

test('authenticated users with org can visit visao macro', function () {
    $user = User::factory()->create();
    $org = Organization::factory()->create();
    $user->organizations()->attach($org->id, ['role' => 'admin']);
    $user->update(['current_organization_id' => $org->id]);

    $this->actingAs($user);

    $response = $this->get(route('visao-macro'));
    $response->assertOk();
});
