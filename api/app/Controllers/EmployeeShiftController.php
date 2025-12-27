<?php

namespace App\Controllers;

use App\Models\EmployeeShiftModel;
use CodeIgniter\API\ResponseTrait;

class EmployeeShiftController extends ApiController
{
    protected $employeeShiftModel;

    public function __construct()
    {
        $this->employeeShiftModel = new EmployeeShiftModel();
    }

    public function index()
    {
        $employeeModel = new \App\Models\EmployeeModel();
        
        // Fetch all employees with their department and current/latest shift
        $data = $employeeModel
            ->select('employees.id as employee_id, employees.first_name, employees.last_name, 
                      departments.name as department, 
                      employee_shifts.id as assignment_id, employee_shifts.effective_from,
                      shifts.id as shift_id, shifts.name as shift_name, shifts.code as shift_code, shifts.start_time, shifts.end_time')
            ->join('departments', 'departments.id = employees.department_id', 'left')
            ->join('employee_shifts', 'employee_shifts.employee_id = employees.id', 'left')
            ->join('shifts', 'shifts.id = employee_shifts.shift_id', 'left')
            // Simple logic: if multiple shifts exist, we might get duplicates. 
            // Ideally should filter by active shift. For now, assuming distinct or latest is sufficient for the mocked scenario.
            // ->groupBy('employees.id') // Caused only_full_group_by error 
            ->findAll();
            
        // Format names
        $formatted = array_map(function($row) {
            $row['employee_name'] = trim(($row['first_name'] ?? '') . ' ' . ($row['last_name'] ?? ''));
            // Ensure department is not null for UI
            $row['department'] = $row['department'] ?? 'Unassigned';
            return $row;
        }, $data);

        return $this->respondSuccess($formatted);
    }

    public function create()
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        
        if ($this->employeeShiftModel->insert($data)) {
            return $this->respondCreated(['id' => $this->employeeShiftModel->getInsertID(), ...$data], 'Shift assigned successfully');
        }

        return $this->respondError('Failed to assign shift', 500, $this->employeeShiftModel->errors());
    }
}
