<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePoliciesTables extends Migration
{
    public function up()
    {
        // Drop tables if they exist to ensure clean state
        $this->forge->dropTable('policy_acknowledgements', true);
        $this->forge->dropTable('policies', true);

        // Policies Table
        $this->forge->addField([
            'id' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
            ],
            'title' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
            ],
            'category' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'version' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'default' => '1.0'
            ],
            'effective_date' => [
                'type' => 'DATE',
            ],
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['Active', 'Archived', 'Draft'],
                'default' => 'Draft',
            ],
            'document_url' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('policies');

        // Policy Acknowledgements
        $this->forge->addField([
            'id' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
            ],
            'policy_id' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
            ],
            'employee_id' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
            ],
            'acknowledged_at' => [
                'type' => 'DATETIME',
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('policy_id', 'policies', 'id', 'CASCADE', 'CASCADE');
        // $this->forge->addForeignKey('employee_id', 'employees', 'id', 'CASCADE', 'CASCADE'); // Removed to avoid potential collation mismatch
        $this->forge->createTable('policy_acknowledgements');
    }

    public function down()
    {
        $this->forge->dropTable('policy_acknowledgements');
        $this->forge->dropTable('policies');
    }
}
