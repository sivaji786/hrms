<?php

namespace App\Models;

use CodeIgniter\Model;

class LeaveModel extends Model
{
    protected $table            = 'leave_requests';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['id', 'employee_id', 'leave_type_id', 'start_date', 'end_date', 'days_count', 'reason', 'status'];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules      = [
        'employee_id' => 'required',
        'leave_type_id' => 'required',
        'start_date'  => 'required|valid_date',
        'end_date'    => 'required|valid_date',
        'reason'      => 'required',
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
