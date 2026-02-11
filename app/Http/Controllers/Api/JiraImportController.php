<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IntegrationLink;
use App\Models\WorkItem;
use Illuminate\Http\Request;

class JiraImportController extends Controller
{
    public function store(Request $request)
    {
        $orgId = $request->user()->current_organization_id;

        $validated = $request->validate([
            'work_item_id' => 'required|exists:work_items,id',
            'jira_key' => 'required|string|max:50',
            'remote_url' => 'nullable|url',
        ]);

        $workItem = WorkItem::where('organization_id', $orgId)->findOrFail($validated['work_item_id']);
        $workItem->jira_key = $validated['jira_key'];
        $workItem->save();

        IntegrationLink::updateOrCreate(
            [
                'work_item_id' => $workItem->id,
                'provider' => 'jira',
                'remote_item_id' => $validated['jira_key'],
            ],
            [
                'remote_url' => $validated['remote_url'] ?? null,
                'sync_status' => 'linked',
            ]
        );

        return response()->json(['status' => 'linked']);
    }
}
