<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use CodeIgniter\I18n\Time;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Disable foreign key checks to allow truncation/insert order flexibility
        $this->db->query('SET FOREIGN_KEY_CHECKS=0');
        
        $this->seedLocationsAndDepartments();
        $this->seedShifts();
        $this->seedEmployees();
        $this->seedUsers(); // Depends on employees for linking usually, but here independent admin
        $this->seedSalaryStructures();
        $this->seedLeaveTypesAndBalances();
        $this->seedAttendance();
        $this->seedPayroll(); // Deletes old records first
        $this->seedExpensesAndTravel();
        $this->seedAssets();
        $this->seedTickets(); // Depends on employees/users
        $this->seedDocuments();
        $this->seedPolicies();
        $this->seedHolidays();
        $this->seedDashboardExtras();
        $this->seedDemoSql();

        $this->db->query('SET FOREIGN_KEY_CHECKS=1');
    }

    private function seedLocationsAndDepartments()
    {
        // Data from DashboardSeeder & AssetSeeder
        $locations = [
            ['id' => 'loc-001', 'name' => 'Dubai HQ', 'city' => 'Dubai', 'country' => 'UAE'],
            ['id' => 'loc-002', 'name' => 'Abu Dhabi Branch', 'city' => 'Abu Dhabi', 'country' => 'UAE'],
            // From AssetSeeder fallback
            ['id' => 'loc-dubai-001', 'name' => 'Dubai HQ', 'city' => 'Dubai', 'country' => 'UAE']
        ];
        
        // Use insertBatch with ignore to handle duplicates
        $this->db->table('locations')->ignore(true)->insertBatch($locations);

        $departments = [
            ['id' => 'dept-001', 'name' => 'Engineering', 'location_id' => 'loc-001'],
            ['id' => 'dept-002', 'name' => 'Marketing', 'location_id' => 'loc-001'],
            ['id' => 'dept-003', 'name' => 'Sales', 'location_id' => 'loc-002'],
            ['id' => 'dept-004', 'name' => 'HR', 'location_id' => 'loc-001'],
            ['id' => 'dept-005', 'name' => 'Operations', 'location_id' => 'loc-002'],
        ];
        
        foreach ($departments as $dept) {
            $this->db->table('departments')->replace($dept);
        }
    }

    private function seedShifts()
    {
        // From ShiftSeeder
        $data = [
            [
                'id' => '76901ff3-5f31-4c59-9573-74452ef0e2fd',
                'code' => 'SH001',
                'name' => 'General Shift',
                'start_time' => '09:00',
                'end_time' => '18:00',
                'break_duration' => 60,
                'status' => 'Active',
                'work_days' => json_encode(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
            ],
            [
                'id' => 'b1552a48-12cd-4860-912f-912232938f32',
                'code' => 'SH002',
                'name' => 'Early Shift',
                'start_time' => '07:00',
                'end_time' => '16:00',
                'break_duration' => 60,
                'status' => 'Active',
                'work_days' => json_encode(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
            ],
            [
                'id' => 'a98c5a21-99ed-412e-9844-42b719463991',
                'code' => 'SH003',
                'name' => 'Late Shift',
                'start_time' => '12:00',
                'end_time' => '21:00',
                'break_duration' => 60,
                'status' => 'Active',
                'work_days' => json_encode(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
            ],
            [
                'id' => 'c183921b-871d-4008-8123-55829910d933',
                'code' => 'SH004',
                'name' => 'Night Shift',
                'start_time' => '22:00',
                'end_time' => '07:00',
                'break_duration' => 60,
                'status' => 'Active',
                'work_days' => json_encode(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']),
            ],
            [
                'id' => 'f291032c-982d-4119-9234-66931121e044',
                'code' => 'SH005',
                'name' => 'Flexible Shift',
                'start_time' => '00:00',
                'end_time' => '00:00',
                'break_duration' => 60,
                'status' => 'Inactive',
                'work_days' => json_encode(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
            ],
        ];

        foreach ($data as $shift) {
            $existing = $this->db->table('shifts')->where('id', $shift['id'])->get()->getRow();
            if (!$existing) {
                $this->db->table('shifts')->insert($shift);
            }
        }
    }

    private function seedEmployees()
    {
        // From EmployeeSeeder & DashboardSeeder
        $employees = [
            // EmployeeSeeder
            [
                'id' => '123e4567-e89b-12d3-a456-426614174000',
                'employee_code' => 'EMP-DEMO-001',
                'first_name' => 'John',
                'last_name' => 'Smith',
                'email' => 'john.smith@company.com',
                'department_id' => 'dept-001',
                'designation' => 'Software Engineer',
                'date_of_joining' => '2023-01-01',
                'status' => 'Active',
                'employment_type' => 'Full-time',
                'location' => 'Dubai HQ'
            ],
            // DashboardSeeder
            [
                'id' => 'emp-001',
                'employee_code' => 'EMP001',
                'first_name' => 'Rahul',
                'last_name' => 'Sharma',
                'email' => 'rahul.sharma@example.com',
                'department_id' => 'dept-001',
                'designation' => 'Software Engineer',
                'date_of_joining' => date('Y-m-d'),
                'status' => 'Active',
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
                'status' => 'Resigned',
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
            ],
            // Future employee
            [
                 'id' => 'emp-006',
                 'employee_code' => 'EMP006',
                 'first_name' => 'New',
                 'last_name' => 'Batch',
                 'email' => 'new.batch@example.com',
                 'department_id' => 'dept-001',
                 'designation' => 'Trainee',
                 'date_of_joining' => '2025-04-01',
                 'status' => 'Active'
            ]
        ];

        foreach ($employees as $emp) {
            // Check if exists by ID or Code to avoid unique constraint violation if IDs differ
            $existing = $this->db->table('employees')
                            ->groupStart()
                                ->where('id', $emp['id'])
                                ->orWhere('employee_code', $emp['employee_code'])
                            ->groupEnd()
                            ->get()->getRow();

            if (!isset($emp['created_at'])) $emp['created_at'] = date('Y-m-d H:i:s');
            if (!isset($emp['updated_at'])) $emp['updated_at'] = date('Y-m-d H:i:s');

            if ($existing) {
                // Update existing record (might change ID if we really wanted to enforce seed ID, 
                // but better to just update fields on the EXISTING ID to preserve relations if they exist)
                // Actually, if we want to enforce seeding data, we should probably update based on code if found.
                // But let's just use replace(). REPLACE DELETEs conflicting rows. This breaks FKs if ON DELETE CASCADE is not set.
                // Safest is to update if found.
                
                $this->db->table('employees')->where('id', $existing->id)->update($emp);
            } else {
                $this->db->table('employees')->insert($emp);
            }
        }
    }

    private function seedUsers()
    {
        $data = [
            'username' => 'admin',
            'email'    => 'admin@example.com',
            'password_hash' => password_hash('admin123', PASSWORD_DEFAULT),
            'role_id'  => 'admin',
            'status'   => 'Active',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        $exists = $this->db->table('users')->where('email', 'admin@example.com')->get()->getRow();
        if (!$exists) {
            $this->db->table('users')->insert($data);
        }
    }

    private function seedSalaryStructures()
    {
        $employees = $this->db->table('employees')->select('id')->get()->getResultArray();
        if (empty($employees)) return;

        $newStructures = [];
        foreach ($employees as $employee) {
            $exists = $this->db->table('salary_structures')
                           ->where('employee_id', $employee['id'])
                           ->countAllResults();

            if ($exists > 0) continue;

            $basic = rand(50, 200) * 100;
            $hra = $basic * 0.20;
            $transport = $basic * 0.10;
            $other = $basic * 0.05;

            $newStructures[] = [
                'id' => $this->generateUuid(),
                'employee_id' => $employee['id'],
                'basic_salary' => $basic,
                'housing_allowance' => $hra,
                'transport_allowance' => $transport,
                'other_allowances' => $other,
                'effective_from' => date('Y-01-01'), // Effective from start of this year
                'created_at' => date('Y-m-d H:i:s')
            ];
        }

        if (!empty($newStructures)) {
            $this->db->table('salary_structures')->insertBatch($newStructures);
        }
    }

    private function seedLeaveTypesAndBalances()
    {
        $leaveTypes = [
            ['id' => 'lt-001', 'name' => 'Annual Leave', 'days_allowed' => 30, 'carry_forward' => 0, 'is_paid' => 1],
            ['id' => 'lt-002', 'name' => 'Sick Leave', 'days_allowed' => 15, 'carry_forward' => 1, 'is_paid' => 1],
            ['id' => 'lt-003', 'name' => 'Casual Leave', 'days_allowed' => 10, 'carry_forward' => 0, 'is_paid' => 1],
            ['id' => 'lt-004', 'name' => 'Compensatory Off', 'days_allowed' => 0, 'carry_forward' => 0, 'is_paid' => 1],
            ['id' => 'lt-005', 'name' => 'Maternity Leave', 'days_allowed' => 90, 'carry_forward' => 0, 'is_paid' => 1],
            ['id' => 'lt-006', 'name' => 'Paternity Leave', 'days_allowed' => 5, 'carry_forward' => 0, 'is_paid' => 1],
        ];

        foreach ($leaveTypes as $type) {
             $this->db->table('leave_types')->replace($type);
        }

        // Balances
        $employees = $this->db->table('employees')->get()->getResultArray();
        $currentYear = date('Y');

        foreach ($employees as $employee) {
            foreach ($leaveTypes as $type) {
                $exists = $this->db->table('leave_balances')
                    ->where('employee_id', $employee['id'])
                    ->where('leave_type_id', $type['id'])
                    ->where('year', $currentYear)
                    ->countAllResults();
                
                if ($exists == 0) {
                    $this->db->table('leave_balances')->insert([
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

        // Leave Requests
        $requests = [
             [
                'id' => 'leave-001',
                'employee_id' => 'emp-002',
                'leave_type_id' => 'lt-001', // Annual in DashSeeder, but lt-001 is Annual here
                'start_date' => date('Y-m-d', strtotime('+1 day')),
                'end_date' => date('Y-m-d', strtotime('+3 days')),
                'days_count' => 3,
                'status' => 'Approved',
                'approval_date' => date('Y-m-d H:i:s'),
                'reason' => 'Short Vacay'
            ]
        ];

        foreach ($requests as $req) {
             $exists = $this->db->table('leave_requests')->where('id', $req['id'])->get()->getRow();
             if (!$exists) {
                $this->db->table('leave_requests')->insert($req);
             }
        }
    }

    private function seedAttendance()
    {
        $employees = $this->db->table('employees')->select('id')->get()->getResultArray();
        if (empty($employees)) return;

        $attendanceData = [];
        $startDate = new \DateTime('-60 days');
        $endDate = new \DateTime('now');
        $interval = new \DateInterval('P1D');
        $period = new \DatePeriod($startDate, $interval, $endDate);

        foreach ($employees as $employee) {
            foreach ($period as $date) {
                $dateStr = $date->format('Y-m-d');
                $dayOfWeek = $date->format('N'); 
                $status = ($dayOfWeek >= 6) ? 'Weekend' : 'Present'; 
                $checkIn = ($status == 'Present') ? '09:00:00' : null;
                $checkOut = ($status == 'Present') ? '18:00:00' : null;

                // Simple randomization
                if ($status == 'Present' && rand(1, 10) > 8) {
                     $status = 'Late';
                     $checkIn = '09:30:00';
                }

                $attendanceData[] = [
                    'id'            => $this->generateUuid(),
                    'employee_id'   => $employee['id'],
                    'date'          => $dateStr,
                    'status'        => $status,
                    'check_in'      => $checkIn,
                    'check_out'     => $checkOut,
                    'created_at'    => date('Y-m-d H:i:s'),
                ];
                
                if (count($attendanceData) >= 100) {
                    $this->db->table('attendance_records')->ignore(true)->insertBatch($attendanceData);
                    $attendanceData = [];
                }
            }
        }
        if (!empty($attendanceData)) {
            $this->db->table('attendance_records')->ignore(true)->insertBatch($attendanceData);
        }

        // Specific record from DashboardSeeder
        $this->db->table('attendance_records')->ignore(true)->insert([
                'id' => 'att-001',
                'employee_id' => 'emp-005',
                'date' => date('Y-m-d'),
                'status' => 'Late',
                'check_in' => '09:45:00',
                'check_out' => null,
                'created_at' => date('Y-m-d H:i:s')
        ]);
    }

    private function seedPayroll()
    {
        $this->db->table('payroll_records')
                 ->where('year', 2025)
                 ->whereIn('month', [10, 11])
                 ->delete();

        $employees = $this->db->table('employees')
                              ->select('employees.id, employees.employee_code, ss.basic_salary, ss.housing_allowance, ss.transport_allowance, ss.other_allowances')
                              ->join('salary_structures ss', 'ss.employee_id = employees.id')
                              ->get()->getResultArray();

        if (empty($employees)) return;

        $payrollData = [];
        $periods = [
            ['month' => 10, 'year' => 2025, 'status' => 'Processed', 'payment_date' => '2025-10-28'],
            ['month' => 11, 'year' => 2025, 'status' => 'Processed', 'payment_date' => '2025-11-28']
        ];

        // Define varied deduction scenarios for different employees
        $deductionScenarios = [
            0 => ['tax' => 0.05, 'insurance' => 500, 'pension' => 0.03, 'loan' => 0],           // 5% tax + insurance + 3% pension
            1 => ['tax' => 0.07, 'insurance' => 750, 'pension' => 0.05, 'loan' => 1000],        // 7% tax + insurance + 5% pension + loan
            2 => ['tax' => 0.04, 'insurance' => 600, 'pension' => 0.02, 'loan' => 500],         // 4% tax + insurance + 2% pension + small loan
            3 => ['tax' => 0.06, 'insurance' => 800, 'pension' => 0.04, 'loan' => 0],           // 6% tax + insurance + 4% pension
            4 => ['tax' => 0.08, 'insurance' => 900, 'pension' => 0.05, 'loan' => 1500],        // 8% tax + insurance + 5% pension + large loan
            5 => ['tax' => 0.03, 'insurance' => 400, 'pension' => 0.02, 'loan' => 0],           // 3% tax + insurance + 2% pension (minimal)
        ];

        foreach ($employees as $index => $employee) {
            $basic = $employee['basic_salary'];
            $allowances = $employee['housing_allowance'] + $employee['transport_allowance'] + $employee['other_allowances'];
            $gross = $basic + $allowances;
            
            // Get deduction scenario (cycle through scenarios if more employees than scenarios)
            $scenario = $deductionScenarios[$index % count($deductionScenarios)];
            
            // Calculate deductions
            $taxDeduction = $gross * $scenario['tax'];
            $insuranceDeduction = $scenario['insurance'];
            $pensionDeduction = $gross * $scenario['pension'];
            $loanDeduction = $scenario['loan'];
            
            $totalDeductions = $taxDeduction + $insuranceDeduction + $pensionDeduction + $loanDeduction;
            $net = $gross - $totalDeductions;

            foreach ($periods as $period) {
                $payrollData[] = [
                    'id' => $this->generateUuid(),
                    'employee_id' => $employee['id'],
                    'month' => $period['month'],
                    'year' => $period['year'],
                    'basic_salary' => $basic,
                    'total_allowances' => $allowances,
                    'total_deductions' => $totalDeductions,
                    'net_salary' => $net,
                    'status' => $period['status'],
                    'payment_date' => $period['payment_date'],
                    'created_at' => date('Y-m-d H:i:s')
                ];
            }
        }

        if (!empty($payrollData)) {
            $this->db->table('payroll_records')->ignore(true)->insertBatch($payrollData);
        }
    }

    private function seedExpensesAndTravel()
    {
        $employees = $this->db->table('employees')->get()->getResultArray();
        if (empty($employees)) return;

        $getRandomEmployeeId = function () use ($employees) {
            return $employees[array_rand($employees)]['id'];
        };

        $expenses = [
            ['category' => 'Travel', 'amount' => 1200.00, 'description' => 'Flight to London for conference', 'status' => 'Approved', 'date' => date('Y-m-d', strtotime('-10 days'))],
            ['category' => 'Food', 'amount' => 150.50, 'description' => 'Client lunch meeting', 'status' => 'Pending', 'date' => date('Y-m-d', strtotime('-2 days'))],
            ['category' => 'Office Supplies', 'amount' => 450.00, 'description' => 'New monitor and keyboard', 'status' => 'Reimbursed', 'date' => date('Y-m-d', strtotime('-20 days'))],
            ['category' => 'Transport', 'amount' => 80.00, 'description' => 'Taxi to airport', 'status' => 'Rejected', 'date' => date('Y-m-d', strtotime('-5 days'))],
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
                'created_at' => date('Y-m-d H:i:s'),
            ];
             $this->db->table('expenses')->ignore(true)->insert($data);
        }

        $travelRequests = [
             ['origin' => 'Dubai', 'destination' => 'London', 'start_date' => date('Y-m-d', strtotime('+10 days')), 'end_date' => date('Y-m-d', strtotime('+15 days')), 'purpose' => 'Tech Conference', 'trip_type' => 'International', 'travel_mode' => 'Flight', 'estimated_cost' => 5000, 'status' => 'Pending'],
             ['origin' => 'Abu Dhabi', 'destination' => 'Riyadh', 'start_date' => date('Y-m-d', strtotime('+5 days')), 'end_date' => date('Y-m-d', strtotime('+7 days')), 'purpose' => 'Workshop', 'trip_type' => 'International', 'travel_mode' => 'Flight', 'estimated_cost' => 2500, 'status' => 'Approved'],
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
            $this->db->table('travel_requests')->ignore(true)->insert($data);
        }
    }

    private function seedAssets()
    {
        $categories = [
            ['id' => 'cat-it-001', 'name' => 'IT Equipment'],
            ['id' => 'cat-furn-001', 'name' => 'Furniture'],
            ['id' => 'cat-veh-001', 'name' => 'Vehicle']
        ];
        $this->db->table('asset_categories')->ignore(true)->insertBatch($categories);

        $assets = [
             ['id' => 'ast-mbp-001', 'name' => 'MacBook Pro 16"', 'category_id' => 'cat-it-001', 'status' => 'Assigned', 'location_id' => 'loc-dubai-001', 'value' => 9175.00],
             ['id' => 'ast-mon-001', 'name' => 'Dell Monitor 27"', 'category_id' => 'cat-it-001', 'status' => 'Assigned', 'location_id' => 'loc-dubai-001', 'value' => 918.00],
             ['id' => 'ast-chair-001', 'name' => 'Ergonomic Chair', 'category_id' => 'cat-furn-001', 'status' => 'Available', 'location_id' => 'loc-dubai-001', 'value' => 450.00],
        ];
        
        foreach($assets as $asset) {
             // Ensure location exists first (seedLocationsAndDepartments should cover it)
             $this->db->table('assets')->ignore(true)->insert($asset);
        }
        
        $assignments = [
             ['id' => 'asgn-001', 'asset_id' => 'ast-mbp-001', 'employee_id' => '123e4567-e89b-12d3-a456-426614174000', 'assigned_date' => '2023-06-20', 'status' => 'Active']
        ];
        foreach($assignments as $asgn) {
             // Check referential integrity only if seeding ordered correctly
             $this->db->table('asset_assignments')->ignore(true)->insert($asgn);
        }
    }

    private function seedTickets()
    {
        $tickets = [
            ['ticket_number' => 'TKT-1001', 'title' => 'Cannot access VPN', 'description' => 'VPN error.', 'category' => 'IT Support', 'priority' => 'High', 'status' => 'Open', 'created_at' => date('Y-m-d H:i:s')],
            ['ticket_number' => 'TKT-1002', 'title' => 'Payroll discrepancy', 'description' => 'Overtime missing.', 'category' => 'Payroll', 'priority' => 'Critical', 'status' => 'In Progress', 'created_at' => date('Y-m-d H:i:s')],
        ];

        $employees = $this->db->table('employees')->get()->getResultArray();
        if (empty($employees)) return;

        foreach ($tickets as $ticket) {
            $ticket['id'] = $this->generateUuid(); // TicketModel usually handles this, manual here
            $ticket['requester_id'] = $employees[array_rand($employees)]['id'];
            $ticket['assignee_id'] = $employees[array_rand($employees)]['id'];
            
            $existing = $this->db->table('tickets')->where('ticket_number', $ticket['ticket_number'])->get()->getRow();
            if (!$existing) {
                 $this->db->table('tickets')->insert($ticket);
            }
        }
    }

    private function seedDocuments()
    {
        $employees = $this->db->table('employees')->orderBy('created_at', 'ASC')->limit(5)->get()->getResultArray();
        if (empty($employees)) return;

        $rawData = [
            ['name' => 'Emirates ID', 'type' => 'UAE Documents', 'status' => 'Verified'],
            ['name' => 'Passport', 'type' => 'Identity', 'status' => 'Verified'],
        ];

        $documents = [];
        foreach ($employees as $emp) {
             foreach ($rawData as $doc) {
                 $documents[] = [
                     'id' => $this->generateUuid(),
                     'employee_id' => $emp['id'],
                     'name' => $doc['name'],
                     'type' => $doc['type'],
                     'status' => $doc['status'],
                     'created_at' => date('Y-m-d H:i:s'),
                     'updated_at' => date('Y-m-d H:i:s'),
                 ];
             }
        }
        
        if (!empty($documents)) {
             $this->db->table('documents')->ignore(true)->insertBatch($documents);
        }
    }

    private function seedPolicies()
    {
        $policies = [
            ['id' => 'pol1', 'title' => 'Code of Conduct', 'category' => 'General', 'version' => '2.1', 'status' => 'Active', 'effective_date' => '2024-01-01'],
            ['id' => 'pol2', 'title' => 'Leave Policy', 'category' => 'HR', 'version' => '3.0', 'status' => 'Active', 'effective_date' => '2024-01-01'],
             // ...
        ];

        foreach ($policies as $pol) {
            // Check if column 'document_url' exists or add if needed (assume schema matches)
             $this->db->table('policies')->replace($pol);
        }
    }

    private function seedHolidays()
    {
        $holidays = [
             ['id' => 'HOL001', 'name' => 'New Year', 'date' => '2025-01-01', 'type' => 'National Holiday', 'day' => 'Wednesday', 'location' => 'All Locations'],
             ['id' => 'HOL002', 'name' => 'Eid al-Fitr', 'date' => '2025-03-31', 'type' => 'National Holiday', 'day' => 'Monday', 'location' => 'All Locations'],
        ];
        foreach($holidays as $h) {
            $this->db->table('holidays')->ignore(true)->insert($h);
        }
    }

    private function seedDashboardExtras()
    {
        // Reviews
        $reviews = [
            ['id' => 'rev-001', 'employee_id' => 'emp-004', 'reviewer_id' => 'emp-002', 'cycle_name' => 'Q1 2025', 'status' => 'Completed', 'created_at' => date('Y-m-d H:i:s')]
        ];
        $this->db->table('performance_reviews')->ignore(true)->insertBatch($reviews);

        // Training
        $programs = [
            ['id' => 'prog-001', 'title' => 'Leadership Training', 'start_date' => '2025-03-28', 'status' => 'Upcoming']
        ];
        $this->db->table('training_programs')->ignore(true)->insertBatch($programs);
    }

    private function seedDemoSql()
    {
        $path = FCPATH . '../database/demo_seed.sql';
        if (file_exists($path)) {
             $sql = file_get_contents($path);
             $statements = explode(';', $sql);
             foreach ($statements as $statement) {
                $statement = trim($statement);
                if (!empty($statement)) {
                    try {
                        $this->db->query($statement);
                    } catch (\Exception $e) {
                        // Ignore errors
                    }
                }
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
