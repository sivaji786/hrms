<?php

namespace App\Controllers;

use App\Models\CandidateModel;
use CodeIgniter\API\ResponseTrait;

class CandidateController extends ApiController
{
    protected $candidateModel;

    public function __construct()
    {
        $this->candidateModel = new CandidateModel();
    }

    public function index()
    {
        $data = $this->candidateModel->findAll();
        return $this->respondSuccess($data);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        
        if ($this->candidateModel->insert($data)) {
            return $this->respondCreated(['id' => $this->candidateModel->getInsertID(), ...$data], 'Candidate profile created');
        }

        return $this->respondError('Failed to create candidate', 500, $this->candidateModel->errors());
    }

    public function show($id = null)
    {
        $data = $this->candidateModel->find($id);
        if ($data) {
             return $this->respondSuccess($data);
        }
        return $this->respondError('Candidate not found', 404);
    }
}
