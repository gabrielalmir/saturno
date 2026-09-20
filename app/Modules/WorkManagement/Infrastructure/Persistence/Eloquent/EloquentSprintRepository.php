<?php

namespace App\Modules\WorkManagement\Infrastructure\Persistence\Eloquent;

use App\Models\Sprint as SprintModel;
use App\Modules\WorkManagement\Application\Ports\Repositories\SprintRepository;
use App\Modules\WorkManagement\Domain\Sprints\Sprint;
use App\Modules\WorkManagement\Domain\Sprints\SprintStatus;
use DateTimeImmutable;
use Illuminate\Support\Carbon;

class EloquentSprintRepository implements SprintRepository
{
    public function findForOrg(int $organizationId, int $id): ?Sprint
    {
        $model = SprintModel::query()
            ->where('organization_id', $organizationId)
            ->where('id', $id)
            ->first();

        return $model ? $this->toDomain($model) : null;
    }

    public function findActiveForOrg(int $organizationId): ?Sprint
    {
        $model = SprintModel::query()
            ->where('organization_id', $organizationId)
            ->where('status', SprintStatus::Active->value)
            ->first();

        return $model ? $this->toDomain($model) : null;
    }

    private function toDomain(SprintModel $model): Sprint
    {
        return new Sprint(
            id: (int) $model->id,
            organizationId: (int) $model->organization_id,
            status: SprintStatus::from((string) ($model->status ?? SprintStatus::Planning->value)),
            capacityTotal: (int) $model->capacity_total,
            capacityReservedN1: (int) $model->capacity_reserved_n1,
            wipLimit: (int) $model->wip_limit,
            startDate: $this->toImmutable($model->start_date) ?? new DateTimeImmutable,
            endDate: $this->toImmutable($model->end_date) ?? new DateTimeImmutable,
        );
    }

    private function toImmutable(mixed $value): ?DateTimeImmutable
    {
        if ($value === null) {
            return null;
        }
        if ($value instanceof DateTimeImmutable) {
            return $value;
        }
        if ($value instanceof Carbon) {
            return $value->toDateTimeImmutable();
        }
        if ($value instanceof \DateTimeInterface) {
            return DateTimeImmutable::createFromInterface($value);
        }

        return new DateTimeImmutable((string) $value);
    }
}
