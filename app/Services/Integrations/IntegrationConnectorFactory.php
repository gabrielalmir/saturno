<?php

namespace App\Services\Integrations;

use App\Services\Integrations\Connectors\BaseConnector;
use App\Services\Integrations\Connectors\JiraConnector;
use App\Services\Integrations\Connectors\TodoistConnector;
use App\Services\Integrations\Connectors\TrelloConnector;
use Illuminate\Support\Facades\Log;

class IntegrationConnectorFactory
{
    public static function make(string $provider): BaseConnector
    {
        $http = new ProviderHttpClient(Log::channel('stack'));

        return match ($provider) {
            'jira' => new JiraConnector($http),
            'trello' => new TrelloConnector($http),
            'todoist' => new TodoistConnector($http),
            default => throw new \InvalidArgumentException('Provider nao suportado'),
        };
    }
}
