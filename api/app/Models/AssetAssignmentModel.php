<?php

namespace App\Models;

use CodeIgniter\Model;

class AssetAssignmentModel extends Model
{
    protected $table            = 'asset_assignments';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['id', 'asset_id', 'employee_id', 'assigned_date', 'return_date', 'status', 'notes'];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = '';
    protected $updatedField  = '';

    // Validation
    protected $validationRules      = [
        'asset_id'      => 'required',
        'employee_id'   => 'required',
        'assigned_date' => 'required|valid_date',
        'status'        => 'required|in_list[Active,Returned]',
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

    public function findAllWithDetails()
    {
        return $this->select('asset_assignments.*, assets.name as asset_name, 
                              employees.first_name as employee_first_name, employees.last_name as employee_last_name,
                              employees.employee_code as employee_code')
                    ->join('assets', 'assets.id = asset_assignments.asset_id')
                    ->join('employees', 'employees.id = asset_assignments.employee_id')
                    ->findAll();
    }
}
