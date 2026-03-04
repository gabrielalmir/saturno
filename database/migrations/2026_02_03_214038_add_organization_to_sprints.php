<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sprints', function (Blueprint $table) {
            $table->foreignId('organization_id')->nullable()->after('id');

            $organizationForeign = $table->foreign('organization_id')->references('id')->on('organizations');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $organizationForeign->noActionOnDelete();
            } else {
                $organizationForeign->cascadeOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('sprints', function (Blueprint $table) {
            $table->dropConstrainedForeignId('organization_id');
        });
    }
};
