<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddFieldsToTravelRequests extends Migration
{
    public function up()
    {
        $fields = [
            'trip_type' => [
                'type'       => 'ENUM',
                'constraint' => ['Domestic', 'International'],
                'default'    => 'Domestic',
                'after'      => 'purpose',
            ],
            'travel_mode' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => true,
                'after'      => 'trip_type',
            ],
            'actual_cost' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'null'       => true,
                'after'      => 'estimated_cost',
            ],
        ];
        $this->forge->addColumn('travel_requests', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('travel_requests', ['trip_type', 'travel_mode', 'actual_cost']);
    }
}
