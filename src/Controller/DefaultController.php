<?php

namespace App\Controller;

use Twig\Environment;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DefaultController
{
    private Environment $twig;

    public function __construct(Environment $twig)
    {
        $this->twig = $twig;
    }

    public function landing(Request $request): Response
    {
        $features = [
            ['icon' => '🧭', 'title' => 'Organize', 'description' => 'Categorize and filter tickets easily.'],
            ['icon' => '⚡', 'title' => 'Fast Actions', 'description' => 'Quickly create, assign and resolve issues.'],
            ['icon' => '📊', 'title' => 'Insights', 'description' => 'Track SLA and team performance.'],
        ];

        return $this->twig->render('landing.twig', [
            'features' => $features
        ]);
    }

    public function dashboard(Request $request): Response
    {
        // Mock data - in a real app, this would come from a service
        $tickets = json_decode(file_get_contents(__DIR__ . '/../../data/tickets.json'), true) ?? [];

        $stats = [
            'total' => count($tickets),
            'open' => count(array_filter($tickets, fn($t) => $t['status'] === 'open')),
            'in_progress' => count(array_filter($tickets, fn($t) => $t['status'] === 'in_progress')),
            'closed' => count(array_filter($tickets, fn($t) => $t['status'] === 'closed')),
        ];

        // Get recent tickets
        usort($tickets, fn($a, $b) => strtotime($b['created_at']) - strtotime($a['created_at']));
        $recentTickets = array_slice($tickets, 0, 5);

        return $this->twig->render('dashboard.twig', [
            'stats' => $stats,
            'recent_tickets' => $recentTickets
        ]);
    }
}