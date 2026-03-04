<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('integration_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('integration_id');
            $table->foreignId('work_item_id');
            $table->string('provider');
            $table->string('remote_item_id');
            $table->string('remote_url')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamp('remote_updated_at')->nullable();
            $table->string('sync_status')->default('pending'); // ok, pending, failed, conflicted
            $table->text('last_error')->nullable();
            $table->timestamps();

            $integrationForeign = $table->foreign('integration_id')->references('id')->on('integrations');
            $workItemForeign = $table->foreign('work_item_id')->references('id')->on('work_items');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $integrationForeign->cascadeOnDelete();
                $workItemForeign->noActionOnDelete();
            } else {
                $integrationForeign->cascadeOnDelete();
                $workItemForeign->cascadeOnDelete();
            }

            $table->unique(['integration_id', 'work_item_id']);
            $table->index(['provider', 'remote_item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('integration_links');
    }
};
