<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class ShiftSeeder extends Seeder
{
    public function run()
    {
        $this->db->query('SET FOREIGN_KEY_CHECKS=0');
        $this->db->table('shifts')->truncate();
        $this->db->query('SET FOREIGN_KEY_CHECKS=1');

        $data = [
            [
                'id' => '76901ff3-5f31-4c59-9573-74452ef0e2fd', // Deterministic UUID
                'code' => 'SH001',
                'name' => 'General Shift',
                'start_time' => '09:00',
                'end_time' => '18:00',
                'break_duration' => 60,
                'status' => 'Active',
                'work_days' => json_encode(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
            ],
            [
                'id' => 'b1552a48-12cd-4860-912f-912232938f32',
                'code' => 'SH002',
                'name' => 'Early Shift',
                'start_time' => '07:00',
                'end_time' => '16:00',
                'break_duration' => 60,
                'status' => 'Active',
                'work_days' => json_encode(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
            ],
            [
                'id' => 'a98c5a21-99ed-412e-9844-42b719463991',
                'code' => 'SH003',
                'name' => 'Late Shift',
                'start_time' => '12:00',
                'end_time' => '21:00',
                'break_duration' => 60,
                'status' => 'Active',
                'work_days' => json_encode(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
            ],
            [
                'id' => 'c183921b-871d-4008-8123-55829910d933',
                'code' => 'SH004',
                'name' => 'Night Shift',
                'start_time' => '22:00',
                'end_time' => '07:00',
                'break_duration' => 60,
                'status' => 'Active',
                'work_days' => json_encode(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']),
            ],
            [
                'id' => 'f291032c-982d-4119-9234-66931121e044',
                'code' => 'SH005',
                'name' => 'Flexible Shift',
                'start_time' => '00:00',
                'end_time' => '00:00',
                'break_duration' => 60,
                'status' => 'Inactive',
                'work_days' => json_encode(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
            ],
        ];

        // Simple check to avoid duplicates if running multiple times without refresh
        $builder = $this->db->table('shifts');
        foreach ($data as $shift) {
            $existing = $builder->where('id', $shift['id'])->get()->getRow();
            if (!$existing) {
                $builder->insert($shift);
            }
        }
    }
}
