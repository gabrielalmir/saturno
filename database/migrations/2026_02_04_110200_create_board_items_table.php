<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('board_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('board_id');
            $table->foreignId('column_id');
            $table->foreignId('work_item_id');
            $table->unsignedInteger('position')->default(1);
            $table->timestamps();

            $boardForeign = $table->foreign('board_id')->references('id')->on('boards');
            $columnForeign = $table->foreign('column_id')->references('id')->on('board_columns');
            $workItemForeign = $table->foreign('work_item_id')->references('id')->on('work_items');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $boardForeign->cascadeOnDelete();
                $columnForeign->noActionOnDelete();
                $workItemForeign->noActionOnDelete();
            } else {
                $boardForeign->cascadeOnDelete();
                $columnForeign->cascadeOnDelete();
                $workItemForeign->cascadeOnDelete();
            }

            $table->unique(['board_id', 'work_item_id']);
            $table->index(['column_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('board_items');
    }
};
