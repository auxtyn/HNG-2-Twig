<?php

use App\Controller\DefaultController;
use App\Controller\AuthController;
use App\Controller\TicketController;

$routes = [
    // Public routes
    '/' => [DefaultController::class, 'landing'],
    '/login' => [AuthController::class, 'login'],
    '/register' => [AuthController::class, 'register'],
    '/forgot-password' => [AuthController::class, 'forgotPassword'],

    // Protected routes (require authentication)
    '/dashboard' => [DefaultController::class, 'dashboard'],
    '/tickets' => [TicketController::class, 'list'],
    '/tickets/new' => [TicketController::class, 'new'],
    '/tickets/{id}/edit' => [TicketController::class, 'edit'],
    '/tickets/{id}' => [TicketController::class, 'detail'],
];

return $routes;