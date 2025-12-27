<?php

require_once __DIR__ . '/app/Services/PayrollService.php';

use App\Services\PayrollService;

$service = new PayrollService();

echo "Verifying UAE Payroll Calculations...\n\n";

// Test Case 1: Gratuity (User Example)
// Basic: 10,000, 7 Years Service
$basicSalary = 10000;
$joiningDate = '2018-01-01';
$endDate = '2025-01-01'; // 7 years exactly

echo "Test Case 1: Gratuity (7 Years, 10k Basic)\n";
$result = $service->calculateGratuity($basicSalary, $joiningDate, $endDate);
echo "Expected: 55,000\n";
echo "Actual: " . $result['amount'] . "\n";
echo "Breakdown:\n";
foreach ($result['breakdown'] as $line) {
    echo "- $line\n";
}
echo "\n";

// Test Case 2: Leave Salary (User Example)
// Basic: 9,000, 15 Days
$basicSalary2 = 9000;
$leaveDays = 15;

echo "Test Case 2: Leave Salary (15 Days, 9k Basic)\n";
$leaveSalary = $service->calculateLeaveSalary($basicSalary2, $leaveDays);
echo "Expected: 4,500\n";
echo "Actual: " . $leaveSalary . "\n";
echo "\n";

// Test Case 3: Gratuity Cap
// Basic: 10,000, 30 Years Service (Should be capped at 24 months = 240,000)
$joiningDate3 = '1995-01-01';
$endDate3 = '2025-01-01';

echo "Test Case 3: Gratuity Cap (30 Years, 10k Basic)\n";
$result3 = $service->calculateGratuity($basicSalary, $joiningDate3, $endDate3);
echo "Expected: 240,000\n";
echo "Actual: " . $result3['amount'] . "\n";
echo "Breakdown:\n";
foreach ($result3['breakdown'] as $line) {
    echo "- $line\n";
}
