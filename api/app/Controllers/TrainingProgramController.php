<?php

namespace App\Controllers;

use App\Models\TrainingProgramModel;
use CodeIgniter\API\ResponseTrait;

class TrainingProgramController extends ApiController
{
    protected $trainingModel;

    public function __construct()
    {
        $this->trainingModel = new TrainingProgramModel();
    }

    public function index()
    {
        $data = $this->trainingModel->findAll();
        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        
        if ($this->trainingModel->insert($data)) {
            return $this->respondCreated(['id' => $this->trainingModel->getInsertID(), ...$data], 'Training program created');
        }

        return $this->respondError('Failed to create program', 500, $this->trainingModel->errors());
    }

    public function show($id = null)
    {
        $data = $this->trainingModel->find($id);
        if ($data) {
             return $this->respondSuccess($data);
        }
        return $this->respondError('Program not found', 404);
    }
    public function update($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        
        if ($this->trainingModel->update($id, $data)) {
            return $this->respondSuccess($this->trainingModel->find($id), 'Training program updated successfully');
        }

        return $this->respondError('Failed to update program', 500, $this->trainingModel->errors());
    }

    public function delete($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        if ($this->trainingModel->delete($id)) {
            return $this->respondSuccess(null, 'Training program deleted successfully');
        }

        return $this->respondError('Failed to delete program', 500);
    }

    public function getStats()
    {
        $programs = $this->trainingModel->findAll();
        
        $stats = [
            'total_programs' => count($programs),
            'upcoming' => count(array_filter($programs, fn($p) => $p['status'] === 'Upcoming')),
            'ongoing' => count(array_filter($programs, fn($p) => $p['status'] === 'Ongoing')),
            'completed' => count(array_filter($programs, fn($p) => $p['status'] === 'Completed')),
        ];
        
        return $this->respondSuccess($stats);
    }
}
