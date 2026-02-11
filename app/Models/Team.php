<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'project_id',
        'name',
        'description',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('role')->withTimestamps();
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function sprints()
    {
        return $this->hasMany(Sprint::class);
    }

    public function workItems()
    {
        return $this->hasMany(WorkItem::class);
    }

    public function workCadence()
    {
        return $this->hasOne(WorkCadence::class);
    }
}
