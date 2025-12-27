<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class ModifyDocumentStatusEnum extends Migration
{
    public function up()
    {
        $this->forge->modifyColumn('documents', [
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['Valid', 'Expiring Soon', 'Expired', 'Pending Verification', 'Verified', 'Rejected'],
                'default' => 'Pending Verification',
                'null' => true,
            ],
        ]);
    }

    public function down()
    {
        $this->forge->modifyColumn('documents', [
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['Valid', 'Expiring Soon', 'Expired', 'Pending Verification'],
                'default' => 'Valid',
                'null' => true,
            ],
        ]);
    }
}
