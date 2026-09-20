<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_item_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_item_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('allocation_percentage')->default(100)->comment('1-100, % de dedicação');
            $table->decimal('estimated_hours', 8, 2)->nullable()->comment('Calculado automaticamente');
            $table->timestamps();

            $table->unique(['work_item_id', 'user_id']);
            $table->index('work_item_id');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_item_allocations');
    }
};
