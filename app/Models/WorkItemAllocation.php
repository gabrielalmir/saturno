<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkItemAllocation extends Model
{
    protected $fillable = [
        'work_item_id',
        'user_id',
        'allocation_percentage',
        'estimated_hours',
    ];

    protected $casts = [
        'allocation_percentage' => 'integer',
        'estimated_hours' => 'decimal:2',
    ];

    public function workItem()
    {
        return $this->belongsTo(WorkItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Calculate estimated hours based on work item estimate and allocation percentage
     */
    public function calculateEstimatedHours(): float
    {
        if (! $this->workItem || ! $this->workItem->estimate) {
            return 0;
        }

        return ($this->workItem->estimate * $this->allocation_percentage) / 100;
    }

    /**
     * Auto-calculate and save estimated hours
     */
    public function updateEstimatedHours(): void
    {
        $this->estimated_hours = $this->calculateEstimatedHours();
        $this->save();
    }

    /**
     * Boot method to auto-calculate estimated hours
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($allocation) {
            if ($allocation->workItem && $allocation->workItem->estimate) {
                $allocation->estimated_hours = (float) $allocation->calculateEstimatedHours();
            }
        });
    }
}
