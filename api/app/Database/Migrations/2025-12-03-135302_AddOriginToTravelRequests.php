<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddOriginToTravelRequests extends Migration
{
    public function up()
    {
        $fields = [
            'origin' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
                'after'      => 'employee_id',
            ],
        ];
        $this->forge->addColumn('travel_requests', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('travel_requests', 'origin');
    }
}
