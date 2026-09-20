<?php

use App\Http\Controllers\Settings\OrganizationController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\ProjectController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    Route::get('settings/organization', [OrganizationController::class, 'edit'])->name('organization.edit');
    Route::get('settings/organization/create', [OrganizationController::class, 'create'])->name('organization.create');
    Route::post('settings/organization', [OrganizationController::class, 'store'])->name('organization.store');
    Route::put('settings/organization', [OrganizationController::class, 'update'])->name('organization.update');
    Route::post('settings/organization/members', [OrganizationController::class, 'inviteMember'])->name('organization.members.invite');
    Route::put('settings/organization/members/{member}', [OrganizationController::class, 'updateMemberRole'])->name('organization.members.update');
    Route::delete('settings/organization/members/{member}', [OrganizationController::class, 'removeMember'])->name('organization.members.remove');
    Route::post('organizations/switch', [OrganizationController::class, 'switchOrganization'])->name('organizations.switch');
    Route::post('projects/switch', [ProjectController::class, 'switchProject'])->name('projects.switch');
    Route::post('settings/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::post('settings/projects/{project}/members', [ProjectController::class, 'inviteMember'])->name('projects.members.invite');
    Route::delete('settings/organization', [OrganizationController::class, 'destroy'])->name('organization.destroy');

    Route::get('settings/capacity', [App\Http\Controllers\CapacitySettingsController::class, 'index'])->name('capacity.settings');

    Route::get('settings/cadences', [App\Http\Controllers\WorkCadenceController::class, 'index'])->name('cadences.index');
    Route::post('settings/cadences', [App\Http\Controllers\WorkCadenceController::class, 'store'])->name('cadences.store');
    Route::put('settings/cadences/{cadence}', [App\Http\Controllers\WorkCadenceController::class, 'update'])->name('cadences.update');
    Route::delete('settings/cadences/{cadence}', [App\Http\Controllers\WorkCadenceController::class, 'destroy'])->name('cadences.destroy');

    Route::get('settings/team-events', [App\Http\Controllers\TeamEventController::class, 'index'])->name('team-events.index');
    Route::post('settings/team-events', [App\Http\Controllers\TeamEventController::class, 'store'])->name('team-events.store');
    Route::put('settings/team-events/{event}', [App\Http\Controllers\TeamEventController::class, 'update'])->name('team-events.update');
    Route::delete('settings/team-events/{event}', [App\Http\Controllers\TeamEventController::class, 'destroy'])->name('team-events.destroy');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});
