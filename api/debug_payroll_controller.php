<?php

// Bootstrap CodeIgniter
define('FCPATH', __DIR__ . '/public' . DIRECTORY_SEPARATOR);
chdir(__DIR__);

require 'vendor/autoload.php';

// Load paths config
require 'app/Config/Paths.php';
$paths = new Config\Paths();

// Load framework bootstrap
require $paths->systemDirectory . '/Boot.php';

// Initialize without running
$app = Config\Services::codeigniter();
$app->initialize();
$app->setContext('web');

use App\Models\PayrollModel;

$model = new PayrollModel();
$model->select('payroll_records.*, employees.first_name, employees.last_name, employees.department_id as department, employees.employee_code');
$model->join('employees', 'employees.id = payroll_records.employee_id');
$data = $model->findAll();

echo "Total Records: " . count($data) . "\n";
foreach ($data as $record) {
    if ($record['first_name'] === 'Admin' && $record['last_name'] === 'User') {
        echo "ID: {$record['id']} | Month: {$record['month']} | Year: {$record['year']} | Created: {$record['created_at']}\n";
    }
}
