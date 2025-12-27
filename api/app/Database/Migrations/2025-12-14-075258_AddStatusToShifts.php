<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddStatusToShifts extends Migration
{
    public function up()
    {
        $this->forge->addColumn('shifts', [
            'status' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
                'default'    => 'Active',
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('shifts', 'status');
    }
}
