<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddUpdatedAtToDocuments extends Migration
{
    public function up()
    {
        $this->forge->addColumn('documents', [
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
                'default' => null,
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('documents', 'updated_at');
    }
}
