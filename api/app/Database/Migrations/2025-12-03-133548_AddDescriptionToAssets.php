<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddDescriptionToAssets extends Migration
{
    public function up()
    {
        $this->forge->addColumn('assets', [
            'description' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'location_id'
            ]
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('assets', 'description');
    }
}
