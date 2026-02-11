<?php

namespace App\Modules\WorkManagement\Application\Ports\Repositories;

interface TicketRepository
{
    public function existsForOrg(int $organizationId, int $ticketId): bool;
}
