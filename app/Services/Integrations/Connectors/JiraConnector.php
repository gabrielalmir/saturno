<?php

namespace App\Services\Integrations\Connectors;

use App\Models\Integration;
use App\Models\IntegrationLink;
use App\Models\WorkItem;
use App\Services\Integrations\ConnectionResult;
use App\Services\Integrations\SyncResult;

class JiraConnector extends BaseConnector
{
    /**
     * Jira Cloud REST API v3 auth via Basic (email:api_token).
     *
     * @see https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/
     */
    private function getAuthHeader(array $config): string
    {
        // Jira Cloud uses Basic auth with email:api_token
        $email = $config['email'] ?? '';
        $token = $config['token'] ?? '';

        return 'Basic '.base64_encode($email.':'.$token);
    }

    public function validateCredentials(array $config): void
    {
        if (empty($config['token'])) {
            throw new \InvalidArgumentException('Token de API obrigatório.');
        }
        if (empty($config['base_url'])) {
            throw new \InvalidArgumentException('URL base do Jira obrigatória.');
        }
    }

    public function testConnection(Integration $integration): ConnectionResult
    {
        $config = $integration->config ?? [];
        $this->validateCredentials($config);

        $baseUrl = rtrim($config['base_url'] ?? '', '/');
        $url = $baseUrl.'/rest/api/3/myself';

        $response = $this->http->get($url, [
            'headers' => [
                'Authorization' => $this->getAuthHeader($config),
                'Accept' => 'application/json',
            ],
        ]);

        if ($response->ok) {
            $user = ($response->json)();
            $displayName = $user['displayName'] ?? 'Usuário';

            return new ConnectionResult(true, "Conectado como {$displayName}");
        }

        return new ConnectionResult(false, 'Falha ao conectar: '.($response->body ?? 'Erro desconhecido'));
    }

    public function importItems(Integration $integration): SyncResult
    {
        $config = $integration->config ?? [];
        $baseUrl = rtrim($config['base_url'] ?? '', '/');
        $projectKey = $this->resolveProjectKey($config, $baseUrl);

        if (! $baseUrl) {
            return new SyncResult('failed', [], 'URL base não configurada.');
        }

        // Build JQL query
        $jql = $projectKey
            ? 'project = "'.addcslashes($projectKey, '"\\').'" ORDER BY updated DESC'
            : 'assignee = currentUser() ORDER BY updated DESC';

        $url = $baseUrl.'/rest/api/3/search';

        $response = $this->http->get($url, [
            'headers' => [
                'Authorization' => $this->getAuthHeader($config),
                'Accept' => 'application/json',
            ],
            'query' => [
                'jql' => $jql,
                'maxResults' => 100,
                'fields' => 'summary,description,status,priority,assignee,duedate,labels,issuetype',
            ],
        ]);

        if (! $response->ok) {
            return new SyncResult('failed', [], 'Falha ao buscar issues do Jira: '.($response->body ?? ''));
        }

        $data = ($response->json)();
        $issues = $data['issues'] ?? [];

        $imported = 0;
        $updated = 0;

        foreach ($issues as $issue) {
            $mapped = $this->mapJiraToLocal($issue, $baseUrl);
            $issueKey = $issue['key'] ?? $issue['id'];

            // Check if already linked
            $existingLink = IntegrationLink::where('integration_id', $integration->id)
                ->where('remote_item_id', (string) $issueKey)
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
                    'provider' => 'jira',
                    'remote_item_id' => (string) $issueKey,
                    'remote_url' => $baseUrl.'/browse/'.$issueKey,
                    'last_synced_at' => now(),
                    'sync_status' => 'ok',
                ]);

