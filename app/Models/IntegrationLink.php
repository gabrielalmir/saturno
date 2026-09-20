<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IntegrationLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'integration_id',
        'work_item_id',
        'provider',
        'remote_item_id',
        'remote_url',
        'last_synced_at',
        'remote_updated_at',
        'sync_status',
        'last_error',
    ];

    protected $casts = [
        'last_synced_at' => 'datetime',
        'remote_updated_at' => 'datetime',
    ];

    public function integration(): BelongsTo
    {
        return $this->belongsTo(Integration::class);
    }

    public function workItem(): BelongsTo
    {
        return $this->belongsTo(WorkItem::class);
    }
}
