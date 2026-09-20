<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Sprint;
use App\Models\User;
use App\Models\WorkItem;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create or get default organization
        $organization = Organization::updateOrCreate(
            ['slug' => 'saturno-team'],
            [
                'name' => 'Saturno Team',
                'description' => 'Organização padrão do Saturno',
            ]
        );

        // Create or update test user and attach to organization as admin
        $user = User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'current_organization_id' => $organization->id,
            ]
        );

        if (! $organization->users()->where('user_id', $user->id)->exists()) {
            $organization->users()->attach($user->id, ['role' => 'admin']);
        }

        // Create additional team members
        $member1 = User::updateOrCreate(
            ['email' => 'maria@example.com'],
            [
                'name' => 'Maria Silva',
                'password' => bcrypt('password'),
                'current_organization_id' => $organization->id,
                'analyst_role' => 'qa',
            ]
        );
        if (! $organization->users()->where('user_id', $member1->id)->exists()) {
            $organization->users()->attach($member1->id, ['role' => 'analyst']);
        }

        $member2 = User::updateOrCreate(
            ['email' => 'joao@example.com'],
            [
                'name' => 'João Santos',
                'password' => bcrypt('password'),
                'current_organization_id' => $organization->id,
                'analyst_role' => 'infra',
            ]
        );
        if (! $organization->users()->where('user_id', $member2->id)->exists()) {
            $organization->users()->attach($member2->id, ['role' => 'maintainer']);
        }

        // Create current sprint if it doesn't exist for this org
        $sprint = Sprint::firstOrCreate(
            [
                'organization_id' => $organization->id,
                'name' => 'Sprint 1',
            ],
            [
                'status' => 'planning',
                'goal' => 'Estabilizar fluxo N1 e destravar itens críticos',
                'start_date' => now()->startOfWeek(),
                'end_date' => now()->startOfWeek()->addDays(13),
                'capacity_total' => 40,
                'capacity_reserved_n1' => 10,
                'wip_limit' => 5,
            ]
        );

        // Create sample work items only if they don't exist
        if (WorkItem::where('organization_id', $organization->id)->count() === 0) {
            WorkItem::create([
                'organization_id' => $organization->id,
                'title' => 'Implementar autenticação OAuth',
                'description' => 'Adicionar login via Google e GitHub',
                'tier' => 'N2',
                'type' => 'servico',
                'size' => 'padrao',
                'priority' => 'P1',
                'status' => 'in_progress',
                'sprint_id' => $sprint->id,
                'assignee_id' => $user->id,
                'reporter_id' => $user->id,
                'estimate' => 8,
                'due_date' => now()->addDays(3)->toDateString(),
            ]);

            WorkItem::create([
                'organization_id' => $organization->id,
                'title' => 'Corrigir bug de timeout no relatório',
                'description' => 'Relatório mensal está dando timeout',
                'tier' => 'N1',
                'type' => 'incidente',
                'size' => 'rapido',
                'priority' => 'P0',
                'status' => 'ready',
                'sprint_id' => $sprint->id,
                'assignee_id' => $member1->id,
                'reporter_id' => $user->id,
                'estimate' => 4,
                'due_date' => now()->addDays(1)->toDateString(),
            ]);

            WorkItem::create([
                'organization_id' => $organization->id,
                'title' => 'Refatorar módulo de pagamentos',
                'description' => 'Melhorar arquitetura e adicionar testes',
                'tier' => 'N2',
                'type' => 'mudanca',
                'size' => 'longo',
                'priority' => 'P2',
                'status' => 'backlog',
                'sprint_id' => $sprint->id,
                'assignee_id' => $member2->id,
                'reporter_id' => $user->id,
                'estimate' => 13,
                'due_date' => now()->addDays(10)->toDateString(),
            ]);

            WorkItem::create([
                'organization_id' => $organization->id,
                'title' => 'Investigar lentidão no dashboard',
                'description' => 'Dashboard está lento para usuários com muitos dados',
                'tier' => 'N2',
                'type' => 'problema',
                'size' => 'padrao',
                'priority' => 'P2',
                'status' => 'backlog',
                'sprint_id' => null, // No sprint - backlog
                'reporter_id' => $member1->id,
                'estimate' => 5,
                'due_date' => now()->addDays(14)->toDateString(),
            ]);
        }
    }
}
