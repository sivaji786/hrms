<?php

namespace App\Controllers;

use App\Models\SalaryStructureModel;
use CodeIgniter\API\ResponseTrait;

class SalaryStructureController extends ApiController
{
    protected $salaryModel;

    public function __construct()
    {
        $this->salaryModel = new SalaryStructureModel();
    }

    public function index()
    {
        $user = $this->getUser();
        if ($user->role === 'admin') {
            $data = $this->salaryModel->findAll();
        } else {
            $data = $this->salaryModel->where('employee_id', $user->id)->findAll();
        }
        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        
        if ($this->salaryModel->insert($data)) {
            return $this->respondCreated(['id' => $this->salaryModel->getInsertID(), ...$data], 'Salary structure created successfully');
        }

        return $this->respondError('Failed to create salary structure', 500, $this->salaryModel->errors());
    }
}
