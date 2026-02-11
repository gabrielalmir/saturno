<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    protected $fillable = [
        'organization_id',
        'date',
        'name',
        'is_recurring',
    ];

    protected $casts = [
        'date' => 'date',
        'is_recurring' => 'boolean',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Check if this holiday applies to a given year
     */
    public function appliesToYear(int $year): bool
    {
        if ($this->is_recurring) {
            return true;
        }

        return $this->date->format('Y') == $year;
    }

    /**
     * Get the date for this holiday in a specific year (for recurring holidays)
     */
    public function getDateForYear(int $year)
    {
        if (! $this->is_recurring) {
            return $this->date;
        }

        return $this->date->copy()->year($year);
    }
}
