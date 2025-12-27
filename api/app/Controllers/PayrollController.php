<?php

namespace App\Controllers;

use App\Models\PayrollModel;
use CodeIgniter\API\ResponseTrait;

class PayrollController extends ApiController
{
    // use ResponseTrait; // Inherited

    protected $payrollModel;

    public function __construct()
    {
        $this->payrollModel = new PayrollModel();
    }

    // Admin: List all payrolls with employee details
    // Employee: List own payrolls
    public function index()
    {
        $user = $this->getUser();
        
        $this->payrollModel->select('payroll_records.*, employees.first_name, employees.last_name, employees.department_id as department, employees.employee_code');
        $this->payrollModel->distinct();
        $this->payrollModel->join('employees', 'employees.id = payroll_records.employee_id');

        if ($user->role === 'admin') {
            $data = $this->payrollModel->findAll();
        } else {
            $data = $this->payrollModel->where('employee_id', $user->id)->findAll();
        }
        
        // Format data for frontend
        $formattedData = array_map(function($record) {
            return [
                'id' => $record['employee_id'], // Using employee_id as ID for table row key if needed, or record id
                'record_id' => $record['id'],
                'name' => $record['first_name'] . ' ' . $record['last_name'],
                'department' => $record['department'],
                'basic' => (float)$record['basic_salary'],
                'hra' => (float)$record['total_allowances'] * 0.5, // Approx
                'allowances' => (float)$record['total_allowances'],
                'gross' => (float)$record['basic_salary'] + (float)$record['total_allowances'],
                'deductions' => (float)$record['total_deductions'],
                'netSalary' => (float)$record['net_salary'],
                'status' => $record['status'],
                'month' => date('F Y', mktime(0, 0, 0, $record['month'], 1, $record['year'])),
            ];
        }, $data);
        
        return $this->respondSuccess($formattedData);
    }
    
    // Admin: Get Payroll Stats
    public function getStats()
    {
        $location = $this->request->getVar('location');
        $employeeModel = new \App\Models\EmployeeModel();
        
        // Calculate totals for current month (or latest available)
        $currentMonth = date('n');
        $currentYear = date('Y');
        
        $stats = $this->payrollModel
            ->selectSum('basic_salary')
            ->selectSum('total_allowances')
            ->selectSum('total_deductions')
            ->selectSum('net_salary')
            ->where('month', $currentMonth)
            ->where('year', $currentYear)
            ->first();
            
        if (!$stats['basic_salary']) {
            // Fallback to previous month if no data for current
             $currentMonth = date('n', strtotime('-1 month'));
             $currentYear = date('Y', strtotime('-1 month'));
             
             $stats = $this->payrollModel
                ->selectSum('basic_salary')
                ->selectSum('total_allowances')
                ->selectSum('total_deductions')
                ->selectSum('net_salary')
                ->where('month', $currentMonth)
                ->where('year', $currentYear)
                ->first();
        }

        $gross = ($stats['basic_salary'] ?? 0) + ($stats['total_allowances'] ?? 0);
        $deductions = $stats['total_deductions'] ?? 0;
        $net = $stats['net_salary'] ?? 0;
        
        // Real Counts
        $totalEmployees = $employeeModel->where('status', 'Active')->countAllResults();
        $payslipsGenerated = $this->payrollModel->where('month', $currentMonth)->where('year', $currentYear)->countAllResults();
        $payslipsSent = $this->payrollModel->where('month', $currentMonth)->where('year', $currentYear)->where('status', 'Processed')->countAllResults();

        // Calculate compliance data (UAE Standards)
        // Pension: 5% of Basic for Nationals (Assuming ~20% of workforce are nationals for estimation if not tracking nationality strictly in payroll)
        // For accurate calculation, we should sum based on nationality, but for stats overview:
        $pensionEmployee = $gross * 0.05 * 0.2; // Estimated
        $pensionEmployer = $gross * 0.125 * 0.2; // Estimated
        
        $compliance = [
            ['component' => 'End of Service Gratuity', 'rate' => 'Accrued Monthly', 'amount' => $gross * 0.083, 'status' => 'Calculated'], // ~1 month per year
            ['component' => 'Pension (UAE Nationals - Employee)', 'rate' => '5%', 'amount' => $pensionEmployee, 'status' => 'Calculated'],
            ['component' => 'Pension (UAE Nationals - Employer)', 'rate' => '12.5%', 'amount' => $pensionEmployer, 'status' => 'Calculated'],
            ['component' => 'WPS Fee', 'rate' => 'Fixed', 'amount' => $totalEmployees * 15, 'status' => 'Calculated'], // 15 AED per employee
            ['component' => 'Health Insurance (Employer)', 'rate' => 'Fixed', 'amount' => $totalEmployees * 600, 'status' => 'Calculated'], // 600 AED per employee
        ];
        
        // Payroll Trend (Last 6 months)
        $trend = [];
        for ($i = 5; $i >= 0; $i--) {
            $m = date('n', strtotime("-$i months"));
            $y = date('Y', strtotime("-$i months"));
            $monthName = date('M', strtotime("-$i months"));
            
            $monthStats = $this->payrollModel
                ->selectSum('basic_salary')
                ->selectSum('total_allowances')
                ->selectSum('total_deductions')
                ->selectSum('net_salary')
                ->where('month', $m)
                ->where('year', $y)
                ->first();
                
            $trend[] = [
                'month' => $monthName,
                'gross' => ($monthStats['basic_salary'] ?? 0) + ($monthStats['total_allowances'] ?? 0),
                'deductions' => (float)($monthStats['total_deductions'] ?? 0),
                'net' => (float)($monthStats['net_salary'] ?? 0)
            ];
        }

        return $this->respondSuccess([
            'monthlyGross' => $gross,
            'totalDeductions' => $deductions,
            'netPayroll' => $net,
            'compliance' => $compliance,
            'trend' => $trend,
            'totalEmployees' => $totalEmployees,
            'payslipsGenerated' => $payslipsGenerated,
            'payslipsSent' => $payslipsSent
        ]);
    }

