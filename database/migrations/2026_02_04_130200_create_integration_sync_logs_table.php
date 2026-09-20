<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('integration_sync_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('integration_id')->constrained('integrations')->cascadeOnDelete();
            $table->string('provider');
            $table->string('direction');
            $table->string('status'); // success, failed, partial
            $table->json('stats')->nullable(); // counts, durations, retries
            $table->text('error')->nullable(); // sanitized, no secrets
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('integration_sync_logs');
    }
};
