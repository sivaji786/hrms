<?php

namespace App\Services;

use CodeIgniter\I18n\Time;

class GratuityService
{
    protected $db;
    protected $payrollService;
    
    public function __construct()
    {
        $this->db = \Config\Database::connect();
        $this->payrollService = new PayrollService();
    }
    
    /**
     * Calculate and store gratuity for an employee
     * 
     * @param string $employeeId
     * @param string $calculationType Type of calculation (monthly, annual, settlement, adjustment)
     * @param string|null $createdBy User ID who initiated the calculation
     * @param string|null $notes Additional notes
     * @return array Calculation result
     */
    public function calculateAndStoreGratuity(
        string $employeeId, 
        string $calculationType = 'monthly',
        ?string $createdBy = null,
        ?string $notes = null
    ): array
    {
        // Get employee details
        $employee = $this->db->table('employees')
            ->select('id, date_of_joining')
            ->where('id', $employeeId)
            ->get()
            ->getRow();
            
        if (!$employee) {
            throw new \Exception('Employee not found');
        }
        
        // Get current salary structure
        $salary = $this->db->table('salary_structures')
            ->where('employee_id', $employeeId)
            ->orderBy('created_at', 'DESC')
            ->get()
            ->getRow();
            
        if (!$salary) {
            throw new \Exception('Salary structure not found for employee');
        }
        
        // Calculate gratuity using PayrollService
        $calculation = $this->payrollService->calculateGratuity(
            $salary->basic_salary,
            $employee->date_of_joining
        );
        
        $calculationDate = date('Y-m-d');
        $dailyWage = $salary->basic_salary / 30;
        
        // Begin transaction
        $this->db->transStart();
        
        try {
            // Check if record exists in employee_gratuity
            $existing = $this->db->table('employee_gratuity')
                ->where('employee_id', $employeeId)
                ->get()
                ->getRow();
            
            $gratuityData = [
                'employee_id' => $employeeId,
                'current_amount' => $calculation['amount'],
                'years_of_service' => $calculation['yearsOfService'],
                'daily_wage' => $dailyWage,
                'basic_salary' => $salary->basic_salary,
                'calculation_date' => $calculationDate,
                'last_updated' => Time::now()->toDateTimeString(),
            ];
            
            if ($existing) {
                // Update existing record
                $this->db->table('employee_gratuity')
                    ->where('employee_id', $employeeId)
                    ->update($gratuityData);
            } else {
                // Insert new record
                $gratuityData['created_at'] = Time::now()->toDateTimeString();
                $this->db->table('employee_gratuity')->insert($gratuityData);
            }
            
            // Insert into history
            $historyData = [
                'employee_id' => $employeeId,
                'amount' => $calculation['amount'],
                'years_of_service' => $calculation['yearsOfService'],
                'daily_wage' => $dailyWage,
                'basic_salary' => $salary->basic_salary,
                'calculation_date' => $calculationDate,
                'calculation_type' => $calculationType,
                'notes' => $notes,
                'created_by' => $createdBy,
                'created_at' => Time::now()->toDateTimeString(),
            ];
            
            $this->db->table('gratuity_history')->insert($historyData);
            
            $this->db->transComplete();
            
            if ($this->db->transStatus() === false) {
                throw new \Exception('Failed to save gratuity calculation');
            }
            
            return [
                'success' => true,
                'data' => [
                    'employee_id' => $employeeId,
                    'amount' => $calculation['amount'],
                    'years_of_service' => $calculation['yearsOfService'],
                    'daily_wage' => $dailyWage,
                    'basic_salary' => $salary->basic_salary,
                    'calculation_date' => $calculationDate,
                    'breakdown' => $calculation['breakdown'] ?? []
                ]
            ];
            
        } catch (\Exception $e) {
            $this->db->transRollback();
            throw $e;
        }
    }
    
    /**
     * Get current gratuity for an employee
     * 
     * @param string $employeeId
     * @return array|null
     */
    public function getEmployeeGratuity(string $employeeId): ?array
    {
        $gratuity = $this->db->table('employee_gratuity')
            ->where('employee_id', $employeeId)
            ->get()
            ->getRowArray();
            
        return $gratuity;
    }
    
    /**
     * Get gratuity history for an employee
     * 
     * @param string $employeeId
     * @param int $limit
     * @return array
     */
    public function getGratuityHistory(string $employeeId, int $limit = 12): array
    {
        $history = $this->db->table('gratuity_history gh')
            ->select('gh.*, u.first_name, u.last_name')
            ->join('users u', 'gh.created_by = u.id', 'left')
            ->where('gh.employee_id', $employeeId)
            ->orderBy('gh.calculation_date', 'DESC')
            ->limit($limit)
            ->get()
            ->getResultArray();
            
        return $history;
    }
    
