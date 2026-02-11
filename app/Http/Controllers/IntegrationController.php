<?php

namespace App\Http\Controllers;

use App\Jobs\RunIntegrationSync;
use App\Models\Integration;
use App\Models\IntegrationLink;
use App\Models\IntegrationSyncLog;
use App\Services\Integrations\IntegrationConnectorFactory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IntegrationController extends Controller
{
    public function index(Request $request)
    {
        $orgId = $request->user()->current_organization_id;
        $integrations = Integration::where('organization_id', $orgId)->get();
        $logs = IntegrationSyncLog::whereIn('integration_id', $integrations->pluck('id'))
            ->latest()->limit(20)->get();

        return Inertia::render('settings/integrations', [
            'integrations' => $integrations,
            'logs' => $logs,
        ]);
    }

    public function store(Request $request)
    {
        $orgId = $request->user()->current_organization_id;
        $data = $request->validate([
            'provider' => 'required|in:jira,trello,todoist',
            'enabled' => 'boolean',
            'direction' => 'required|in:pull,push,two_way',
            'frequency' => 'required|in:manual,interval,webhook',
            'scope' => 'nullable|array',
            'field_mapping' => 'nullable|array',
            'conflict_policy' => 'required|in:last_write_wins,prefer_local,prefer_remote,manual_review',
            'config' => 'required|array',
        ]);

        $data['organization_id'] = $orgId;
        $data['enabled'] = $data['enabled'] ?? false;

        $connector = IntegrationConnectorFactory::make($data['provider']);
        $connector->validateCredentials($data['config']);

        $integration = Integration::updateOrCreate(
            ['organization_id' => $orgId, 'provider' => $data['provider']],
            $data,
        );

        return redirect()->back();
    }

    public function test(Request $request, Integration $integration)
    {
        if ((int) $integration->organization_id !== (int) $request->user()->current_organization_id) {
            abort(404);
        }

        $connector = IntegrationConnectorFactory::make($integration->provider);
        $result = $connector->testConnection($integration);

        return response()->json(['ok' => $result->ok, 'message' => $result->message]);
    }

    public function syncNow(Request $request, Integration $integration)
    {
        if ((int) $integration->organization_id !== (int) $request->user()->current_organization_id) {
            abort(404);
        }

        RunIntegrationSync::dispatch($integration, 'delta');

        return redirect()->back();
    }

    public function update(Request $request, Integration $integration)
    {
        if ((int) $integration->organization_id !== (int) $request->user()->current_organization_id) {
            abort(404);
        }

        $validated = $request->validate([
            'enabled' => 'sometimes|boolean',
            'direction' => 'sometimes|in:pull,push,two_way',
            'frequency' => 'sometimes|in:manual,interval,webhook',
            'scope' => 'sometimes|array',
            'field_mapping' => 'sometimes|array',
            'conflict_policy' => 'sometimes|in:last_write_wins,prefer_local,prefer_remote,manual_review',
            'config' => 'sometimes|array',
        ]);

        if (array_key_exists('config', $validated)) {
            $connector = IntegrationConnectorFactory::make($integration->provider);
            $connector->validateCredentials($validated['config']);
        }

        $update = $validated;
        if (! array_key_exists('config', $validated)) {
            unset($update['config']);
        }

        $integration->update($update);

        return redirect()->back();
    }

    public function destroy(Request $request, Integration $integration)
    {
        if ((int) $integration->organization_id !== (int) $request->user()->current_organization_id) {
            abort(404);
        }

        $integration->delete();

        return redirect()->back();
    }

    public function toggle(Request $request, Integration $integration)
    {
        if ((int) $integration->organization_id !== (int) $request->user()->current_organization_id) {
            abort(404);
        }

        $validated = $request->validate([
            'enabled' => 'required|boolean',
        ]);

        $integration->update(['enabled' => (bool) $validated['enabled']]);

        return redirect()->back();
    }

    public function links(Request $request, Integration $integration)
    {
        if ((int) $integration->organization_id !== (int) $request->user()->current_organization_id) {
            abort(404);
        }

        $links = IntegrationLink::where('integration_id', $integration->id)->with('workItem')->paginate(20);

        return response()->json($links);
    }
}
