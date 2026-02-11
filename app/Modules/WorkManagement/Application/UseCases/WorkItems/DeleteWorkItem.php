<?php

namespace App\Modules\WorkManagement\Application\UseCases\WorkItems;

use App\Modules\WorkManagement\Application\Exceptions\NotFound;
use App\Modules\WorkManagement\Application\Ports\Auth\CurrentUserProvider;
use App\Modules\WorkManagement\Application\Ports\Repositories\WorkItemEventRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\WorkItemRepository;
use App\Modules\WorkManagement\Domain\Exceptions\CannotDeleteDoneWorkItem;
use App\Modules\WorkManagement\Domain\WorkItems\WorkItemStatus;

final class DeleteWorkItem
{
    public function __construct(
        private CurrentUserProvider $currentUser,
        private WorkItemRepository $workItems,
        private WorkItemEventRepository $events,
    ) {}

    public function execute(int $workItemId): void
    {
        $orgId = $this->currentUser->organizationId();
        $userId = $this->currentUser->userId();

        $workItem = $this->workItems->findForOrg($orgId, $workItemId);
        if (! $workItem) {
            throw new NotFound('Work item não encontrado.');
        }

        if ($workItem->status === WorkItemStatus::Done) {
            $this->events->record($orgId, $workItem->id, $userId, 'delete_rejected', [
                'reason' => 'done',
            ]);
            throw new CannotDeleteDoneWorkItem;
        }

        $this->workItems->delete($workItem);

        $this->events->record($orgId, $workItem->id, $userId, 'deleted', null);
    }
}
