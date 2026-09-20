<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use WithoutMiddleware;
}
