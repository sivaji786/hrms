<?php

namespace App\Controllers;

use App\Models\PerformanceReviewModel;
use CodeIgniter\API\ResponseTrait;

class PerformanceReviewController extends ApiController
{
    protected $reviewModel;

    public function __construct()
    {
        $this->reviewModel = new PerformanceReviewModel();
    }

    public function index()
    {
        $user = $this->getUser();
        if ($user->role === 'admin') {
            $data = $this->reviewModel->findAll();
        } else {
            // Employees see their own reviews
            $data = $this->reviewModel->where('employee_id', $user->id)->findAll();
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
        $data['status'] = 'Draft';
        
        if ($this->reviewModel->insert($data)) {
            return $this->respondCreated(['id' => $this->reviewModel->getInsertID(), ...$data], 'Performance review created');
        }

        return $this->respondError('Failed to create review', 500, $this->reviewModel->errors());
    }

    public function show($id = null)
    {
        $data = $this->reviewModel->find($id);
        if ($data) {
             return $this->respondSuccess($data);
        }
        return $this->respondError('Review not found', 404);
    }

    public function update($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        
        if ($this->reviewModel->update($id, $data)) {
            return $this->respondSuccess($this->reviewModel->find($id), 'Performance review updated successfully');
        }

        return $this->respondError('Failed to update review', 500, $this->reviewModel->errors());
    }

    public function delete($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        if ($this->reviewModel->delete($id)) {
            return $this->respondSuccess(null, 'Performance review deleted successfully');
        }

        return $this->respondError('Failed to delete review', 500);
    }

    public function getByEmployee($employeeId)
    {
        $data = $this->reviewModel->where('employee_id', $employeeId)->findAll();
        return $this->respondSuccess($data);
    }

    public function getStats()
    {
        $reviews = $this->reviewModel->findAll();
        
        $stats = [
            'total_reviews' => count($reviews),
            'completed' => count(array_filter($reviews, fn($r) => $r['status'] === 'Completed')),
            'in_progress' => count(array_filter($reviews, fn($r) => in_array($r['status'], ['Self-Review', 'Manager-Review']))),
            'pending' => count(array_filter($reviews, fn($r) => $r['status'] === 'Draft')),
            'average_rating' => $this->calculateAverageRating($reviews),
        ];
        
        return $this->respondSuccess($stats);
    }

    public function getDepartmentStats()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('performance_reviews pr');
        $builder->select('e.department_id, d.name as department_name, COUNT(pr.id) as review_count, AVG(pr.final_rating) as avg_rating');
        $builder->join('employees e', 'e.id = pr.employee_id');
        $builder->join('departments d', 'd.id = e.department_id', 'left');
        $builder->where('pr.final_rating IS NOT NULL');
        $builder->groupBy('e.department_id, d.name');
        
        $data = $builder->get()->getResultArray();
        return $this->respondSuccess($data);
    }

    private function calculateAverageRating($reviews)
    {
        $ratings = array_filter(array_column($reviews, 'final_rating'));
        return !empty($ratings) ? round(array_sum($ratings) / count($ratings), 2) : 0;
    }
}
