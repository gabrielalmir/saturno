<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'slug',
        'description',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('role')->withTimestamps();
    }

    public function teams()
    {
        return $this->hasMany(Team::class);
    }

    public function sprints()
    {
        return $this->hasMany(Sprint::class);
    }

    public function workItems()
    {
        return $this->hasMany(WorkItem::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
