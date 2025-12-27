<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddProfileImageToEmployees extends Migration
{
    public function up()
    {
        $this->forge->addColumn('employees', [
            'profile_image' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
                'after'      => 'location'
            ]
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('employees', 'profile_image');
    }
}
