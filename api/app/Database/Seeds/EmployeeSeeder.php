<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'id' => '123e4567-e89b-12d3-a456-426614174000',
            'employee_code' => 'EMP-DEMO-001',
            'first_name' => 'John',
            'last_name' => 'Smith',
            'email' => 'john.smith@company.com',
            'department_id' => 'dept-001',
            'designation' => 'Software Engineer',
            'date_of_joining' => '2023-01-01',
            'status' => 'Active',
            'employment_type' => 'Full-time',
            'location' => 'Dubai HQ'
        ];

        // Check if employee exists by ID
        $exists = $this->db->table('employees')->where('id', $data['id'])->get()->getRow();

        if ($exists) {
            $this->db->table('employees')->where('id', $data['id'])->update($data);
        } else {
            $this->db->table('employees')->insert($data);
        }
    }
}
