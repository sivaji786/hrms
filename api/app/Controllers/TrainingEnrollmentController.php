<?php

namespace App\Controllers;

use App\Models\TrainingEnrollmentModel;
use CodeIgniter\API\ResponseTrait;

class TrainingEnrollmentController extends ApiController
{
    protected $enrollmentModel;

    public function __construct()
    {
        $this->enrollmentModel = new TrainingEnrollmentModel();
    }

    public function index()
    {
        $user = $this->getUser();
        if ($user->role === 'admin') {
            $data = $this->enrollmentModel->findAll();
        } else {
            $data = $this->enrollmentModel->where('employee_id', $user->id)->findAll();
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
        
        if ($this->enrollmentModel->insert($data)) {
            return $this->respondCreated(['id' => $this->enrollmentModel->getInsertID(), ...$data], 'Enrolled successfully');
        }

        return $this->respondError('Failed to enroll', 500, $this->enrollmentModel->errors());
    }
    public function update($id = null)
    {
        $user = $this->getUser();
        // Allow admin or the employee themselves (if logic permits, usually admin/trainer updates status)
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        
        if ($this->enrollmentModel->update($id, $data)) {
            return $this->respondSuccess($this->enrollmentModel->find($id), 'Enrollment updated successfully');
        }

        return $this->respondError('Failed to update enrollment', 500, $this->enrollmentModel->errors());
    }

    public function delete($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        if ($this->enrollmentModel->delete($id)) {
            return $this->respondSuccess(null, 'Enrollment deleted successfully');
        }

        return $this->respondError('Failed to delete enrollment', 500);
    }

    public function getByProgram($programId)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }
        
        // Join with employees table to get names
        $db = \Config\Database::connect();
        $builder = $db->table('training_enrollments te');
        $builder->select('te.*, e.first_name, e.last_name, e.employee_code, e.department_id');
        $builder->join('employees e', 'e.id = te.employee_id');
        $builder->where('te.program_id', $programId);
        
        $data = $builder->get()->getResultArray();
        return $this->respondSuccess($data);
    }
}
