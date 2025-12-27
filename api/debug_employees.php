<?php

// Load CodeIgniter
require __DIR__ . '/public/index.php';

use App\Models\EmployeeModel;

$model = new EmployeeModel();
$employees = $model->findAll();

echo "Total Employees: " . count($employees) . "\n";
foreach ($employees as $emp) {
    echo "ID: {$emp['id']} | Name: {$emp['first_name']} {$emp['last_name']} | Email: {$emp['email']}\n";
}
