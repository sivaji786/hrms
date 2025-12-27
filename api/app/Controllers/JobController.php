<?php

namespace App\Controllers;

use App\Models\JobModel;
use CodeIgniter\API\ResponseTrait;

class JobController extends ApiController
{
    protected $jobModel;

    public function __construct()
    {
        $this->jobModel = new JobModel();
    }

    public function index()
    {
        $data = $this->jobModel->findAll();
        return $this->respondSuccess($data);
    }

    public function show($id = null)
    {
        $data = $this->jobModel->find($id);
        if ($data) {
            return $this->respondSuccess($data);
        }
        return $this->respondError('Job not found', 404);
    }

    public function create()
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') { // Only admin can post jobs for now
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        $data['posted_date'] = date('Y-m-d');
        
        if ($this->jobModel->insert($data)) {
            return $this->respondCreated(['id' => $this->jobModel->getInsertID(), ...$data], 'Job posted successfully');
        }

        return $this->respondError('Failed to post job', 500, $this->jobModel->errors());
    }

    public function update($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        if ($this->jobModel->update($id, $data)) {
            return $this->respondSuccess(null, 'Job updated successfully');
        }
        return $this->respondError('Failed to update job', 500, $this->jobModel->errors());
    }

    public function delete($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        if ($this->jobModel->delete($id)) {
            return $this->respondSuccess(null, 'Job deleted successfully');
        }
        return $this->respondError('Failed to delete job', 500, $this->jobModel->errors());
    }
}
