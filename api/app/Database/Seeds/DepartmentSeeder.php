<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'id' => 'dept-001',
            'name' => 'Engineering',
            'description' => 'Software Development and Engineering',
            'manager_id' => null, // Can be updated later
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        // Force insert or update
        $this->db->table('departments')->replace($data);
    }
}
