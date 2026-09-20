<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkCadence extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'team_id',
        'name',
        'sprint_duration_weeks',
        'sprint_start_day',
        'n1_n2_split_percentage',
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
