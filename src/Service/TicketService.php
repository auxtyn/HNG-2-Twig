<?php

namespace App\Service;

class TicketService
{
    private string $dataFile;

    public function __construct()
    {
        $this->dataFile = __DIR__ . '/../../data/tickets.json';
        $this->ensureDataFileExists();
    }

    public function getTickets(): array
    {
        $data = json_decode(file_get_contents($this->dataFile), true);
        return $data ?? [];
    }

    public function saveTickets(array $tickets): bool
    {
        try {
            file_put_contents($this->dataFile, json_encode($tickets, JSON_PRETTY_PRINT));
            return true;
        } catch (\Exception $e) {
            error_log("Error saving tickets: " . $e->getMessage());
            return false;
        }
    }

    public function addTicket(array $ticket): bool
    {
        $tickets = $this->getTickets();
        $tickets[] = $ticket;
        return $this->saveTickets($tickets);
    }

    public function updateTicket(string $id, array $updatedTicket): bool
    {
        $tickets = $this->getTickets();
        $index = array_search($id, array_column($tickets, 'id'));

        if ($index !== false) {
            $tickets[$index] = array_merge($updatedTicket, [
                'updated_at' => date('Y-m-d H:i:s')
            ]);
            return $this->saveTickets($tickets);
        }

        return false;
    }

    public function deleteTicket(string $id): bool
    {
        $tickets = $this->getTickets();
        $tickets = array_filter($tickets, fn($ticket) => $ticket['id'] !== $id);
        return $this->saveTickets(array_values($tickets));
    }

    public function getTicketById(string $id): ?array
    {
        $tickets = $this->getTickets();
        $ticket = array_filter($tickets, fn($ticket) => $ticket['id'] === $id);
        return !empty($ticket) ? array_shift($ticket) : null;
    }

    public function filterTickets(array $filters = []): array
    {
        $tickets = $this->getTickets();

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $tickets = array_filter($tickets, fn($ticket) => $ticket['status'] === $filters['status']);
        }

        if (!empty($filters['search'])) {
            $searchTerm = strtolower($filters['search']);
            $tickets = array_filter($tickets, function($ticket) use ($searchTerm) {
                return stripos($ticket['title'], $searchTerm) !== false ||
                       stripos($ticket['description'], $searchTerm) !== false;
            });
        }

        if (!empty($filters['sortBy'])) {
            if ($filters['sortBy'] === 'newest') {
                usort($tickets, fn($a, $b) => strtotime($b['created_at']) - strtotime($a['created_at']));
            } else {
                usort($tickets, fn($a, $b) => strtotime($a['created_at']) - strtotime($b['created_at']));
            }
        }

        return array_values($tickets);
    }

    public function getStats(): array
    {
        $tickets = $this->getTickets();

        return [
            'total' => count($tickets),
            'open' => count(array_filter($tickets, fn($t) => $t['status'] === 'open')),
            'in_progress' => count(array_filter($tickets, fn($t) => $t['status'] === 'in_progress')),
            'closed' => count(array_filter($tickets, fn($t) => $t['status'] === 'closed')),
        ];
    }

    private function ensureDataFileExists(): void
    {
        $dataDir = dirname($this->dataFile);
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0755, true);
        }

        if (!file_exists($this->dataFile)) {
            $sampleTickets = [
                [
                    'id' => '1',
                    'title' => 'Bug: Login button not working',
                    'description' => 'Users cannot log in using the login button on the homepage.',
                    'status' => 'open',
                    'priority' => 'high',
                    'created_at' => '2024-01-15T10:00:00.000Z',
                    'updated_at' => '2024-01-15T10:00:00.000Z'
                ],
                [
                    'id' => '2',
                    'title' => 'Feature: Add dark mode',
                    'description' => 'Implement dark mode toggle for better user experience.',
                    'status' => 'in_progress',
                    'priority' => 'medium',
                    'created_at' => '2024-01-16T14:30:00.000Z',
                    'updated_at' => '2024-01-16T14:30:00.000Z'
                ]
            ];
            file_put_contents($this->dataFile, json_encode($sampleTickets, JSON_PRETTY_PRINT));
        }
    }
}