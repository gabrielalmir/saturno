<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sprints', function (Blueprint $table) {
            $table
                ->boolean('use_member_n1_reserve')
                ->default(false)
                ->after('capacity_reserved_n1');
        });
    }

    public function down(): void
    {
        Schema::table('sprints', function (Blueprint $table) {
            $table->dropColumn('use_member_n1_reserve');
        });
    }
};
