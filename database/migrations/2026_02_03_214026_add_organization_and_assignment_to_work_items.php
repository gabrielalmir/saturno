<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('work_items', function (Blueprint $table) {
            $table->foreignId('organization_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
            $table->foreignId('assignee_id')->nullable()->after('status');
            $table->foreignId('reporter_id')->nullable()->after('assignee_id');
            $table->integer('estimate')->nullable()->after('reporter_id');
            $table->foreignId('epic_id')->nullable()->after('estimate');

            $assigneeForeign = $table->foreign('assignee_id')->references('id')->on('users');
            $reporterForeign = $table->foreign('reporter_id')->references('id')->on('users');
            $epicForeign = $table->foreign('epic_id')->references('id')->on('epics');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $assigneeForeign->noActionOnDelete();
                $reporterForeign->noActionOnDelete();
                $epicForeign->noActionOnDelete();
            } else {
                $assigneeForeign->nullOnDelete();
                $reporterForeign->nullOnDelete();
                $epicForeign->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('work_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('epic_id');
            $table->dropColumn('estimate');
            $table->dropConstrainedForeignId('reporter_id');
            $table->dropConstrainedForeignId('assignee_id');
            $table->dropConstrainedForeignId('organization_id');
        });
    }
};
