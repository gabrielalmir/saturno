<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sprints', function (Blueprint $table) {
            $table->string('status')->default('planning')->after('name');
            $table->timestamp('started_at')->nullable()->after('status');
            $table->timestamp('completed_at')->nullable()->after('started_at');
            $table->integer('capacity_snapshot_total')->nullable()->after('wip_limit');
            $table->integer('capacity_snapshot_reserved_n1')->nullable()->after('capacity_snapshot_total');
            $table->integer('commitment_snapshot')->nullable()->after('capacity_snapshot_reserved_n1');
        });
    }

    public function down(): void
    {
        Schema::table('sprints', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'started_at',
                'completed_at',
                'capacity_snapshot_total',
                'capacity_snapshot_reserved_n1',
                'commitment_snapshot',
            ]);
        });
    }
};
