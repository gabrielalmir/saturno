<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'current_organization_id',
        'current_project_id',
        'analyst_role',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function organizations()
    {
        return $this->belongsToMany(Organization::class)->withPivot('role')->withTimestamps();
    }

    public function teams()
    {
        return $this->belongsToMany(Team::class)->withPivot('role')->withTimestamps();
    }

    public function currentOrganization()
    {
        return $this->belongsTo(Organization::class, 'current_organization_id');
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class)->withPivot('role')->withTimestamps();
    }

    public function currentProject()
    {
        return $this->belongsTo(Project::class, 'current_project_id');
    }

    public function currentOrganizationRole(): ?string
    {
        if (! $this->current_organization_id) {
            return null;
        }

        return $this->organizations()
            ->where('organizations.id', $this->current_organization_id)
            ->first()?->pivot?->role;
    }

    public function assignedWorkItems()
    {
        return $this->hasMany(WorkItem::class, 'assignee_id');
    }

    public function reportedWorkItems()
    {
        return $this->hasMany(WorkItem::class, 'reporter_id');
    }

    public function ownedEpics()
    {
        return $this->hasMany(Epic::class, 'owner_id');
    }

    public function availability()
    {
        return $this->hasMany(UserAvailability::class);
    }

    public function allocations()
    {
        return $this->hasMany(WorkItemAllocation::class);
    }

    // Helper to get organization ID for scoping
    public function getOrganizationId(): ?int
    {
        return $this->current_organization_id;
    }
}
