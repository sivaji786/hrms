<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DashboardSeeder extends Seeder
{
    public function run()
    {
        // 1. Seed Locations
        $locations = [
            ['id' => 'loc-001', 'name' => 'Dubai HQ', 'city' => 'Dubai', 'country' => 'UAE'],
            ['id' => 'loc-002', 'name' => 'Abu Dhabi Branch', 'city' => 'Abu Dhabi', 'country' => 'UAE'],
        ];
        $this->db->table('locations')->ignore(true)->insertBatch($locations);

        // 2. Seed Departments
        $departments = [
            ['id' => 'dept-001', 'name' => 'Engineering', 'location_id' => 'loc-001'],
            ['id' => 'dept-002', 'name' => 'Marketing', 'location_id' => 'loc-001'],
            ['id' => 'dept-003', 'name' => 'Sales', 'location_id' => 'loc-002'],
            ['id' => 'dept-004', 'name' => 'HR', 'location_id' => 'loc-001'],
            ['id' => 'dept-005', 'name' => 'Operations', 'location_id' => 'loc-002'],
        ];
        $this->db->table('departments')->ignore(true)->insertBatch($departments);

        // 3. Seed Employees (Matching Mock Data)
        $employees = [
            [
                'id' => 'emp-001',
                'employee_code' => 'EMP001',
                'first_name' => 'Rahul',
                'last_name' => 'Sharma',
                'email' => 'rahul.sharma@example.com',
                'department_id' => 'dept-001',
                'designation' => 'Software Engineer',
                'date_of_joining' => date('Y-m-d'), // New Hire
                'status' => 'Active',
                'created_at' => date('Y-m-d H:i:s', strtotime('-10 minutes')),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 'emp-002',
                'employee_code' => 'EMP002',
                'first_name' => 'Priya',
                'last_name' => 'Patel',
                'email' => 'priya.patel@example.com',
                'department_id' => 'dept-002',
                'designation' => 'Marketing Manager',
                'date_of_joining' => '2023-01-15',
                'status' => 'Active',
                'created_at' => date('Y-m-d H:i:s', strtotime('-1 year')),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 'emp-003',
                'employee_code' => 'EMP003',
                'first_name' => 'Amit',
                'last_name' => 'Kumar',
                'email' => 'amit.kumar@example.com',
                'department_id' => 'dept-003',
                'designation' => 'Sales Executive',
                'date_of_joining' => '2022-05-20',
                'status' => 'Resigned', // Exit Process
                'created_at' => date('Y-m-d H:i:s', strtotime('-2 years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-1 hour'))
            ],
            [
                'id' => 'emp-004',
                'employee_code' => 'EMP004',
                'first_name' => 'Sneha',
                'last_name' => 'Reddy',
                'email' => 'sneha.reddy@example.com',
                'department_id' => 'dept-004',
                'designation' => 'HR Specialist',
                'date_of_joining' => '2021-11-10',
                'status' => 'Active',
                'created_at' => date('Y-m-d H:i:s', strtotime('-3 years')),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 'emp-005',
                'employee_code' => 'EMP005',
                'first_name' => 'Vikram',
                'last_name' => 'Singh',
                'email' => 'vikram.singh@example.com',
                'department_id' => 'dept-005',
                'designation' => 'Operations Manager',
                'date_of_joining' => '2020-03-01',
                'status' => 'Active',
                'created_at' => date('Y-m-d H:i:s', strtotime('-4 years')),
                'updated_at' => date('Y-m-d H:i:s')
            ],
        ];
        $this->db->table('employees')->ignore(true)->insertBatch($employees);

        // 4. Seed Leave Types
        $leaveTypes = [
            ['id' => 'lt-001', 'name' => 'Annual Leave', 'days_allowed' => 30],
            ['id' => 'lt-002', 'name' => 'Sick Leave', 'days_allowed' => 15],
            ['id' => 'lt-003', 'name' => 'Casual Leave', 'days_allowed' => 10],
        ];
        $this->db->table('leave_types')->ignore(true)->insertBatch($leaveTypes);

        // 5. Seed Leave Requests (Priya Patel - Leave Approved)
        $leaves = [
            [
                'id' => 'leave-001',
                'employee_id' => 'emp-002',
                'leave_type_id' => 'lt-001',
                'start_date' => date('Y-m-d', strtotime('+1 day')),
                'end_date' => date('Y-m-d', strtotime('+3 days')),
                'days_count' => 3,
                'status' => 'Approved',
                'approval_date' => date('Y-m-d H:i:s', strtotime('-25 minutes'))
            ]
        ];
        $this->db->table('leave_requests')->ignore(true)->insertBatch($leaves);

        // 6. Seed Attendance (Vikram Singh - Late Arrival)
        $attendance = [
            [
                'id' => 'att-001',
                'employee_id' => 'emp-005',
                'date' => date('Y-m-d'),
                'status' => 'Late',
                'check_in' => '09:45:00', // Late
                'check_out' => null,
                'created_at' => date('Y-m-d H:i:s', strtotime('-3 hours'))
            ]
        ];
        $this->db->table('attendance_records')->ignore(true)->insertBatch($attendance);

        // 7. Seed Performance Reviews (Sneha Reddy - Performance Review)
        $reviews = [
            [
                'id' => 'rev-001',
                'employee_id' => 'emp-004',
                'reviewer_id' => 'emp-002', // Priya reviews Sneha
                'cycle_name' => 'Q1 2025',
                'start_date' => null,
                'end_date' => null,
                'status' => 'Completed',
                'created_at' => date('Y-m-d H:i:s', strtotime('-2 hours'))
            ],
            // Upcoming Event: Appraisal Cycle Q2
            [
                'id' => 'rev-002',
                'employee_id' => 'emp-001',
                'reviewer_id' => 'emp-005',
                'cycle_name' => 'Q2 2025',
                'start_date' => '2025-04-01',
                'end_date' => '2025-04-15',
                'status' => 'Draft',
                'created_at' => date('Y-m-d H:i:s')
            ]
        ];
        $this->db->table('performance_reviews')->ignore(true)->insertBatch($reviews);

        // 8. Seed Training Programs (Upcoming Events)
        $programs = [
            [
                'id' => 'prog-001',
                'title' => 'Leadership Training',
                'start_date' => '2025-03-28',
                'status' => 'Upcoming',
                'description' => null
            ],
            [
                'id' => 'prog-002',
                'title' => 'Town Hall Meeting',
                'start_date' => '2025-03-25',
                'status' => 'Upcoming',
                'description' => 'Meeting' // Using description to store type if needed
            ]
        ];
        $this->db->table('training_programs')->ignore(true)->insertBatch($programs);
        
        // 9. Seed New Batch Onboarding (Future Employee)
        // We can't easily seed a "future employee" that shows up in "Upcoming Events" unless we query for it.
        // Let's add one.
        $futureEmployee = [
             'id' => 'emp-006',
             'employee_code' => 'EMP006',
             'first_name' => 'New',
             'last_name' => 'Batch',
             'email' => 'new.batch@example.com',
             'department_id' => 'dept-001',
             'designation' => 'Trainee',
             'date_of_joining' => '2025-04-01',
             'status' => 'Active'
        ];
        $this->db->table('employees')->ignore(true)->insert($futureEmployee);
    }
}
