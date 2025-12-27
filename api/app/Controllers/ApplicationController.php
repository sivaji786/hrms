<?php

namespace App\Controllers;

use App\Models\ApplicationModel;
use CodeIgniter\API\ResponseTrait;

class ApplicationController extends ApiController
{
    protected $applicationModel;

    public function __construct()
    {
        $this->applicationModel = new ApplicationModel();
    }

    public function index()
    {
        $data = $this->applicationModel->findAll();
        return $this->respondSuccess($data);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $data['status'] = 'Applied';
        
        if ($this->applicationModel->insert($data)) {
            return $this->respondCreated(['id' => $this->applicationModel->getInsertID(), ...$data], 'Application submitted');
        }

        return $this->respondError('Failed to submit application', 500, $this->applicationModel->errors());
    }
}
