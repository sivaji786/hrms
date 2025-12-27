<?php

namespace App\Models;

use CodeIgniter\Model;

class TravelRequestModel extends Model
{
    protected $table            = 'travel_requests';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['id', 'employee_id', 'origin', 'destination', 'start_date', 'end_date', 'purpose', 'trip_type', 'travel_mode', 'estimated_cost', 'actual_cost', 'status', 'approver_id'];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules      = [
        'employee_id' => 'required',
        'destination' => 'required|min_length[3]',
        'start_date'  => 'required|valid_date',
        'end_date'    => 'required|valid_date',
        'status'      => 'required|in_list[Pending,Approved,Rejected]',
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
