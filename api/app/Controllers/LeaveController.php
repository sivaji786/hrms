<?php

namespace App\Controllers;

use App\Models\LeaveModel;
use CodeIgniter\API\ResponseTrait;

class LeaveController extends ApiController
{
    // use ResponseTrait; // Inherited from ApiController

    protected $leaveModel;

    public function __construct()
    {
        $this->leaveModel = new LeaveModel();
    }

    // Admin: View all leaves
    // Employee: View own leaves
    public function index()
    {
        $user = $this->getUser();
        
        $this->leaveModel->select('leave_requests.*, employees.first_name, employees.last_name, employees.employee_code, departments.name as department_name, leave_types.name as leave_type_name');
        $this->leaveModel->join('employees', 'employees.id = leave_requests.employee_id');
        $this->leaveModel->join('departments', 'departments.id = employees.department_id', 'left');
        $this->leaveModel->join('leave_types', 'leave_types.id = leave_requests.leave_type_id');

        if ($user->role !== 'admin') {
            $this->leaveModel->where('leave_requests.employee_id', $user->id);
        }
        
        $data = $this->leaveModel->orderBy('created_at', 'DESC')->findAll();
        
        // Format response
        $formatted = array_map(function($row) {
            return [
                'id' => $row['id'],
                'employee' => $row['first_name'] . ' ' . $row['last_name'],
                'empId' => $row['employee_code'],
                'department' => $row['department_name'] ?? 'N/A',
                'leaveType' => $row['leave_type_name'],
                'from' => $row['start_date'],
                'to' => $row['end_date'],
                'days' => (float)$row['days_count'],
                'reason' => $row['reason'],
                'status' => $row['status'],
                'created_at' => $row['created_at']
            ];
        }, $data);

        return $this->respondSuccess($formatted);
    }

    // Get Leave Stats for Dashboard
    public function stats()
    {
        $user = $this->getUser();
        $db = \Config\Database::connect();
        
        $builder = $db->table('leave_requests');
        if ($user->role !== 'admin') {
            // $builder->where('employee_id', $user->id); // Employees only see their stats usually, but dashboard might be global?
            // Assuming dashboard is global stats for Admin, and personal stats for Employee?
            // Let's return global stats for now as the UI seems to be an Admin View.
            // If strictly employee, we filter.
             $builder->where('employee_id', $user->id);
        }

        // Pending
        $pending = (clone $builder)->where('status', 'Pending')->countAllResults();
        
        // Approved this month
        $approvedMonth = (clone $builder)
            ->where('status', 'Approved')
            ->where('MONTH(start_date)', date('m'))
            ->where('YEAR(start_date)', date('Y'))
            ->countAllResults();
            
        // Rejected this month
        $rejectedMonth = (clone $builder)
            ->where('status', 'Rejected')
            ->where('MONTH(created_at)', date('m'))
            ->where('YEAR(created_at)', date('Y'))
            ->countAllResults();
            
        // On Leave Today
        $today = date('Y-m-d');
        $onLeave = $db->table('leave_requests')
            ->where('status', 'Approved')
            ->where('start_date <=', $today)
            ->where('end_date >=', $today)
            ->countAllResults();

        return $this->respondSuccess([
            'pendingRequests' => $pending,
            'approvedThisMonth' => $approvedMonth,
            'rejectedThisMonth' => $rejectedMonth,
            'onLeaveToday' => $onLeave
        ]);
    }

    // Get Leave Types
    public function types()
    {
        $db = \Config\Database::connect();
        $types = $db->table('leave_types')->get()->getResultArray();
        return $this->respondSuccess($types);
    }

