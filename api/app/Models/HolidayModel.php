<?php

namespace App\Models;

use CodeIgniter\Model;

class HolidayModel extends Model
{
    protected $table            = 'holidays';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false; // Using UUIDs string based
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false; // Can enable if needed
    protected $protectFields    = true;
    protected $allowedFields    = ['id', 'name', 'date', 'day', 'type', 'location', 'description', 'is_optional'];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [
        'name' => 'required',
        'date' => 'required|valid_date',
        'type' => 'required',
        'location' => 'required',
    ];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
}
