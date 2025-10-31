<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use App\Service\AuthService;

// Initialize Twig
$loader = new FilesystemLoader(__DIR__ . '/../templates');
$twig = new Environment($loader, [
    'cache' => __DIR__ . '/../cache/twig',
    'debug' => true,
]);

// Add custom functions
$twig->addFunction(new \Twig\TwigFunction('path', function ($name, $parameters = []) {
    // Simple path generator - in a real app, use Symfony's UrlGenerator
    $routes = require __DIR__ . '/../config/routes.php';

    // Reverse lookup route by controller
    foreach ($routes as $path => $controller) {
        if (is_array($controller) && $controller[1] === $name) {
            $routePath = $path;
            break;
        }
    }

    if (!isset($routePath)) {
        return '#'; // fallback
    }

    // Replace parameters
    foreach ($parameters as $key => $value) {
        $routePath = str_replace('{' . $key . '}', $value, $routePath);
    }

    return $routePath;
}));

$twig->addFunction(new \Twig\TwigFunction('asset', function ($path) {
    return '/' . $path;
}));

// Initialize services
$authService = new AuthService();

// Handle request
$request = Request::createFromGlobals();

// Simple routing (in a real app, use Symfony Routing component)
$path = $request->getPathInfo();
$routes = require __DIR__ . '/../config/routes.php';

try {
    if (isset($routes[$path])) {
        $controllerInfo = $routes[$path];

        if (is_array($controllerInfo)) {
            $controllerClass = $controllerInfo[0];
            $method = $controllerInfo[1];

            // Instantiate controller with dependencies
            $controller = new $controllerClass($twig, $authService);

            // Call the method
            $response = $controller->$method($request);
        } else {
            // Static content
            $response = $twig->render($controllerInfo);
        }
    } else {
        // 404
        $response = $twig->render('404.twig', [], 404);
    }
} catch (Exception $e) {
    // Error handling
    $response = $twig->render('error.twig', [
        'error' => $e->getMessage()
    ], 500);
}

if ($response instanceof \Symfony\Component\HttpFoundation\Response) {
    $response->send();
} else {
    echo $response;
}