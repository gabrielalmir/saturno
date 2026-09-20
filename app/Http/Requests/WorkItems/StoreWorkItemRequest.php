<?php

namespace App\Http\Requests\WorkItems;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'tier' => 'required|in:N1,N2',
            'type' => 'required|string|max:50',
            'size' => 'required|string|max:50',
            'priority' => 'required|string|max:10',
            'status' => 'nullable|in:backlog,ready',
            'estimate' => 'nullable|integer',
            'due_date' => 'nullable|date',
            'planned_for' => 'nullable|date',
            'planned_rank' => 'nullable|integer|min:0',
            'assignee_id' => 'nullable|integer|exists:users,id',
            'epic_id' => 'nullable|integer|exists:epics,id',
            'ticket_id' => 'nullable|integer|exists:tickets,id',
            'sprint_id' => 'nullable|integer|exists:sprints,id',
            'parent_id' => 'nullable|integer|exists:work_items,id',
        ];
    }
}
