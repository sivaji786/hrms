<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class PolicySeeder extends Seeder
{
    public function run()
    {
        $policies = [
            [
                'id' => 'pol1',
                'title' => 'Code of Conduct',
                'category' => 'General',
                'version' => '2.1',
                'effective_date' => '2024-01-01',
                'status' => 'Active',
                'description' => 'This policy outlines the expected standards of conduct for all employees. It covers professional behavior, ethical practices, conflict of interest, confidentiality, and compliance with laws and regulations. All employees are expected to maintain the highest standards of integrity and professionalism.',
                'created_at' => '2024-01-15 10:00:00',
                'updated_at' => '2024-01-15 10:00:00',
                'document_url' => 'uploads/policies/Code_of_Conduct.txt',
            ],
            [
                'id' => 'pol2',
                'title' => 'Leave Policy',
                'category' => 'HR',
                'version' => '3.0',
                'effective_date' => '2024-01-01',
                'status' => 'Active',
                'description' => 'This comprehensive leave policy covers all types of employee leave including annual leave, sick leave, parental leave, bereavement leave, and unpaid leave. It outlines the application process, approval procedures, carry-forward rules, and encashment policies.',
                'created_at' => '2024-02-10 10:00:00',
                'updated_at' => '2024-02-10 10:00:00',
                'document_url' => 'uploads/policies/Leave_Policy.txt',
            ],
            [
                'id' => 'pol3',
                'title' => 'Remote Work Policy',
                'category' => 'Operations',
                'version' => '1.5',
                'effective_date' => '2024-03-01',
                'status' => 'Active',
                'description' => 'Guidelines for employees working remotely, including eligibility criteria, equipment provisions, work hours, communication expectations, data security requirements, and performance monitoring. Ensures productivity and collaboration in remote work arrangements.',
                'created_at' => '2024-03-05 10:00:00',
                'updated_at' => '2024-03-05 10:00:00',
                'document_url' => 'uploads/policies/Remote_Work_Policy.txt',
            ],
            [
                'id' => 'pol4',
                'title' => 'Data Security Policy',
                'category' => 'IT',
                'version' => '4.0',
                'effective_date' => '2024-01-01',
                'status' => 'Active',
                'description' => 'Comprehensive data security guidelines covering password management, access controls, data classification, encryption standards, incident reporting, and GDPR compliance. Protects company and customer data from unauthorized access and breaches.',
                'created_at' => '2024-01-20 10:00:00',
                'updated_at' => '2024-01-20 10:00:00',
                'document_url' => 'uploads/policies/Data_Security_Policy.txt',
            ],
            [
                'id' => 'pol5',
                'title' => 'Travel & Expense Policy',
                'category' => 'Finance',
                'version' => '2.3',
                'effective_date' => '2024-01-01',
                'status' => 'Active',
                'description' => 'Outlines procedures for business travel approval, expense reimbursement, travel class entitlements, accommodation standards, daily allowances, and submission deadlines. Ensures cost-effective and compliant business travel.',
                'created_at' => '2024-01-25 10:00:00',
                'updated_at' => '2024-01-25 10:00:00',
                'document_url' => 'uploads/policies/Travel_Expense_Policy.txt',
            ],
            [
                'id' => 'pol6',
                'title' => 'Performance Review Policy',
                'category' => 'HR',
                'version' => '1.8',
                'effective_date' => '2024-02-01',
                'status' => 'Active',
                'description' => 'Details the performance evaluation process including review cycles, rating scales, goal setting procedures, feedback mechanisms, and improvement plans. Promotes fair and consistent performance assessment across the organization.',
                'created_at' => '2024-02-15 10:00:00',
                'updated_at' => '2024-02-15 10:00:00',
                'document_url' => 'uploads/policies/Performance_Review_Policy.txt',
            ],
            [
                'id' => 'pol7',
                'title' => 'Anti-Harassment Policy',
                'category' => 'HR',
                'version' => '1.2',
                'effective_date' => '2024-01-01',
                'status' => 'Active',
                'description' => 'Zero-tolerance policy against harassment and discrimination. Defines unacceptable behaviors, reporting procedures, investigation processes, and protective measures for complainants. Maintains a safe and respectful workplace for all employees.',
                'created_at' => '2024-01-10 10:00:00',
                'updated_at' => '2024-01-10 10:00:00',
                'document_url' => 'uploads/policies/Anti_Harassment_Policy.txt',
            ],
            [
                'id' => 'pol8',
                'title' => 'Equipment Usage Policy',
                'category' => 'IT',
                'version' => '2.0',
                'effective_date' => '2024-01-01',
                'status' => 'Active',
                'description' => 'Guidelines for proper use and care of company-provided equipment including laptops, mobile devices, and peripherals. Covers acceptable use, maintenance responsibilities, return procedures, and liability for damage or loss.',
                'created_at' => '2024-01-18 10:00:00',
                'updated_at' => '2024-01-18 10:00:00',
                'document_url' => 'uploads/policies/Equipment_Usage_Policy.txt',
            ],
            [
                'id' => 'pol9',
                'title' => 'Overtime Policy',
                'category' => 'HR',
                'version' => '1.5',
                'effective_date' => '2024-02-01',
                'status' => 'Active',
                'description' => 'Defines overtime eligibility, approval processes, compensation rates, maximum limits, and documentation requirements. Ensures fair compensation for extra work hours while managing operational costs and employee wellbeing.',
                'created_at' => '2024-02-12 10:00:00',
                'updated_at' => '2024-02-12 10:00:00',
                'document_url' => 'uploads/policies/Overtime_Policy.txt',
            ],
            [
                'id' => 'pol10',
                'title' => 'Social Media Policy',
                'category' => 'General',
                'version' => '1.3',
                'effective_date' => '2024-01-01',
                'status' => 'Active',
                'description' => 'Guidelines for employee use of social media platforms, both personal and professional. Covers brand representation, confidentiality obligations, prohibited content, and consequences of policy violations. Protects company reputation online.',
                'created_at' => '2024-01-22 10:00:00',
                'updated_at' => '2024-01-22 10:00:00',
                'document_url' => 'uploads/policies/Social_Media_Policy.txt',
            ],
        ];

        // Use upsertBatch to update existing records with new data (like document_url)
        // If upsertBatch is not available (CI4 version dependent), we might need another approach.
        // Assuming CI 4.3+
        $this->db->table('policies')->upsertBatch($policies);
        
        // Seed Acknowledgements - assume some dummy employees exist or use logic
        // Since we don't know employee IDs for sure, we can fetch them first
        $employees = $this->db->table('employees')->select('id')->limit(50)->get()->getResultArray();
        
        if (!empty($employees)) {
            $acks = [];
            foreach ($policies as $policy) {
                // Randomly acknowledge 80%
                foreach ($employees as $emp) {
                    if (mt_rand(1, 100) <= 80) {
                        $acks[] = [
                            'id' => sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000, mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)),
                            'policy_id' => $policy['id'],
                            'employee_id' => $emp['id'],
                            'acknowledged_at' => date('Y-m-d H:i:s'),
                        ];
                    }
                }
            }
            // Batch insert in chunks to avoid query limit
            if (!empty($acks)) {
                $chunks = array_chunk($acks, 100);
                foreach ($chunks as $chunk) {
                    $this->db->table('policy_acknowledgements')->ignore(true)->insertBatch($chunk);
                }
            }
        }
    }
}