                $imported++;
            }
        }

        return new SyncResult('success', [
            'imported' => $imported,
            'updated' => $updated,
            'total' => count($issues),
        ], null);
    }

    public function exportItems(Integration $integration): SyncResult
    {
        $config = $integration->config ?? [];
        $baseUrl = rtrim($config['base_url'] ?? '', '/');
        $projectKey = $this->resolveProjectKey($config, $baseUrl);

        if (! $baseUrl) {
            return new SyncResult('failed', [], 'URL base é necessária para exportar.');
        }

        if (! $projectKey) {
            return new SyncResult('failed', [], 'Nenhum projeto Jira disponível para exportação. Defina um projeto ou garanta acesso a pelo menos um projeto no Jira.');
        }

        // Get work items that aren't linked yet
        $unlinkedItems = WorkItem::where('organization_id', $integration->organization_id)
            ->whereDoesntHave('integrationLinks', function ($query) use ($integration) {
                $query->where('integration_id', $integration->id);
            })
            ->limit(50)
            ->get();

        $exported = 0;
        $errors = [];

        foreach ($unlinkedItems as $item) {
            $jiraData = $this->mapLocalToJira($item, $projectKey);

            $response = $this->http->post($baseUrl.'/rest/api/3/issue', [
                'headers' => [
                    'Authorization' => $this->getAuthHeader($config),
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ],
                'body' => $jiraData,
            ]);

            if ($response->ok) {
                $created = ($response->json)();
                $issueKey = $created['key'] ?? $created['id'];

                IntegrationLink::create([
                    'integration_id' => $integration->id,
                    'work_item_id' => $item->id,
                    'provider' => 'jira',
                    'remote_item_id' => (string) $issueKey,
                    'remote_url' => $baseUrl.'/browse/'.$issueKey,
                    'last_synced_at' => now(),
                    'sync_status' => 'ok',
                ]);

                $exported++;
            } else {
                $errors[] = "Falha ao exportar item {$item->id}";
            }
        }

        $status = count($errors) > 0 ? 'partial' : 'success';

        return new SyncResult($status, [
            'exported' => $exported,
            'errors' => count($errors),
        ], count($errors) > 0 ? implode('; ', $errors) : null);
    }

    public function syncDelta(Integration $integration): SyncResult
    {
        // For now, delegate to full import
        return $this->importItems($integration);
    }

    private function mapJiraToLocal(array $issue, string $baseUrl): array
    {
        $fields = $issue['fields'] ?? [];

        // Map Jira status to our status
        $statusName = strtolower($fields['status']['name'] ?? 'backlog');
        $status = match (true) {
            str_contains($statusName, 'done') || str_contains($statusName, 'closed') => 'done',
            str_contains($statusName, 'progress') || str_contains($statusName, 'review') => 'in_progress',
            str_contains($statusName, 'todo') || str_contains($statusName, 'open') => 'todo',
            default => 'backlog',
        };

        // Map Jira priority to our priority
        $priorityName = strtolower($fields['priority']['name'] ?? 'medium');
        $priority = match (true) {
            str_contains($priorityName, 'highest') || str_contains($priorityName, 'blocker') => 'P1',
            str_contains($priorityName, 'high') || str_contains($priorityName, 'critical') => 'P2',
            str_contains($priorityName, 'low') || str_contains($priorityName, 'minor') => 'P4',
            str_contains($priorityName, 'lowest') || str_contains($priorityName, 'trivial') => 'P4',
            default => 'P3',
        };

        // Extract labels
        $labels = array_map(fn ($l) => $l['name'] ?? $l, $fields['labels'] ?? []);

        // Map issue type
        $issueType = strtolower($fields['issuetype']['name'] ?? 'task');
        $type = match (true) {
            str_contains($issueType, 'bug') => 'bug',
            str_contains($issueType, 'story') => 'story',
            str_contains($issueType, 'epic') => 'epic',
            str_contains($issueType, 'subtask') || str_contains($issueType, 'sub-task') => 'subtask',
            default => 'task',
        };

        return [
            'title' => $fields['summary'] ?? '[Sem título]',
            'description' => $this->extractDescription($fields['description'] ?? null),
            'status' => $status,
            'priority' => $priority,
            'type' => $type,
            'due_date' => $fields['duedate'] ?? null,
            'labels' => $labels,
            'metadata' => [
                'jira_key' => $issue['key'] ?? null,
                'jira_id' => $issue['id'] ?? null,
                'jira_type' => $fields['issuetype']['name'] ?? null,
            ],
        ];
    }

    private function extractDescription($description): ?string
    {
        if (is_string($description)) {
            return $description;
        }

        // Jira uses Atlassian Document Format (ADF)
        if (is_array($description) && isset($description['content'])) {
            $text = '';
            foreach ($description['content'] as $block) {
                if (isset($block['content'])) {
                    foreach ($block['content'] as $inline) {
                        $text .= $inline['text'] ?? '';
                    }
                }
                $text .= "\n";
            }

            return trim($text);
        }

        return null;
    }

    private function mapLocalToJira(WorkItem $item, string $projectKey): array
    {
        // Map our priority to Jira priority
        $priorityMap = [
            'P1' => 'Highest',
            'P2' => 'High',
            'P3' => 'Medium',
            'P4' => 'Low',
        ];

        // Map our type to Jira issue type
        $typeMap = [
            'bug' => 'Bug',
            'story' => 'Story',
            'task' => 'Task',
            'epic' => 'Epic',
            'subtask' => 'Sub-task',
        ];

        return [
            'fields' => [
                'project' => ['key' => $projectKey],
                'summary' => $item->title,
                'description' => [
                    'type' => 'doc',
                    'version' => 1,
                    'content' => [
                        [
                            'type' => 'paragraph',
                            'content' => [
                                [
                                    'type' => 'text',
                                    'text' => $item->description ?? '',
                                ],
                            ],
                        ],
                    ],
                ],
                'issuetype' => ['name' => $typeMap[$item->type ?? 'task'] ?? 'Task'],
                'priority' => ['name' => $priorityMap[$item->priority ?? 'P3'] ?? 'Medium'],
            ],
        ];
    }

    /**
     * Resolve project key from config or from Jira API when omitted.
     *
     * @see https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-projects/#api-rest-api-3-project-search-get
     */
    private function resolveProjectKey(array $config, string $baseUrl): ?string
    {
        $configuredKey = trim((string) ($config['project_key'] ?? ''));
        if ($configuredKey !== '') {
            return $configuredKey;
        }

        if (! $baseUrl) {
            return null;
        }

        $response = $this->http->get($baseUrl.'/rest/api/3/project/search', [
            'headers' => [
                'Authorization' => $this->getAuthHeader($config),
                'Accept' => 'application/json',
            ],
            'query' => [
                'maxResults' => 1,
            ],
        ]);

        if (! $response->ok) {
            return null;
        }

        $data = ($response->json)();
        $firstProject = $data['values'][0] ?? null;

        return is_array($firstProject) ? ($firstProject['key'] ?? null) : null;
    }
}
