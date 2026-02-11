<?php

namespace App\Services\Integrations\Connectors;

use App\Models\Epic;
use App\Models\Integration;
use App\Models\IntegrationLink;
use App\Models\WorkItem;
use App\Services\Integrations\ConnectionResult;
use App\Services\Integrations\SyncResult;
use Stevenmaguire\Services\Trello\Client as TrelloClient;
use Throwable;

class TrelloConnector extends BaseConnector
{
    /**
     * Trello REST auth is key+token query params.
     *
     * @see https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/
     */
    protected function getClient(array $config): TrelloClient
    {
        $config = $this->normalizeConfig($config);

        return new TrelloClient([
            'key' => $config['key'] ?? '',
            'token' => $config['token'] ?? '',
        ]);
    }

    public function validateCredentials(array $config): void
    {
        $config = $this->normalizeConfig($config);

        if (empty($config['key'])) {
            throw new \InvalidArgumentException('API Key do Trello obrigatória.');
        }
        if (empty($config['token'])) {
            throw new \InvalidArgumentException('Token do Trello obrigatório.');
        }
    }

    public function testConnection(Integration $integration): ConnectionResult
    {
        $config = $this->normalizeConfig($integration->config ?? []);
        $this->validateCredentials($config);

        try {
            $client = $this->getClient($config);
            $user = $client->getCurrentUser();

            if (isset($user->fullName) || isset($user->username)) {
                $name = $user->fullName ?? $user->username;

                return new ConnectionResult(true, "Conectado como {$name}");
            }

            return new ConnectionResult(false, 'Falha ao conectar ao Trello.');
        } catch (Throwable $e) {
            if ($this->isUnauthorizedError($e->getMessage())) {
                return new ConnectionResult(false, 'Trello retornou Unauthorized. Verifique se o token foi gerado com escopos read/write e se você tem acesso ao board/workspace.');
            }

            return new ConnectionResult(false, 'Erro: '.$e->getMessage());
        }
    }

    public function importItems(Integration $integration): SyncResult
    {
        $config = $this->normalizeConfig($integration->config ?? []);

        try {
            $client = $this->getClient($config);
            $resolveError = null;
            $boardId = $this->resolveBoardId($integration, $client, $config, false, $resolveError);

            if (! $boardId) {
                return new SyncResult('failed', [], $resolveError ?: 'Não foi possível resolver um board no Trello.');
            }

            // Get cards from the board
            $cards = $client->getBoardCards($boardId);
            if (! is_array($cards) && ! is_object($cards)) {
                return new SyncResult('failed', [], 'Falha ao buscar cards do Trello.');
            }
            $cards = is_array($cards) ? $cards : [$cards];

            // Get lists to map status
            $lists = $client->getBoardLists($boardId);
            $listMap = [];
            foreach ($lists as $list) {
                $listMap[$list->id] = $list->name;
            }

            // Import board as Epic
            $epicId = $this->importBoardAsEpic($integration, $client, $boardId);

            $imported = 0;
            $updated = 0;

            foreach ($cards as $card) {
                $mapped = $this->mapCardToLocal($card, $listMap, $epicId);

                // Check if already linked
                $existingLink = IntegrationLink::where('integration_id', $integration->id)
                    ->where('remote_item_id', (string) $card->id)
                    ->first();

                if ($existingLink) {
                    $existingLink->workItem?->update($mapped);
                    $existingLink->update([
                        'last_synced_at' => now(),
                        'sync_status' => 'ok',
                    ]);
                    $updated++;
                } else {
                    $workItem = WorkItem::create(array_merge($mapped, [
                        'organization_id' => $integration->organization_id,
                    ]));

                    IntegrationLink::create([
                        'integration_id' => $integration->id,
                        'work_item_id' => $workItem->id,
                        'provider' => 'trello',
                        'remote_item_id' => (string) $card->id,
                        'remote_url' => $card->shortUrl ?? $card->url ?? "https://trello.com/c/{$card->id}",
                        'last_synced_at' => now(),
                        'sync_status' => 'ok',
                    ]);

                    $imported++;
                }
            }

            return new SyncResult('success', [
                'imported' => $imported,
                'updated' => $updated,
                'total' => count($cards),
            ], null);
        } catch (Throwable $e) {
            return new SyncResult('failed', [], 'Erro: '.$e->getMessage());
        }
    }

    private function importBoardAsEpic(Integration $integration, TrelloClient $client, string $boardId): ?int
    {
        // Check if board is already linked to an Epic
        $existingLink = IntegrationLink::where('integration_id', $integration->id)
            ->where('provider', 'trello')
            ->where('remote_item_id', 'board:'.$boardId)
            ->first();

        if ($existingLink) {
            return $existingLink->work_item_id;
        }

        // Get board details
        try {
            $board = $client->getBoard($boardId);
            $boardName = $board->name ?? 'Trello Board';

            $epic = Epic::create([
                'organization_id' => $integration->organization_id,
                'title' => $boardName,
                'description' => $board->desc ?? null,
                'status' => 'active',
            ]);

            IntegrationLink::create([
                'integration_id' => $integration->id,
                'work_item_id' => $epic->id,
                'provider' => 'trello',
                'remote_item_id' => 'board:'.$boardId,
                'remote_url' => $board->shortUrl ?? $board->url ?? "https://trello.com/b/{$boardId}",
                'last_synced_at' => now(),
                'sync_status' => 'ok',
            ]);

            return $epic->id;
        } catch (Throwable $e) {
            return null;
        }
    }

