<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateHolidaysTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
            ],
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
            ],
            'date' => [
                'type' => 'DATE',
            ],
            'day' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => true,
            ],
            'type' => [
                'type' => 'VARCHAR',
                'constraint' => 50, // National Holiday, Regional Holiday, Optional Holiday
            ],
            'location' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'default' => 'All Locations',
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'is_optional' => [
                'type' => 'BOOLEAN',
                'default' => false,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('holidays');
    }

    public function down()
    {
        $this->forge->dropTable('holidays');
    }
}
