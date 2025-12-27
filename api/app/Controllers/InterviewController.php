<?php

namespace App\Controllers;

use App\Models\InterviewModel;
use CodeIgniter\API\ResponseTrait;

class InterviewController extends ApiController
{
    protected $interviewModel;

    public function __construct()
    {
        $this->interviewModel = new InterviewModel();
    }

    public function index()
    {
        $data = $this->interviewModel->findAll();
        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        $data['status'] = 'Scheduled';
        
        if ($this->interviewModel->insert($data)) {
            return $this->respondCreated(['id' => $this->interviewModel->getInsertID(), ...$data], 'Interview scheduled');
        }

        return $this->respondError('Failed to schedule interview', 500, $this->interviewModel->errors());
    }
}
