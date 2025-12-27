import StatCard from './common/StatCard';
import { Calendar, Clock, Award, BookOpen, CheckCircle, DollarSign } from 'lucide-react';
import { CurrencyIcon } from './common';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  getEmployeeDashboardStats,
  CURRENT_EMPLOYEE_ID
} from '../data/employeePortalData';

export default function EmployeeDashboardHome() {
  const { t } = useLanguage();
  const { formatCurrency, convertAmount } = useCurrency();

  // Get employee dashboard stats from shared data
  const dashboardStats = getEmployeeDashboardStats(CURRENT_EMPLOYEE_ID);

  const stats = [
    {
      title: t('employee.myLeaveBalance'),
      value: dashboardStats?.leave.total.toString() || '18',
      subtitle: t('employee.daysRemaining'),
      icon: Calendar,
      trend: { value: 2, isPositive: true },
    },
    {
      title: t('employee.thisMonthAttendance'),
      value: `${dashboardStats?.attendance.rate || '95'}%`,
      subtitle: t('employee.attendanceRate'),
      icon: Clock,
      trend: { value: 5, isPositive: true },
    },
    {
      title: t('employee.lastSalary'),
      value: formatCurrency(convertAmount(Math.round((dashboardStats?.payroll.net || 75850) / 15))),
      subtitle: t('employee.november2025'),
      icon: CurrencyIcon,
      trend: { value: 0, isPositive: true },
    },
    {
      title: t('employee.pendingTasks'),
      value: ((dashboardStats?.leave.pending || 0) + 3).toString(),
      subtitle: t('employee.itemsToReview'),
      icon: CheckCircle,
      trend: { value: 3, isPositive: false },
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Performance Review Meeting',
      date: '2025-11-20',
      time: '2:00 PM',
      type: 'Meeting',
      status: 'Scheduled',
    },
    {
      id: 2,
      title: 'Team Building Event',
      date: '2025-11-22',
      time: '10:00 AM',
      type: 'Event',
      status: 'Confirmed',
    },
    {
      id: 3,
      title: 'Training: Advanced Excel',
      date: '2025-11-25',
      time: '9:00 AM',
      type: 'Training',
      status: 'Enrolled',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Leave Request Approved',
      description: 'Your leave request for Dec 20-22 has been approved',
      time: '2 hours ago',
      icon: Calendar,
    },
    {
      id: 2,
      action: 'Payslip Generated',
      description: 'November 2025 payslip is now available',
      time: '1 day ago',
      icon: DollarSign,
    },
    {
      id: 3,
      action: 'Training Completed',
      description: 'You completed "Time Management Skills" training',
      time: '3 days ago',
      icon: BookOpen,
    },
    {
      id: 4,
      action: 'Performance Review Scheduled',
      description: 'Your quarterly review is scheduled for Nov 20',
      time: '5 days ago',
      icon: Award,
    },
  ];

  const quickStats = [
    { label: t('employee.totalWorkingDays'), value: '20', icon: Calendar },
    { label: t('employee.presentDays'), value: '19', icon: CheckCircle },
    { label: t('employee.completedTrainings'), value: '12', icon: BookOpen },
    { label: t('employee.performanceScore'), value: '4.5/5', icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl mb-2">{t('employee.welcomeBack')}, John Smith! 👋</h2>
        <p className="text-blue-100">{t('employee.dashboardDescription')}</p>
      </div>

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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="font-semibold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>{t('employee.upcomingEvents')}</CardTitle>
            <CardDescription>{t('employee.scheduledActivities')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
                  <p className="text-xs text-blue-600 font-medium">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </p>
                  <p className="text-lg font-semibold text-blue-600">
                    {new Date(event.date).getDate()}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {event.time} • {event.type}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>{t('employee.recentActivities')}</CardTitle>
            <CardDescription>{t('employee.latestUpdates')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{activity.action}</h4>
                    <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}