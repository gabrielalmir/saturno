<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('boards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('context_type')->default('custom');
            $table->json('context_filter')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'context_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('boards');
    }
};
