<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'organization_id',
        'project_id',
        'title',
        'description',
        'status',
        'priority',
        'reporter_id',
        'assignee_id',
        'due_date',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function workItems()
    {
        return $this->hasMany(WorkItem::class);
    }
}
