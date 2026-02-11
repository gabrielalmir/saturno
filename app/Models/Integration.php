<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Integration extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'provider',
        'enabled',
        'direction',
        'frequency',
        'scope',
        'field_mapping',
        'conflict_policy',
        'status',
        'last_error',
        'last_synced_at',
        'config',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'scope' => 'array',
        'field_mapping' => 'array',
        'config' => 'encrypted:array',
        'last_synced_at' => 'datetime',
    ];

    protected $hidden = ['config'];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function links(): HasMany
    {
        return $this->hasMany(IntegrationLink::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(IntegrationSyncLog::class);
    }
}
