<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Normalize legacy/unsupported statuses so items don't get "stuck" after governance rules.
        $allowed = ['backlog', 'ready', 'in_progress', 'blocked', 'done'];

        DB::table('work_items')
            ->whereNotIn('status', $allowed)
            ->update(['status' => 'backlog']);

        // Backfill flow timestamps for existing data so board metrics are meaningful.
        DB::table('work_items')
            ->where('status', 'in_progress')
            ->whereNull('started_at')
            ->update(['started_at' => DB::raw('created_at')]);

        DB::table('work_items')
            ->where('status', 'blocked')
            ->whereNull('blocked_at')
            ->update(['blocked_at' => DB::raw('updated_at')]);

        DB::table('work_items')
            ->where('status', 'done')
            ->whereNull('completed_at')
            ->update(['completed_at' => DB::raw('updated_at')]);

        DB::table('work_items')
            ->where('status', 'done')
            ->whereNull('started_at')
            ->update(['started_at' => DB::raw('created_at')]);
    }

    public function down(): void
    {
        // Non-reversible data normalization/backfill.
    }
};
