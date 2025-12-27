<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddCodeToShifts extends Migration
{
    public function up()
    {
        $this->forge->addColumn('shifts', [
            'code' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
                'null'       => true,
                'after'      => 'id',
            ],
        ]);
        // Ideally enforce unique, but if existing data is null, it's ok for now or fill it?
        // Since we will re-seed, we can assume we will fix data.
    }

    public function down()
    {
        $this->forge->dropColumn('shifts', 'code');
    }
}
