<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $organizations = DB::table('organizations')->get();

        foreach ($organizations as $organization) {
            $existing = DB::table('boards')
                ->where('organization_id', $organization->id)
                ->where('context_type', 'sprint')
                ->first();

            if ($existing) {
                continue;
            }

            $boardId = DB::table('boards')->insertGetId([
                'organization_id' => $organization->id,
                'name' => 'Board Principal',
                'description' => 'Board padrao da organizacao',
                'context_type' => 'sprint',
                'context_filter' => json_encode([
                    'sprint' => 'active',
                    'include_unsprinted_backlog' => true,
                ]),
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $columns = [
                ['name' => 'Backlog', 'kind' => 'status', 'status_mapping' => 'backlog'],
                ['name' => 'Pronto', 'kind' => 'status', 'status_mapping' => 'ready'],
                ['name' => 'Em Progresso', 'kind' => 'status', 'status_mapping' => 'in_progress'],
                ['name' => 'Bloqueado', 'kind' => 'status', 'status_mapping' => 'blocked'],
                ['name' => 'Concluido', 'kind' => 'status', 'status_mapping' => 'done'],
            ];

            $columnIds = [];
            foreach ($columns as $index => $column) {
                $columnId = DB::table('board_columns')->insertGetId([
                    'board_id' => $boardId,
                    'name' => $column['name'],
                    'kind' => $column['kind'],
                    'status_mapping' => $column['status_mapping'],
                    'position' => $index + 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                $columnIds[$column['status_mapping']] = $columnId;
            }

            $workItems = DB::table('work_items')
                ->where('organization_id', $organization->id)
                ->orderBy('created_at')
                ->orderBy('id')
                ->get();

            $positions = array_fill_keys(array_keys($columnIds), 0);

            foreach ($workItems as $item) {
                $status = $item->status ?? 'backlog';
                $columnId = $columnIds[$status] ?? $columnIds['backlog'];
                $positions[$status] = ($positions[$status] ?? 0) + 1;

                DB::table('board_items')->insert([
                    'board_id' => $boardId,
                    'column_id' => $columnId,
                    'work_item_id' => $item->id,
                    'position' => $positions[$status],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    public function down(): void
    {
        // No-op: keep boards and mappings to avoid accidental data loss.
    }
};
