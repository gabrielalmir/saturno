<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('integrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->string('provider'); // jira, trello, todoist
            $table->boolean('enabled')->default(false);
            $table->string('direction')->default('pull'); // pull, push, two_way
            $table->string('frequency')->default('manual'); // manual, interval, webhook
            $table->json('scope')->nullable(); // project/board/list ids
            $table->json('field_mapping')->nullable();
            $table->string('conflict_policy')->default('last_write_wins');
            $table->string('status')->default('idle'); // idle, syncing, error
            $table->text('last_error')->nullable(); // sanitized
            $table->timestamp('last_synced_at')->nullable();
            $table->json('config')->nullable(); // encrypted credentials
            $table->timestamps();

            $table->unique(['organization_id', 'provider']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('integrations');
    }
};
