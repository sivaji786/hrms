import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import { employeeService, attendanceService } from '../../services/api';
import EmployeeInfoCard from './EmployeeInfoCard';
import toast from '../../utils/toast';

interface EmployeeAttendanceProps {
  employeeId: string;
  onBack: () => void;
  onViewProfile: (id: string) => void;
  onEdit: (id: string) => void;
  onViewAttendance: (id: string) => void;
  onViewPayroll: (id: string) => void;
  onOffboard: (id: string) => void;
}

export default function EmployeeAttendance({
  employeeId,
  onBack,
  onViewProfile,
  onEdit,
  onViewAttendance,
  onViewPayroll,
  onOffboard
}: EmployeeAttendanceProps) {
  const [employee, setEmployee] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    fetchData();
  }, [employeeId, selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empData, attData] = await Promise.all([
        employeeService.getById(employeeId),
        attendanceService.getEmployeeAttendance(employeeId, selectedMonth, selectedYear)
      ]);
      setEmployee(empData);
      setAttendanceData(attData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'present':
        return 'bg-green-500';
      case 'absent':
        return 'bg-red-500';
      case 'leave':
        return 'bg-blue-500';
      case 'half day':
        return 'bg-orange-500';
      case 'weekend':
        return 'bg-gray-300';
      default:
        return 'bg-gray-200';
    }
  };

  const getStatusBgColor = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'present':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'absent':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'leave':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'half day':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      case 'weekend':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Employee not found</p>
        <Button onClick={onBack} className="mt-4">
          Back to Employee List
        </Button>
      </div>
    );
  }

  // Group attendance by weeks for calendar view
  const calendarWeeks: any[] = [];
  let currentWeek: any[] = [];

  // Get first day of month
  const firstDay = new Date(selectedYear, selectedMonth - 1, 1).getDay();

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }

  // Add all days of the month
  attendanceData.attendance.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      calendarWeeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  // Add remaining days to last week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    calendarWeeks.push(currentWeek);
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Employees', onClick: onBack },
          { label: employee.first_name + ' ' + employee.last_name, onClick: () => { } },
          { label: 'Attendance' },
        ]}
      />

      {/* Employee Info Card */}
      <EmployeeInfoCard
        employee={{
          id: employee.id,
          name: `${employee.first_name} ${employee.last_name}`,
          role: employee.designation || 'N/A',
          status: employee.status || 'Active',
          department: employee.department_name || employee.department_id || 'N/A',
          employeeCode: employee.employee_code,
        }}
        currentView="attendance"
        onViewProfile={onViewProfile}
        onEdit={onEdit}
        onViewAttendance={onViewAttendance}
        onViewPayroll={onViewPayroll}
        onOffboard={onOffboard}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-medium text-gray-900">{attendanceData.summary.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-medium text-gray-900">{attendanceData.summary.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Leave</p>
                <p className="text-2xl font-medium text-gray-900">{attendanceData.summary.leave}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Half Day</p>
                <p className="text-2xl font-medium text-gray-900">{attendanceData.summary.halfDay}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-blue-600">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-2xl font-medium text-blue-600">{attendanceData.summary.attendanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Attendance Calendar
            </CardTitle>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-gradient-to-r from-gray-100 to-gray-50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-4 text-center font-medium text-gray-700 border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            {calendarWeeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 border-t">
                {week.map((day: any, dayIndex: number) => (
                  <div
                    key={dayIndex}
                    className={`min-h-[120px] p-3 border-r last:border-r-0 ${day ? getStatusBgColor(day.status) : 'bg-gray-50'
                      } transition-all`}
                  >
                    {day && (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-medium text-gray-900">
                            {new Date(day.date).getDate()}
                          </span>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(day.status)}`} />
                        </div>
                        <div className="space-y-1">
                          <Badge
                            className={
                              day.status.toLowerCase() === 'present'
                                ? 'bg-green-100 text-green-700 text-xs'
                                : day.status.toLowerCase() === 'absent'
                                  ? 'bg-red-100 text-red-700 text-xs'
                                  : day.status.toLowerCase() === 'leave'
                                    ? 'bg-blue-100 text-blue-700 text-xs'
                                    : day.status.toLowerCase() === 'half day'
                                      ? 'bg-orange-100 text-orange-700 text-xs'
                                      : 'bg-gray-100 text-gray-700 text-xs'
                            }
                          >
                            {day.status.charAt(0).toUpperCase() + day.status.slice(1)}
                          </Badge>
                          {day.checkIn && (
                            <div className="text-xs text-gray-600 space-y-0.5 mt-2">
                              <div>In: {day.checkIn}</div>
                              <div>Out: {day.checkOut}</div>
                            </div>
                          )}
                          {day.leaveType && (
                            <div className="text-xs text-blue-600 mt-1">{day.leaveType}</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <span className="text-sm text-gray-700">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span className="text-sm text-gray-700">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-700">Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500" />
              <span className="text-sm text-gray-700">Half Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-300" />
              <span className="text-sm text-gray-700">Weekend</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}