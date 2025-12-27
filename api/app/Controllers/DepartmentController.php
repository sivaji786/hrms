<?php

namespace App\Controllers;

use App\Models\DepartmentModel;
use CodeIgniter\API\ResponseTrait;

class DepartmentController extends ApiController
{
    protected $departmentModel;

    public function __construct()
    {
        $this->departmentModel = new DepartmentModel();
    }

    public function index()
    {
        $data = $this->departmentModel->select('departments.*, locations.name as location_name')
                                      ->join('locations', 'locations.id = departments.location_id', 'left')
                                      ->findAll();
        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        
        if ($this->departmentModel->insert($data)) {
            return $this->respondCreated(['id' => $this->departmentModel->getInsertID(), ...$data], 'Department created successfully');
        }

        return $this->respondError('Failed to create department', 500, $this->departmentModel->errors());
    }

    public function show($id = null)
    {
        $data = $this->departmentModel->find($id);
        if ($data) {
             return $this->respondSuccess($data);
        }
        return $this->respondError('Department not found', 404);
    }

    public function update($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        
        if ($this->departmentModel->update($id, $data)) {
            return $this->respondSuccess(['id' => $id, ...$data], 'Department updated successfully');
        }

        return $this->respondError('Failed to update department', 500, $this->departmentModel->errors());
    }

    public function delete($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        if ($this->departmentModel->delete($id)) {
            return $this->respondSuccess(null, 'Department deleted successfully');
        }

        return $this->respondError('Failed to delete department', 500);
    }
}
