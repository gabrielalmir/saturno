<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('work_items', function (Blueprint $table) {
            $table->date('planned_for')->nullable()->after('due_date');
            $table->unsignedInteger('planned_rank')->nullable()->after('planned_for');

            $table->index(['organization_id', 'planned_for']);
            $table->index(['organization_id', 'assignee_id', 'planned_for']);
        });
    }

    public function down(): void
    {
        Schema::table('work_items', function (Blueprint $table) {
            $table->dropIndex(['organization_id', 'planned_for']);
            $table->dropIndex(['organization_id', 'assignee_id', 'planned_for']);

            $table->dropColumn(['planned_for', 'planned_rank']);
        });
    }
};
