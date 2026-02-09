<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateGratuitySettlementsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'employee_id' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
                'null' => false,
            ],
            'total_amount' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',
                'null' => false,
            ],
            'years_of_service' => [
                'type' => 'DECIMAL',
                'constraint' => '4,2',
                'null' => false,
            ],
            'final_basic_salary' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',
                'null' => false,
            ],
            'settlement_date' => [
                'type' => 'DATE',
                'null' => false,
            ],
            'payment_status' => [
                'type' => 'ENUM',
                'constraint' => ['pending', 'approved', 'paid'],
                'default' => 'pending',
            ],
            'payment_date' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'payment_method' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => true,
            ],
            'payment_reference' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => true,
            ],
            'approved_by' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
                'null' => true,
            ],
            'approved_at' => [
                'type' => 'TIMESTAMP',
                'null' => true,
            ],
            'notes' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'created_at' => [
                'type' => 'TIMESTAMP',
                'null' => false,
            ],
            'updated_at' => [
                'type' => 'TIMESTAMP',
                'null' => false,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('employee_id');
        $this->forge->addKey('settlement_date');
        $this->forge->addKey('payment_status');
        
        $this->forge->createTable('gratuity_settlements');
        
        // Add foreign keys using raw SQL with matching collation
        $this->db->query('ALTER TABLE gratuity_settlements MODIFY COLUMN employee_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL');
        $this->db->query('ALTER TABLE gratuity_settlements MODIFY COLUMN approved_by VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL');
        $this->db->query('ALTER TABLE gratuity_settlements ADD CONSTRAINT gratuity_settlements_employee_id_foreign FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE');
        $this->db->query('ALTER TABLE gratuity_settlements ADD CONSTRAINT gratuity_settlements_approved_by_foreign FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE');
    }

    public function down()
    {
        $this->forge->dropTable('gratuity_settlements');
    }
}
