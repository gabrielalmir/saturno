<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkItemEvent extends Model
{
    protected $fillable = [
        'organization_id',
        'work_item_id',
        'user_id',
        'type',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
    ];

    public function workItem()
    {
        return $this->belongsTo(WorkItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
}
