<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['organization_id', 'name']);
        });

        Schema::create('team_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained('teams')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('role')->default('analyst'); // analyst | manager
            $table->timestamps();

            $table->unique(['team_id', 'user_id']);
        });

        Schema::table('sprints', function (Blueprint $table) {
            $table->foreignId('team_id')->nullable()->after('organization_id');

            $teamForeign = $table->foreign('team_id')->references('id')->on('teams');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $teamForeign->noActionOnDelete();
            } else {
                $teamForeign->nullOnDelete();
            }
        });

        Schema::table('work_items', function (Blueprint $table) {
            $table->foreignId('team_id')->nullable()->after('organization_id');
            $teamForeign = $table->foreign('team_id')->references('id')->on('teams');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $teamForeign->noActionOnDelete();
            } else {
                $teamForeign->nullOnDelete();
            }

            $table->string('jira_key')->nullable()->after('ticket_id');
        });

        // Backfill: create one team per organization and attach existing users/sprints/work items
        $organizations = DB::table('organizations')->get(['id', 'name']);

        foreach ($organizations as $organization) {
            $teamId = DB::table('teams')->insertGetId([
                'organization_id' => $organization->id,
                'name' => $organization->name.' Team',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Attach all org users to the new team preserving org role when possible
            $memberships = DB::table('organization_user')
                ->where('organization_id', $organization->id)
                ->get(['user_id', 'role']);

            foreach ($memberships as $membership) {
                DB::table('team_user')->updateOrInsert([
                    'team_id' => $teamId,
                    'user_id' => $membership->user_id,
                ], [
                    'role' => $membership->role === 'admin' ? 'manager' : ($membership->role ?? 'analyst'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Attach existing sprints and work items to the default team
            DB::table('sprints')
                ->where('organization_id', $organization->id)
                ->update(['team_id' => $teamId]);

            DB::table('work_items')
                ->where('organization_id', $organization->id)
                ->update(['team_id' => $teamId]);
        }
    }

    public function down(): void
    {
        Schema::table('work_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('team_id');
            $table->dropColumn('jira_key');
        });

        Schema::table('sprints', function (Blueprint $table) {
            $table->dropConstrainedForeignId('team_id');
        });

        Schema::dropIfExists('team_user');
        Schema::dropIfExists('teams');
    }
};
