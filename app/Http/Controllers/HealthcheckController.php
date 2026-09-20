<?php

namespace App\Http\Controllers;

class HealthcheckController extends Controller
{
    public function __invoke()
    {
        return response()->json(['status' => 'ok']);
    }
}
