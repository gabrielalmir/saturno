<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This migration consolidates the data from the 'stories' and 'tasks' tables
     * back into the 'work_items' table, which is a more flexible and abstract
     * representation of work. This is a corrective migration to unify the domain model.
     */
    public function up(): void
    {
        // Disable foreign key checks to avoid issues with dependencies
        Schema::disableForeignKeyConstraints();

        // Step 1: Create WorkItems for Stories that act as containers
        $stories = DB::table('stories')->whereNotNull('epic_id')->get();
        foreach ($stories as $story) {
            DB::table('work_items')->updateOrInsert(
                ['jira_key' => $story->jira_key, 'title' => $story->title], // A best-effort unique key
                [
                    'organization_id' => $story->organization_id,
                    'project_id' => $story->project_id,
                    'team_id' => $story->team_id,
                    'epic_id' => $story->epic_id,
                    'title' => $story->title,
                    'description' => $story->description,
                    'tier' => 'N2', // Stories are generally planned work
                    'type' => 'story', // Mark these as stories
                    'priority' => $story->priority,
                    'status' => $story->status,
                    'estimate' => $story->estimate,
                    'jira_key' => $story->jira_key,
                    'created_at' => $story->created_at,
                    'updated_at' => $story->updated_at,
                ]
            );
        }

        // Step 2: Create WorkItems for Tasks, linking them to the Story's WorkItem if applicable
        $tasks = DB::table('tasks')->get();
        foreach ($tasks as $task) {
            $story = $task->story_id ? DB::table('stories')->find($task->story_id) : null;

            $parentWorkItem = null;
            if ($story) {
                $parentWorkItem = DB::table('work_items')->where('title', $story->title)
                    ->where('epic_id', $story->epic_id)
                    ->first();
            }

            DB::table('work_items')->updateOrInsert(
                ['jira_key' => $task->jira_key, 'title' => $task->title], // A best-effort unique key
                [
                    'organization_id' => $task->organization_id,
                    'project_id' => $task->project_id,
                    'team_id' => $task->team_id,
                    'sprint_id' => $task->sprint_id,
                    'parent_id' => $parentWorkItem ? $parentWorkItem->id : null,
                    'epic_id' => $parentWorkItem ? $parentWorkItem->epic_id : ($story ? $story->epic_id : null),
                    'assignee_id' => $task->assignee_id,
                    'reporter_id' => $task->reporter_id,
                    'ticket_id' => $task->ticket_id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'tier' => $task->n1 ? 'N1' : 'N2',
                    'type' => $task->type,
                    'priority' => $task->priority,
                    'status' => $task->status,
                    'estimate' => $task->estimate,
                    'started_at' => $task->started_at,
                    'blocked_at' => $task->blocked_at,
                    'blocked_reason' => $task->blocked_reason,
                    'completed_at' => $task->completed_at,
                    'jira_key' => $task->jira_key,
                    'created_at' => $task->created_at,
                    'updated_at' => $task->updated_at,
                ]
            );
        }

        // Re-enable foreign key checks
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     *
     * This down migration is destructive and should be used with caution.
     * It will remove all work items that were created based on stories and tasks.
     */
    public function down(): void
    {
        // This is a best-effort reversal. It's not perfectly transactional.
        DB::table('work_items')->whereIn('type', ['story', 'task', 'bug', 'support'])->delete();
    }
};
