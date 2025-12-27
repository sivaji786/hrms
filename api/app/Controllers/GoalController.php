<?php

namespace App\Controllers;

use App\Models\GoalModel;
use CodeIgniter\API\ResponseTrait;

class GoalController extends ApiController
{
    protected $goalModel;

    public function __construct()
    {
        $this->goalModel = new GoalModel();
    }

    public function index()
    {
        $user = $this->getUser();
        if ($user->role === 'admin') {
            $data = $this->goalModel->findAll();
        } else {
            $data = $this->goalModel->where('employee_id', $user->id)->findAll();
        }
        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        $data = $this->request->getJSON(true);
        
        if (!isset($data['employee_id'])) {
            $data['employee_id'] = $user->id;
        }
        
        if ($this->goalModel->insert($data)) {
            return $this->respondCreated(['id' => $this->goalModel->getInsertID(), ...$data], 'Goal created successfully');
        }

        return $this->respondError('Failed to create goal', 500, $this->goalModel->errors());
    }

    public function show($id = null)
    {
        $data = $this->goalModel->find($id);
        if ($data) {
            return $this->respondSuccess($data);
        }
        return $this->respondError('Goal not found', 404);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        
        if ($this->goalModel->update($id, $data)) {
            return $this->respondSuccess($this->goalModel->find($id), 'Goal updated successfully');
        }

        return $this->respondError('Failed to update goal', 500, $this->goalModel->errors());
    }

    public function delete($id = null)
    {
        if ($this->goalModel->delete($id)) {
            return $this->respondSuccess(null, 'Goal deleted successfully');
        }

        return $this->respondError('Failed to delete goal', 500);
    }

    public function updateProgress($id = null)
    {
        $data = $this->request->getJSON(true);
        
        if (!isset($data['progress'])) {
            return $this->respondError('Progress value is required', 400);
        }
        
        if ($this->goalModel->update($id, ['progress' => $data['progress']])) {
            return $this->respondSuccess($this->goalModel->find($id), 'Goal progress updated successfully');
        }

        return $this->respondError('Failed to update goal progress', 500);
    }

    public function getByEmployee($employeeId)
    {
        $data = $this->goalModel->where('employee_id', $employeeId)->findAll();
        return $this->respondSuccess($data);
    }
}
