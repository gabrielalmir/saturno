<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\BoardItem;
use App\Models\Epic;
use App\Models\Holiday;
use App\Models\Integration;
use App\Models\IntegrationLink;
use App\Models\IntegrationSyncLog;
use App\Models\Organization;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\SprintUserN1Reservation;
use App\Models\Team;
use App\Models\TeamEvent;
use App\Models\Ticket;
use App\Models\User;
use App\Models\UserAvailability;
use App\Models\WorkCadence;
use App\Models\WorkItem;
use App\Models\WorkItemAllocation;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSaturnoOwnerSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::updateOrCreate(
            ['slug' => 'saturno'],
            [
                'name' => 'Saturno',
                'description' => 'Ambiente de demonstracao completo do Saturno',
                'planning_unit' => 'story_points',
            ]
        );

        $admin = User::updateOrCreate(
            ['email' => 'admin@saturno.com.br'],
            [
                'name' => 'Admin Saturno',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'current_organization_id' => $organization->id,
                'analyst_role' => 'manager',
            ]
        );

        $maintainer = User::updateOrCreate(
            ['email' => 'produto@saturno.com.br'],
            [
                'name' => 'Paula Produto',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'current_organization_id' => $organization->id,
                'analyst_role' => 'po',
            ]
        );

        $analyst = User::updateOrCreate(
            ['email' => 'analista@saturno.com.br'],
            [
                'name' => 'Ana Analista',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'current_organization_id' => $organization->id,
                'analyst_role' => 'qa',
            ]
        );

        $developer = User::updateOrCreate(
            ['email' => 'dev@saturno.com.br'],
            [
                'name' => 'Diego Dev',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'current_organization_id' => $organization->id,
                'analyst_role' => 'developer',
            ]
        );

        $support = User::updateOrCreate(
            ['email' => 'suporte@saturno.com.br'],
            [
                'name' => 'Sofia Suporte',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'current_organization_id' => $organization->id,
                'analyst_role' => 'support',
            ]
        );

        $this->syncOrganizationRole($organization, $admin, 'admin');
        $this->syncOrganizationRole($organization, $maintainer, 'maintainer');
        $this->syncOrganizationRole($organization, $analyst, 'analyst');
        $this->syncOrganizationRole($organization, $developer, 'user');
        $this->syncOrganizationRole($organization, $support, 'analyst');

        $principalProject = Project::updateOrCreate(
            [
                'organization_id' => $organization->id,
                'slug' => 'saturno-principal',
            ],
            [
                'name' => 'Produto Saturno',
                'description' => 'Projeto principal para demonstracao',
                'settings' => ['demo_mode' => true],
            ]
        );

        Project::updateOrCreate(
            [
                'organization_id' => $organization->id,
                'slug' => 'saturno-mobile',
            ],
            [
                'name' => 'Aplicativo Mobile',
                'description' => 'Projeto secundario para portfolio de iniciativas',
                'settings' => ['platform' => 'ios_android'],
            ]
        );

        $this->syncProjectRole($principalProject, $admin, 'manager');
        $this->syncProjectRole($principalProject, $maintainer, 'manager');
        $this->syncProjectRole($principalProject, $analyst, 'member');
        $this->syncProjectRole($principalProject, $developer, 'member');
        $this->syncProjectRole($principalProject, $support, 'member');

        foreach ([$admin, $maintainer, $analyst, $developer, $support] as $member) {
            $member->forceFill([
                'current_organization_id' => $organization->id,
                'current_project_id' => $principalProject->id,
            ])->save();
        }

        $platformTeam = Team::updateOrCreate(
            [
                'organization_id' => $organization->id,
                'name' => 'Time Plataforma',
            ],
            [
                'project_id' => $principalProject->id,
                'description' => 'Responsavel por backlog N2 e arquitetura',
            ]
        );

        $opsTeam = Team::updateOrCreate(
            [
                'organization_id' => $organization->id,
                'name' => 'Time Operacoes',
            ],
            [
                'project_id' => $principalProject->id,
                'description' => 'Responsavel por operacao e demandas N1',
            ]
        );

        $this->syncTeamRole($platformTeam, $admin, 'manager');
        $this->syncTeamRole($platformTeam, $maintainer, 'manager');
        $this->syncTeamRole($platformTeam, $analyst, 'analyst');
        $this->syncTeamRole($platformTeam, $developer, 'analyst');
        $this->syncTeamRole($opsTeam, $support, 'manager');
        $this->syncTeamRole($opsTeam, $analyst, 'analyst');
        $this->syncTeamRole($opsTeam, $developer, 'analyst');

        WorkCadence::updateOrCreate(
            ['team_id' => $platformTeam->id, 'name' => 'Cadencia Principal'],
            [
                'organization_id' => $organization->id,
                'sprint_duration_weeks' => 2,
                'sprint_start_day' => 'Monday',
                'n1_n2_split_percentage' => 20,
            ]
        );

        WorkCadence::updateOrCreate(
            ['team_id' => $opsTeam->id, 'name' => 'Cadencia Operacional'],
            [
                'organization_id' => $organization->id,
                'sprint_duration_weeks' => 1,
                'sprint_start_day' => 'Monday',
                'n1_n2_split_percentage' => 35,
            ]
        );

        $today = now()->startOfDay();

        $planningSprint = Sprint::updateOrCreate(
            [
                'organization_id' => $organization->id,
                'project_id' => $principalProject->id,
                'name' => 'Sprint Planejamento',
            ],
            [
                'team_id' => $platformTeam->id,
                'goal' => 'Preparar proximas entregas da plataforma',
                'status' => 'planning',
                'start_date' => $today->copy()->next('Monday')->toDateString(),
                'end_date' => $today->copy()->next('Monday')->addDays(13)->toDateString(),
                'capacity_total' => 80,
                'capacity_reserved_n1' => 16,
                'use_member_n1_reserve' => true,
                'buffer_percentage_n1' => 20,
                'wip_limit' => 6,
                'capacity_snapshot_total' => null,
                'capacity_snapshot_reserved_n1' => null,
                'commitment_snapshot' => null,
                'started_at' => null,
                'completed_at' => null,
            ]
        );

        $activeSprint = Sprint::updateOrCreate(
            [
                'organization_id' => $organization->id,
                'project_id' => $principalProject->id,
                'name' => 'Sprint Ativa',
            ],
            [
                'team_id' => $platformTeam->id,
                'goal' => 'Entregar automacoes e reduzir retrabalho',
                'status' => 'active',
                'start_date' => $today->copy()->subDays(4)->toDateString(),
                'end_date' => $today->copy()->addDays(9)->toDateString(),
                'capacity_total' => 80,
                'capacity_reserved_n1' => 18,
                'use_member_n1_reserve' => true,
                'buffer_percentage_n1' => 22,
                'wip_limit' => 5,
                'capacity_snapshot_total' => 80,
                'capacity_snapshot_reserved_n1' => 18,
                'commitment_snapshot' => 55,
                'started_at' => $today->copy()->subDays(4),
                'completed_at' => null,
            ]
        );

        $doneSprint = Sprint::updateOrCreate(
            [
                'organization_id' => $organization->id,
                'project_id' => $principalProject->id,
                'name' => 'Sprint Anterior',
            ],
            [
                'team_id' => $platformTeam->id,
                'goal' => 'Consolidar base de monitoramento',
                'status' => 'completed',
                'start_date' => $today->copy()->subDays(21)->toDateString(),
                'end_date' => $today->copy()->subDays(8)->toDateString(),
                'capacity_total' => 75,
                'capacity_reserved_n1' => 15,
                'use_member_n1_reserve' => false,
                'buffer_percentage_n1' => 20,
                'wip_limit' => 5,
                'capacity_snapshot_total' => 75,
                'capacity_snapshot_reserved_n1' => 15,
                'commitment_snapshot' => 50,
                'started_at' => $today->copy()->subDays(21),
                'completed_at' => $today->copy()->subDays(8),
            ]
        );

        SprintUserN1Reservation::updateOrCreate(
            ['sprint_id' => $activeSprint->id, 'user_id' => $support->id],
            ['reserved_n1' => 12]
        );
        SprintUserN1Reservation::updateOrCreate(
            ['sprint_id' => $activeSprint->id, 'user_id' => $analyst->id],
            ['reserved_n1' => 6]
        );

        DB::table('sprint_events')->updateOrInsert(
            ['sprint_id' => $activeSprint->id, 'type' => 'started'],
            [
                'user_id' => $admin->id,
                'payload' => json_encode(['note' => 'Sprint iniciada para demonstracao']),
                'created_at' => $today->copy()->subDays(4),
                'updated_at' => now(),
            ]
        );
        DB::table('sprint_events')->updateOrInsert(
            ['sprint_id' => $doneSprint->id, 'type' => 'completed'],
            [
                'user_id' => $maintainer->id,
                'payload' => json_encode(['note' => 'Sprint concluida com sucesso']),
                'created_at' => $today->copy()->subDays(8),
                'updated_at' => now(),
            ]
        );

        $epicObservability = Epic::updateOrCreate(
            ['organization_id' => $organization->id, 'title' => 'Plataforma de Observabilidade'],
            [
                'project_id' => $principalProject->id,
                'description' => 'Melhorias de monitoramento e alertas',
                'status' => 'in_progress',
                'owner_id' => $maintainer->id,
            ]
        );

        $epicAutomation = Epic::updateOrCreate(
            ['organization_id' => $organization->id, 'title' => 'Automacao de Atendimento N1'],
            [
                'project_id' => $principalProject->id,
                'description' => 'Automacoes para fila operacional',
                'status' => 'planning',
                'owner_id' => $support->id,
            ]
        );

        $incidentTicket = Ticket::updateOrCreate(
            ['organization_id' => $organization->id, 'title' => 'Timeout no dashboard de relatorios'],
            [
                'project_id' => $principalProject->id,
                'description' => 'Clientes relatam timeout ao abrir relatorios mensais',
                'status' => 'open',
                'priority' => 'P0',
                'reporter_id' => $support->id,
                'assignee_id' => $developer->id,
                'due_date' => $today->copy()->addDays(2)->toDateString(),
            ]
        );

        $improvementTicket = Ticket::updateOrCreate(
            ['organization_id' => $organization->id, 'title' => 'Melhorar onboarding de novos clientes'],
            [
                'project_id' => $principalProject->id,
                'description' => 'Novo fluxo guiado de ativacao',
                'status' => 'in_progress',
                'priority' => 'P2',
                'reporter_id' => $maintainer->id,
                'assignee_id' => $analyst->id,
                'due_date' => $today->copy()->addDays(10)->toDateString(),
            ]
        );

        $story = WorkItem::updateOrCreate(
            ['organization_id' => $organization->id, 'jira_key' => 'SAT-100'],
            [
                'project_id' => $principalProject->id,
                'team_id' => $platformTeam->id,
                'title' => 'Story: Telemetria centralizada',
                'description' => 'Container para tarefas de observabilidade',
                'tier' => 'N2',
                'type' => 'story',
                'size' => 'epico',
                'priority' => 'P1',
                'status' => 'in_progress',
                'started_at' => $today->copy()->subDays(3),
                'blocked_at' => null,
                'blocked_reason' => null,
                'completed_at' => null,
                'assignee_id' => $developer->id,
                'reporter_id' => $maintainer->id,
                'estimate' => 13,
                'due_date' => $today->copy()->addDays(7)->toDateString(),
                'planned_for' => $today->copy()->addDays(1)->toDateString(),
                'planned_rank' => 1,
                'epic_id' => $epicObservability->id,
                'ticket_id' => $improvementTicket->id,
                'sprint_id' => $activeSprint->id,
                'parent_id' => null,
            ]
        );

        $workItems = [
            [
                'jira_key' => 'SAT-101',
                'title' => 'Configurar dashboards de latencia',
                'description' => 'Painel com SLO e taxa de erro por modulo',
                'tier' => 'N2',
                'type' => 'servico',
                'size' => 'padrao',
                'priority' => 'P1',
                'status' => 'ready',
                'started_at' => null,
                'blocked_at' => null,
                'blocked_reason' => null,
                'completed_at' => null,
                'assignee_id' => $analyst->id,
                'reporter_id' => $admin->id,
                'estimate' => 5,
                'due_date' => $today->copy()->addDays(4)->toDateString(),
                'planned_for' => $today->copy()->toDateString(),
                'planned_rank' => 2,
                'epic_id' => $epicObservability->id,
                'ticket_id' => $improvementTicket->id,
                'sprint_id' => $activeSprint->id,
                'team_id' => $platformTeam->id,
                'parent_id' => $story->id,
            ],
            [
                'jira_key' => 'SAT-102',
                'title' => 'Investigar timeout em consultas pesadas',
                'description' => 'Analisar query planner e incluir indice composto',
                'tier' => 'N1',
                'type' => 'incidente',
                'size' => 'rapido',
                'priority' => 'P0',
                'status' => 'blocked',
                'started_at' => $today->copy()->subDays(2),
                'blocked_at' => $today->copy()->subDay(),
                'blocked_reason' => 'Aguardando permissao no banco de producao',
                'completed_at' => null,
                'assignee_id' => $developer->id,
                'reporter_id' => $support->id,
                'estimate' => 3,
                'due_date' => $today->copy()->addDay()->toDateString(),
                'planned_for' => $today->copy()->toDateString(),
                'planned_rank' => 1,
                'epic_id' => $epicAutomation->id,
                'ticket_id' => $incidentTicket->id,
                'sprint_id' => $activeSprint->id,
                'team_id' => $opsTeam->id,
                'parent_id' => null,
            ],
            [
                'jira_key' => 'SAT-103',
                'title' => 'Automatizar triagem de chamados recorrentes',
                'description' => 'Criar regras para classificacao inicial N1',
                'tier' => 'N1',
                'type' => 'mudanca',
                'size' => 'padrao',
                'priority' => 'P1',
                'status' => 'in_progress',
                'started_at' => $today->copy()->subDays(1),
                'blocked_at' => null,
                'blocked_reason' => null,
                'completed_at' => null,
                'assignee_id' => $support->id,
                'reporter_id' => $maintainer->id,
                'estimate' => 8,
                'due_date' => $today->copy()->addDays(5)->toDateString(),
                'planned_for' => $today->copy()->addDay()->toDateString(),
                'planned_rank' => 3,
                'epic_id' => $epicAutomation->id,
                'ticket_id' => null,
                'sprint_id' => $activeSprint->id,
                'team_id' => $opsTeam->id,
                'parent_id' => null,
            ],
            [
                'jira_key' => 'SAT-104',
                'title' => 'Refatorar fila de processamento noturno',
                'description' => 'Separar filas por prioridade para reduzir backlog',
                'tier' => 'N2',
                'type' => 'servico',
                'size' => 'longo',
                'priority' => 'P2',
                'status' => 'backlog',
                'started_at' => null,
                'blocked_at' => null,
                'blocked_reason' => null,
                'completed_at' => null,
                'assignee_id' => $developer->id,
                'reporter_id' => $admin->id,
                'estimate' => 13,
                'due_date' => $today->copy()->addDays(15)->toDateString(),
                'planned_for' => null,
                'planned_rank' => null,
                'epic_id' => $epicObservability->id,
                'ticket_id' => null,
                'sprint_id' => null,
                'team_id' => $platformTeam->id,
                'parent_id' => null,
            ],
            [
                'jira_key' => 'SAT-105',
                'title' => 'Concluir padronizacao de alertas',
                'description' => 'Ajustar templates e thresholds por servico',
                'tier' => 'N2',
                'type' => 'problema',
                'size' => 'padrao',
                'priority' => 'P2',
                'status' => 'done',
                'started_at' => $today->copy()->subDays(10),
                'blocked_at' => null,
                'blocked_reason' => null,
                'completed_at' => $today->copy()->subDays(7),
                'assignee_id' => $analyst->id,
                'reporter_id' => $maintainer->id,
                'estimate' => 5,
                'due_date' => $today->copy()->subDays(8)->toDateString(),
                'planned_for' => $today->copy()->subDays(12)->toDateString(),
                'planned_rank' => 4,
                'epic_id' => $epicObservability->id,
                'ticket_id' => $improvementTicket->id,
                'sprint_id' => $doneSprint->id,
                'team_id' => $platformTeam->id,
                'parent_id' => null,
            ],
            [
                'jira_key' => 'SAT-106',
                'title' => 'Preparar escopo da proxima sprint',
                'description' => 'Item em planejamento para demonstrar pipeline',
                'tier' => 'N2',
                'type' => 'servico',
                'size' => 'padrao',
                'priority' => 'P3',
                'status' => 'ready',
                'started_at' => null,
                'blocked_at' => null,
                'blocked_reason' => null,
                'completed_at' => null,
                'assignee_id' => $maintainer->id,
                'reporter_id' => $admin->id,
                'estimate' => 3,
                'due_date' => $today->copy()->addDays(12)->toDateString(),
                'planned_for' => $today->copy()->addDays(6)->toDateString(),
                'planned_rank' => 5,
                'epic_id' => $epicAutomation->id,
                'ticket_id' => null,
                'sprint_id' => $planningSprint->id,
                'team_id' => $platformTeam->id,
                'parent_id' => null,
            ],
        ];

        $seededItems = [
            'SAT-100' => $story,
        ];

        foreach ($workItems as $itemData) {
            $seededItems[$itemData['jira_key']] = WorkItem::updateOrCreate(
                ['organization_id' => $organization->id, 'jira_key' => $itemData['jira_key']],
                array_merge($itemData, [
                    'organization_id' => $organization->id,
                    'project_id' => $principalProject->id,
                ])
            );
        }

        WorkItemAllocation::updateOrCreate(
            ['work_item_id' => $seededItems['SAT-102']->id, 'user_id' => $developer->id],
            ['allocation_percentage' => 70, 'estimated_hours' => null]
        );
        WorkItemAllocation::updateOrCreate(
            ['work_item_id' => $seededItems['SAT-102']->id, 'user_id' => $support->id],
            ['allocation_percentage' => 30, 'estimated_hours' => null]
        );
        WorkItemAllocation::updateOrCreate(
            ['work_item_id' => $seededItems['SAT-103']->id, 'user_id' => $support->id],
            ['allocation_percentage' => 100, 'estimated_hours' => null]
        );

        DB::table('work_item_events')->updateOrInsert(
            ['organization_id' => $organization->id, 'work_item_id' => $seededItems['SAT-102']->id, 'type' => 'blocked'],
            [
                'user_id' => $developer->id,
                'payload' => json_encode(['reason' => 'Aguardando permissao no banco de producao']),
                'created_at' => now()->subHours(20),
                'updated_at' => now()->subHours(20),
            ]
        );
        DB::table('work_item_events')->updateOrInsert(
            ['organization_id' => $organization->id, 'work_item_id' => $seededItems['SAT-105']->id, 'type' => 'completed'],
            [
                'user_id' => $analyst->id,
                'payload' => json_encode(['cycle_time_days' => 3]),
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ]
        );

        $board = Board::updateOrCreate(
            [
                'organization_id' => $organization->id,
                'project_id' => $principalProject->id,
                'context_type' => 'sprint',
            ],
            [
                'name' => 'Board Principal',
                'description' => 'Kanban principal da demonstracao',
                'context_filter' => [
                    'sprint' => 'active',
                    'include_unsprinted_backlog' => true,
                ],
            ]
        );

        $columnsByStatus = [];
        foreach ([
            ['name' => 'Backlog', 'status' => 'backlog', 'color' => '#64748b', 'position' => 1],
            ['name' => 'Pronto', 'status' => 'ready', 'color' => '#0284c7', 'position' => 2],
            ['name' => 'Em Progresso', 'status' => 'in_progress', 'color' => '#0f766e', 'position' => 3],
            ['name' => 'Bloqueado', 'status' => 'blocked', 'color' => '#b91c1c', 'position' => 4],
            ['name' => 'Concluido', 'status' => 'done', 'color' => '#15803d', 'position' => 5],
        ] as $columnData) {
            $column = $board->columns()->updateOrCreate(
                ['status_mapping' => $columnData['status']],
                [
                    'name' => $columnData['name'],
                    'kind' => 'status',
                    'color' => $columnData['color'],
                    'position' => $columnData['position'],
                ]
            );

            $columnsByStatus[$columnData['status']] = $column;
        }

        $positionByStatus = [
            'backlog' => 1,
            'ready' => 1,
            'in_progress' => 1,
            'blocked' => 1,
            'done' => 1,
        ];

        foreach ($seededItems as $workItem) {
            if (! isset($columnsByStatus[$workItem->status])) {
                continue;
            }

            BoardItem::updateOrCreate(
                [
                    'board_id' => $board->id,
                    'work_item_id' => $workItem->id,
                ],
                [
                    'column_id' => $columnsByStatus[$workItem->status]->id,
                    'position' => $positionByStatus[$workItem->status]++,
                ]
            );
        }

        Holiday::updateOrCreate(
            [
                'organization_id' => $organization->id,
                'date' => $today->copy()->addDays(9)->toDateString(),
                'name' => 'Feriado Municipal',
            ],
            ['is_recurring' => false]
        );
        Holiday::updateOrCreate(
            [
                'organization_id' => $organization->id,
                'date' => '2024-01-01',
                'name' => 'Confraternizacao Universal',
            ],
            ['is_recurring' => true]
        );

        UserAvailability::updateOrCreate(
            [
                'user_id' => $analyst->id,
                'organization_id' => $organization->id,
                'start_date' => $today->copy()->addDays(3)->toDateString(),
                'end_date' => $today->copy()->addDays(5)->toDateString(),
            ],
            [
                'availability_percentage' => 50,
                'reason' => 'Treinamento interno',
            ]
        );
        UserAvailability::updateOrCreate(
            [
                'user_id' => $support->id,
                'organization_id' => $organization->id,
                'start_date' => $today->copy()->addDays(6)->toDateString(),
                'end_date' => $today->copy()->addDays(6)->toDateString(),
            ],
            [
                'availability_percentage' => 0,
                'reason' => 'Folga programada',
            ]
        );

        TeamEvent::updateOrCreate(
            [
                'organization_id' => $organization->id,
                'team_id' => $platformTeam->id,
                'name' => 'Sprint Review',
                'start_date' => $today->copy()->addDays(8)->toDateString(),
            ],
            [
                'end_date' => $today->copy()->addDays(8)->toDateString(),
                'is_full_day' => false,
            ]
        );
        TeamEvent::updateOrCreate(
            [
                'organization_id' => $organization->id,
                'team_id' => $opsTeam->id,
                'name' => 'Plantao Especial',
                'start_date' => $today->copy()->addDays(2)->toDateString(),
            ],
            [
                'end_date' => $today->copy()->addDays(2)->toDateString(),
                'is_full_day' => true,
            ]
        );

        $jiraIntegration = Integration::updateOrCreate(
            [
                'organization_id' => $organization->id,
                'provider' => 'jira',
            ],
            [
                'enabled' => true,
                'direction' => 'two_way',
                'frequency' => 'interval',
                'scope' => ['projectKeys' => ['SAT']],
                'field_mapping' => ['title' => 'summary', 'description' => 'description'],
                'conflict_policy' => 'last_write_wins',
                'status' => 'idle',
                'last_error' => null,
                'last_synced_at' => now()->subHours(2),
                'config' => ['base_url' => 'https://example.atlassian.net', 'email' => 'admin@saturno.com.br'],
            ]
        );

        $todoistIntegration = Integration::updateOrCreate(
            [
                'organization_id' => $organization->id,
                'provider' => 'todoist',
            ],
            [
                'enabled' => false,
                'direction' => 'pull',
                'frequency' => 'manual',
                'scope' => ['project_id' => 'inbox'],
                'field_mapping' => ['title' => 'content'],
                'conflict_policy' => 'last_write_wins',
                'status' => 'error',
                'last_error' => 'Token nao configurado para ambiente de demo',
                'last_synced_at' => null,
                'config' => ['workspace' => 'demo'],
            ]
        );

        IntegrationLink::updateOrCreate(
            [
                'integration_id' => $jiraIntegration->id,
                'work_item_id' => $seededItems['SAT-102']->id,
            ],
            [
                'provider' => 'jira',
                'remote_item_id' => 'SAT-102',
                'remote_url' => 'https://example.atlassian.net/browse/SAT-102',
                'last_synced_at' => now()->subHours(2),
                'remote_updated_at' => now()->subHours(3),
                'sync_status' => 'ok',
                'last_error' => null,
            ]
        );

        IntegrationLink::updateOrCreate(
            [
                'integration_id' => $jiraIntegration->id,
                'work_item_id' => $seededItems['SAT-103']->id,
            ],
            [
                'provider' => 'jira',
                'remote_item_id' => 'SAT-103',
                'remote_url' => 'https://example.atlassian.net/browse/SAT-103',
                'last_synced_at' => now()->subHours(1),
                'remote_updated_at' => now()->subHours(1),
                'sync_status' => 'pending',
                'last_error' => null,
            ]
        );

        IntegrationSyncLog::updateOrCreate(
            [
                'integration_id' => $jiraIntegration->id,
                'provider' => 'jira',
                'direction' => 'two_way',
                'status' => 'success',
            ],
            [
                'stats' => ['pulled' => 4, 'pushed' => 2, 'duration_ms' => 1870],
                'error' => null,
            ]
        );
        IntegrationSyncLog::updateOrCreate(
            [
                'integration_id' => $todoistIntegration->id,
                'provider' => 'todoist',
                'direction' => 'pull',
                'status' => 'failed',
            ],
            [
                'stats' => ['pulled' => 0, 'duration_ms' => 210],
                'error' => 'Falha de autenticacao no ambiente demo',
            ]
        );
    }

    private function syncOrganizationRole(Organization $organization, User $user, string $role): void
    {
        $organization->users()->syncWithoutDetaching([$user->id => ['role' => $role]]);
        $organization->users()->updateExistingPivot($user->id, ['role' => $role]);
    }

    private function syncProjectRole(Project $project, User $user, string $role): void
    {
        $project->users()->syncWithoutDetaching([$user->id => ['role' => $role]]);
        $project->users()->updateExistingPivot($user->id, ['role' => $role]);
    }

    private function syncTeamRole(Team $team, User $user, string $role): void
    {
        $team->users()->syncWithoutDetaching([$user->id => ['role' => $role]]);
        $team->users()->updateExistingPivot($user->id, ['role' => $role]);
    }
}
