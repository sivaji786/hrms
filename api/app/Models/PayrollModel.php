<?php

namespace App\Models;

use CodeIgniter\Model;

class PayrollModel extends Model
{
    protected $table            = 'payroll_records';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['id', 'employee_id', 'month', 'year', 'basic_salary', 'total_allowances', 'total_deductions', 'net_salary', 'status', 'payment_date'];

    // Dates
    protected $useTimestamps = false; // schema has created_at default, no updated_at
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules      = [
        'employee_id' => 'required',
        'month'       => 'required|integer|greater_than[0]|less_than[13]',
        'year'        => 'required|integer',
        'basic_salary'=> 'required|numeric',
        'net_salary'  => 'required|numeric',
        'status'      => 'required|in_list[Draft,Processed,Paid]',
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
