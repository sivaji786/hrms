<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class LeaveSeeder extends Seeder
{
    public function run()
    {
        $db = \Config\Database::connect();

        // 1. Insert Leave Types
        $leaveTypes = [
            [
                'id' => 'lt-001',
                'name' => 'Casual Leave',
                'days_allowed' => 12,
                'carry_forward' => 0,
                'is_paid' => 1,
            ],
            [
                'id' => 'lt-002',
                'name' => 'Sick Leave',
                'days_allowed' => 10,
                'carry_forward' => 1,
                'is_paid' => 1,
            ],
            [
                'id' => 'lt-003',
                'name' => 'Privilege Leave',
                'days_allowed' => 15,
                'carry_forward' => 1,
                'is_paid' => 1,
            ],
            [
                'id' => 'lt-004',
                'name' => 'Compensatory Off',
                'days_allowed' => 0, // Earned based on work
                'carry_forward' => 0,
                'is_paid' => 1,
            ],
            [
                'id' => 'lt-005',
                'name' => 'Maternity Leave',
                'days_allowed' => 90,
                'carry_forward' => 0,
                'is_paid' => 1,
            ],
            [
                'id' => 'lt-006',
                'name' => 'Paternity Leave',
                'days_allowed' => 5,
                'carry_forward' => 0,
                'is_paid' => 1,
            ],
        ];

        // Upsert Leave Types
        foreach ($leaveTypes as $type) {
            $existing = $db->table('leave_types')->where('id', $type['id'])->get()->getRow();
            if (!$existing) {
                $db->table('leave_types')->insert($type);
            } else {
                $db->table('leave_types')->where('id', $type['id'])->update($type);
            }
        }

        // 2. Assign Balances to Employees
        $employees = $db->table('employees')->get()->getResultArray();
        $currentYear = date('Y');

        foreach ($employees as $employee) {
            foreach ($leaveTypes as $type) {
                // Skip if balance already exists
                $exists = $db->table('leave_balances')
                    ->where('employee_id', $employee['id'])
                    ->where('leave_type_id', $type['id'])
                    ->where('year', $currentYear)
                    ->countAllResults();
                
                if ($exists == 0) {
                    $db->table('leave_balances')->insert([
                        'id' => $this->generateUuid(),
                        'employee_id' => $employee['id'],
                        'leave_type_id' => $type['id'],
                        'year' => $currentYear,
                        'total_days' => $type['days_allowed'],
                        'used_days' => 0,
                        'pending_days' => 0,
                    ]);
                }
            }
        }

        // 3. Create Sample Leave Requests (if none exist)
        if ($db->table('leave_requests')->countAllResults() == 0 && !empty($employees)) {
            $empId = $employees[0]['id'];
            
            $requests = [
                [
                    'id' => $this->generateUuid(),
                    'employee_id' => $empId,
                    'leave_type_id' => 'lt-001', // Casual
                    'start_date' => date('Y-m-d', strtotime('-10 days')),
                    'end_date' => date('Y-m-d', strtotime('-9 days')),
                    'days_count' => 2,
                    'reason' => 'Personal work',
                    'status' => 'Approved',
                ],
                [
                    'id' => $this->generateUuid(),
                    'employee_id' => $empId,
                    'leave_type_id' => 'lt-002', // Sick
                    'start_date' => date('Y-m-d', strtotime('+2 days')),
                    'end_date' => date('Y-m-d', strtotime('+3 days')),
                    'days_count' => 2,
                    'reason' => 'Not feeling well',
                    'status' => 'Pending',
                ]
            ];

            foreach ($requests as $req) {
                 $db->table('leave_requests')->insert($req);
            }
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
