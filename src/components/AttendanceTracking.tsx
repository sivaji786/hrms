import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Users, UserCheck, UserX, Clock, TrendingUp, Calendar as CalendarIcon, Search, Download, MapPin, Filter, Eye, CheckCircle, XCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Pagination } from './common';
import { todayAttendance, attendanceStats, departmentAttendanceData, monthlyTrendData, attendanceTrendData, generateMonthlyAttendance } from '../data/attendanceData';
import toast from '../utils/toast';
import { StatCard } from './common';
import { useLanguage } from '../contexts/LanguageContext';
import DataTable, { TableColumn } from './common/DataTable';
import { AvatarCell, IconTextCell } from './common/TableCells';
import AttendanceDetails from './attendance/AttendanceDetails';
import ManageTodayAttendance from './attendance/ManageTodayAttendance';
import ManagePastAttendance from './attendance/ManagePastAttendance';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const monthOptions = [
  { value: '2025-01', label: 'January 2025' },
  { value: '2024-12', label: 'December 2024' },
  { value: '2024-11', label: 'November 2024' },
  { value: '2024-10', label: 'October 2024' },
  { value: '2024-09', label: 'September 2024' },
];

const locations = [
  { value: 'all', label: 'All Locations' },
  { value: 'abuDhabi', label: 'Abu Dhabi' },
  { value: 'dubai', label: 'Dubai' },
  { value: 'sharjah', label: 'Sharjah' },
  { value: 'ajman', label: 'Ajman' },
  { value: 'rasAlKhaimah', label: 'Ras Al Khaimah' },
  { value: 'fujairah', label: 'Fujairah' },
  { value: 'ummAlQuwain', label: 'Umm Al Quwain' },
];

