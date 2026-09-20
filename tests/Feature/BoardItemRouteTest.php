<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

it('resolves move endpoint to the move route instead of store', function () {
    $route = Route::getRoutes()->match(Request::create('/boards/1/items/move', 'POST'));

    expect($route->getName())->toBe('boards.items.move');
});

it('resolves numeric work item endpoint to the store route', function () {
    $route = Route::getRoutes()->match(Request::create('/boards/1/items/123', 'POST'));

    expect($route->getName())->toBe('boards.items.store');
});
