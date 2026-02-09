<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateEmployeeGratuityTable extends Migration
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
            'current_amount' => [
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
            'last_updated' => [
                'type' => 'TIMESTAMP',
                'null' => false,
            ],
            'created_at' => [
                'type' => 'TIMESTAMP',
                'null' => false,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('employee_id');
        $this->forge->addKey('calculation_date');
        
        $this->forge->createTable('employee_gratuity');
        
        // Add foreign key using raw SQL with matching collation
        $this->db->query('ALTER TABLE employee_gratuity MODIFY COLUMN employee_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL');
        $this->db->query('ALTER TABLE employee_gratuity ADD CONSTRAINT employee_gratuity_employee_id_foreign FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE');
    }

    public function down()
    {
        $this->forge->dropTable('employee_gratuity');
    }
}
