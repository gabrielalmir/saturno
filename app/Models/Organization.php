<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo_path',
        'planning_unit',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('role')->withTimestamps();
    }

    public function sprints()
    {
        return $this->hasMany(Sprint::class);
    }

    public function workItems()
    {
        return $this->hasMany(WorkItem::class);
    }

    public function epics()
    {
        return $this->hasMany(Epic::class);
    }

    public function admins()
    {
        return $this->users()->wherePivot('role', 'admin');
    }

    public function members()
    {
        return $this->users()->wherePivot('role', 'user');
    }

    public function maintainers()
    {
        return $this->users()->wherePivot('role', 'maintainer');
    }

    public function analysts()
    {
        return $this->users()->wherePivot('role', 'analyst');
    }

    public function holidays()
    {
        return $this->hasMany(Holiday::class);
    }

    public function integrations()
    {
        return $this->hasMany(Integration::class);
    }

    public function teams()
    {
        return $this->hasMany(Team::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
