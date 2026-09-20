<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SprintEvent extends Model
{
    protected $fillable = [
        'sprint_id',
        'user_id',
        'type',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
    ];

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
