<?php

namespace App\Models;

use CodeIgniter\Model;

class CompanySettingsModel extends Model
{
    protected $table            = 'company_settings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'company_name', 'address', 'email', 'phone', 'website', 
        'logo_url', 'currency', 'tax_id'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = ''; // No created_at needed really, but table has updated_at
    protected $updatedField  = 'updated_at';
    protected $deletedField  = '';

    // Validation
    protected $validationRules      = [
        'company_name' => 'required|min_length[3]',
        'email'        => 'permit_empty|valid_email',
    ];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}
