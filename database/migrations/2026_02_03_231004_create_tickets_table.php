<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('open');
            $table->string('priority')->default('P2');
            $table->foreignId('reporter_id')->nullable();
            $table->foreignId('assignee_id')->nullable();
            $table->date('due_date')->nullable();
            $table->timestamps();

            $reporterForeign = $table->foreign('reporter_id')->references('id')->on('users');
            $assigneeForeign = $table->foreign('assignee_id')->references('id')->on('users');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $reporterForeign->noActionOnDelete();
                $assigneeForeign->noActionOnDelete();
            } else {
                $reporterForeign->nullOnDelete();
                $assigneeForeign->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
