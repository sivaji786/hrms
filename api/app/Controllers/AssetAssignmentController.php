<?php

namespace App\Controllers;

use App\Models\AssetAssignmentModel;
use CodeIgniter\API\ResponseTrait;

class AssetAssignmentController extends ApiController
{
    protected $assignmentModel;

    public function __construct()
    {
        $this->assignmentModel = new AssetAssignmentModel();
    }

    public function index()
    {
        $assignments = $this->assignmentModel->findAllWithDetails();
        
        $data = array_map(function($assignment) {
            $assignment['assetName'] = $assignment['asset_name'] ?? null;
            $assignment['employeeName'] = trim(($assignment['employee_first_name'] ?? '') . ' ' . ($assignment['employee_last_name'] ?? ''));
            $assignment['employeeId'] = $assignment['employee_code'] ?? null;
            $assignment['assignedDate'] = $assignment['assigned_date'];
            $assignment['returnDate'] = $assignment['return_date'];
            return $assignment;
        }, $assignments);

        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        // if ($user->role !== 'admin') {
        //      return $this->respondError('Unauthorized', 403);
        // }

        $data = $this->request->getJSON(true);
        
        // Look up employee ID if code is passed?
        // Frontend sends employeeId which is likely the code (e.g. EMP001).
        // But the DB expects employee_id (UUID).
        // We need to resolve employee code to UUID.
        
        if (isset($data['employeeId'])) {
            $employeeModel = new \App\Models\EmployeeModel();
            $employee = $employeeModel->where('employee_code', $data['employeeId'])->first();
            if ($employee) {
                $data['employee_id'] = $employee['id'];
            } else {
                return $this->respondError('Employee not found', 404);
            }
        }

        if ($this->assignmentModel->insert($data)) {
            // Update asset status
            $assetModel = new \App\Models\AssetModel();
            $assetModel->update($data['asset_id'], ['status' => 'Assigned']);

            return $this->respondCreated(['id' => $this->assignmentModel->getInsertID(), ...$data], 'Asset assigned successfully');
        }

        return $this->respondError('Failed to assign asset', 500, $this->assignmentModel->errors());
    }
}
