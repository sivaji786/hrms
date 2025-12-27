// Utility functions for attendance calculations with face recognition device data

export interface AttendancePunch {
  id?: string;
  time: string; // Format: "HH:MM AM/PM"
  type: 'in' | 'out';
  location?: string;
}

export interface AttendanceCalculation {
  firstCheckIn: string;
  lastCheckOut: string;
  totalAttendingMinutes: number;
  totalBreakMinutes: number;
  workHoursDisplay: string;
  breakHoursDisplay: string;
  status: 'Present' | 'Half Day' | 'Absent' | 'Late' | 'On Leave';
}

// Configuration for attendance rules (can be customized per organization)
export const ATTENDANCE_CONFIG = {
  fullDayMinutes: 8 * 60, // 8 hours
  halfDayMinutes: 4 * 60, // 4 hours
  lateThresholdMinutes: 30, // 30 minutes after shift start
  shiftStartTime: '09:00',
  breakDeductionMinutes: 60, // 1 hour lunch break to deduct
};

/**
 * Parse time string to minutes from midnight
 * Supports "HH:MM" (24h) and "HH:MM AM/PM" (12h)
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr || timeStr === '-') return 0;

  try {
    // Check if it has AM/PM
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      const [time, period] = timeStr.trim().split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      return hours * 60 + minutes;
    }

    // Assume 24h format "HH:MM" or "HH:MM:SS"
    const [hours, minutes] = timeStr.trim().split(':').map(Number);
    return hours * 60 + minutes;
  } catch (error) {
    console.error('Error parsing time:', timeStr, error);
    return 0;
  }
}

/**
 * Convert minutes to time string (24-hour format)
 */
export function minutesToTimeString(minutes: number): string {
  if (minutes === 0) return '-';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Convert minutes to readable hour/minute format
 */
export function minutesToHourDisplay(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

/**
 * Calculate attendance details from multiple punches
 */
export function calculateAttendanceFromPunches(
  punches: AttendancePunch[]
): AttendanceCalculation {
  // Default values for no attendance
  const defaultResult: AttendanceCalculation = {
    firstCheckIn: '-',
    lastCheckOut: '-',
    totalAttendingMinutes: 0,
    totalBreakMinutes: 0,
    workHoursDisplay: '0h 0m',
    breakHoursDisplay: '0h 0m',
    status: 'Absent',
  };

  if (!punches || punches.length === 0) {
    return defaultResult;
  }

  // Sort punches by time
  const sortedPunches = [...punches].sort(
    (a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
  );

  // Find first check-in and last check-out
  const checkIns = sortedPunches.filter(p => p.type === 'in');
  const checkOuts = sortedPunches.filter(p => p.type === 'out');

  if (checkIns.length === 0) {
    return defaultResult;
  }

  const firstCheckIn = checkIns[0].time;
  const lastCheckOut = checkOuts.length > 0 ? checkOuts[checkOuts.length - 1].time : '-';

  // Calculate total attending time and break time
  let totalAttendingMinutes = 0;
  let totalBreakMinutes = 0;

  // Process pairs of check-in and check-out
  for (let i = 0; i < checkIns.length; i++) {
    const checkInTime = parseTimeToMinutes(checkIns[i].time);

    // Find corresponding check-out
    const checkOut = checkOuts.find(
      co => parseTimeToMinutes(co.time) > checkInTime &&
        (i === checkIns.length - 1 || parseTimeToMinutes(co.time) <= parseTimeToMinutes(checkIns[i + 1].time))
    );

    if (checkOut) {
      const checkOutTime = parseTimeToMinutes(checkOut.time);
      const sessionMinutes = checkOutTime - checkInTime;
      totalAttendingMinutes += sessionMinutes;

      // Calculate break time (gap until next check-in)
      if (i < checkIns.length - 1) {
        const nextCheckInTime = parseTimeToMinutes(checkIns[i + 1].time);
        const breakMinutes = nextCheckInTime - checkOutTime;
        if (breakMinutes > 0) {
          totalBreakMinutes += breakMinutes;
        }
      }
    } else if (i === checkIns.length - 1) {
      // Last check-in without check-out - calculate till current time or end of shift
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const sessionMinutes = currentMinutes - checkInTime;
      if (sessionMinutes > 0) {
        totalAttendingMinutes += sessionMinutes;
      }
    }
  }

  // Determine status based on total attending time and first check-in time
  let status: AttendanceCalculation['status'] = 'Absent';

  const shiftStartMinutes = parseTimeToMinutes(ATTENDANCE_CONFIG.shiftStartTime);
  const firstCheckInMinutes = parseTimeToMinutes(firstCheckIn);
  const isLate = firstCheckInMinutes > shiftStartMinutes + ATTENDANCE_CONFIG.lateThresholdMinutes;

  if (totalAttendingMinutes >= ATTENDANCE_CONFIG.fullDayMinutes) {
    status = isLate ? 'Late' : 'Present';
  } else if (totalAttendingMinutes >= ATTENDANCE_CONFIG.halfDayMinutes) {
    status = 'Half Day';
  } else if (totalAttendingMinutes > 0) {
    status = 'Half Day'; // Less than half day but some attendance
  }

  return {
    firstCheckIn: firstCheckIn === '-' ? '-' : minutesToTimeString(parseTimeToMinutes(firstCheckIn)),
    lastCheckOut: lastCheckOut === '-' ? '-' : minutesToTimeString(parseTimeToMinutes(lastCheckOut)),
    totalAttendingMinutes,
    totalBreakMinutes,
    workHoursDisplay: minutesToHourDisplay(totalAttendingMinutes),
    breakHoursDisplay: minutesToHourDisplay(totalBreakMinutes),
    status,
  };
}

/**
 * Generate realistic punch data for testing
 */
export function generateMockPunches(
  scenario: 'full-day' | 'half-day' | 'late' | 'multiple-breaks' | 'early-exit' | 'absent' = 'full-day'
): AttendancePunch[] {
  switch (scenario) {
    case 'full-day':
      return [
        { time: '09:05', type: 'in' },
        { time: '13:00', type: 'out' },
        { time: '14:00', type: 'in' },
        { time: '18:15', type: 'out' },
      ];

    case 'half-day':
      return [
        { time: '09:00', type: 'in' },
        { time: '13:00', type: 'out' },
      ];

    case 'late':
      return [
        { time: '10:30', type: 'in' },
        { time: '13:00', type: 'out' },
        { time: '14:00', type: 'in' },
        { time: '18:30', type: 'out' },
      ];

    case 'multiple-breaks':
      return [
        { time: '09:00', type: 'in' },
        { time: '10:30', type: 'out' },
        { time: '10:45', type: 'in' },
        { time: '13:00', type: 'out' },
        { time: '14:00', type: 'in' },
        { time: '16:00', type: 'out' },
        { time: '16:15', type: 'in' },
        { time: '18:00', type: 'out' },
      ];

    case 'early-exit':
      return [
        { time: '09:00', type: 'in' },
        { time: '14:00', type: 'out' },
      ];

    case 'absent':
    default:
      return [];
  }
}

/**
 * Calculate work hours between two times
 */
export function calculateWorkHoursBetweenTimes(checkIn: string, checkOut: string): string {
  if (checkIn === '-' || checkOut === '-') return '0h 0m';

  const checkInMinutes = parseTimeToMinutes(checkIn);
  const checkOutMinutes = parseTimeToMinutes(checkOut);

  let diffMinutes = checkOutMinutes - checkInMinutes;
  if (diffMinutes < 0) diffMinutes += 24 * 60; // Handle next day

  return minutesToHourDisplay(diffMinutes);
}
