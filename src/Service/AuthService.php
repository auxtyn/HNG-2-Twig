<?php

namespace App\Service;

class AuthService
{
    private array $users = [];

    public function __construct()
    {
        // Load users from storage (in a real app, this would be a database)
        $this->users = json_decode(file_get_contents(__DIR__ . '/../../data/users.json'), true) ?? [];
    }

    public function login(string $username, string $password): array
    {
        foreach ($this->users as $user) {
            if ($user['username'] === $username && password_verify($password, $user['password'])) {
                // Start session
                session_start();
                $_SESSION['user'] = $user;
                return ['success' => true];
            }
        }

        return ['success' => false, 'error' => 'Invalid username or password'];
    }

    public function register(string $username, string $password, string $role = 'user'): array
    {
        // Check if user already exists
        foreach ($this->users as $user) {
            if ($user['username'] === $username) {
                return ['success' => false, 'error' => 'Username already exists'];
            }
        }

        // Create new user
        $newUser = [
            'id' => uniqid(),
            'username' => $username,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'role' => $role,
            'created_at' => date('Y-m-d H:i:s')
        ];

        $this->users[] = $newUser;
        $this->saveUsers();

        // Auto login after registration
        session_start();
        $_SESSION['user'] = $newUser;

        return ['success' => true];
    }

    public function getCurrentUser(): ?array
    {
        session_start();
        return $_SESSION['user'] ?? null;
    }

    public function logout(): void
    {
        session_start();
        session_destroy();
    }

    public function hasPermission(string $permission): bool
    {
        $user = $this->getCurrentUser();
        if (!$user) return false;

        // Simple permission check based on role
        $permissions = [
            'user' => ['view_tickets', 'create_tickets', 'edit_own_tickets'],
            'admin' => ['view_tickets', 'create_tickets', 'edit_all_tickets', 'delete_tickets', 'manage_users']
        ];

        return in_array($permission, $permissions[$user['role']] ?? []);
    }

    private function saveUsers(): void
    {
        file_put_contents(__DIR__ . '/../../data/users.json', json_encode($this->users));
    }
}