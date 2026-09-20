<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sprint_user_n1_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sprint_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('reserved_n1')->nullable(); // same unit as organization planning_unit
            $table->timestamps();

            $table->unique(['sprint_id', 'user_id']);
            $table->index(['sprint_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sprint_user_n1_reservations');
    }
};
