import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { ArrowLeft, Search, Calendar, AlertCircle, Info, Clock, CheckCircle, UserX, CalendarClock, Users } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import DataTable from '../common/DataTable';
import { AvatarCell } from '../common/TableCells';
import StatCard from '../common/StatCard';
import toast from '../../utils/toast';
import { attendanceService } from '../../services/api';
import {
  calculateAttendanceFromPunches,
  AttendancePunch,
  AttendanceCalculation
} from '../../utils/attendanceCalculations';
import AttendancePunchView from './AttendancePunchView';

interface PastAttendanceRecord {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  location: string;
  date: string;
  punches: AttendancePunch[];
  calculation: AttendanceCalculation;
  attendanceId?: string; // ID of the attendance record in database
  manualOverride?: {
    status: 'On Leave' | 'Absent' | 'Weekend' | 'Holiday';
    notes?: string;
  };
}

interface ManagePastAttendanceProps {
  onBack: () => void;
}

export default function ManagePastAttendance({ onBack }: ManagePastAttendanceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to yesterday
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  });

  const [attendanceRecords, setAttendanceRecords] = useState<PastAttendanceRecord[]>([]);

  // Fetch attendance when date changes
  useEffect(() => {
    fetchAttendanceForDate(selectedDate);
  }, [selectedDate]);

  const fetchAttendanceForDate = async (dateStr: string) => {
    try {
      setLoading(true);
      const data = await attendanceService.getAttendanceByDate(dateStr);

      // Transform API data to component format
      const records = data.map((item: any) => {
        const employee = item.employee;
        const attendance = item.attendance;

        // For now, we'll use empty punches since the backend doesn't store punch data
        const punches: AttendancePunch[] = [];

        // If there's attendance data, create a punch record
        if (attendance) {
          if (attendance.check_in) {
            punches.push({
              id: `${attendance.id}-in`,
              time: attendance.check_in,
              type: 'in' as const,
              location: employee.location_id || 'Office',
            });
          }
          if (attendance.check_out) {
            punches.push({
              id: `${attendance.id}-out`,
              time: attendance.check_out,
              type: 'out' as const,
              location: employee.location_id || 'Office',
            });
          }
        }

        const calculation = calculateAttendanceFromPunches(punches);

        return {
          id: employee.id,
          name: `${employee.first_name} ${employee.last_name}`,
          email: employee.email,
          department: employee.department_id || 'N/A',
          role: employee.designation || 'N/A',
          location: employee.location_id || 'N/A',
          date: dateStr,
          punches,
          calculation,
          attendanceId: attendance?.id,
          manualOverride: attendance?.status === 'leave' ? { status: 'On Leave' as const } :
            attendance?.status === 'absent' ? { status: 'Absent' as const } : undefined,
        };
      });

      setAttendanceRecords(records);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(record =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [attendanceRecords, searchTerm]);

  const handleDateChange = (newDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (newDate >= today) {
      toast.error('Cannot select today or future dates', {
        description: 'Please select a past date to manage attendance',
      });
      return;
    }

    setSelectedDate(newDate);
    // fetchAttendanceForDate is triggered by useEffect
    setExpandedRowId(null);
  };

  const handlePunchesUpdate = async (recordId: string, newPunches: AttendancePunch[]) => {
    const record = attendanceRecords.find(r => r.id === recordId);
    if (!record) return;

    try {
      // Find first check-in and last check-out to sync with backend
      const firstIn = newPunches.find(p => p.type === 'in')?.time;
      const lastOut = [...newPunches].reverse().find(p => p.type === 'out')?.time;

      const calculation = calculateAttendanceFromPunches(newPunches);

      if (record.attendanceId) {
        await attendanceService.updateAttendance(record.attendanceId, {
          check_in: firstIn,
          check_out: lastOut,
          status: calculation.status.toLowerCase()
        });
      } else {
        await attendanceService.bulkUpsertAttendance([{
          employee_id: recordId,
          date: selectedDate,
          check_in: firstIn,
          check_out: lastOut,
          status: calculation.status.toLowerCase()
        }]);
      }

      const updatedRecords = attendanceRecords.map(r => {
        if (r.id === recordId) {
          return {
            ...r,
            punches: newPunches,
            calculation,
          };
        }
        return r;
      });

      setAttendanceRecords(updatedRecords);
      toast.success(`Attendance updated for ${record.name}`, {
        description: `Date: ${new Date(selectedDate).toLocaleDateString()}`,
      });
    } catch (error) {
      console.error('Error updating punches:', error);
      toast.error('Failed to update attendance');
    }
  };

  const handleManualOverride = async (recordId: string, status: 'On Leave' | 'Absent' | 'Weekend' | null) => {
    const record = attendanceRecords.find(r => r.id === recordId);
    if (!record) return;

    try {
      const apiStatus = status === 'On Leave' ? 'leave' : status === 'Absent' ? 'absent' : status === 'Weekend' ? 'weekend' : 'present';

      if (record.attendanceId) {
        // Update existing record
        await attendanceService.updateAttendance(record.attendanceId, { status: apiStatus });
      } else {
        // Create new record
        await attendanceService.bulkUpsertAttendance([{
          employee_id: recordId,
          date: selectedDate,
          status: apiStatus,
        }]);
      }

      const updatedRecords = attendanceRecords.map(r => {
        if (r.id === recordId) {
          if (status === null) {
            return {
              ...r,
              manualOverride: undefined,
            };
          }
          return {
            ...r,
            manualOverride: {
              status,
            },
          };
        }
        return r;
      });

      setAttendanceRecords(updatedRecords);
      toast.success(`Status updated for ${record.name}`, {
        description: status ? `Marked as ${status}` : 'Manual override removed',
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Failed to update attendance status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-700 border-green-200';
      case 'Late': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Absent': return 'bg-red-100 text-red-700 border-red-200';
      case 'Half Day': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'On Leave': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Weekend': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const summaryStats = useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;
    let halfDay = 0;
    let onLeave = 0;
    let weekend = 0;

    attendanceRecords.forEach(record => {
      if (record.manualOverride) {
        switch (record.manualOverride.status) {
          case 'On Leave': onLeave++; break;
          case 'Absent': absent++; break;
          case 'Weekend': weekend++; break;
        }
      } else {
        switch (record.calculation.status) {
          case 'Present': present++; break;
          case 'Late': late++; break;
          case 'Absent': absent++; break;
          case 'Half Day': halfDay++; break;
          case 'On Leave': onLeave++; break;
        }
      }
    });

    const total = attendanceRecords.length;
    return { present, late, absent, halfDay, onLeave, weekend, total };
  }, [attendanceRecords]);

  const columns = [
    {
      accessor: 'name',
      header: 'Employee',
      cell: (record: PastAttendanceRecord) => (
        <AvatarCell
          name={record.name}
          subtitle={record.id}
          fallbackColor="from-blue-500 to-blue-600"
        />
      ),
    },
    {
      accessor: 'department',
      header: 'Department',
      cell: (record: PastAttendanceRecord) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900">{record.department}</span>
          <span className="text-xs text-gray-500">{record.role}</span>
        </div>
      ),
    },
    {
      accessor: 'location',
      header: 'Location',
    },
    {
      accessor: 'status',
      header: 'Status',
      cell: (record: PastAttendanceRecord) => {
        const status = record.manualOverride?.status || record.calculation.status;
        return (
          <div className="space-y-1">
            <Badge className={getStatusColor(status)}>
              {status}
            </Badge>
            {record.manualOverride && (
              <p className="text-xs text-gray-500">Manual Override</p>
            )}
          </div>
        );
      },
    },
    {
      accessor: 'firstCheckIn',
      header: 'First Check-In',
      cell: (record: PastAttendanceRecord) => (
        <span className="text-sm">
          {record.manualOverride ? '-' : record.calculation.firstCheckIn}
        </span>
      ),
    },
    {
      accessor: 'lastCheckOut',
      header: 'Last Check-Out',
      cell: (record: PastAttendanceRecord) => (
        <span className="text-sm">
          {record.manualOverride ? '-' : record.calculation.lastCheckOut}
        </span>
      ),
    },
    {
      accessor: 'workHours',
      header: 'Work Hours',
      cell: (record: PastAttendanceRecord) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {record.manualOverride ? '0h 0m' : record.calculation.workHoursDisplay}
          </span>
          {!record.manualOverride && record.calculation.totalBreakMinutes > 0 && (
            <span className="text-xs text-gray-500">
              Break: {record.calculation.breakHoursDisplay}
            </span>
          )}
        </div>
      ),
    },
    {
      accessor: 'punches',
      header: 'Punches',
      cell: (record: PastAttendanceRecord) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {record.punches.length} {record.punches.length === 1 ? 'punch' : 'punches'}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpandedRowId(expandedRowId === record.id ? null : record.id)}
            className="h-6 text-xs px-2"
          >
            <Info className="h-3 w-3 mr-1" />
            {expandedRowId === record.id ? 'Hide' : 'View'}
          </Button>
        </div>
      ),
    },
    {
      accessor: 'actions',
      header: 'Actions',
      cell: (record: PastAttendanceRecord) => (
        <div className="flex items-center gap-2">
          {record.manualOverride ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleManualOverride(record.id, null)}
              className="h-8 text-xs"
            >
              Clear Override
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleManualOverride(record.id, 'On Leave')}
                className="h-8 text-xs"
              >
                Mark Leave
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleManualOverride(record.id, 'Absent')}
                className="h-8 text-xs"
              >
                Mark Absent
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const maxDate = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today.toISOString().split('T')[0];
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-2 -ml-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Attendance
          </Button>
          <div>
            <h1 className="text-3xl">Manage Past Attendance</h1>
            <Breadcrumbs
              items={[
                { label: 'Dashboard' },
                { label: 'Attendance' },
                { label: 'Past Attendance' },
              ]}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Select Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                max={maxDate}
                className="pl-10 w-56"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alert for Date Selection */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-amber-900 mb-1">
                Selected Date: {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <p className="text-sm text-amber-700">
                You can only modify attendance for past dates. To manage today's attendance, use the "Manage Today's Attendance" feature.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-1">Face Recognition Attendance System</h3>
              <p className="text-sm text-blue-700 mb-2">
                Historical attendance captured from face recognition devices showing all check-in and check-out punches.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                <div>• <strong>Work Hours:</strong> Total time excluding breaks</div>
                <div>• <strong>Break Time:</strong> Time between check-out and next check-in</div>
                <div>• <strong>Full Day:</strong> {'>='} 8 hours of work</div>
                <div>• <strong>Half Day:</strong> {'>='} 4 hours but {'<'} 8 hours</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        <StatCard
          title="Total"
          value={summaryStats.total}
          icon={Users}
          iconColor="text-blue-500"
          variant="default"
        />

        <StatCard
          title="Present"
          value={summaryStats.present}
          icon={CheckCircle}
          iconColor="text-green-500"
          variant="default"
        />

        <StatCard
          title="Late"
          value={summaryStats.late}
          icon={Clock}
          iconColor="text-yellow-500"
          variant="default"
        />

        <StatCard
          title="Absent"
          value={summaryStats.absent}
          icon={UserX}
          iconColor="text-red-500"
          variant="default"
        />

        <StatCard
          title="Half Day"
          value={summaryStats.halfDay}
          icon={CalendarClock}
          iconColor="text-blue-500"
          variant="default"
        />

        <StatCard
          title="On Leave"
          value={summaryStats.onLeave}
          icon={CalendarClock}
          iconColor="text-purple-500"
          variant="default"
        />

        <StatCard
          title="Weekend"
          value={summaryStats.weekend}
          icon={Calendar}
          iconColor="text-gray-500"
          variant="default"
        />
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Employee Attendance Records</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, ID, department, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div>
            {filteredRecords.map((record) => (
              <div key={record.id} className="border-b last:border-b-0">
                <DataTable
                  columns={columns}
                  data={[record]}
                  withCard={false}
                />
                {expandedRowId === record.id && (
                  <div className="px-6 py-4 bg-gray-50">
                    <AttendancePunchView
                      punches={record.punches}
                      onPunchesChange={(newPunches) => handlePunchesUpdate(record.id, newPunches)}
                      readonly={!!record.manualOverride}
                    />
                    {record.manualOverride && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                          <strong>Note:</strong> This employee has a manual override status.
                          Clear the override to edit punches.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
