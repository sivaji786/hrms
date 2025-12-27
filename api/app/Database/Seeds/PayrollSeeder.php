<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class PayrollSeeder extends Seeder
{
    public function run()
    {
        // Clear existing October and November 2025 payroll records
        $this->db->table('payroll_records')
                 ->where('year', 2025)
                 ->whereIn('month', [10, 11])
                 ->delete();

        echo "Creating UAE-compliant sample payroll data for October & November 2025...\n";

        // Get employees with their salary structures
        $employees = $this->db->table('employees')
                              ->select('employees.id, employees.first_name, employees.last_name, employees.date_of_joining, ss.basic_salary, ss.housing_allowance, ss.transport_allowance, ss.other_allowances')
                              ->join('salary_structures ss', 'ss.employee_id = employees.id')
                              ->get()->getResultArray();

        if (empty($employees)) {
            echo "No employees with salary structures found.\n";
            return;
        }

        $payrollData = [];
        $periods = [
            ['month' => 10, 'year' => 2025, 'status' => 'Paid', 'payment_date' => '2025-10-28'],
            ['month' => 11, 'year' => 2025, 'status' => 'Paid', 'payment_date' => '2025-11-28']
        ];

        foreach ($employees as $index => $employee) {
            $basic = $employee['basic_salary'];
            $allowances = $employee['housing_allowance'] + $employee['transport_allowance'] + $employee['other_allowances'];
            $gross = $basic + $allowances;

            // UAE-specific deductions (minimal for expats)
            // Create different scenarios for different employees
            $deductionScenarios = [
                0 => ['pension' => 0, 'loan' => 0, 'insurance' => 0, 'other' => 0], // No deductions
                1 => ['pension' => 0, 'loan' => 500, 'insurance' => 0, 'other' => 0], // Loan deduction
                2 => ['pension' => 0, 'loan' => 0, 'insurance' => 300, 'other' => 0], // Insurance
                3 => ['pension' => $basic * 0.05, 'loan' => 0, 'insurance' => 0, 'other' => 0], // UAE national with pension
                4 => ['pension' => 0, 'loan' => 1000, 'insurance' => 250, 'other' => 100], // Multiple deductions
            ];

            $scenario = $deductionScenarios[$index % count($deductionScenarios)];
            $totalDeductions = array_sum($scenario);
            $netSalary = $gross - $totalDeductions;

            foreach ($periods as $period) {
                $payrollData[] = [
                    'id' => $this->generateUuid(),
                    'employee_id' => $employee['id'],
                    'month' => $period['month'],
                    'year' => $period['year'],
                    'basic_salary' => $basic,
                    'total_allowances' => $allowances,
                    'total_deductions' => $totalDeductions,
                    'net_salary' => $netSalary,
                    'status' => $period['status'],
                    'payment_date' => $period['payment_date'],
                    'created_at' => date('Y-m-d H:i:s')
                ];
            }

            echo "Employee: {$employee['first_name']} {$employee['last_name']} - Scenario: " . ($index % count($deductionScenarios)) . "\n";
            echo "  Basic: AED " . number_format($basic, 2) . " | Gross: AED " . number_format($gross, 2) . " | Deductions: AED " . number_format($totalDeductions, 2) . " | Net: AED " . number_format($netSalary, 2) . "\n";
        }

        if (!empty($payrollData)) {
            $this->db->table('payroll_records')->insertBatch($payrollData);
            echo "\n✅ Created " . count($payrollData) . " payroll records for October & November 2025.\n";
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
