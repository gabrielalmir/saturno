<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('work_cadences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id');
            $table->foreignId('team_id');
            $table->string('name');
            $table->integer('sprint_duration_weeks')->default(2);
            $table->string('sprint_start_day')->default('Monday');
            $table->unsignedInteger('n1_n2_split_percentage')->default(20); // N1 percentage
            $table->timestamps();

            $organizationForeign = $table->foreign('organization_id')->references('id')->on('organizations');
            $teamForeign = $table->foreign('team_id')->references('id')->on('teams');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $organizationForeign->noActionOnDelete();
                $teamForeign->noActionOnDelete();
            } else {
                $organizationForeign->cascadeOnDelete();
                $teamForeign->cascadeOnDelete();
            }

            $table->unique(['team_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_cadences');
    }
};
