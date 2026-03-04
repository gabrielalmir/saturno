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
        Schema::create('work_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('tier'); // N1, N2
            $table->string('type'); // incident, service, problem, change
            $table->string('size'); // rapid, standard, long, epic
            $table->string('priority')->default('P2'); // P0-P3
            $table->string('status')->default('backlog');
            $table->foreignId('sprint_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('parent_id')->nullable();
            $parentForeign = $table->foreign('parent_id')->references('id')->on('work_items');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $parentForeign->noActionOnDelete();
            } else {
                $parentForeign->nullOnDelete();
            }
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_items');
    }
};
