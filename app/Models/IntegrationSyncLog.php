<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IntegrationSyncLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'integration_id',
        'provider',
        'direction',
        'status',
        'stats',
        'error',
    ];

    protected $casts = [
        'stats' => 'array',
    ];

    public function integration(): BelongsTo
    {
        return $this->belongsTo(Integration::class);
    }
}
