<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('work_items', function (Blueprint $table) {
            // Flow timestamps (used for cycle time / throughput / aging WIP).
            $table->timestamp('started_at')->nullable()->after('status');
            $table->timestamp('blocked_at')->nullable()->after('started_at');
            $table->text('blocked_reason')->nullable()->after('blocked_at');
            $table->timestamp('completed_at')->nullable()->after('blocked_reason');

            $table->index(['organization_id', 'status']);
            $table->index(['sprint_id', 'status']);
            $table->index(['organization_id', 'completed_at']);
        });

        Schema::create('work_item_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id');
            $table->foreignId('work_item_id');
            $table->foreignId('user_id')->nullable();
            $table->string('type'); // e.g. created, status_changed, assignee_changed
            $table->json('payload')->nullable();
            $table->timestamps();

            $organizationForeign = $table->foreign('organization_id')->references('id')->on('organizations');
            $workItemForeign = $table->foreign('work_item_id')->references('id')->on('work_items');
            $userForeign = $table->foreign('user_id')->references('id')->on('users');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $organizationForeign->noActionOnDelete();
                $workItemForeign->noActionOnDelete();
                $userForeign->noActionOnDelete();
            } else {
                $organizationForeign->cascadeOnDelete();
                $workItemForeign->cascadeOnDelete();
                $userForeign->nullOnDelete();
            }

            $table->index(['work_item_id', 'created_at']);
            $table->index(['organization_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_item_events');

        Schema::table('work_items', function (Blueprint $table) {
            $table->dropIndex(['organization_id', 'status']);
            $table->dropIndex(['sprint_id', 'status']);
            $table->dropIndex(['organization_id', 'completed_at']);
            $table->dropColumn(['started_at', 'blocked_at', 'blocked_reason', 'completed_at']);
        });
    }
};
