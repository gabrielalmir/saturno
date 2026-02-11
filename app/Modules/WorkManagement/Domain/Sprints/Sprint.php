<?php

namespace App\Modules\WorkManagement\Domain\Sprints;

use DateTimeImmutable;

final class Sprint
{
    public function __construct(
        public readonly int $id,
        public readonly int $organizationId,
        public readonly SprintStatus $status,
        public readonly int $capacityTotal,
        public readonly int $capacityReservedN1,
        public readonly int $wipLimit,
        public readonly DateTimeImmutable $startDate,
        public readonly DateTimeImmutable $endDate,
    ) {}
}
