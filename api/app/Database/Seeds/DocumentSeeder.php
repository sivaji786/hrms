<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DocumentSeeder extends Seeder
{
    public function run()
    {
        // Fetch existing employees to map EMP001, EMP002, etc.
        $employees = $this->db->table('employees')->orderBy('created_at', 'ASC')->limit(5)->get()->getResultArray();
        
        if (empty($employees)) {
            return;
        }

        $empMap = [];
        foreach ($employees as $index => $emp) {
            $key = 'EMP00' . ($index + 1); // EMP001, EMP002...
            $empMap[$key] = $emp['id'];
        }

        // Mock Data from documentData.ts
        $rawData = [
            'EMP001' => [
                ['name' => 'Emirates ID', 'type' => 'UAE Documents', 'uploadDate' => '2022-01-10', 'expiryDate' => '2027-01-10', 'status' => 'Verified', 'size' => 2400],
                ['name' => 'UAE Residence Visa', 'type' => 'UAE Documents', 'uploadDate' => '2022-01-10', 'expiryDate' => '2025-01-10', 'status' => 'Expiring Soon', 'size' => 1800],
                ['name' => 'Labour Card', 'type' => 'UAE Documents', 'uploadDate' => '2022-01-12', 'expiryDate' => '2025-01-10', 'status' => 'Expiring Soon', 'size' => 1500],
                ['name' => 'Passport', 'type' => 'Identity', 'uploadDate' => '2022-01-10', 'expiryDate' => '2028-05-15', 'status' => 'Verified', 'size' => 3200],
            ],
            'EMP002' => [
                ['name' => 'Emirates ID', 'type' => 'UAE Documents', 'uploadDate' => '2021-06-05', 'expiryDate' => '2026-06-05', 'status' => 'Verified', 'size' => 2100],
                ['name' => 'UAE Residence Visa', 'type' => 'UAE Documents', 'uploadDate' => '2021-06-05', 'expiryDate' => '2024-06-05', 'status' => 'Expired', 'size' => 1500],
                ['name' => 'Passport', 'type' => 'Identity', 'uploadDate' => '2021-06-08', 'expiryDate' => '2029-04-20', 'status' => 'Verified', 'size' => 2800],
            ],
            'EMP003' => [
                ['name' => 'Emirates ID', 'type' => 'UAE Documents', 'uploadDate' => '2023-03-20', 'expiryDate' => '2028-03-20', 'status' => 'Verified', 'size' => 2300],
                ['name' => 'UAE Residence Visa', 'type' => 'UAE Documents', 'uploadDate' => '2023-03-20', 'expiryDate' => '2026-03-20', 'status' => 'Verified', 'size' => 1700],
            ],
        ];

        $documents = [];
        foreach ($rawData as $empKey => $docs) {
            if (isset($empMap[$empKey])) {
                $empId = $empMap[$empKey];
                foreach ($docs as $doc) {
                    $documents[] = [
                        'id' => sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000, mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)),
                        'employee_id' => $empId,
                        'name' => $doc['name'],
                        'type' => $doc['type'],
                        'file_url' => 'uploads/mock_document.pdf', // Placeholder, field is file_url
                        'expiry_date' => $doc['expiryDate'],
                        'status' => $doc['status'],
                        'is_company_document' => 0,
                        'created_at' => $doc['uploadDate'] . ' 10:00:00',
                        'updated_at' => $doc['uploadDate'] . ' 10:00:00',
                    ];
                }
            }
        }
    
        if (!empty($documents)) {
             $this->db->table('documents')->ignore(true)->insertBatch($documents);
        }
    }
}