    // Get Balances
    public function balances()
    {
        $user = $this->getUser();
        $db = \Config\Database::connect();
        
        $builder = $db->table('leave_balances')
            ->select('leave_balances.*, leave_types.name as leave_type_name, employees.first_name, employees.last_name, employees.employee_code, departments.name as department_name')
            ->join('leave_types', 'leave_types.id = leave_balances.leave_type_id')
            ->join('employees', 'employees.id = leave_balances.employee_id')
            ->join('departments', 'departments.id = employees.department_id', 'left')
            ->where('year', date('Y'));

        if ($user->role !== 'admin') {
            $builder->where('employee_id', $user->id);
        }
        
        $data = $builder->get()->getResultArray();
        
        // Group by employee if admin to match UI structure (rows per employee)
        // The UI table shows one row per employee with columns for Casual, Sick, etc.
        // So we need to transform the data.
        
        $grouped = [];
        foreach ($data as $row) {
            $empId = $row['employee_id'];
            if (!isset($grouped[$empId])) {
                $grouped[$empId] = [
                    'employee' => $row['first_name'] . ' ' . $row['last_name'],
                    'empId' => $row['employee_code'],
                    'department' => $row['department_name'] ?? 'N/A',
                    'casual' => 0,
                    'sick' => 0,
                    'privilege' => 0,
                    'compensatory' => 0,
                    // Store individual balances if needed
                ];
            }
            
            // Map leave types to keys
            // In seeder: Casual Leave, Sick Leave, Privilege Leave, Compensatory Off
            $typeName = strtolower($row['leave_type_name']);
            if (strpos($typeName, 'casual') !== false) $grouped[$empId]['casual'] = (float)$row['remaining_days'];
            elseif (strpos($typeName, 'sick') !== false) $grouped[$empId]['sick'] = (float)$row['remaining_days'];
            elseif (strpos($typeName, 'privilege') !== false) $grouped[$empId]['privilege'] = (float)$row['remaining_days'];
            elseif (strpos($typeName, 'compensatory') !== false) $grouped[$empId]['compensatory'] = (float)$row['remaining_days'];
        }

        return $this->respondSuccess(array_values($grouped));
    }

    // Employee: Request leave
    public function create()
    {
        $user = $this->getUser();
        $rules = [
            'leave_type' => 'required',
            'start_date' => 'required|valid_date',
            'end_date'   => 'required|valid_date',
            'reason'     => 'required',
        ];

        if (! $this->validate($rules)) {
            return $this->respondError('Validation failed', 400, $this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);
        
        if ($user->role === 'admin' && !empty($data['employee_id'])) {
            // Admin can apply for others
        } else {
            $data['employee_id'] = $user->id;
        }

        $data['status'] = 'Pending'; // Case sensitive enum in schema? Schema says 'Pending'

        // Lookup leave_type_id
        $db = \Config\Database::connect();
        $type = $db->table('leave_types')->where('name', $data['leave_type'])->get()->getRow();
        
        if (!$type) {
             return $this->respondError('Invalid leave type', 400);
        }
        $data['leave_type_id'] = $type->id;
        unset($data['leave_type']);

        // Calculate days_count
        $start = new \DateTime($data['start_date']);
        $end = new \DateTime($data['end_date']);
        $diff = $start->diff($end);
        $data['days_count'] = $diff->days + 1;

        if ($this->leaveModel->insert($data)) {
            return $this->respondCreated(['id' => $this->leaveModel->getInsertID(), ...$data], 'Leave request submitted');
        }

        return $this->respondError('Failed to submit leave request', 500, $this->leaveModel->errors());
    }

    // Admin: Approve/Reject leave
    public function update($id = null)
    {
        $user = $this->getUser();
        
        // Only admin can approve/reject, but maybe employees can update pending requests?
        // For simplicity, let's say only admin updates status for now, or employee updates details if pending.
        
        $data = $this->request->getRawInput();
        
        if ($user->role !== 'admin' && isset($data['status'])) {
             return $this->respondError('Unauthorized to change status', 403);
        }

        if ($this->leaveModel->update($id, $data)) {
            return $this->respondSuccess(null, 'Leave request updated');
        }

        return $this->respondError('Failed to update leave request', 500, $this->leaveModel->errors());
    }
    
    public function delete($id = null)
    {
         $user = $this->getUser();
         $leave = $this->leaveModel->find($id);
         
         if (!$leave) {
             return $this->respondError('Leave request not found', 404);
         }
         
         // Only owner or admin
         if ($user->role !== 'admin' && $leave['employee_id'] !== $user->id) {
             return $this->respondError('Unauthorized', 403);
         }
         
         if ($this->leaveModel->delete($id)) {
             return $this->respondSuccess(null, 'Leave request deleted');
         }
         
         return $this->respondError('Failed to delete leave request', 500);
    }
}
