<?php

namespace Tests\Feature\Settings;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrganizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_user_redirected_to_create_org()
    {
        $user = User::factory()->create([
            'current_organization_id' => null,
        ]);

        $response = $this->actingAs($user)->get('/settings/organization');

        $response->assertRedirect(route('organization.create'));
    }

    public function test_user_can_create_organization()
    {
        $user = User::factory()->create([
            'current_organization_id' => null,
        ]);

        $response = $this->actingAs($user)->post('/settings/organization', [
            'name' => 'My New Startup',
            'slug' => 'my-new-startup',
            'description' => 'A great place to work',
        ]);

        $response->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('organizations', [
            'name' => 'My New Startup',
            'slug' => 'my-new-startup',
        ]);

        $user->refresh();
        $this->assertNotNull($user->current_organization_id);
        $this->assertEquals('My New Startup', $user->currentOrganization->name);

        // Assert user is admin of the new org
        $this->assertTrue($user->organizations()->where('name', 'My New Startup')->exists());
        $this->assertEquals('admin', $user->organizations()->first()->pivot->role);
    }

    public function test_user_can_switch_organization()
    {
        $user = User::factory()->create();
        $org1 = Organization::factory()->create();
        $org2 = Organization::factory()->create();

        $user->organizations()->attach($org1->id, ['role' => 'member']);
        $user->organizations()->attach($org2->id, ['role' => 'member']);
        $user->update(['current_organization_id' => $org1->id]);

        $response = $this->actingAs($user)->post(route('organizations.switch'), [
            'organization_id' => $org2->id,
        ]);

        $response->assertRedirect();

        $user->refresh();
        $this->assertEquals($org2->id, $user->current_organization_id);
    }

    public function test_user_cannot_switch_to_unowned_org()
    {
        $user = User::factory()->create();
        $org1 = Organization::factory()->create();
        $org2 = Organization::factory()->create(); // User not attached

        $user->organizations()->attach($org1->id, ['role' => 'member']);
        $user->update(['current_organization_id' => $org1->id]);

        $response = $this->actingAs($user)->post(route('organizations.switch'), [
            'organization_id' => $org2->id,
        ]);

        $response->assertStatus(403);

        $user->refresh();
        $this->assertEquals($org1->id, $user->current_organization_id);
    }

    public function test_user_without_org_redirected_from_dashboard()
    {
        $user = User::factory()->create([
            'current_organization_id' => null,
        ]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertRedirect(route('organization.create'));
    }

    public function test_user_with_org_can_access_dashboard()
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create();

        $user->organizations()->attach($org->id, ['role' => 'admin']);
        $user->update(['current_organization_id' => $org->id]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_admin_can_delete_org_with_multiple_orgs()
    {
        $user = User::factory()->create();
        $org1 = Organization::factory()->create();
        $org2 = Organization::factory()->create();

        $user->organizations()->attach($org1->id, ['role' => 'admin']);
        $user->organizations()->attach($org2->id, ['role' => 'member']);
        $user->update(['current_organization_id' => $org1->id]);

        $response = $this->actingAs($user)->delete('/settings/organization');

        $response->assertRedirect(route('dashboard'));
        $this->assertDatabaseMissing('organizations', ['id' => $org1->id]);

        $user->refresh();
        $this->assertEquals($org2->id, $user->current_organization_id);
    }

    public function test_admin_cannot_delete_only_org()
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create();

        $user->organizations()->attach($org->id, ['role' => 'admin']);
        $user->update(['current_organization_id' => $org->id]);

        $response = $this->actingAs($user)->delete('/settings/organization');

        $response->assertRedirect();
        $response->assertSessionHasErrors('organization');
        $this->assertDatabaseHas('organizations', ['id' => $org->id]);
    }

    public function test_non_admin_cannot_delete_org()
    {
        $user = User::factory()->create();
        $org1 = Organization::factory()->create();
        $org2 = Organization::factory()->create();

        $user->organizations()->attach($org1->id, ['role' => 'member']);
        $user->organizations()->attach($org2->id, ['role' => 'member']);
        $user->update(['current_organization_id' => $org1->id]);

        $response = $this->actingAs($user)->delete('/settings/organization');

        $response->assertStatus(403);
        $this->assertDatabaseHas('organizations', ['id' => $org1->id]);
    }
}
