<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class CapacitySettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('settings/capacity');
    }
}