    public function exportItems(Integration $integration): SyncResult
    {
        $config = $this->normalizeConfig($integration->config ?? []);

        try {
            $client = $this->getClient($config);
            $resolveError = null;
            $boardId = $this->resolveBoardId($integration, $client, $config, true, $resolveError);

            if (! $boardId) {
                return new SyncResult('failed', [], $resolveError ?: 'Não foi possível resolver/criar um board no Trello para exportação.');
            }

            $listError = null;
            $defaultListId = $this->resolveDefaultListId($boardId, $client, $config, true, $listError);
            if (! $defaultListId) {
                return new SyncResult('failed', [], $listError ?: 'Não foi possível resolver/criar uma lista no board do Trello.');
            }

            // Get unlinked work items
            $unlinkedItems = WorkItem::where('organization_id', $integration->organization_id)
                ->whereDoesntHave('integrationLinks', function ($query) use ($integration) {
                    $query->where('integration_id', $integration->id);
                })
                ->limit(50)
                ->get();

            $exported = 0;
            $errors = [];

            foreach ($unlinkedItems as $item) {
                try {
                    $cardData = [
                        'name' => $item->title,
                        'desc' => $item->description ?? '',
                        'idList' => $defaultListId,
                    ];

                    if ($item->due_date) {
                        $cardData['due'] = $item->due_date->format('Y-m-d');
                    }

                    $created = $client->addCard($cardData);

                    if ($created && isset($created->id)) {
                        IntegrationLink::create([
                            'integration_id' => $integration->id,
                            'work_item_id' => $item->id,
                            'provider' => 'trello',
                            'remote_item_id' => (string) $created->id,
                            'remote_url' => $created->shortUrl ?? $created->url ?? "https://trello.com/c/{$created->id}",
                            'last_synced_at' => now(),
                            'sync_status' => 'ok',
                        ]);

                        $exported++;
                    } else {
                        $errors[] = "Falha ao exportar: {$item->title}";
                    }
                } catch (Throwable $e) {
                    $errors[] = "Erro em {$item->title}: ".$e->getMessage();
                }
            }

            $status = count($errors) > 0 ? 'partial' : 'success';

            return new SyncResult($status, [
                'exported' => $exported,
                'errors' => count($errors),
            ], count($errors) > 0 ? implode('; ', array_slice($errors, 0, 3)) : null);
        } catch (Throwable $e) {
            return new SyncResult('failed', [], 'Erro: '.$e->getMessage());
        }
    }

    public function syncDelta(Integration $integration): SyncResult
    {
        $resultImport = $this->importItems($integration);
        $resultExport = $this->exportItems($integration);

        $combinedError = $this->buildCombinedError($resultImport->error ?? null, $resultExport->error ?? null);

        return new SyncResult(
            $resultImport->status === 'success' && $resultExport->status === 'success' ? 'success' : 'partial',
            [
                'imported' => $resultImport->stats['imported'] ?? 0,
                'updated' => $resultImport->stats['updated'] ?? 0,
                'exported' => $resultExport->stats['exported'] ?? 0,
                'errors' => ($resultImport->stats['errors'] ?? 0) + ($resultExport->stats['errors'] ?? 0),
            ],
            $combinedError ?: null
        );
    }

    /**
     * Resolve board through configured board_id, first available board or board creation.
     *
     * @see https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-members-id-boards-get
     * @see https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-post
     */
    private function resolveBoardId(Integration $integration, TrelloClient $client, array $config, bool $allowCreate = false, ?string &$error = null): ?string
    {
        $configuredBoard = trim((string) ($config['board_id'] ?? ''));
        if ($configuredBoard !== '') {
            return $configuredBoard;
        }

        try {
            $boards = $client->getCurrentUserBoards();
        } catch (Throwable $e) {
            if ($this->isUnauthorizedError($e->getMessage())) {
                $error = 'Token do Trello sem permissão para listar boards. Verifique os escopos (read/write).';
            }

            return null;
        }

        if (! empty($boards) && isset($boards[0]->id)) {
            return (string) $boards[0]->id;
        }

        if (! $allowCreate) {
            $error = 'Nenhum board encontrado para o usuário no Trello.';

            return null;
        }

        return $this->createDefaultBoard($integration, $config, $error);
    }

    private function resolveDefaultListId(string $boardId, TrelloClient $client, array $config, bool $allowCreate = false, ?string &$error = null): ?string
    {
        $configuredList = trim((string) ($config['default_list_id'] ?? ''));
        if ($configuredList !== '') {
            return $configuredList;
        }

        $lists = $client->getBoardLists($boardId);
        if (! empty($lists)) {
            foreach ($lists as $list) {
                if (! isset($list->closed) || $list->closed === false) {
                    return (string) $list->id;
                }
            }

            return isset($lists[0]->id) ? (string) $lists[0]->id : null;
        }

        if (! $allowCreate) {
            $error = 'Nenhuma lista disponível no board do Trello.';

            return null;
        }

        return $this->createDefaultList($boardId, $config, $error);
    }

