<?php

namespace App\Models;

use CodeIgniter\Model;

class FeedbackModel extends Model
{
    protected $table            = 'feedback_360';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id', 'employee_id', 'reviewer_id', 'review_id', 'feedback_type',
        'rating', 'technical_skills', 'communication', 'leadership', 
        'teamwork', 'initiative', 'comments', 'strengths', 
        'areas_of_improvement', 'status', 'submitted_at'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = null; // No updated_at in this table

    // Validation
    protected $validationRules      = [
        'employee_id'   => 'required',
        'reviewer_id'   => 'required',
        'feedback_type' => 'required|in_list[Manager,Peer,Self,Subordinate]',
        'status'        => 'in_list[Draft,Submitted,Reviewed]',
        'rating'        => 'permit_empty|decimal|greater_than_equal_to[1.0]|less_than_equal_to[5.0]',
    ];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = ['generateId'];

    protected function generateId(array $data)
    {
        if (! isset($data['data']['id'])) {
            $data['data']['id'] = $this->generateUuid();
        }
        return $data;
    }

    protected function generateUuid()
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
