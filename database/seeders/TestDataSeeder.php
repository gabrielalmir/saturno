<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Sprint;
use App\Models\User;
use App\Models\WorkItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::create([
            'name' => 'Saturno E2E',
            'slug' => 'saturno-e2e',
            'description' => 'Dados de teste para Playwright (E2E)',
            'logo_path' => null,
        ]);

        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'current_organization_id' => $organization->id,
            'analyst_role' => 'developer',
        ]);

        $organization->users()->attach($user->id, ['role' => 'admin']);

        $member = User::create([
            'name' => 'Maria Silva',
            'email' => 'maria@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'current_organization_id' => $organization->id,
            'analyst_role' => 'qa',
        ]);
        $organization->users()->attach($member->id, ['role' => 'analyst']);

        // Sprint in planning so /sprint-planning is not empty.
        $planning = Sprint::create([
            'organization_id' => $organization->id,
            'name' => 'Sprint 1',
            'goal' => 'Sprint de testes E2E',
            'status' => 'planning',
            'start_date' => now()->startOfWeek()->toDateString(),
            'end_date' => now()->startOfWeek()->addDays(13)->toDateString(),
            'capacity_total' => 40,
            'capacity_reserved_n1' => 10,
            'wip_limit' => 3,
        ]);

        // Active sprint to enable WIP indicator/metrics in board.
        $active = Sprint::create([
            'organization_id' => $organization->id,
            'name' => 'Sprint Ativa',
            'goal' => 'Execução',
            'status' => 'active',
            'start_date' => now()->subDays(2)->toDateString(),
            'end_date' => now()->addDays(12)->toDateString(),
            'capacity_total' => 40,
            'capacity_reserved_n1' => 10,
            'wip_limit' => 3,
            'started_at' => now(),
        ]);

        // N2 backlog/ready without sprint for planning pipeline.
        WorkItem::create([
            'organization_id' => $organization->id,
            'title' => 'E2E Backlog Item',
            'description' => 'Seed item (backlog)',
            'tier' => 'N2',
            'type' => 'servico',
            'size' => 'padrao',
            'priority' => 'P2',
            'status' => 'backlog',
            'sprint_id' => null,
            'assignee_id' => $user->id,
            'reporter_id' => $user->id,
            'estimate' => 3,
            'due_date' => now()->addDays(7)->toDateString(),
        ]);

        WorkItem::create([
            'organization_id' => $organization->id,
            'title' => 'E2E Ready Item',
            'description' => 'Seed item (ready)',
            'tier' => 'N2',
            'type' => 'servico',
            'size' => 'padrao',
            'priority' => 'P2',
            'status' => 'ready',
            'sprint_id' => null,
            'assignee_id' => $user->id,
            'reporter_id' => $user->id,
            'estimate' => 5,
            'due_date' => now()->addDays(3)->toDateString(),
        ]);

        // One item in active sprint so the board has something immediately.
        WorkItem::create([
            'organization_id' => $organization->id,
            'title' => 'E2E In Progress',
            'description' => 'Seed item (in_progress)',
            'tier' => 'N2',
            'type' => 'servico',
            'size' => 'padrao',
            'priority' => 'P1',
            'status' => 'in_progress',
            'sprint_id' => $active->id,
            'assignee_id' => $user->id,
            'reporter_id' => $user->id,
            'estimate' => 2,
            'started_at' => now()->subHours(2),
        ]);

        // Keep Sprint 1 connected: an item already in scope.
        WorkItem::create([
            'organization_id' => $organization->id,
            'title' => 'E2E In Scope (Ready)',
            'description' => 'Seed item (planning scope)',
            'tier' => 'N2',
            'type' => 'servico',
            'size' => 'padrao',
            'priority' => 'P2',
            'status' => 'ready',
            'sprint_id' => $planning->id,
            'assignee_id' => $user->id,
            'reporter_id' => $user->id,
            'estimate' => 3,
        ]);
    }
}
