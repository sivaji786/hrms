<?php

namespace App\Services;

class PayrollService
{
    /**
     * Calculate End of Service Gratuity (UAE Labor Law 2025)
     * 
     * Rules:
     * - First 5 years: 21 days basic salary per year
     * - > 5 years: 30 days basic salary per additional year
     * - Cap: Total gratuity cannot exceed 2 years' basic salary
     * 
     * @param float $basicSalary Monthly basic salary
     * @param string $joiningDate Date of joining (Y-m-d)
     * @param string $endDate End date (Y-m-d) - defaults to today if null
     * @return array Calculation details
     */
    public function calculateGratuity(float $basicSalary, string $joiningDate, ?string $endDate = null): array
    {
        $start = new \DateTime($joiningDate);
        $end = new \DateTime($endDate ?? 'now');
        
        // Calculate total years of service (including fractions)
        $diff = $start->diff($end);
        $yearsOfService = $diff->y + ($diff->m / 12) + ($diff->d / 365);
        
        // Daily basic wage
        $dailyWage = $basicSalary / 30;
        
        $gratuityAmount = 0;
        $breakdown = [];
        
        if ($yearsOfService < 1) {
            // Usually no gratuity for less than 1 year, but let's return 0 with reason
            return [
                'amount' => 0,
                'yearsOfService' => round($yearsOfService, 2),
                'breakdown' => ['Less than 1 year service']
            ];
        }

        // First 5 years calculation
        $firstFiveYears = min($yearsOfService, 5);
        $firstFiveAmount = $firstFiveYears * 21 * $dailyWage;
        $gratuityAmount += $firstFiveAmount;
        $breakdown[] = "First 5 years ({$firstFiveYears} years): " . number_format($firstFiveAmount, 2);

        // Subsequent years calculation
        if ($yearsOfService > 5) {
            $additionalYears = $yearsOfService - 5;
            $additionalAmount = $additionalYears * 30 * $dailyWage;
            $gratuityAmount += $additionalAmount;
            $breakdown[] = "Additional years ({$additionalYears} years): " . number_format($additionalAmount, 2);
        }

        // Cap check (Max 2 years basic salary = 24 months)
        $maxGratuity = $basicSalary * 24;
        if ($gratuityAmount > $maxGratuity) {
            $breakdown[] = "Capped at 2 years basic salary: " . number_format($maxGratuity, 2) . " (Calculated: " . number_format($gratuityAmount, 2) . ")";
            $gratuityAmount = $maxGratuity;
        }

        return [
            'amount' => round($gratuityAmount, 2),
            'yearsOfService' => round($yearsOfService, 2),
            'dailyWage' => round($dailyWage, 2),
            'breakdown' => $breakdown
        ];
    }

    /**
     * Calculate Leave Salary
     * 
     * Formula: (Basic Salary / 30) * Unused Leave Days
     * 
     * @param float $basicSalary Monthly basic salary
     * @param float $leaveDays Number of unused leave days
     * @return float Calculated leave salary
     */
    public function calculateLeaveSalary(float $basicSalary, float $leaveDays): float
    {
        $dailyWage = $basicSalary / 30;
        return round($dailyWage * $leaveDays, 2);
    }
}
