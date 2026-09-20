<?php

namespace App\Providers;

use App\Modules\WorkManagement\Application\Ports\Auth\CurrentUserProvider;
use App\Modules\WorkManagement\Application\Ports\Repositories\EpicRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\OrganizationMembershipRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\SprintRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\TicketRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\WorkItemEventRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\WorkItemRepository;
use App\Modules\WorkManagement\Infrastructure\Auth\LaravelCurrentUserProvider;
use App\Modules\WorkManagement\Infrastructure\Persistence\Eloquent\EloquentEpicRepository;
use App\Modules\WorkManagement\Infrastructure\Persistence\Eloquent\EloquentOrganizationMembershipRepository;
use App\Modules\WorkManagement\Infrastructure\Persistence\Eloquent\EloquentSprintRepository;
use App\Modules\WorkManagement\Infrastructure\Persistence\Eloquent\EloquentTicketRepository;
use App\Modules\WorkManagement\Infrastructure\Persistence\Eloquent\EloquentWorkItemEventRepository;
use App\Modules\WorkManagement\Infrastructure\Persistence\Eloquent\EloquentWorkItemRepository;
use Illuminate\Support\ServiceProvider;

class WorkManagementServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CurrentUserProvider::class, LaravelCurrentUserProvider::class);

        $this->app->bind(WorkItemRepository::class, EloquentWorkItemRepository::class);
        $this->app->bind(WorkItemEventRepository::class, EloquentWorkItemEventRepository::class);
        $this->app->bind(SprintRepository::class, EloquentSprintRepository::class);
        $this->app->bind(EpicRepository::class, EloquentEpicRepository::class);
        $this->app->bind(TicketRepository::class, EloquentTicketRepository::class);
        $this->app->bind(OrganizationMembershipRepository::class, EloquentOrganizationMembershipRepository::class);
    }
}
