<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('work_items', function (Blueprint $table) {
            $table->foreignId('ticket_id')->nullable()->after('epic_id');

            $ticketForeign = $table->foreign('ticket_id')->references('id')->on('tickets');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $ticketForeign->noActionOnDelete();
            } else {
                $ticketForeign->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('work_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('ticket_id');
        });
    }
};
