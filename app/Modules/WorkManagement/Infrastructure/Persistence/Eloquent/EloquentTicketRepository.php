<?php

namespace App\Modules\WorkManagement\Infrastructure\Persistence\Eloquent;

use App\Models\Ticket;
use App\Modules\WorkManagement\Application\Ports\Repositories\TicketRepository;

class EloquentTicketRepository implements TicketRepository
{
    public function existsForOrg(int $organizationId, int $ticketId): bool
    {
        return Ticket::query()
            ->where('organization_id', $organizationId)
            ->where('id', $ticketId)
            ->exists();
    }
}
