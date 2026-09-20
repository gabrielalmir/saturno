<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SprintUserN1Reservation extends Model
{
    protected $fillable = [
        'sprint_id',
        'user_id',
        'reserved_n1',
    ];

    protected $casts = [
        'reserved_n1' => 'integer',
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
