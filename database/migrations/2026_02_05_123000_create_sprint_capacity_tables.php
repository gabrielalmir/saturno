<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sprint_capacities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sprint_id')->constrained()->cascadeOnDelete();
            $table->integer('working_days');
            $table->integer('total_hours');
            $table->integer('reserved_n1_hours')->default(0);
            $table->integer('buffer_n1_hours')->default(0);
            $table->integer('available_n2_hours');
            $table->json('details')->nullable(); // per-user breakdown
            $table->timestamps();
        });

        Schema::create('absences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('availability_percentage')->default(0);
            $table->string('reason')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'team_id']);
            $table->index(['start_date', 'end_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absences');
        Schema::dropIfExists('sprint_capacities');
    }
};
