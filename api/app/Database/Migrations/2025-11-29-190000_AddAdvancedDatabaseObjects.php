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

        // 2. Create Stored Procedure: sp_calculate_payroll
        $this->db->query("DROP PROCEDURE IF EXISTS sp_calculate_payroll");
        $this->db->query("
            CREATE PROCEDURE sp_calculate_payroll(IN p_month INT, IN p_year INT)
            BEGIN
                INSERT INTO payroll_records (id, employee_id, month, year, basic_salary, total_allowances, total_deductions, net_salary, status, created_at)
                SELECT 
                    UUID(),
                    e.id,
                    p_month,
                    p_year,
                    ss.basic_salary,
                    (ss.housing_allowance + ss.transport_allowance + ss.other_allowances),
                    0,
                    (ss.basic_salary + ss.housing_allowance + ss.transport_allowance + ss.other_allowances),
                    'Draft',
                    NOW()
                FROM employees e
                JOIN salary_structures ss ON e.id = ss.employee_id
                WHERE e.status = 'Active'
                AND NOT EXISTS (
                    SELECT 1 FROM payroll_records pr 
                    WHERE pr.employee_id = e.id AND pr.month = p_month AND pr.year = p_year
                );
            END
        ");

        // 3. Create Trigger: tr_employee_update_timestamp
        $this->db->query("DROP TRIGGER IF EXISTS tr_employee_update_timestamp");
        $this->db->query("
            CREATE TRIGGER tr_employee_update_timestamp
            BEFORE UPDATE ON employees
            FOR EACH ROW
            BEGIN
                SET NEW.updated_at = NOW();
            END
        ");
    }

    public function down()
    {
        $this->db->query("DROP VIEW IF EXISTS v_employee_details");
        $this->db->query("DROP PROCEDURE IF EXISTS sp_calculate_payroll");
        $this->db->query("DROP TRIGGER IF EXISTS tr_employee_update_timestamp");
    }
}
