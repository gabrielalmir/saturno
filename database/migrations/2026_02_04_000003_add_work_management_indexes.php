<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('work_items', function (Blueprint $table) {
            $table->index(['organization_id', 'assignee_id']);
            $table->index(['organization_id', 'due_date']);
            $table->index(['organization_id', 'epic_id']);
            $table->index(['organization_id', 'ticket_id']);
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->index(['organization_id', 'status']);
            $table->index(['organization_id', 'assignee_id']);
            $table->index(['organization_id', 'due_date']);
        });

        Schema::table('epics', function (Blueprint $table) {
            $table->index(['organization_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::table('work_items', function (Blueprint $table) {
            $table->dropIndex(['organization_id', 'assignee_id']);
            $table->dropIndex(['organization_id', 'due_date']);
            $table->dropIndex(['organization_id', 'epic_id']);
            $table->dropIndex(['organization_id', 'ticket_id']);
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->dropIndex(['organization_id', 'status']);
            $table->dropIndex(['organization_id', 'assignee_id']);
            $table->dropIndex(['organization_id', 'due_date']);
        });

        Schema::table('epics', function (Blueprint $table) {
            $table->dropIndex(['organization_id', 'status']);
        });
    }
};