    private function createDefaultBoard(Integration $integration, array $config, ?string &$error = null): ?string
    {
        $response = $this->http->post('https://api.trello.com/1/boards', [
            'query' => $this->trelloAuthQuery($config, [
                'name' => 'Saturno '.($integration->provider ?? 'Trello').' Sync',
                'defaultLists' => 'true',
                'desc' => 'Board criado automaticamente para integração do Saturno.',
            ]),
            'body' => [],
        ], ['Authorization']);

        if (! $response->ok) {
            $error = $this->trelloApiErrorMessage($response->status ?? null, $response->body ?? null, 'Não foi possível criar board no Trello.');

            return null;
        }

        $data = ($response->json)();

        return is_array($data) ? (($data['id'] ?? null) ? (string) $data['id'] : null) : null;
    }

    /**
     * Create a fallback list when board has no list available.
     *
     * @see https://developer.atlassian.com/cloud/trello/rest/api-group-lists/#api-lists-post
     */
    private function createDefaultList(string $boardId, array $config, ?string &$error = null): ?string
    {
        $response = $this->http->post('https://api.trello.com/1/lists', [
            'query' => $this->trelloAuthQuery($config, [
                'name' => 'To Do',
                'idBoard' => $boardId,
            ]),
            'body' => [],
        ], ['Authorization']);

        if (! $response->ok) {
            $error = $this->trelloApiErrorMessage($response->status ?? null, $response->body ?? null, 'Não foi possível criar lista no Trello.');

            return null;
        }

        $data = ($response->json)();

        return is_array($data) ? (($data['id'] ?? null) ? (string) $data['id'] : null) : null;
    }

    private function trelloAuthQuery(array $config, array $query = []): array
    {
        $config = $this->normalizeConfig($config);

        return array_merge($query, [
            'key' => $config['key'] ?? '',
            'token' => $config['token'] ?? '',
        ]);
    }

    private function normalizeConfig(array $config): array
    {
        foreach (['key', 'token', 'board_id', 'default_list_id'] as $field) {
            if (! array_key_exists($field, $config) || ! is_string($config[$field])) {
                continue;
            }

            $config[$field] = trim($config[$field]);
        }

        return $config;
    }

    private function buildCombinedError(?string $importError, ?string $exportError): ?string
    {
        $parts = array_filter([trim((string) $importError), trim((string) $exportError)]);
        if ($parts === []) {
            return null;
        }

        return implode(' ', array_values(array_unique($parts)));
    }

    private function trelloApiErrorMessage(?int $status, ?string $body, string $fallback): string
    {
        $isUnauthorized = in_array($status, [401, 403], true) || $this->isUnauthorizedError((string) $body);

        if ($isUnauthorized) {
            return 'Trello retornou Unauthorized. Verifique se o token possui escopos read/write e acesso ao workspace/board.';
        }

        return $fallback;
    }

    private function isUnauthorizedError(string $message): bool
    {
        return str_contains(strtolower($message), 'unauthorized');
    }

    private function mapCardToLocal(object $card, array $listMap, ?int $epicId): array
    {
        // Map list name to status
        $listName = strtolower($listMap[$card->idList] ?? 'backlog');
        $status = match (true) {
            str_contains($listName, 'done') || str_contains($listName, 'conclu') => 'done',
            str_contains($listName, 'doing') || str_contains($listName, 'progress') || str_contains($listName, 'andamento') => 'in_progress',
            str_contains($listName, 'todo') || str_contains($listName, 'fazer') => 'todo',
            str_contains($listName, 'review') || str_contains($listName, 'revisão') => 'in_progress',
            default => 'backlog',
        };

        // If card is closed, mark as done
        if ($card->closed ?? false) {
            $status = 'done';
        }

        // Extract labels
        $labels = [];
        if (isset($card->labels) && is_array($card->labels)) {
            $labels = array_map(fn ($l) => $l->name ?? $l->color ?? '', $card->labels);
        }

        // Determine priority from labels
        $priority = 'P3';
        foreach ($labels as $label) {
            $labelLower = strtolower($label);
            if (str_contains($labelLower, 'urgent') || str_contains($labelLower, 'crítico') || str_contains($labelLower, 'p1')) {
                $priority = 'P1';
                break;
            } elseif (str_contains($labelLower, 'high') || str_contains($labelLower, 'alto') || str_contains($labelLower, 'p2')) {
                $priority = 'P2';
            } elseif (str_contains($labelLower, 'low') || str_contains($labelLower, 'baixo') || str_contains($labelLower, 'p4')) {
                $priority = 'P4';
            }
        }

        return [
            'title' => $card->name ?? '[Sem título]',
            'description' => $card->desc ?? null,
            'status' => $status,
            'priority' => $priority,
            'due_date' => isset($card->due) ? date('Y-m-d', strtotime($card->due)) : null,
            'epic_id' => $epicId,
        ];
    }
}
