<?php

namespace App\Models;

use CodeIgniter\Model;

class EmployeeModel extends Model
{
    protected $table            = 'employees';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id', 'employee_code', 'first_name', 'last_name', 'email', 'phone',
        'department_id', 'designation', 'manager_id', 'date_of_joining',
        'status', 'employment_type', 'work_schedule',
        'date_of_birth', 'gender', 'marital_status', 'nationality', 'address', 'blood_group',
        'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relation',
        'bank_name', 'account_number', 'iban',
        'emirates_id', 'passport_number', 'visa_number', 'labour_card_number',
        'profile_image'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules      = [
        'employee_code' => 'required|is_unique[employees.employee_code,id,{id}]',
        'first_name'    => 'required',
        'last_name'     => 'required',
        'email'         => 'required|valid_email|is_unique[employees.email,id,{id}]',
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
