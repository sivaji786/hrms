<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class HolidaySeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'id' => 'HOL001',
                'name' => 'New Year\'s Day',
                'date' => '2025-01-01',
                'day' => 'Wednesday',
                'type' => 'National Holiday',
                'location' => 'All Locations',
                'description' => 'Celebration of the New Year',
                'is_optional' => 0,
            ],
            [
                'id' => 'HOL002',
                'name' => 'Eid al-Fitr',
                'date' => '2025-03-31',
                'day' => 'Monday',
                'type' => 'National Holiday',
                'location' => 'All Locations',
                'description' => 'End of Ramadan celebration',
                'is_optional' => 0,
            ],
            [
                'id' => 'HOL003',
                'name' => 'Eid al-Fitr (Day 2)',
                'date' => '2025-04-01',
                'day' => 'Tuesday',
                'type' => 'National Holiday',
                'location' => 'All Locations',
                'description' => 'Second day of Eid al-Fitr',
                'is_optional' => 0,
            ],
            [
                'id' => 'HOL004',
                'name' => 'Eid al-Adha',
                'date' => '2025-06-06',
                'day' => 'Friday',
                'type' => 'National Holiday',
                'location' => 'All Locations',
                'description' => 'Festival of Sacrifice',
                'is_optional' => 0,
            ],
            [
                'id' => 'HOL005',
                'name' => 'Islamic New Year',
                'date' => '2025-06-27',
                'day' => 'Friday',
                'type' => 'National Holiday',
                'location' => 'All Locations',
                'description' => 'Beginning of the Islamic calendar',
                'is_optional' => 0,
            ],
            [
                'id' => 'HOL006',
                'name' => 'Prophet\'s Birthday',
                'date' => '2025-09-05',
                'day' => 'Friday',
                'type' => 'National Holiday',
                'location' => 'All Locations',
                'description' => 'Birth of Prophet Muhammad (PBUH)',
                'is_optional' => 0,
            ],
            [
                'id' => 'HOL007',
                'name' => 'Commemoration Day',
                'date' => '2025-11-30',
                'day' => 'Sunday',
                'type' => 'National Holiday',
                'location' => 'All Locations',
                'description' => 'Honoring the martyrs',
                'is_optional' => 0,
            ],
            [
                'id' => 'HOL008',
                'name' => 'National Day',
                'date' => '2025-12-02',
                'day' => 'Tuesday',
                'type' => 'National Holiday',
                'location' => 'All Locations',
                'description' => 'UAE National Day',
                'is_optional' => 0,
            ],
            [
                'id' => 'HOL009',
                'name' => 'Diwali',
                'date' => '2025-10-20',
                'day' => 'Monday',
                'type' => 'Optional Holiday',
                'location' => 'All Locations',
                'description' => 'Festival of Lights',
                'is_optional' => 1,
            ],
            [
                'id' => 'HOL010',
                'name' => 'Christmas',
                'date' => '2025-12-25',
                'day' => 'Thursday',
                'type' => 'Optional Holiday',
                'location' => 'All Locations',
                'description' => 'Christian holiday',
                'is_optional' => 1,
            ],
            [
                'id' => 'HOL011',
                'name' => 'Easter Sunday',
                'date' => '2025-04-20',
                'day' => 'Sunday',
                'type' => 'Optional Holiday',
                'location' => 'All Locations',
                'description' => 'Christian holiday',
                'is_optional' => 1,
            ],
            [
                'id' => 'HOL012',
                'name' => 'Sharjah Census Day',
                'date' => '2025-10-15',
                'day' => 'Wednesday',
                'type' => 'Regional Holiday',
                'location' => 'Sharjah',
                'description' => 'Census day in Sharjah',
                'is_optional' => 0,
            ],
            [
                'id' => 'HOL013',
                'name' => 'Dubai Expo Anniversary',
                'date' => '2025-10-01',
                'day' => 'Wednesday',
                'type' => 'Regional Holiday',
                'location' => 'Dubai',
                'description' => 'Anniversary of Expo 2020',
                'is_optional' => 0,
            ],
        ];

        $db = \Config\Database::connect();
        $builder = $db->table('holidays');

        // Clear existing data to avoid duplicates if re-seeding
        // $builder->truncate(); 

        foreach ($data as $holiday) {
            $existing = $builder->where('id', $holiday['id'])->get()->getRow();
            if (!$existing) {
                // Add timestamps
                $holiday['created_at'] = date('Y-m-d H:i:s');
                $holiday['updated_at'] = date('Y-m-d H:i:s');
                $builder->insert($holiday);
            }
        }
    }
}
