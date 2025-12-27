<?php

namespace App\Controllers;

use App\Models\ShiftModel;
use CodeIgniter\API\ResponseTrait;

class ShiftController extends ApiController
{
    protected $shiftModel;

    public function __construct()
    {
        $this->shiftModel = new ShiftModel();
    }

    public function index()
    {
        $data = $this->shiftModel->findAll();
        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        
        if ($this->shiftModel->insert($data)) {
            return $this->respondCreated(['id' => $this->shiftModel->getInsertID(), ...$data], 'Shift created successfully');
        }

        return $this->respondError('Failed to create shift', 500, $this->shiftModel->errors());
    }

    public function show($id = null)
    {
        $data = $this->shiftModel->find($id);
        if ($data) {
             return $this->respondSuccess($data);
        }
        return $this->respondError('Shift not found', 404);
    }
    public function update($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        if ($this->shiftModel->update($id, $data)) {
            return $this->respondSuccess(['id' => $id, ...$data], 'Shift updated successfully');
        }

        return $this->respondError('Failed to update shift', 500, $this->shiftModel->errors());
    }

    public function delete($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        if ($this->shiftModel->delete($id)) {
            return $this->respondDeleted(['id' => $id], 'Shift deleted successfully');
        }

        return $this->respondError('Failed to delete shift', 500);
    }
}
