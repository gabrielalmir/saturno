<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sprint extends Model
{
    protected $fillable = [
        'organization_id',
        'project_id',
        'team_id',
        'name',
        'goal',
        'status',
        'start_date',
        'end_date',
        'capacity_total',
        'capacity_reserved_n1',
        'use_member_n1_reserve',
        'buffer_percentage_n1',
        'wip_limit',
        'started_at',
        'completed_at',
        'capacity_snapshot_total',
        'capacity_snapshot_reserved_n1',
        'commitment_snapshot',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function workItems()
    {
        return $this->hasMany(WorkItem::class);
    }

    public function memberN1Reservations()
    {
        return $this->hasMany(SprintUserN1Reservation::class);
    }
}
