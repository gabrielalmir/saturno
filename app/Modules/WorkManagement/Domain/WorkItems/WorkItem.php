<?php

namespace App\Modules\WorkManagement\Domain\WorkItems;

use DateTimeImmutable;

final class WorkItem
{
    public function __construct(
        public readonly int $id,
        public readonly int $organizationId,
        public readonly string $title,
        public readonly ?string $description,
        public readonly Tier $tier,
        public readonly string $type,
        public readonly string $size,
        public readonly string $priority,
        public readonly WorkItemStatus $status,
        public readonly ?int $sprintId,
        public readonly ?int $assigneeId,
        public readonly int $reporterId,
        public readonly ?int $estimate,
        public readonly ?DateTimeImmutable $dueDate,
        public readonly ?DateTimeImmutable $plannedFor,
        public readonly ?int $plannedRank,
        public readonly ?int $epicId,
        public readonly ?int $ticketId,
        public readonly ?int $parentId,
        public readonly ?DateTimeImmutable $startedAt,
        public readonly ?DateTimeImmutable $blockedAt,
        public readonly ?string $blockedReason,
        public readonly ?DateTimeImmutable $completedAt,
    ) {}

    public function with(
        ?string $title = null,
        ?string $description = null,
        ?Tier $tier = null,
        ?string $type = null,
        ?string $size = null,
        ?string $priority = null,
        ?WorkItemStatus $status = null,
        ?int $sprintId = null,
        ?int $assigneeId = null,
        ?int $reporterId = null,
        ?int $estimate = null,
        ?DateTimeImmutable $dueDate = null,
        ?DateTimeImmutable $plannedFor = null,
        ?int $plannedRank = null,
        ?int $epicId = null,
        ?int $ticketId = null,
        ?int $parentId = null,
        ?DateTimeImmutable $startedAt = null,
        ?DateTimeImmutable $blockedAt = null,
        ?string $blockedReason = null,
        ?DateTimeImmutable $completedAt = null,
    ): self {
        return new self(
            id: $this->id,
            organizationId: $this->organizationId,
            title: $title ?? $this->title,
            description: $description ?? $this->description,
            tier: $tier ?? $this->tier,
            type: $type ?? $this->type,
            size: $size ?? $this->size,
            priority: $priority ?? $this->priority,
            status: $status ?? $this->status,
            sprintId: $sprintId ?? $this->sprintId,
            assigneeId: $assigneeId ?? $this->assigneeId,
            reporterId: $reporterId ?? $this->reporterId,
            estimate: $estimate ?? $this->estimate,
            dueDate: $dueDate ?? $this->dueDate,
            plannedFor: $plannedFor ?? $this->plannedFor,
            plannedRank: $plannedRank ?? $this->plannedRank,
            epicId: $epicId ?? $this->epicId,
            ticketId: $ticketId ?? $this->ticketId,
            parentId: $parentId ?? $this->parentId,
            startedAt: $startedAt ?? $this->startedAt,
            blockedAt: $blockedAt ?? $this->blockedAt,
            blockedReason: $blockedReason ?? $this->blockedReason,
            completedAt: $completedAt ?? $this->completedAt,
        );
    }
}
