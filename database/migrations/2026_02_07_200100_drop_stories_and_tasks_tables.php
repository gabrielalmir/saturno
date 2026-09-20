<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('stories');
    }

    /**
     * Reverse the migrations.
     *
     * Note: This down migration is a best-effort recreation and will not
     * restore the data. The original creation migration is
     * 2026_02_05_121000_create_stories_and_tasks.php
     */
    public function down(): void
    {
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->constrained('teams')->cascadeOnDelete();
            $table->foreignId('epic_id')->nullable()->constrained('epics')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('priority')->default('P2');
            $table->string('status')->default('backlog');
            $table->integer('estimate')->nullable();
            $table->string('jira_key')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'team_id']);
        });

        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->constrained('teams')->cascadeOnDelete();
            $table->foreignId('story_id')->nullable()->constrained('stories')->nullOnDelete();
            $table->foreignId('sprint_id')->nullable()->constrained('sprints')->nullOnDelete();
            $table->foreignId('assignee_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('reporter_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('ticket_id')->nullable()->constrained('tickets')->nullOnDelete();
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

            $table->index(['organization_id', 'team_id']);
            $table->index(['sprint_id', 'status']);
            $table->index(['organization_id', 'completed_at']);
        });
    }
};
