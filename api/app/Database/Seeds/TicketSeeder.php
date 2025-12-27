<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use CodeIgniter\I18n\Time;

class TicketSeeder extends Seeder
{
    public function run()
    {
        $tickets = [
            [
                'ticket_number' => 'TKT-1001',
                'title'         => 'Cannot access VPN',
                'description'   => 'I am getting a connection error when trying to connect to the VPN from home.',
                'category'      => 'IT Support',
                'priority'      => 'High',
                'status'        => 'Open',
                'created_at'    => Time::now()->subDays(2)->toDateTimeString(),
            ],
            [
                'ticket_number' => 'TKT-1002',
                'title'         => 'Payroll discrepancy for July',
                'description'   => 'My payslip for July shows incorrect overtime hours.',
                'category'      => 'Payroll',
                'priority'      => 'Critical',
                'status'        => 'In Progress',
                'created_at'    => Time::now()->subDays(5)->toDateTimeString(),
            ],
            [
                'ticket_number' => 'TKT-1003',
                'title'         => 'New ID Card Request',
                'description'   => 'I lost my ID card and need a replacement.',
                'category'      => 'HR',
                'priority'      => 'Low',
                'status'        => 'Resolved',
                'created_at'    => Time::now()->subDays(7)->toDateTimeString(),
            ],
            [
                'ticket_number' => 'TKT-1004',
                'title'         => 'Monitor flickering',
                'description'   => 'The external monitor screen keeps flickering intermittently.',
                'category'      => 'IT Support',
                'priority'      => 'Medium',
                'status'        => 'Open',
                'created_at'    => Time::now()->subHours(4)->toDateTimeString(),
            ],
        ];

        // Fetch some employees to assign as requesters/assignees
        $employeeModel = model('EmployeeModel');
        $employees = $employeeModel->findAll();
        
        if (empty($employees)) {
            // Create a dummy user if none exist? No, better to assume seeders ran in order.
            // But to be safe, let's just log or skip if no users.
            return;
        }

        $ticketModel = model('TicketModel');
        $commentModel = model('TicketCommentModel');
        $userModel = model('UserModel');

        foreach ($tickets as $ticketData) {
            // Assign random requester from employees
            $requester = $employees[array_rand($employees)];
            $ticketData['requester_id'] = $requester['id'];

            // Assign random assignee from employees
            $assignee = $employees[array_rand($employees)];
            $ticketData['assignee_id'] = $assignee['id'];

            // Insert Ticket
            $ticketModel->insert($ticketData);
            
            // We need the ID of the inserted ticket.
            // Since ticketModel generates UUID in beforeInsert, we can't easily get it from insertID if using UUIDs in some setups.
            // Let's fetch it back using ticket_number
            $insertedTicket = $ticketModel->where('ticket_number', $ticketData['ticket_number'])->first();

            if ($insertedTicket) {
                // Find associated users for comments (since comments link to users, not employees)
                // We need to find the user account associated with the employee
                $requesterUser = $userModel->where('employee_id', $requester['id'])->first();
                $assigneeUser = $userModel->where('employee_id', $assignee['id'])->first();

                // Fallback to any user if specific employee doesn't have a user account (for seeding purpose)
                $anyUser = $userModel->first();
                $requesterUserId = $requesterUser ? $requesterUser['id'] : ($anyUser['id'] ?? null);
                $assigneeUserId = $assigneeUser ? $assigneeUser['id'] : ($anyUser['id'] ?? null);

                if ($requesterUserId && $assigneeUserId) {
                    // Add some comments
                    $comments = [
                        [
                            'ticket_id' => $insertedTicket['id'],
                            'user_id'   => $requesterUserId,
                            'comment'   => 'Any update on this?',
                            'is_internal' => 0,
                            'created_at' => Time::now()->subHours(2)->toDateTimeString(),
                        ],
                        [
                            'ticket_id' => $insertedTicket['id'],
                            'user_id'   => $assigneeUserId,
                            'comment'   => 'Checking it now.',
                            'is_internal' => 1,
                            'created_at' => Time::now()->subHours(1)->toDateTimeString(),
                        ]
                    ];

                    foreach ($comments as $comment) {
                         $commentModel->insert($comment);
                    }
                }
            }
        }
    }
}
