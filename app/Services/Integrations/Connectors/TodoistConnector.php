<?php

namespace App\Services\Integrations\Connectors;

use App\Models\Epic;
use App\Models\Integration;
use App\Models\IntegrationLink;
use App\Models\WorkItem;
use App\Services\Integrations\ConnectionResult;
use App\Services\Integrations\SyncResult;
use FabianBeiner\Todoist\TodoistClient;
use Throwable;

class TodoistConnector extends BaseConnector
{
    private function getClient(array $config): TodoistClient
    {
        $token = $config['token'] ?? '';

        return new TodoistClient($token);
    }

    public function testConnection(Integration $integration): ConnectionResult
    {
        $config = $integration->config ?? [];
        $this->validateCredentials($config);

        try {
            $client = $this->getClient($config);
            $projects = $client->getAllProjects();

            if ($projects === false) {
                return new ConnectionResult(false, 'Falha ao conectar ao Todoist.');
            }

            $projectCount = count($projects);

            return new ConnectionResult(true, "Conexão OK. {$projectCount} projeto(s) encontrado(s).");
        } catch (Throwable $e) {
            return new ConnectionResult(false, 'Erro: '.$e->getMessage());
        }
    }

    public function importItems(Integration $integration): SyncResult
    {
        $config = $integration->config ?? [];

        try {
            $client = $this->getClient($config);

            // Get all projects
            $projects = $client->getAllProjects();
            if ($projects === false) {
                return new SyncResult('failed', [], 'Falha ao buscar projetos do Todoist.');
            }

            // Get all tasks
            $tasks = $client->getAllTasks();
            if ($tasks === false) {
                return new SyncResult('failed', [], 'Falha ao buscar tarefas do Todoist.');
            }

            // Step 1: Import projects as Epics
            $projectToEpicMap = $this->importProjects($integration, $projects);

            // Step 2: Import tasks as WorkItems
            $imported = 0;
            $updated = 0;

            foreach ($tasks as $task) {
                $projectId = $task['project_id'] ?? null;
                $epicId = $projectToEpicMap[$projectId] ?? null;

                $mapped = $this->mapTaskToLocal($task, $epicId);

                // Check if already linked
                $existingLink = IntegrationLink::where('integration_id', $integration->id)
                    ->where('remote_item_id', (string) $task['id'])
                    ->first();

                if ($existingLink) {
                    // Update existing work item
                    $existingLink->workItem?->update($mapped);
                    $existingLink->update([
                        'last_synced_at' => now(),
                        'sync_status' => 'ok',
                    ]);
                    $updated++;
                } else {
                    // Create new work item
                    $workItem = WorkItem::create(array_merge($mapped, [
                        'organization_id' => $integration->organization_id,
                    ]));

                    IntegrationLink::create([
                        'integration_id' => $integration->id,
                        'work_item_id' => $workItem->id,
                        'provider' => 'todoist',
                        'remote_item_id' => (string) $task['id'],
                        'remote_url' => $task['url'] ?? ('https://todoist.com/app/task/'.$task['id']),
                        'last_synced_at' => now(),
                        'sync_status' => 'ok',
                    ]);

                    $imported++;
                }
            }

            return new SyncResult('success', [
                'projects' => count($projectToEpicMap),
                'imported' => $imported,
                'updated' => $updated,
            ], null);
        } catch (Throwable $e) {
            return new SyncResult('failed', [], 'Erro: '.$e->getMessage());
        }
    }

    private function importProjects(Integration $integration, array $projects): array
    {
        $projectToEpicMap = [];

        foreach ($projects as $project) {
            $projectId = $project['id'] ?? null;
            if (! $projectId) {
                continue;
            }

            $projectName = $project['name'] ?? 'Sem nome';

            // Skip inbox
            if (strtolower($projectName) === 'inbox' || ($project['is_inbox_project'] ?? false)) {
                continue;
            }

            // Check if we already have a link for this project
            $existingLink = IntegrationLink::where('integration_id', $integration->id)
                ->where('provider', 'todoist')
                ->where('remote_item_id', 'project:'.$projectId)
                ->first();

            if ($existingLink && $existingLink->work_item_id) {
                $epic = Epic::find($existingLink->work_item_id);
                if ($epic) {
                    $epic->update([
                        'title' => $projectName,
                    ]);
                    $projectToEpicMap[$projectId] = $epic->id;

                    continue;
                }
            }

            // Create new Epic
            $epic = Epic::create([
                'organization_id' => $integration->organization_id,
                'title' => $projectName,
                'description' => null,
                'status' => 'active',
            ]);

            IntegrationLink::updateOrCreate(
                [
                    'integration_id' => $integration->id,
                    'remote_item_id' => 'project:'.$projectId,
                ],
                [
                    'work_item_id' => $epic->id,
                    'provider' => 'todoist',
                    'remote_url' => $project['url'] ?? ('https://todoist.com/app/project/'.$projectId),
                    'last_synced_at' => now(),
                    'sync_status' => 'ok',
                ]
            );

            $projectToEpicMap[$projectId] = $epic->id;
        }

        return $projectToEpicMap;
    }

