<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id');
            $table->foreignId('team_id');
            $table->foreignId('epic_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('priority')->default('P2');
            $table->string('status')->default('backlog');
            $table->integer('estimate')->nullable();
            $table->string('jira_key')->nullable();
            $table->timestamps();

            $organizationForeign = $table->foreign('organization_id')->references('id')->on('organizations');
            $teamForeign = $table->foreign('team_id')->references('id')->on('teams');
            $epicForeign = $table->foreign('epic_id')->references('id')->on('epics');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $organizationForeign->noActionOnDelete();
                $teamForeign->noActionOnDelete();
                $epicForeign->noActionOnDelete();
            } else {
                $organizationForeign->cascadeOnDelete();
                $teamForeign->cascadeOnDelete();
                $epicForeign->nullOnDelete();
            }

            $table->index(['organization_id', 'team_id']);
        });

        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id');
            $table->foreignId('team_id');
            $table->foreignId('story_id')->nullable();
            $table->foreignId('sprint_id')->nullable();
            $table->foreignId('assignee_id')->nullable();
            $table->foreignId('reporter_id')->nullable();
            $table->foreignId('ticket_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type')->default('task'); // task, bug, support
            $table->string('priority')->default('P2');
            $table->string('status')->default('backlog'); // backlog, ready, in_progress, blocked, done
            $table->integer('estimate')->nullable();
            $table->boolean('n1')->default(false);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('blocked_at')->nullable();
            $table->text('blocked_reason')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->string('jira_key')->nullable();
            $table->timestamps();

            $organizationForeign = $table->foreign('organization_id')->references('id')->on('organizations');
            $teamForeign = $table->foreign('team_id')->references('id')->on('teams');
            $storyForeign = $table->foreign('story_id')->references('id')->on('stories');
            $sprintForeign = $table->foreign('sprint_id')->references('id')->on('sprints');
            $assigneeForeign = $table->foreign('assignee_id')->references('id')->on('users');
            $reporterForeign = $table->foreign('reporter_id')->references('id')->on('users');
            $ticketForeign = $table->foreign('ticket_id')->references('id')->on('tickets');

            if (Schema::getConnection()->getDriverName() === 'sqlsrv') {
                $organizationForeign->noActionOnDelete();
                $teamForeign->noActionOnDelete();
                $storyForeign->noActionOnDelete();
                $sprintForeign->noActionOnDelete();
                $assigneeForeign->noActionOnDelete();
                $reporterForeign->noActionOnDelete();
                $ticketForeign->noActionOnDelete();
            } else {
                $organizationForeign->cascadeOnDelete();
                $teamForeign->cascadeOnDelete();
                $storyForeign->nullOnDelete();
                $sprintForeign->nullOnDelete();
                $assigneeForeign->nullOnDelete();
                $reporterForeign->nullOnDelete();
                $ticketForeign->nullOnDelete();
            }

            $table->index(['organization_id', 'team_id']);
            $table->index(['sprint_id', 'status']);
            $table->index(['organization_id', 'completed_at']);
        });

        // Backfill from work_items
        $workItems = DB::table('work_items')->get();
        foreach ($workItems as $wi) {
            // Story: use parent for hierarchy, else create a synthetic story wrapping the task
            if ($wi->parent_id) {
                $storyId = DB::table('stories')->insertGetId([
                    'organization_id' => $wi->organization_id,
                    'team_id' => $wi->team_id,
                    'epic_id' => $wi->epic_id,
                    'title' => $wi->title,
                    'description' => $wi->description,
                    'priority' => $wi->priority,
                    'status' => $wi->status,
                    'estimate' => $wi->estimate,
                    'jira_key' => $wi->jira_key ?? null,
                    'created_at' => $wi->created_at,
                    'updated_at' => $wi->updated_at,
                ]);

                DB::table('tasks')->insert([
                    'organization_id' => $wi->organization_id,
                    'team_id' => $wi->team_id,
                    'story_id' => $storyId,
                    'sprint_id' => $wi->sprint_id,
                    'assignee_id' => $wi->assignee_id,
                    'reporter_id' => $wi->reporter_id,
                    'ticket_id' => $wi->ticket_id,
                    'title' => $wi->title,
                    'description' => $wi->description,
                    'type' => $wi->type,
                    'priority' => $wi->priority,
                    'status' => $wi->status,
                    'estimate' => $wi->estimate,
                    'n1' => $wi->tier === 'N1',
                    'started_at' => $wi->started_at,
                    'blocked_at' => $wi->blocked_at,
                    'blocked_reason' => $wi->blocked_reason,
                    'completed_at' => $wi->completed_at,
                    'jira_key' => $wi->jira_key ?? null,
                    'created_at' => $wi->created_at,
                    'updated_at' => $wi->updated_at,
                ]);
            } else {
                // Create story as container and move the item as task
                $storyId = DB::table('stories')->insertGetId([
                    'organization_id' => $wi->organization_id,
                    'team_id' => $wi->team_id,
                    'epic_id' => $wi->epic_id,
                    'title' => $wi->title,
                    'description' => $wi->description,
                    'priority' => $wi->priority,
                    'status' => $wi->status,
                    'estimate' => $wi->estimate,
                    'jira_key' => $wi->jira_key ?? null,
                    'created_at' => $wi->created_at,
                    'updated_at' => $wi->updated_at,
                ]);

                DB::table('tasks')->insert([
                    'organization_id' => $wi->organization_id,
                    'team_id' => $wi->team_id,
                    'story_id' => $storyId,
                    'sprint_id' => $wi->sprint_id,
                    'assignee_id' => $wi->assignee_id,
                    'reporter_id' => $wi->reporter_id,
                    'ticket_id' => $wi->ticket_id,
                    'title' => $wi->title,
                    'description' => $wi->description,
                    'type' => $wi->type,
                    'priority' => $wi->priority,
                    'status' => $wi->status,
                    'estimate' => $wi->estimate,
                    'n1' => $wi->tier === 'N1',
                    'started_at' => $wi->started_at,
                    'blocked_at' => $wi->blocked_at,
                    'blocked_reason' => $wi->blocked_reason,
                    'completed_at' => $wi->completed_at,
                    'jira_key' => $wi->jira_key ?? null,
                    'created_at' => $wi->created_at,
                    'updated_at' => $wi->updated_at,
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('stories');
    }
};
