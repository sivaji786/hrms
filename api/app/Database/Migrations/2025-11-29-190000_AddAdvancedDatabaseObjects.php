<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddAdvancedDatabaseObjects extends Migration
{
    public function up()
    {
        // 1. Create View: v_employee_details
        $this->db->query("
            CREATE OR REPLACE VIEW v_employee_details AS
            SELECT 
                e.id,
                e.employee_code,
                CONCAT(e.first_name, ' ', e.last_name) AS full_name,
                e.email,
                d.name AS department_name,
                l.name AS location_name,
                e.designation,
                e.status,
                e.date_of_joining
            FROM employees e
            LEFT JOIN departments d ON e.department_id = d.id
            LEFT JOIN locations l ON d.location_id = l.id;
        ");

    }

    public function down()
    {
        $this->db->query("DROP VIEW IF EXISTS v_employee_details");
    }
}