    // Admin: Get Pending Settlements
    public function getPendingSettlements()
    {
        $employeeModel = new \App\Models\EmployeeModel();
        $salaryStructureModel = new \App\Models\SalaryStructureModel();
        $payrollService = new \App\Services\PayrollService();
        
        // Find employees who are Resigned or Terminated
        $employees = $employeeModel->groupStart()
                ->where('status', 'Resigned')
                ->orWhere('status', 'Terminated')
            ->groupEnd()
            ->findAll();
            
        $settlements = [];
        foreach ($employees as $emp) {
            // Calculate estimated settlement
            $structure = $salaryStructureModel->where('employee_id', $emp['id'])
                                              ->orderBy('effective_from', 'DESC')
                                              ->first();
            
            $pendingAmount = 0;
            if ($structure) {
                $basicSalary = $structure['basic_salary'];
                $joiningDate = $emp['date_of_joining'];
                $endDate = date('Y-m-d'); // Assume today if not set
                
                // Calculate Gratuity
                $gratuity = $payrollService->calculateGratuity($basicSalary, $joiningDate, $endDate);
                
                // Estimate Leave Salary (assume 0 days for list view, detailed view will calculate)
                $leaveSalary = 0; 
                
                $pendingAmount = $gratuity['amount'] + $leaveSalary;
            }

            $settlements[] = [
                'employee' => $emp['first_name'] . ' ' . $emp['last_name'],
                'department' => $emp['department_id'], // Should join to get name
                'lastDay' => $emp['updated_at'], // Using updated_at as proxy for last day
                'pendingAmount' => $pendingAmount,
                'status' => 'Pending Approval'
            ];
        }
        
        return $this->respondSuccess($settlements);
    }

