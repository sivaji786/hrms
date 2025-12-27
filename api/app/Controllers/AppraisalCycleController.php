<?php

namespace App\Controllers;

use App\Models\AppraisalCycleModel;

class AppraisalCycleController extends ApiController
{
    protected $cycleModel;

    public function __construct()
    {
        $this->cycleModel = new AppraisalCycleModel();
    }

    public function index()
    {
        $data = $this->cycleModel->orderBy('created_at', 'DESC')->findAll();
        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        
        if (!isset($data['created_by'])) {
            $data['created_by'] = $user->id;
        }
        
        if (!isset($data['status'])) {
            $data['status'] = 'Draft';
        }
        
        if ($this->cycleModel->insert($data)) {
            return $this->respondCreated(['id' => $this->cycleModel->getInsertID(), ...$data], 'Appraisal cycle created successfully');
        }

        return $this->respondError('Failed to create appraisal cycle', 500, $this->cycleModel->errors());
    }

    public function show($id = null)
    {
        $data = $this->cycleModel->find($id);
        if ($data) {
            return $this->respondSuccess($data);
        }
        return $this->respondError('Appraisal cycle not found', 404);
    }

    public function update($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        
        if ($this->cycleModel->update($id, $data)) {
            return $this->respondSuccess($this->cycleModel->find($id), 'Appraisal cycle updated successfully');
        }

        return $this->respondError('Failed to update appraisal cycle', 500, $this->cycleModel->errors());
    }

    public function delete($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        if ($this->cycleModel->delete($id)) {
            return $this->respondSuccess(null, 'Appraisal cycle deleted successfully');
        }

        return $this->respondError('Failed to delete appraisal cycle', 500);
    }

    public function getActive()
    {
        $data = $this->cycleModel
            ->whereIn('status', ['Active', 'In Progress'])
            ->orderBy('start_date', 'DESC')
            ->findAll();
        return $this->respondSuccess($data);
    }

    public function getStats()
    {
        $cycles = $this->cycleModel->findAll();
        
        $stats = [
            'total_cycles' => count($cycles),
            'active_cycles' => count(array_filter($cycles, fn($c) => in_array($c['status'], ['Active', 'In Progress']))),
            'completed_cycles' => count(array_filter($cycles, fn($c) => $c['status'] === 'Completed')),
            'total_reviews' => array_sum(array_column($cycles, 'total_employees')),
            'completed_reviews' => array_sum(array_column($cycles, 'completed_reviews')),
            'pending_reviews' => array_sum(array_column($cycles, 'pending_reviews')),
        ];
        
        return $this->respondSuccess($stats);
    }
}
