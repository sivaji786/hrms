<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class GratuitySeeder extends Seeder
{
    public function run()
    {
        $gratuityService = new \App\Services\GratuityService();
        
        echo "Starting gratuity initialization for existing employees...\n";
        
        // Calculate gratuity for all active employees
        $results = $gratuityService->calculateAllEmployeesGratuity('initial', null);
        
        echo "Gratuity initialization completed:\n";
        echo "Total employees: {$results['total']}\n";
        echo "Successfully processed: {$results['success']}\n";
        echo "Failed: {$results['failed']}\n";
        
        if (!empty($results['errors'])) {
            echo "\nErrors:\n";
            foreach ($results['errors'] as $error) {
                echo "- Employee {$error['employee_id']}: {$error['error']}\n";
            }
        }
    }
}
