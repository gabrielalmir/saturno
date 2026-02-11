<?php

use App\Http\Controllers\BoardColumnController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\BoardItemController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EpicController;
use App\Http\Controllers\HealthcheckController;
use App\Http\Controllers\IntegrationController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\VisaoMacroController;
use App\Http\Controllers\WorkItemController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/manifesto', fn () => Inertia::render('manifesto'))->name('manifesto');
Route::get('/docs', fn () => Inertia::render('docs'))->name('docs');
Route::get('/api', fn () => Inertia::render('api'))->name('api');
Route::get('/community', fn () => Inertia::render('community'))->name('community');
Route::get('/sobre', fn () => Inertia::render('sobre'))->name('sobre');
Route::get('/carreiras', fn () => Inertia::render('carreiras'))->name('carreiras');
Route::get('/blog', fn () => Inertia::render('blog'))->name('blog');
Route::get('/contato', fn () => Inertia::render('contato'))->name('contato');
Route::get('/privacidade', fn () => Inertia::render('privacidade'))->name('privacidade');
Route::get('/termos', fn () => Inertia::render('termos'))->name('termos');
Route::get('/cookies', fn () => Inertia::render('cookies'))->name('cookies');

Route::get('/health', HealthcheckController::class);

Route::get('dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified', 'hasOrg'])->name('dashboard');

Route::middleware(['auth', 'verified', 'hasOrg'])->group(function () {
    Route::get('visao-macro', [VisaoMacroController::class, 'index'])->name('visao-macro');

    Route::get('sprint-planning', [SprintController::class, 'index'])->name('sprint-planning');
    Route::post('sprints', [SprintController::class, 'store'])->name('sprints.store');
    Route::put('sprints/{sprint}', [SprintController::class, 'update'])->name('sprints.update');
    Route::post('sprints/{sprint}/start', [SprintController::class, 'start'])->name('sprints.start');
    Route::post('sprints/{sprint}/complete', [SprintController::class, 'complete'])->name('sprints.complete');

    Route::resource('work-items', WorkItemController::class);

    Route::get('sprint-board', [BoardController::class, 'sprintBoard'])->name('sprint-board');
    Route::get('boards/{board}', [BoardController::class, 'show'])->name('boards.show');
    Route::post('boards', [BoardController::class, 'store'])->name('boards.store');
    Route::put('boards/{board}', [BoardController::class, 'update'])->name('boards.update');
    Route::delete('boards/{board}', [BoardController::class, 'destroy'])->name('boards.destroy');
    Route::post('boards/{board}/columns', [BoardColumnController::class, 'store'])->name('boards.columns.store');
    Route::put('boards/{board}/columns/{column}', [BoardColumnController::class, 'update'])->name('boards.columns.update');
    Route::post('boards/{board}/columns/reorder', [BoardColumnController::class, 'reorder'])->name('boards.columns.reorder');
    Route::delete('boards/{board}/columns/{column}', [BoardColumnController::class, 'destroy'])->name('boards.columns.destroy');
    Route::post('boards/{board}/items/move', [BoardItemController::class, 'move'])->name('boards.items.move');
    Route::post('boards/{board}/items/{workItem}', [BoardItemController::class, 'store'])
        ->whereNumber('workItem')
        ->name('boards.items.store');

    Route::get('settings/integrations', [IntegrationController::class, 'index'])->name('integrations.index');
    Route::post('settings/integrations', [IntegrationController::class, 'store'])->name('integrations.store');
    Route::put('settings/integrations/{integration}', [IntegrationController::class, 'update'])->name('integrations.update');
    Route::post('settings/integrations/{integration}/test', [IntegrationController::class, 'test'])->name('integrations.test');
    Route::post('settings/integrations/{integration}/sync-now', [IntegrationController::class, 'syncNow'])->name('integrations.sync');
    Route::post('settings/integrations/{integration}/toggle', [IntegrationController::class, 'toggle'])->name('integrations.toggle');
    Route::get('settings/integrations/{integration}/links', [IntegrationController::class, 'links'])->name('integrations.links');
    Route::delete('settings/integrations/{integration}', [IntegrationController::class, 'destroy'])->name('integrations.destroy');
    Route::get('sprint-calendar', [CalendarController::class, 'index'])->name('sprint-calendar');

    // Capacity Management API Routes
    Route::prefix('api')->group(function () {
        Route::get('availability', [App\Http\Controllers\Api\UserAvailabilityController::class, 'index']);
        Route::post('availability', [App\Http\Controllers\Api\UserAvailabilityController::class, 'store']);
        Route::put('availability/{availability}', [App\Http\Controllers\Api\UserAvailabilityController::class, 'update']);
        Route::delete('availability/{availability}', [App\Http\Controllers\Api\UserAvailabilityController::class, 'destroy']);

        Route::get('holidays', [App\Http\Controllers\Api\HolidayController::class, 'index']);
        Route::post('holidays', [App\Http\Controllers\Api\HolidayController::class, 'store']);
        Route::put('holidays/{holiday}', [App\Http\Controllers\Api\HolidayController::class, 'update']);
        Route::delete('holidays/{holiday}', [App\Http\Controllers\Api\HolidayController::class, 'destroy']);

        Route::get('work-items/{workItem}/allocations', [App\Http\Controllers\Api\WorkItemAllocationController::class, 'index']);
        Route::post('work-items/{workItem}/allocations', [App\Http\Controllers\Api\WorkItemAllocationController::class, 'store']);
        Route::put('work-items/{workItem}/allocations/{userId}', [App\Http\Controllers\Api\WorkItemAllocationController::class, 'update']);
        Route::delete('work-items/{workItem}/allocations/{userId}', [App\Http\Controllers\Api\WorkItemAllocationController::class, 'destroy']);

        Route::get('sprints/{sprint}/capacity', [App\Http\Controllers\Api\SprintCapacityController::class, 'summary']);
        Route::get('sprints/{sprint}/capacity/users', [App\Http\Controllers\Api\SprintCapacityController::class, 'userCapacity']);
        Route::get('sprints/{sprint}/capacity/working-days', [App\Http\Controllers\Api\SprintCapacityController::class, 'workingDays']);
        Route::get('sprints/{sprint}/n1-reservations', [App\Http\Controllers\Api\SprintN1ReservationController::class, 'index']);
        Route::put('sprints/{sprint}/n1-reservations/{user}', [App\Http\Controllers\Api\SprintN1ReservationController::class, 'upsert']);
        Route::post('jira/import', [App\Http\Controllers\Api\JiraImportController::class, 'store']);
    });

    Route::resource('epics', EpicController::class);
    Route::resource('tickets', TicketController::class);
});

require __DIR__.'/settings.php';
