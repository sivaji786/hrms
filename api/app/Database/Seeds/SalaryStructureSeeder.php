<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class SalaryStructureSeeder extends Seeder
{
    public function run()
    {
        // 1. Get all employees
        $employees = $this->db->table('employees')->select('id')->get()->getResultArray();

        if (empty($employees)) {
            echo "No employees found. Please seed employees first.\n";
            return;
        }

        $newStructures = [];

        foreach ($employees as $employee) {
            // Check if structure exists
            $exists = $this->db->table('salary_structures')
                           ->where('employee_id', $employee['id'])
                           ->countAllResults();

            if ($exists > 0) {
                continue;
            }

            // Generate random salary structure
            $basic = rand(50, 200) * 100; // 5000 - 20000
            $hra = $basic * 0.20;
            $transport = $basic * 0.10;
            $other = $basic * 0.05;

            $newStructures[] = [
                'id' => $this->generateUuid(),
                'employee_id' => $employee['id'],
                'basic_salary' => $basic,
                'housing_allowance' => $hra,
                'transport_allowance' => $transport,
                'other_allowances' => $other,
                'effective_from' => date('Y-01-01'), // Effective from start of this year
                'created_at' => date('Y-m-d H:i:s')
            ];
        }

        if (!empty($newStructures)) {
            $this->db->table('salary_structures')->insertBatch($newStructures);
            echo count($newStructures) . " salary structures created.\n";
        } else {
            echo "All employees already have salary structures.\n";
        }
    }

    private function generateUuid()
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
