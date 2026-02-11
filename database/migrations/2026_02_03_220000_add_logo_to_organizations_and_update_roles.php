<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->string('logo_path')->nullable()->after('description');
        });

        DB::table('organization_user')
            ->where('role', 'member')
            ->update(['role' => 'user']);
    }

    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropColumn('logo_path');
        });

        DB::table('organization_user')
            ->where('role', 'user')
            ->update(['role' => 'member']);
    }
};
