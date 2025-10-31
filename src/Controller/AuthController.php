<?php

namespace App\Controller;

use Twig\Environment;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use App\Service\AuthService;

class AuthController
{
    private Environment $twig;
    private AuthService $authService;

    public function __construct(Environment $twig, AuthService $authService)
    {
        $this->twig = $twig;
        $this->authService = $authService;
    }

    public function login(Request $request): Response
    {
        if ($request->isMethod('POST')) {
            $username = $request->request->get('username');
            $password = $request->request->get('password');

            $result = $this->authService->login($username, $password);

            if ($result['success']) {
                // Redirect to tickets page after successful login
                return new RedirectResponse('/tickets');
            } else {
                return $this->twig->render('login.twig', [
                    'error' => $result['error'],
                    'form_data' => ['username' => $username]
                ]);
            }
        }

        return $this->twig->render('login.twig');
    }

    public function register(Request $request): Response
    {
        if ($request->isMethod('POST')) {
            $username = $request->request->get('username');
            $password = $request->request->get('password');
            $confirmPassword = $request->request->get('confirmPassword');
            $role = $request->request->get('role', 'user');

            // Validation
            if ($password !== $confirmPassword) {
                return $this->twig->render('register.twig', [
                    'error' => 'Passwords do not match',
                    'form_data' => compact('username', 'role')
                ]);
            }

            if (strlen($password) < 6) {
                return $this->twig->render('register.twig', [
                    'error' => 'Password must be at least 6 characters long',
                    'form_data' => compact('username', 'role')
                ]);
            }

            $result = $this->authService->register($username, $password, $role);

            if ($result['success']) {
                return new RedirectResponse('/tickets');
            } else {
                return $this->twig->render('register.twig', [
                    'error' => $result['error'],
                    'form_data' => compact('username', 'role')
                ]);
            }
        }

        return $this->twig->render('register.twig');
    }

    public function forgotPassword(Request $request): Response
    {
        // Implementation for forgot password
        return $this->twig->render('forgot_password.twig');
    }
}