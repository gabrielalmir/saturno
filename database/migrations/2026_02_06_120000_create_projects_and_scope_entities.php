<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();

            $table->unique(['organization_id', 'slug']);
            $table->index(['organization_id', 'name']);
        });

        Schema::create('project_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('role')->default('member');
            $table->timestamps();

            $table->unique(['project_id', 'user_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('current_project_id')->nullable()->after('current_organization_id');
            $projectForeign = $table->foreign('current_project_id')->references('id')->on('projects');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $projectForeign->noActionOnDelete();
            } else {
                $projectForeign->nullOnDelete();
            }
        });

        Schema::table('teams', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable()->after('organization_id');
            $projectForeign = $table->foreign('project_id')->references('id')->on('projects');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $projectForeign->noActionOnDelete();
            } else {
                $projectForeign->nullOnDelete();
            }
        });

        Schema::table('sprints', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable()->after('organization_id');
            $projectForeign = $table->foreign('project_id')->references('id')->on('projects');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $projectForeign->noActionOnDelete();
            } else {
                $projectForeign->nullOnDelete();
            }

            $table->index(['organization_id', 'project_id', 'status']);
        });

        Schema::table('work_items', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable()->after('organization_id');
            $projectForeign = $table->foreign('project_id')->references('id')->on('projects');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $projectForeign->noActionOnDelete();
            } else {
                $projectForeign->nullOnDelete();
            }

            $table->index(['organization_id', 'project_id', 'status']);
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable()->after('organization_id');
            $projectForeign = $table->foreign('project_id')->references('id')->on('projects');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $projectForeign->noActionOnDelete();
            } else {
                $projectForeign->nullOnDelete();
            }

            $table->index(['organization_id', 'project_id', 'status']);
        });

        Schema::table('boards', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable()->after('organization_id');
            $projectForeign = $table->foreign('project_id')->references('id')->on('projects');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $projectForeign->noActionOnDelete();
            } else {
                $projectForeign->nullOnDelete();
            }

            $table->index(['organization_id', 'project_id', 'context_type']);
        });

        Schema::table('epics', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable()->after('organization_id');
            $projectForeign = $table->foreign('project_id')->references('id')->on('projects');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $projectForeign->noActionOnDelete();
            } else {
                $projectForeign->nullOnDelete();
            }
        });

        Schema::table('stories', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable()->after('organization_id');
            $projectForeign = $table->foreign('project_id')->references('id')->on('projects');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $projectForeign->noActionOnDelete();
            } else {
                $projectForeign->nullOnDelete();
            }
        });

        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable()->after('organization_id');
            $projectForeign = $table->foreign('project_id')->references('id')->on('projects');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $projectForeign->noActionOnDelete();
            } else {
                $projectForeign->nullOnDelete();
            }
        });

        $organizations = DB::table('organizations')->get(['id', 'name']);

        foreach ($organizations as $organization) {
            $baseSlug = Str::slug((string) $organization->name) ?: 'projeto';
            $slug = "{$baseSlug}-principal";

            $projectId = DB::table('projects')->insertGetId([
                'organization_id' => $organization->id,
                'name' => 'Projeto Principal',
                'slug' => $slug,
                'description' => 'Projeto padrão da organização',
                'settings' => json_encode([]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $memberships = DB::table('organization_user')
                ->where('organization_id', $organization->id)
                ->get(['user_id', 'role']);

            foreach ($memberships as $membership) {
                $projectRole = in_array($membership->role, ['admin', 'maintainer'], true) ? 'manager' : 'member';
                DB::table('project_user')->updateOrInsert(
                    [
                        'project_id' => $projectId,
                        'user_id' => $membership->user_id,
                    ],
                    [
                        'role' => $projectRole,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                );
            }

            DB::table('users')
                ->where('current_organization_id', $organization->id)
                ->whereNull('current_project_id')
                ->update(['current_project_id' => $projectId]);

            DB::table('teams')
                ->where('organization_id', $organization->id)
                ->whereNull('project_id')
                ->update(['project_id' => $projectId]);

            DB::table('sprints')
                ->where('organization_id', $organization->id)
                ->whereNull('project_id')
                ->update(['project_id' => $projectId]);

            DB::table('work_items')
                ->where('organization_id', $organization->id)
                ->whereNull('project_id')
                ->update(['project_id' => $projectId]);

            DB::table('tickets')
                ->where('organization_id', $organization->id)
                ->whereNull('project_id')
                ->update(['project_id' => $projectId]);

            DB::table('boards')
                ->where('organization_id', $organization->id)
                ->whereNull('project_id')
                ->update(['project_id' => $projectId]);

            DB::table('epics')
                ->where('organization_id', $organization->id)
                ->whereNull('project_id')
                ->update(['project_id' => $projectId]);

            DB::table('stories')
                ->where('organization_id', $organization->id)
                ->whereNull('project_id')
                ->update(['project_id' => $projectId]);

            DB::table('tasks')
                ->where('organization_id', $organization->id)
                ->whereNull('project_id')
                ->update(['project_id' => $projectId]);
        }
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropConstrainedForeignId('project_id');
        });

        Schema::table('stories', function (Blueprint $table) {
            $table->dropConstrainedForeignId('project_id');
        });

        Schema::table('epics', function (Blueprint $table) {
            $table->dropConstrainedForeignId('project_id');
        });

        Schema::table('boards', function (Blueprint $table) {
            $table->dropIndex(['organization_id', 'project_id', 'context_type']);
            $table->dropConstrainedForeignId('project_id');
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->dropIndex(['organization_id', 'project_id', 'status']);
            $table->dropConstrainedForeignId('project_id');
        });

        Schema::table('work_items', function (Blueprint $table) {
            $table->dropIndex(['organization_id', 'project_id', 'status']);
            $table->dropConstrainedForeignId('project_id');
        });

        Schema::table('sprints', function (Blueprint $table) {
            $table->dropIndex(['organization_id', 'project_id', 'status']);
            $table->dropConstrainedForeignId('project_id');
        });

        Schema::table('teams', function (Blueprint $table) {
            $table->dropConstrainedForeignId('project_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('current_project_id');
        });

        Schema::dropIfExists('project_user');
        Schema::dropIfExists('projects');
    }
};
