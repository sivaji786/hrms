<?php

namespace App\Controllers;

use App\Models\RoleModel;
use CodeIgniter\API\ResponseTrait;

class RoleController extends ApiController
{
    protected $roleModel;

    public function __construct()
    {
        $this->roleModel = new RoleModel();
    }

    public function index()
    {
        $data = $this->roleModel->findAll();
        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        
        if ($this->roleModel->insert($data)) {
            return $this->respondCreated(['id' => $this->roleModel->getInsertID(), ...$data], 'Role created successfully');
        }

        return $this->respondError('Failed to create role', 500, $this->roleModel->errors());
    }

    public function show($id = null)
    {
        $data = $this->roleModel->find($id);
        if ($data) {
             return $this->respondSuccess($data);
        }
        return $this->respondError('Role not found', 404);
    }

    public function update($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        
        if ($this->roleModel->update($id, $data)) {
            return $this->respondSuccess(['id' => $id, ...$data], 'Role updated successfully');
        }

        return $this->respondError('Failed to update role', 500, $this->roleModel->errors());
    }

    public function delete($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        // Prevent deletion of default roles
        if (in_array($id, ['admin', 'employee'])) {
            return $this->respondError('Cannot delete default system roles', 400);
        }

        if ($this->roleModel->delete($id)) {
            return $this->respondSuccess(null, 'Role deleted successfully');
        }

        return $this->respondError('Failed to delete role', 500);
    }
}
