<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'team_id',
        'name',
        'start_date',
        'end_date',
        'is_full_day',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_full_day' => 'boolean',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
