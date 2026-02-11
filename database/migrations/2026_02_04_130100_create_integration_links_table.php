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
            $table->foreignId('integration_id')->constrained('integrations')->cascadeOnDelete();
            $table->foreignId('work_item_id')->constrained('work_items')->cascadeOnDelete();
            $table->string('provider');
            $table->string('remote_item_id');
            $table->string('remote_url')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamp('remote_updated_at')->nullable();
            $table->string('sync_status')->default('pending'); // ok, pending, failed, conflicted
            $table->text('last_error')->nullable();
            $table->timestamps();

            $table->unique(['integration_id', 'work_item_id']);
            $table->index(['provider', 'remote_item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('integration_links');
    }
};
