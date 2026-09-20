<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Epic extends Model
{
    protected $fillable = [
        'organization_id',
        'project_id',
        'title',
        'description',
        'status',
        'owner_id',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function workItems()
    {
        return $this->hasMany(WorkItem::class);
    }
}
