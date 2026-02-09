<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateGratuityHistoryTable extends Migration
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
            'amount' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',
                'null' => false,
            ],
            'years_of_service' => [
                'type' => 'DECIMAL',
                'constraint' => '4,2',
                'null' => false,
            ],
            'daily_wage' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',
                'null' => false,
            ],
            'basic_salary' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',
                'null' => false,
            ],
            'calculation_date' => [
                'type' => 'DATE',
                'null' => false,
            ],
            'calculation_type' => [
                'type' => 'ENUM',
                'constraint' => ['monthly', 'annual', 'settlement', 'adjustment', 'initial'],
                'default' => 'monthly',
            ],
            'notes' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'created_by' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
                'null' => true,
            ],
            'created_at' => [
                'type' => 'TIMESTAMP',
                'null' => false,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('employee_id');
        $this->forge->addKey('calculation_date');
        $this->forge->addKey('calculation_type');
        
        $this->forge->createTable('gratuity_history');
        
        // Add foreign keys using raw SQL with matching collation
        $this->db->query('ALTER TABLE gratuity_history MODIFY COLUMN employee_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL');
        $this->db->query('ALTER TABLE gratuity_history MODIFY COLUMN created_by VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL');
        $this->db->query('ALTER TABLE gratuity_history ADD CONSTRAINT gratuity_history_employee_id_foreign FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE');
        $this->db->query('ALTER TABLE gratuity_history ADD CONSTRAINT gratuity_history_created_by_foreign FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE');
    }

    public function down()
    {
        $this->forge->dropTable('gratuity_history');
    }
}