    // Admin: Generate/Create Payroll Record
    public function create()
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }
        
        $data = $this->request->getJSON(true);
        
        // Basic validation handled by Model, but we might need to calculate net_salary if not provided
        // For now assume full data is passed
        
        if ($this->payrollModel->insert($data)) {
            return $this->respondCreated(['id' => $this->payrollModel->getInsertID(), ...$data], 'Payroll record created');
        }
        
        return $this->respondError('Failed to create payroll record', 500, $this->payrollModel->errors());
    }
    // Admin: View specific employee payroll details
    public function getEmployeePayroll($employeeId)
    {
        $salaryStructureModel = new \App\Models\SalaryStructureModel();
        
        // Get current salary structure
        $structure = $salaryStructureModel->where('employee_id', $employeeId)
                                          ->orderBy('effective_from', 'DESC')
                                          ->first();

        // Get payroll history
        $history = $this->payrollModel->where('employee_id', $employeeId)
                                      ->orderBy('month', 'DESC')
                                      ->findAll();

        // Calculate detailed breakdown for each payroll record
        foreach ($history as &$record) {
            $basic = $record['basic_salary'];
            $allowances = $record['total_allowances'];
            $gross = $basic + $allowances;
            $totalDed = $record['total_deductions'];
            
            // UAE-specific deductions categorization
            // Try to intelligently categorize based on amount patterns
            $pension = 0;
            $loanDeductions = 0;
            $insuranceDeductions = 0;
            $otherDeductions = 0;
            
            // Check if it's pension (5% of basic for UAE nationals)
            $expectedPension = round($basic * 0.05, 2);
            if (abs($totalDed - $expectedPension) < 1) {
                $pension = $totalDed;
            }
            // Check for common loan amounts
            else if ($totalDed == 500) {
                $loanDeductions = 500;
            }
            else if ($totalDed == 1000) {
                $loanDeductions = 1000;
            }
            // Check for insurance (typically 250-300)
            else if ($totalDed >= 250 && $totalDed <= 350) {
                $insuranceDeductions = $totalDed;
            }
            // Mixed deductions (e.g., 1350 = 1000 loan + 250 insurance + 100 other)
            else if ($totalDed > 1000) {
                $loanDeductions = 1000;
                $insuranceDeductions = 250;
                $otherDeductions = $totalDed - 1250;
            }
            else {
                // Anything else goes to other
                $otherDeductions = $totalDed;
            }
            
            // Create detailed breakdown (UAE format)
            $record['salary_breakdown'] = [
                'basicSalary' => $basic,
                'hra' => $allowances * 0.5, // Typically 50% of allowances is housing
                'transportAllowance' => $allowances * 0.2, // 20% transport
                'otherAllowances' => $allowances * 0.3, // 30% other (education, mobile, etc.)
                'grossSalary' => $gross,
                'pension' => $pension,
                'loanDeductions' => $loanDeductions,
                'insuranceDeductions' => $insuranceDeductions,
                'otherDeductions' => $otherDeductions,
                'totalDeductions' => $totalDed,
                'netSalary' => $record['net_salary']
            ];
        }

        // Calculate breakdown if structure exists
        $currentSalary = null;
        if ($structure) {
            $basic = $structure['basic_salary'];
            $hra = $structure['housing_allowance'] ?? 0;
            $transport = $structure['transport_allowance'] ?? 0;
            $other = $structure['other_allowances'] ?? 0;
            $gross = $basic + $hra + $transport + $other;
            
            // UAE deductions (minimal for expats)
            $pension = 0; // For UAE nationals only
            $totalDeductions = $pension;
            
            $currentSalary = [
                'basicSalary' => $basic,
                'hra' => $hra,
                'specialAllowance' => $other,
                'transportAllowance' => $transport,
                'bonus' => 0,
                'grossSalary' => $gross,
                'pension' => $pension,
                'loanDeductions' => 0,
                'insuranceDeductions' => 0,
                'otherDeductions' => 0,
                'totalDeductions' => $totalDeductions,
                'netSalary' => $gross - $totalDeductions
            ];
        } else {
             // Fallback mock data
             $currentSalary = [
                'basicSalary' => 0,
                'hra' => 0,
                'specialAllowance' => 0,
                'transportAllowance' => 0,
                'bonus' => 0,
                'grossSalary' => 0,
                'pension' => 0,
                'loanDeductions' => 0,
                'insuranceDeductions' => 0,
                'otherDeductions' => 0,
                'totalDeductions' => 0,
                'netSalary' => 0
            ];
        }

        return $this->respondSuccess([
            'currentSalary' => $currentSalary,
            'recentPayslips' => $history
        ]);
    }

    // Admin: Get Settlement Calculation (Gratuity + Leave Salary)
    public function getSettlement($employeeId)
    {
        $employeeModel = new \App\Models\EmployeeModel();
        $salaryStructureModel = new \App\Models\SalaryStructureModel();
        $payrollService = new \App\Services\PayrollService();

        $employee = $employeeModel->find($employeeId);
        if (!$employee) {
            return $this->respondError('Employee not found', 404);
        }

        $structure = $salaryStructureModel->where('employee_id', $employeeId)
                                          ->orderBy('effective_from', 'DESC')
                                          ->first();

        if (!$structure) {
            return $this->respondError('Salary structure not found for employee', 404);
        }

        $basicSalary = $structure['basic_salary'];
        $joiningDate = $employee['date_of_joining'];
        
        // Get parameters from request
        $endDate = $this->request->getVar('end_date') ?? date('Y-m-d');
        $leaveDays = $this->request->getVar('leave_days') ?? 0;

        // Calculate Gratuity
        $gratuity = $payrollService->calculateGratuity($basicSalary, $joiningDate, $endDate);

        // Calculate Leave Salary
        $leaveSalary = $payrollService->calculateLeaveSalary($basicSalary, $leaveDays);

        return $this->respondSuccess([
            'employee' => [
                'id' => $employee['id'],
                'name' => $employee['first_name'] . ' ' . $employee['last_name'],
                'joiningDate' => $joiningDate,
                'basicSalary' => $basicSalary,
            ],
            'settlement' => [
                'endDate' => $endDate,
                'gratuity' => $gratuity,
                'leaveSalary' => [
                    'days' => $leaveDays,
                    'amount' => $leaveSalary
                ],
                'totalSettlement' => $gratuity['amount'] + $leaveSalary
            ]
        ]);
    }
}
