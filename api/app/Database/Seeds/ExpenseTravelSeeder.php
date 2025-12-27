<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class ExpenseTravelSeeder extends Seeder
{
    public function run()
    {
        $db = \Config\Database::connect();
        $employeeModel = model('App\Models\EmployeeModel');
        $employees = $employeeModel->findAll();

        if (empty($employees)) {
            echo "No employees found. Please seed employees first.\n";
            return;
        }

        // Truncate tables to avoid duplicates and ensure clean state
        $db->table('expenses')->emptyTable();
        $db->table('travel_requests')->emptyTable();

        // Helper to get random employee ID
        $getRandomEmployeeId = function () use ($employees) {
            return $employees[array_rand($employees)]['id'];
        };

        // Seed Expenses
        $expenses = [
            [
                'category' => 'Travel',
                'amount' => 1200.00,
                'description' => 'Flight to London for conference',
                'status' => 'Approved',
                'date' => date('Y-m-d', strtotime('-10 days')),
            ],
            [
                'category' => 'Food',
                'amount' => 150.50,
                'description' => 'Client lunch meeting',
                'status' => 'Pending',
                'date' => date('Y-m-d', strtotime('-2 days')),
            ],
            [
                'category' => 'Office Supplies',
                'amount' => 450.00,
                'description' => 'New monitor and keyboard',
                'status' => 'Reimbursed',
                'date' => date('Y-m-d', strtotime('-20 days')),
            ],
            [
                'category' => 'Transport',
                'amount' => 80.00,
                'description' => 'Taxi to airport',
                'status' => 'Rejected',
                'date' => date('Y-m-d', strtotime('-5 days')),
                'rejection_reason' => 'Receipt missing',
            ],
            [
                'category' => 'Accommodation',
                'amount' => 3000.00,
                'description' => 'Hotel stay in Paris',
                'status' => 'Approved',
                'date' => date('Y-m-d', strtotime('-15 days')),
            ],
             [
                'category' => 'Training',
                'amount' => 500.00,
                'description' => 'Online React Course',
                'status' => 'Pending',
                'date' => date('Y-m-d', strtotime('-1 days')),
            ],
        ];

        foreach ($expenses as $expense) {
            $data = [
                'id' => $this->generateUuid(),
                'employee_id' => $getRandomEmployeeId(),
                'category' => $expense['category'],
                'amount' => $expense['amount'],
                'currency' => 'AED',
                'date' => $expense['date'],
                'description' => $expense['description'],
                'status' => $expense['status'],
                'receipt_url' => 'https://example.com/receipt.pdf',
                'created_at' => date('Y-m-d H:i:s'),
            ];

            if (in_array($expense['status'], ['Approved', 'Reimbursed', 'Rejected'])) {
                $data['approver_id'] = $getRandomEmployeeId();
                $data['approval_date'] = date('Y-m-d H:i:s');
            }
            
            if (isset($expense['rejection_reason'])) {
                $data['rejection_reason'] = $expense['rejection_reason'];
            }

            // Check if similar record exists to avoid duplicates on re-run (optional, but good practice)
            // For simplicity, we just insert.
            $db->table('expenses')->insert($data);
        }

        // Seed Travel Requests
        $travelRequests = [
            [
                'origin' => 'Dubai',
                'destination' => 'London',
                'start_date' => date('Y-m-d', strtotime('+10 days')),
                'end_date' => date('Y-m-d', strtotime('+15 days')),
                'purpose' => 'Tech Conference 2024',
                'trip_type' => 'International',
                'travel_mode' => 'Flight',
                'estimated_cost' => 5000.00,
                'status' => 'Pending',
            ],
            [
                'origin' => 'Abu Dhabi',
                'destination' => 'Riyadh',
                'start_date' => date('Y-m-d', strtotime('+5 days')),
                'end_date' => date('Y-m-d', strtotime('+7 days')),
                'purpose' => 'Client Workshop',
                'trip_type' => 'International',
                'travel_mode' => 'Flight',
                'estimated_cost' => 2500.00,
                'status' => 'Approved',
            ],
            [
                'origin' => 'Dubai',
                'destination' => 'Sharjah',
                'start_date' => date('Y-m-d', strtotime('-5 days')),
                'end_date' => date('Y-m-d', strtotime('-5 days')),
                'purpose' => 'Site Visit',
                'trip_type' => 'Domestic',
                'travel_mode' => 'Car',
                'estimated_cost' => 200.00,
                'actual_cost' => 180.00,
                'status' => 'Completed',
            ],
             [
                'origin' => 'Dubai',
                'destination' => 'New York',
                'start_date' => date('Y-m-d', strtotime('+30 days')),
                'end_date' => date('Y-m-d', strtotime('+40 days')),
                'purpose' => 'Global Summit',
                'trip_type' => 'International',
                'travel_mode' => 'Flight',
                'estimated_cost' => 15000.00,
                'status' => 'Rejected',
            ],
        ];

        foreach ($travelRequests as $travel) {
            $data = [
                'id' => $this->generateUuid(),
                'employee_id' => $getRandomEmployeeId(),
                'origin' => $travel['origin'],
                'destination' => $travel['destination'],
                'start_date' => $travel['start_date'],
                'end_date' => $travel['end_date'],
                'purpose' => $travel['purpose'],
                'trip_type' => $travel['trip_type'],
                'travel_mode' => $travel['travel_mode'],
                'estimated_cost' => $travel['estimated_cost'],
                'status' => $travel['status'],
                'created_at' => date('Y-m-d H:i:s'),
            ];

            if (isset($travel['actual_cost'])) {
                $data['actual_cost'] = $travel['actual_cost'];
            }

            if (in_array($travel['status'], ['Approved', 'Rejected', 'Completed'])) {
                $data['approver_id'] = $getRandomEmployeeId();
            }

            $db->table('travel_requests')->insert($data);
        }
    }

    private function generateUuid()
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
