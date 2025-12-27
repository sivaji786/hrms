import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import StatCard from './common/StatCard';

export default function MyAttendance() {
  const { t } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());

  const stats = [
    {
      title: t('employee.presentDays'),
      value: '19',
      subtitle: t('employee.thisMonth'),
      icon: CheckCircle,
      trend: { value: 5, isPositive: true },
    },
    {
      title: t('employee.absentDays'),
      value: '1',
      subtitle: t('employee.thisMonth'),
      icon: XCircle,
      trend: { value: 0, isPositive: true },
    },
    {
      title: t('employee.lateDays'),
      value: '2',
      subtitle: t('employee.thisMonth'),
      icon: AlertCircle,
      trend: { value: 1, isPositive: false },
    },
    {
      title: t('employee.attendanceRate'),
      value: '95%',
      subtitle: t('employee.thisMonth'),
      icon: Clock,
      trend: { value: 3, isPositive: true },
    },
  ];

  const attendanceRecords = [
    {
      date: '2025-11-15',
      checkIn: '08:55 AM',
      checkOut: '05:10 PM',
      workHours: '8h 15m',
      status: 'Present',
    },
    {
      date: '2025-11-14',
      checkIn: '09:15 AM',
      checkOut: '05:05 PM',
      workHours: '7h 50m',
      status: 'Late',
    },
    {
      date: '2025-11-13',
      checkIn: '08:50 AM',
      checkOut: '05:00 PM',
      workHours: '8h 10m',
      status: 'Present',
    },
    {
      date: '2025-11-12',
      checkIn: '09:00 AM',
      checkOut: '05:00 PM',
      workHours: '8h 0m',
      status: 'Present',
    },
    {
      date: '2025-11-11',
      checkIn: '-',
      checkOut: '-',
      workHours: '-',
      status: 'Absent',
    },
    {
      date: '2025-11-08',
      checkIn: '08:58 AM',
      checkOut: '05:02 PM',
      workHours: '8h 4m',
      status: 'Present',
    },
    {
      date: '2025-11-07',
      checkIn: '09:10 AM',
      checkOut: '05:00 PM',
      workHours: '7h 50m',
      status: 'Late',
    },
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{t('employee.present')}</Badge>;
      case 'Absent':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{t('employee.absent')}</Badge>;
      case 'Late':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">{t('employee.late')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            trend={stat.trend}
            variant="default"
          />
        ))}
      </div>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('employee.attendanceHistory')}</CardTitle>
              <CardDescription>{t('employee.detailedAttendanceRecords')}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month} {selectedYear}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('common.date')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('employee.checkIn')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('employee.checkOut')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('employee.workHours')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('common.status')}</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{record.checkIn}</td>
                    <td className="py-3 px-4">{record.checkOut}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{record.workHours}</span>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Today's Attendance Card */}
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader>
          <CardTitle>{t('employee.todayAttendance')}</CardTitle>
          <CardDescription>{new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('employee.checkIn')}</p>
              <p className="text-2xl font-semibold text-green-600">08:55 AM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('employee.checkOut')}</p>
              <p className="text-2xl font-semibold text-blue-600">-</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('employee.workHours')}</p>
              <p className="text-2xl font-semibold">7h 22m</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('common.status')}</p>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                {t('employee.present')}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}