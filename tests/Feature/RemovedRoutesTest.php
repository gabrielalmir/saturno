<?php

it('returns 404 for the /stories route', function () {
    $response = $this->get('/stories');
    $response->assertStatus(404);
});

it('returns 404 for the /tasks route', function () {
    $response = $this->get('/tasks');
    $response->assertStatus(404);
});
