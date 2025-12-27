<?php

namespace App\Models;

use CodeIgniter\Model;

class AssetModel extends Model
{
    protected $table            = 'assets';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['id', 'name', 'category_id', 'serial_number', 'purchase_date', 'warranty_expiry', 'value', 'status', 'location_id', 'description'];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules      = [
        'name'          => 'required|min_length[3]',
        'category_id'   => 'required',
        'serial_number' => 'required|is_unique[assets.serial_number,id,{id}]',
        'status'        => 'required|in_list[Available,Assigned,Under Maintenance,Retired]',
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
        return $this->select('assets.*, asset_categories.name as category_name, 
                              employees.first_name as assigned_to_first_name, employees.last_name as assigned_to_last_name, 
                              employees.employee_code as assigned_to_code, asset_assignments.assigned_date')
                    ->join('asset_categories', 'asset_categories.id = assets.category_id', 'left')
                    ->join('asset_assignments', 'asset_assignments.asset_id = assets.id AND asset_assignments.status = "Active"', 'left')
                    ->join('employees', 'employees.id = asset_assignments.employee_id', 'left')
                    ->findAll();
    }
}
