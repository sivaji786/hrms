<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'username' => 'admin',
            'email'    => 'admin@example.com',
            'password_hash' => password_hash('admin123', PASSWORD_DEFAULT),
            'role_id'  => 'admin',
            'status'   => 'Active',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        // Check if user exists
        $exists = $this->db->table('users')->where('email', 'admin@example.com')->get()->getRow();

        if (!$exists) {
            $this->db->table('users')->insert($data);
        }
    }
}
