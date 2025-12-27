<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class ModifyTravelRequestStatusEnum extends Migration
{
    public function up()
    {
        $fields = [
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'],
                'default' => 'Pending',
            ],
        ];
        $this->forge->modifyColumn('travel_requests', $fields);
    }

    public function down()
    {
        $fields = [
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['Pending', 'Approved', 'Rejected'],
                'default' => 'Pending',
            ],
        ];
        $this->forge->modifyColumn('travel_requests', $fields);
    }
}
