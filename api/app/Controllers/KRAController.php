<?php

namespace App\Controllers;

use App\Models\KRAModel;

class KRAController extends ApiController
{
    protected $kraModel;

    public function __construct()
    {
        $this->kraModel = new KRAModel();
    }

    public function index()
    {
        $user = $this->getUser();
        if ($user->role === 'admin') {
            $data = $this->kraModel->findAll();
        } else {
            $data = $this->kraModel->where('employee_id', $user->id)->findAll();
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
        
        if ($this->kraModel->insert($data)) {
            return $this->respondCreated(['id' => $this->kraModel->getInsertID(), ...$data], 'KRA created successfully');
        }

        return $this->respondError('Failed to create KRA', 500, $this->kraModel->errors());
    }

    public function show($id = null)
    {
        $data = $this->kraModel->find($id);
        if ($data) {
            return $this->respondSuccess($data);
        }
        return $this->respondError('KRA not found', 404);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        
        if ($this->kraModel->update($id, $data)) {
            return $this->respondSuccess($this->kraModel->find($id), 'KRA updated successfully');
        }

        return $this->respondError('Failed to update KRA', 500, $this->kraModel->errors());
    }

    public function delete($id = null)
    {
        if ($this->kraModel->delete($id)) {
            return $this->respondSuccess(null, 'KRA deleted successfully');
        }

        return $this->respondError('Failed to delete KRA', 500);
    }

    public function getByEmployee($employeeId)
    {
        $data = $this->kraModel->where('employee_id', $employeeId)->findAll();
        return $this->respondSuccess($data);
    }
}