export default function AttendanceTracking() {
  const [activeTab, setActiveTab] = useState('today');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [monthlyAttendance, setMonthlyAttendance] = useState<any[]>([]);
  const [selectedAttendances, setSelectedAttendances] = useState<string[]>([]);
  const [showManageTodayAttendance, setShowManageTodayAttendance] = useState(false);
  const [showManagePastAttendance, setShowManagePastAttendance] = useState(false);
  const { t } = useLanguage();

  const itemsPerPage = 10;

  useEffect(() => {
    // Load attendance for the selected month
    const [year, month] = selectedMonth.split('-').map(Number);
    const attendance = generateMonthlyAttendance(month - 1, year);
    setMonthlyAttendance(attendance.filter(day => day !== null));
  }, [selectedMonth]);

  const filteredAttendance = todayAttendance.filter((record) =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
  const paginatedAttendance = filteredAttendance.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  // If showing manage today attendance page, render it
  if (showManageTodayAttendance) {
    return (
      <ManageTodayAttendance
        onBack={() => setShowManageTodayAttendance(false)}
      />
    );
  }

  // If showing manage past attendance page, render it
  if (showManagePastAttendance) {
    return (
      <ManagePastAttendance
        onBack={() => setShowManagePastAttendance(false)}
      />
    );
  }

  // If showing details page, render it
  if (isDetailsOpen && selectedEmployee) {
    return (
      <AttendanceDetails
        employee={selectedEmployee}
        onBack={() => setIsDetailsOpen(false)}
      />
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-700 border-green-200';
      case 'Late': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Absent': return 'bg-red-100 text-red-700 border-red-200';
      case 'Half Day': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present': return <CheckCircle className="w-4 h-4" />;
      case 'Late': return <Clock className="w-4 h-4" />;
      case 'Absent': return <XCircle className="w-4 h-4" />;
      case 'Half Day': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  // Handle checkbox selections
  const handleSelectAllAttendances = (checked: boolean) => {
    if (checked) {
      setSelectedAttendances(paginatedAttendance.map(a => a.id));
    } else {
      setSelectedAttendances([]);
    }
  };

  const handleSelectAttendance = (attId: string | number, checked: boolean) => {
    if (checked) {
      setSelectedAttendances([...selectedAttendances, attId as string]);
    } else {
      setSelectedAttendances(selectedAttendances.filter(id => id !== attId));
    }
  };

  const selectedAttendanceObjects = todayAttendance.filter(a =>
    selectedAttendances.includes(a.id)
  );

  // Attendance columns for DataTable
  const attendanceColumns: TableColumn[] = [
    {
      header: t('employees.employee'),
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <AvatarCell
          name={row.name}
          subtitle={row.id}
        />
      ),
    },
    {
      header: t('employees.department'),
      accessor: 'department',
      sortable: true,
    },
    {
      header: t('attendance.checkIn'),
      accessor: 'checkIn',
      sortable: true,
    },
    {
      header: t('attendance.checkOut'),
      accessor: 'checkOut',
      sortable: true,
      cell: (row) => row.checkOut || '-',
    },
    {
      header: t('attendance.workHours'),
      accessor: 'workHours',
      sortable: true,
    },
    {
      header: t('common.status'),
      accessor: 'status',
      sortable: true,
      cell: (row) => (
        <Badge variant="outline" className={getStatusColor(row.status)}>
          <span className="mr-1">{getStatusIcon(row.status)}</span>
          {row.status}
        </Badge>
      ),
    },
    {
      header: t('common.actions'),
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewDetails(row)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  // Calendar view helper
  const renderCalendar = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add day headers
    const headers = dayNames.map(day => (
      <div key={day} className="text-center py-2 text-xs text-gray-500 uppercase tracking-wider">
        {day}
      </div>
    ));

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayAttendance = monthlyAttendance.find(a => a.date === dateStr);
      const isToday = new Date().toDateString() === new Date(dateStr).toDateString();

      days.push(
        <div
          key={day}
          className={`p-2 border rounded-lg ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} hover:border-blue-400 transition-colors cursor-pointer`}
        >
          <div className="text-sm mb-1">{day}</div>
          {dayAttendance && (
            <div className="space-y-1">
              <div className="text-xs text-green-600">{dayAttendance.present}P</div>
              <div className="text-xs text-red-600">{dayAttendance.absent}A</div>
              {dayAttendance.late > 0 && <div className="text-xs text-yellow-600">{dayAttendance.late}L</div>}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {headers}
        {days}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowManageTodayAttendance(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Manage Today's Attendance
          </Button>
          <Button
            onClick={() => setShowManagePastAttendance(true)}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Manage Past Attendance
          </Button>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[180px]">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t('common.export')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('attendance.totalPresent')}
          value={attendanceStats.todayPresent.toString()}
          icon={Users}
          iconColor="text-green-600"
          trend={{ value: 2.5, isPositive: true }}
          variant="default"
        />
        <StatCard
          title={t('attendance.lateArrivals')}
          value={attendanceStats.todayLate.toString()}
          icon={Clock}
          iconColor="text-yellow-600"
          trend={{ value: 1.2, isPositive: false }}
          variant="default"
        />
        <StatCard
          title={t('attendance.absent')}
          value={attendanceStats.todayAbsent.toString()}
          icon={XCircle}
          iconColor="text-red-600"
          variant="default"
        />
        <StatCard
          title={t('attendance.attendanceRate')}
          value={`${attendanceStats.avgAttendanceRate}%`}
          icon={TrendingUp}
          iconColor="text-green-600"
          trend={{ value: 3.2, isPositive: true }}
          variant="default"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">
            <Clock className="w-4 h-4 mr-2" />
            {t('attendance.today')}
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {t('attendance.calendar')}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            {t('attendance.analytics')}
          </TabsTrigger>
        </TabsList>

        {/* Today's Attendance */}
        <TabsContent value="today" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('employees.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              {t('common.filter')}
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <DataTable
                columns={attendanceColumns}
                data={paginatedAttendance}
                selectable
                selectedRows={selectedAttendanceObjects}
                onSelectRow={handleSelectAttendance}
                onSelectAll={handleSelectAllAttendances}
                exportable
                sortable
                exportFileName="attendance"
                exportHeaders={['Employee ID', 'Name', 'Department', 'Check In', 'Check Out', 'Work Hours', 'Status']}
                headerStyle="gradient"
                cellPadding="relaxed"
                emptyMessage={t('attendance.noRecords')}
              />
            </CardContent>
          </Card>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="flex justify-between items-center">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[200px]">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Month
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              {renderCalendar()}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl mb-1">
                    {monthlyAttendance.reduce((sum, day) => sum + day.present, 0)}
                  </div>
                  <div className="text-sm text-gray-500">{t('attendance.totalPresent')}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl mb-1">
                    {monthlyAttendance.reduce((sum, day) => sum + day.absent, 0)}
                  </div>
                  <div className="text-sm text-gray-500">{t('attendance.totalAbsent')}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl mb-1">
                    {monthlyAttendance.reduce((sum, day) => sum + day.late, 0)}
                  </div>
                  <div className="text-sm text-gray-500">{t('attendance.totalLate')}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl mb-1">
                    {monthlyAttendance.reduce((sum, day) => sum + day.halfDay, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Half Days</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Department-wise Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#10b981" name="Present" />
                    <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Present', value: attendanceStats.todayPresent },
                        { name: 'Late', value: attendanceStats.todayLate },
                        { name: 'Absent', value: attendanceStats.todayAbsent },
                        { name: 'On Leave', value: attendanceStats.todayOnLeave },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Attendance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="attendance" stroke="#10b981" name="Attendance Rate %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div >
  );
}