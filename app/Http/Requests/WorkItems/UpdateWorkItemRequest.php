<?php

namespace App\Http\Requests\WorkItems;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'tier' => 'sometimes|in:N1,N2',
            'type' => 'sometimes|string|max:50',
            'size' => 'sometimes|string|max:50',
            'priority' => 'sometimes|string|max:10',
            'status' => 'sometimes|in:backlog,ready,in_progress,blocked,done',
            'estimate' => 'nullable|integer',
            'due_date' => 'nullable|date',
            'planned_for' => 'nullable|date',
            'planned_rank' => 'nullable|integer|min:0',
            'blocked_reason' => 'nullable|string|max:2000',
            'assignee_id' => 'nullable|integer|exists:users,id',
            'epic_id' => 'nullable|integer|exists:epics,id',
            'ticket_id' => 'nullable|integer|exists:tickets,id',
            'sprint_id' => 'nullable|integer|exists:sprints,id',
            'parent_id' => 'nullable|integer|exists:work_items,id',
        ];
    }
}
