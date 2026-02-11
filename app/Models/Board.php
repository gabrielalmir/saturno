<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Board extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'project_id',
        'name',
        'description',
        'context_type',
        'context_filter',
    ];

    protected $casts = [
        'context_filter' => 'array',
    ];

    public function columns(): HasMany
    {
        return $this->hasMany(BoardColumn::class)->orderBy('position');
    }

    public function items(): HasMany
    {
        return $this->hasMany(BoardItem::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public static function defaultForOrganization(int $organizationId, ?int $projectId = null): self
    {
        return DB::transaction(function () use ($organizationId, $projectId) {
            $existing = self::where('organization_id', $organizationId)
                ->where('project_id', $projectId)
                ->where('context_type', 'sprint')
                ->first();

            if ($existing) {
                return $existing;
            }

            $board = self::create([
                'organization_id' => $organizationId,
                'project_id' => $projectId,
                'name' => 'Board Principal',
                'description' => 'Board padrao da organizacao',
                'context_type' => 'sprint',
                'context_filter' => [
                    'sprint' => 'active',
                    'include_unsprinted_backlog' => true,
                ],
            ]);

            $columns = [
                ['name' => 'Backlog', 'kind' => 'status', 'status_mapping' => 'backlog'],
                ['name' => 'Pronto', 'kind' => 'status', 'status_mapping' => 'ready'],
                ['name' => 'Em Progresso', 'kind' => 'status', 'status_mapping' => 'in_progress'],
                ['name' => 'Bloqueado', 'kind' => 'status', 'status_mapping' => 'blocked'],
                ['name' => 'Concluido', 'kind' => 'status', 'status_mapping' => 'done'],
            ];

            foreach ($columns as $index => $column) {
                $board->columns()->create([
                    'name' => $column['name'],
                    'kind' => $column['kind'],
                    'status_mapping' => $column['status_mapping'],
                    'position' => $index + 1,
                ]);
            }

            return $board;
        });
    }
}