    /**
     * Record gratuity settlement for offboarding employee
     * 
     * @param string $employeeId
     * @param string $settlementDate
     * @param string|null $approvedBy
     * @param string|null $notes
     * @return array
     */
    public function recordGratuitySettlement(
        string $employeeId,
        string $settlementDate,
        ?string $approvedBy = null,
        ?string $notes = null
    ): array
    {
        // Get employee details
        $employee = $this->db->table('employees')
            ->select('id, date_of_joining')
            ->where('id', $employeeId)
            ->get()
            ->getRow();
            
        if (!$employee) {
            throw new \Exception('Employee not found');
        }
        
        // Get current salary
        $salary = $this->db->table('salary_structures')
            ->where('employee_id', $employeeId)
            ->orderBy('created_at', 'DESC')
            ->get()
            ->getRow();
            
        if (!$salary) {
            throw new \Exception('Salary structure not found');
        }
        
        // Calculate final gratuity
        $calculation = $this->payrollService->calculateGratuity(
            $salary->basic_salary,
            $employee->date_of_joining,
            $settlementDate
        );
        
        // Begin transaction
        $this->db->transStart();
        
        try {
            // Insert settlement record
            $settlementData = [
                'employee_id' => $employeeId,
                'total_amount' => $calculation['amount'],
                'years_of_service' => $calculation['yearsOfService'],
                'final_basic_salary' => $salary->basic_salary,
                'settlement_date' => $settlementDate,
                'payment_status' => 'pending',
                'approved_by' => $approvedBy,
                'approved_at' => $approvedBy ? Time::now()->toDateTimeString() : null,
                'notes' => $notes,
                'created_at' => Time::now()->toDateTimeString(),
                'updated_at' => Time::now()->toDateTimeString(),
            ];
            
            $this->db->table('gratuity_settlements')->insert($settlementData);
            $settlementId = $this->db->insertID();
            
            // Also record in history
            $this->calculateAndStoreGratuity(
                $employeeId,
                'settlement',
                $approvedBy,
                "Settlement recorded for date: {$settlementDate}"
            );
            
            $this->db->transComplete();
            
            if ($this->db->transStatus() === false) {
                throw new \Exception('Failed to record settlement');
            }
            
            return [
                'success' => true,
                'settlement_id' => $settlementId,
                'data' => [
                    'employee_id' => $employeeId,
                    'total_amount' => $calculation['amount'],
                    'years_of_service' => $calculation['yearsOfService'],
                    'settlement_date' => $settlementDate,
                    'breakdown' => $calculation['breakdown'] ?? []
                ]
            ];
            
        } catch (\Exception $e) {
            $this->db->transRollback();
            throw $e;
        }
    }
    
    /**
     * Update settlement payment status
     * 
     * @param int $settlementId
     * @param string $status
     * @param array $paymentDetails
     * @return bool
     */
    public function updateSettlementPayment(
        int $settlementId,
        string $status,
        array $paymentDetails = []
    ): bool
    {
        $updateData = [
            'payment_status' => $status,
            'updated_at' => Time::now()->toDateTimeString(),
        ];
        
        if (isset($paymentDetails['payment_date'])) {
            $updateData['payment_date'] = $paymentDetails['payment_date'];
        }
        
        if (isset($paymentDetails['payment_method'])) {
            $updateData['payment_method'] = $paymentDetails['payment_method'];
        }
        
        if (isset($paymentDetails['payment_reference'])) {
            $updateData['payment_reference'] = $paymentDetails['payment_reference'];
        }
        
        return $this->db->table('gratuity_settlements')
            ->where('id', $settlementId)
            ->update($updateData);
    }
    
    /**
     * Calculate gratuity for all active employees (for batch processing)
     * 
     * @param string $calculationType
     * @param string|null $createdBy
     * @return array Results summary
     */
    public function calculateAllEmployeesGratuity(
        string $calculationType = 'monthly',
        ?string $createdBy = null
    ): array
    {
        $employees = $this->db->table('employees')
            ->select('id')
            ->where('status', 'Active')
            ->get()
            ->getResult();
            
        $results = [
            'total' => count($employees),
            'success' => 0,
            'failed' => 0,
            'errors' => []
        ];
        
        foreach ($employees as $employee) {
            try {
                $this->calculateAndStoreGratuity(
                    $employee->id,
                    $calculationType,
                    $createdBy,
                    "Batch calculation - {$calculationType}"
                );
                $results['success']++;
            } catch (\Exception $e) {
                $results['failed']++;
                $results['errors'][] = [
                    'employee_id' => $employee->id,
                    'error' => $e->getMessage()
                ];
            }
        }
        
        return $results;
    }
}
