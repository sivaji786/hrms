<?php

namespace App\Controllers;

use App\Models\FeedbackModel;

class FeedbackController extends ApiController
{
    protected $feedbackModel;

    public function __construct()
    {
        $this->feedbackModel = new FeedbackModel();
    }

    public function index()
    {
        $user = $this->getUser();
        if ($user->role === 'admin') {
            $data = $this->feedbackModel->findAll();
        } else {
            // Employees see feedback they gave or received
            $data = $this->feedbackModel
                ->groupStart()
                    ->where('employee_id', $user->id)
                    ->orWhere('reviewer_id', $user->id)
                ->groupEnd()
                ->findAll();
        }
        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        $data = $this->request->getJSON(true);
        
        if (!isset($data['reviewer_id'])) {
            $data['reviewer_id'] = $user->id;
        }
        
        if (!isset($data['status'])) {
            $data['status'] = 'Draft';
        }
        
        if ($this->feedbackModel->insert($data)) {
            return $this->respondCreated(['id' => $this->feedbackModel->getInsertID(), ...$data], 'Feedback submitted successfully');
        }

        return $this->respondError('Failed to submit feedback', 500, $this->feedbackModel->errors());
    }

    public function show($id = null)
    {
        $data = $this->feedbackModel->find($id);
        if ($data) {
            return $this->respondSuccess($data);
        }
        return $this->respondError('Feedback not found', 404);
    }

    public function getByEmployee($employeeId)
    {
        $data = $this->feedbackModel->where('employee_id', $employeeId)->findAll();
        return $this->respondSuccess($data);
    }

    public function getByReview($reviewId)
    {
        $data = $this->feedbackModel->where('review_id', $reviewId)->findAll();
        return $this->respondSuccess($data);
    }
}
