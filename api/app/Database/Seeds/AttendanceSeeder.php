<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    public function run()
    {
        // 1. Get all employees
        $employees = $this->db->table('employees')->select('id')->get()->getResultArray();

        if (empty($employees)) {
            echo "No employees found. Please seed employees first.\n";
            return;
        }

        $attendanceData = [];
        $startDate = new \DateTime('-60 days');
        $endDate = new \DateTime('now');
        $interval = new \DateInterval('P1D');
        $period = new \DatePeriod($startDate, $interval, $endDate);

        foreach ($employees as $employee) {
            foreach ($period as $date) {
                $dateStr = $date->format('Y-m-d');
                $dayOfWeek = $date->format('N'); // 1 (Mon) to 7 (Sun)

                // Skip if record already exists for this employee and date
                // (Optional check, but good for re-running)
                // For bulk insert performance, we might skip this check in code and rely on DB constraints or ignore
                // But since we use insertBatch, let's just generate data.

                $status = 'Absent';
                $checkIn = null;
                $checkOut = null;
                $totalHours = null;
                $lateMinutes = 0;
                $overtimeHours = 0;
                $notes = '';

                // Weekend logic (Saturday=6, Sunday=7)
                if ($dayOfWeek >= 6) {
                    $status = 'Weekend';
                    $notes = 'Weekend';
                } else {
                    // Weekday logic
                    $rand = rand(1, 100);

                    if ($rand <= 80) {
                        // Present (80%)
                        $status = 'Present';
                        
                        // Random check-in between 08:45 and 09:15
                        $checkInTime = strtotime($dateStr . ' 08:45:00') + rand(0, 1800); 
                        $checkIn = date('H:i:s', $checkInTime);

                        // Random check-out between 17:45 and 19:00
                        $checkOutTime = strtotime($dateStr . ' 17:45:00') + rand(0, 4500);
                        $checkOut = date('H:i:s', $checkOutTime);

                        // Calculate hours
                        $diff = $checkOutTime - $checkInTime;
                        $totalHours = round($diff / 3600, 2);

                        // Late calculation (if after 09:00)
                        $nineAm = strtotime($dateStr . ' 09:00:00');
                        if ($checkInTime > $nineAm) {
                            $lateMinutes = round(($checkInTime - $nineAm) / 60);
                            $notes = 'Slightly late';
                        } else {
                            $notes = 'On time';
                        }

                        // Overtime (if > 9 hours)
                        if ($totalHours > 9) {
                            $overtimeHours = $totalHours - 9;
                        }

                    } elseif ($rand <= 90) {
                        // Late (10%)
                        $status = 'Late';
                        
                        // Random check-in between 09:15 and 10:30
                        $checkInTime = strtotime($dateStr . ' 09:15:00') + rand(0, 4500);
                        $checkIn = date('H:i:s', $checkInTime);

                        // Random check-out between 18:00 and 19:00
                        $checkOutTime = strtotime($dateStr . ' 18:00:00') + rand(0, 3600);
                        $checkOut = date('H:i:s', $checkOutTime);

                        $diff = $checkOutTime - $checkInTime;
                        $totalHours = round($diff / 3600, 2);

                        $nineAm = strtotime($dateStr . ' 09:00:00');
                        $lateMinutes = round(($checkInTime - $nineAm) / 60);
                        $notes = 'Traffic/Delay';

                    } elseif ($rand <= 95) {
                        // Half Day (5%)
                        $status = 'Half Day';
                        $checkIn = '09:00:00';
                        $checkOut = '13:00:00';
                        $totalHours = 4.00;
                        $notes = 'Personal Appointment';
                    } else {
                        // Absent (5%)
                        $status = 'Absent';
                        $notes = 'Unplanned Leave';
                    }
                }

                // UUID generation for ID
                $uuid = $this->generateUuid();

                $attendanceData[] = [
                    'id'            => $uuid,
                    'employee_id'   => $employee['id'],
                    'date'          => $dateStr,
                    'status'        => $status,
                    'check_in'      => $checkIn,
                    'check_out'     => $checkOut,
                    'total_hours'   => $totalHours,
                    'late_minutes'  => $lateMinutes,
                    'overtime_hours'=> $overtimeHours,
                    'notes'         => $notes,
                    'created_at'    => date('Y-m-d H:i:s'),
                ];

                // Batch insert every 100 records to avoid memory issues
                if (count($attendanceData) >= 100) {
                    $this->db->table('attendance_records')->ignore(true)->insertBatch($attendanceData);
                    $attendanceData = [];
                }
            }
        }

        // Insert remaining records
        if (!empty($attendanceData)) {
            $this->db->table('attendance_records')->ignore(true)->insertBatch($attendanceData);
        }

        echo "Attendance data seeded successfully for the last 60 days.\n";
    }

    private function generateUuid()
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