    private function mapTaskToLocal(array $task, ?int $epicId): array
    {
        // Map Todoist priority (1=normal, 4=urgent) to our priority
        // Todoist: 1=P4, 2=P3, 3=P2, 4=P1
        $priorityMap = [1 => 'P4', 2 => 'P3', 3 => 'P2', 4 => 'P1'];
        $priority = $priorityMap[$task['priority'] ?? 1] ?? 'P3';

        // Determine status
        $isCompleted = $task['is_completed'] ?? false;
        $status = $isCompleted ? 'done' : 'backlog';

        // Get due date
        $dueDate = null;
        if (isset($task['due']['date'])) {
            $dueDate = $task['due']['date'];
        }

        return [
            'title' => $task['content'] ?? '[Sem título]',
            'description' => $task['description'] ?? null,
            'status' => $status,
            'priority' => $priority,
            'due_date' => $dueDate,
            'epic_id' => $epicId,
        ];
    }

    public function exportItems(Integration $integration): SyncResult
    {
        $config = $integration->config ?? [];

        try {
            $client = $this->getClient($config);

            // Get unlinked work items
            $unlinkedItems = WorkItem::where('organization_id', $integration->organization_id)
                ->whereDoesntHave('integrationLinks', function ($query) use ($integration) {
                    $query->where('integration_id', $integration->id);
                })
                ->limit(50)
                ->get();

            $exported = 0;
            $projectsCreated = 0;
            $errors = [];

            // Cache for epic->project mapping to avoid duplicate project creation
            $epicToProjectCache = [];

            foreach ($unlinkedItems as $item) {
                // Find or create project ID for the epic
                $projectId = null;

                if ($item->epic_id) {
                    // Check cache first
                    if (isset($epicToProjectCache[$item->epic_id])) {
                        $projectId = $epicToProjectCache[$item->epic_id];
                    } else {
                        // Check for existing link
                        $epicLink = IntegrationLink::where('integration_id', $integration->id)
                            ->where('work_item_id', $item->epic_id)
                            ->where('provider', 'todoist')
                            ->where('remote_item_id', 'LIKE', 'project:%')
                            ->first();

                        if ($epicLink) {
                            $projectId = str_replace('project:', '', $epicLink->remote_item_id);
                        } else {
                            // Need to create project in Todoist
                            $epic = Epic::find($item->epic_id);
                            if ($epic) {
                                $createdProject = $client->createProject($epic->title);

                                if ($createdProject && is_array($createdProject)) {
                                    $projectId = (string) $createdProject['id'];

                                    // Create integration link for the epic->project
                                    IntegrationLink::create([
                                        'integration_id' => $integration->id,
                                        'work_item_id' => $epic->id,
                                        'provider' => 'todoist',
                                        'remote_item_id' => 'project:'.$projectId,
                                        'remote_url' => $createdProject['url'] ?? ('https://todoist.com/app/project/'.$projectId),
                                        'last_synced_at' => now(),
                                        'sync_status' => 'ok',
                                    ]);

                                    $projectsCreated++;
                                }
                            }
                        }

                        // Cache the result
                        $epicToProjectCache[$item->epic_id] = $projectId;
                    }
                }

                // Create task in Todoist
                $optionalParams = [
                    'description' => $item->description ?? '',
                    'priority' => $this->mapPriorityToTodoist($item->priority),
                ];

                if ($projectId) {
                    $optionalParams['project_id'] = $projectId;
                }

                if ($item->due_date) {
                    $optionalParams['due_date'] = $item->due_date->format('Y-m-d');
                }

                $created = $client->createTask($item->title, $optionalParams);

                if ($created && is_array($created)) {
                    IntegrationLink::create([
                        'integration_id' => $integration->id,
                        'work_item_id' => $item->id,
                        'provider' => 'todoist',
                        'remote_item_id' => (string) $created['id'],
                        'remote_url' => $created['url'] ?? ('https://todoist.com/app/task/'.$created['id']),
                        'last_synced_at' => now(),
                        'sync_status' => 'ok',
                    ]);

                    $exported++;
                } else {
                    $errors[] = "Falha ao exportar: {$item->title}";
                }
            }

            $status = count($errors) > 0 ? 'partial' : 'success';

            return new SyncResult($status, [
                'exported' => $exported,
                'projects_created' => $projectsCreated,
                'errors' => count($errors),
            ], count($errors) > 0 ? implode('; ', $errors) : null);
        } catch (Throwable $e) {
            return new SyncResult('failed', [], 'Erro: '.$e->getMessage());
        }
    }

    private function mapPriorityToTodoist(?string $priority): int
    {
        // Todoist: 1=Normal, 2=Medium, 3=High, 4=Urgent
        return match ($priority) {
            'P1' => 4,
            'P2' => 3,
            'P3' => 2,
            'P4' => 1,
            default => 1,
        };
    }

    public function syncDelta(Integration $integration): SyncResult
    {
        $resultImport = $this->importItems($integration);
        $resultExport = $this->exportItems($integration);

        $combinedError = trim(($resultImport->error ?? '').' '.($resultExport->error ?? ''));

        return new SyncResult(
            $resultImport->status === 'success' && $resultExport->status === 'success' ? 'success' : 'partial',
            [
                'imported' => $resultImport->stats['imported'] ?? 0,
                'updated' => $resultImport->stats['updated'] ?? 0,
                'exported' => $resultExport->stats['exported'] ?? 0,
                'projects_created' => ($resultImport->stats['projects'] ?? 0) + ($resultExport->stats['projects_created'] ?? 0),
                'errors' => ($resultImport->stats['errors'] ?? 0) + ($resultExport->stats['errors'] ?? 0),
            ],
            $combinedError ?: null
        );
    }
}
