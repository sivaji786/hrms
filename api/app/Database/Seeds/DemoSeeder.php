<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run()
    {
        $sql = file_get_contents(FCPATH . '../database/demo_seed.sql');
        
        // Split SQL by semicolon to execute statements individually
        $statements = explode(';', $sql);
        
        foreach ($statements as $statement) {
            $statement = trim($statement);
            if (!empty($statement)) {
                $this->db->query($statement);
            }
        }
    }
}
