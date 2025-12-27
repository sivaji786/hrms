<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class AssetSeeder extends Seeder
{
    public function run()
    {
        // 1. Seed Categories
        $categories = [
            [
                'id' => 'cat-it-001',
                'name' => 'IT Equipment'
            ],
            [
                'id' => 'cat-furn-001',
                'name' => 'Furniture'
            ],
            [
                'id' => 'cat-veh-001',
                'name' => 'Vehicle'
            ]
        ];

        foreach ($categories as $category) {
            $exists = $this->db->table('asset_categories')->where('id', $category['id'])->get()->getRow();
            if (!$exists) {
                $this->db->table('asset_categories')->insert($category);
            }
        }

        // Get a location
        $location = $this->db->table('locations')->get()->getRow();
        $locationId = $location ? $location->id : null;

        if (!$locationId) {
            // Create a dummy location if none exists
            $locationId = 'loc-dubai-001';
            $this->db->table('locations')->insert([
                'id' => $locationId,
                'name' => 'Dubai HQ',
                'city' => 'Dubai',
                'country' => 'UAE'
            ]);
        }

        // 2. Seed Assets
        $assets = [
            [
                'id' => 'ast-mbp-001',
                'name' => 'MacBook Pro 16"',
                'category_id' => 'cat-it-001',
                'serial_number' => 'MBP2023-001',
                'purchase_date' => '2023-06-15',
                'warranty_expiry' => '2026-06-15',
                'value' => 9175.00,
                'status' => 'Assigned',
                'location_id' => $locationId,
                'description' => 'M2 Pro, 16GB RAM, 512GB SSD'
            ],
            [
                'id' => 'ast-mon-001',
                'name' => 'Dell Monitor 27"',
                'category_id' => 'cat-it-001',
                'serial_number' => 'DELL-MON-2023-042',
                'purchase_date' => '2023-05-20',
                'warranty_expiry' => '2026-05-20',
                'value' => 918.00,
                'status' => 'Assigned',
                'location_id' => $locationId,
                'description' => '4K UHD Display'
            ],
            [
                'id' => 'ast-chair-001',
                'name' => 'Ergonomic Chair',
                'category_id' => 'cat-furn-001',
                'serial_number' => 'CHR-2023-101',
                'purchase_date' => '2023-01-10',
                'warranty_expiry' => '2025-01-10',
                'value' => 450.00,
                'status' => 'Available',
                'location_id' => $locationId,
                'description' => 'Black mesh chair'
            ]
        ];

        foreach ($assets as $asset) {
            $exists = $this->db->table('assets')->where('id', $asset['id'])->get()->getRow();
            if (!$exists) {
                $this->db->table('assets')->insert($asset);
            } else {
                $this->db->table('assets')->where('id', $asset['id'])->update($asset);
            }
        }

        // 3. Seed Assignments
        // Assign to the demo employee from EmployeeSeeder
        $employeeId = '123e4567-e89b-12d3-a456-426614174000';
        
        // Check if employee exists first
        $employee = $this->db->table('employees')->where('id', $employeeId)->get()->getRow();
        
        if ($employee) {
            $assignments = [
                [
                    'id' => 'asgn-001',
                    'asset_id' => 'ast-mbp-001',
                    'employee_id' => $employeeId,
                    'assigned_date' => '2023-06-20',
                    'status' => 'Active',
                    'notes' => 'Primary work laptop'
                ],
                [
                    'id' => 'asgn-002',
                    'asset_id' => 'ast-mon-001',
                    'employee_id' => $employeeId,
                    'assigned_date' => '2023-05-25',
                    'status' => 'Active',
                    'notes' => 'External monitor'
                ]
            ];

            foreach ($assignments as $assignment) {
                $exists = $this->db->table('asset_assignments')->where('id', $assignment['id'])->get()->getRow();
                if (!$exists) {
                    $this->db->table('asset_assignments')->insert($assignment);
                }
            }
        }
    }
}
