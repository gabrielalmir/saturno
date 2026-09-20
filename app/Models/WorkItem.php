<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkItem extends Model
{
    protected $fillable = [
        'organization_id',
        'project_id',
        'team_id',
        'title',
        'description',
        'tier',
        'type',
        'size',
        'priority',
        'status',
        'started_at',
        'blocked_at',
        'blocked_reason',
        'completed_at',
        'assignee_id',
        'reporter_id',
        'estimate',
        'due_date',
        'planned_for',
        'planned_rank',
        'epic_id',
        'ticket_id',
        'sprint_id',
        'parent_id',
        'jira_key',
    ];

    protected $casts = [
        'due_date' => 'date',
        'planned_for' => 'date',
        'started_at' => 'datetime',
        'blocked_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function parent()
    {
        return $this->belongsTo(WorkItem::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(WorkItem::class, 'parent_id');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function epic()
    {
        return $this->belongsTo(Epic::class);
    }

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function events()
    {
        return $this->hasMany(WorkItemEvent::class)->orderBy('created_at', 'desc');
    }

    public function integrationLinks()
    {
        return $this->hasMany(IntegrationLink::class);
    }

    public function allocations()
    {
        return $this->hasMany(WorkItemAllocation::class);
    }
}
