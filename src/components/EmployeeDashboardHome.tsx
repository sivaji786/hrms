import { useState, useEffect } from 'react';
import { Calendar, Clock, Award, BookOpen, CheckCircle, DollarSign, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import StatCard from './common/StatCard';
import { CurrencyIcon } from './common';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { dashboardService } from '../services/api';
import { toast } from 'sonner';

export default function EmployeeDashboardHome() {
  const { t } = useLanguage();
  const { formatCurrency, convertAmount } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getEmployeeStats();
      setData(response);
    } catch (error) {
      console.error('Error fetching employee dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getUserData = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const user = getUserData();

  const iconMap: any = {
    Calendar,
    Clock,
    Award,
    BookOpen,
    CheckCircle,
    DollarSign
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const welcomeName = data?.employee
    ? `${data.employee.firstName} ${data.employee.lastName}`.trim()
    : (user?.full_name || user?.first_name || user?.username || 'Guest');

  const stats = [
    {
      title: t('employee.myLeaveBalance'),
      value: data?.leave?.total?.toString() || '0',
      subtitle: t('employee.daysRemaining'),
      icon: Calendar,
      trend: { value: 0, isPositive: true },
    },
    {
      title: t('employee.thisMonthAttendance'),
      value: `${data?.attendance?.rate || '0'}%`,
      subtitle: t('employee.attendanceRate'),
      icon: Clock,
      trend: { value: 0, isPositive: true },
    },
    {
      title: t('employee.lastSalary'),
      value: formatCurrency(convertAmount(data?.payroll?.net || 0)),
      subtitle: t('employee.latestPayslip'),
      icon: CurrencyIcon,
      trend: { value: 0, isPositive: true },
    },
    {
      title: t('employee.pendingTasks'),
      value: (data?.leave?.pending || 0).toString(),
      subtitle: t('employee.itemsToReview'),
      icon: CheckCircle,
      trend: { value: 0, isPositive: false },
    },
  ];

  const recentActivities = data?.recentActivities || [];
  const upcomingEvents = data?.upcomingEvents || [];

  const quickStats = [
    { label: t('employee.totalWorkingDays'), value: '20', icon: Calendar },
    { label: t('employee.presentDays'), value: (data?.attendance?.rate ? Math.round(data.attendance.rate * 0.2) : 0).toString(), icon: CheckCircle },
    { label: t('employee.completedTrainings'), value: '0', icon: BookOpen },
    { label: t('employee.performanceScore'), value: 'N/A', icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl mb-2">{t('employee.welcomeBack')}, {welcomeName}! 👋</h2>
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
            {upcomingEvents.map((event: any) => (
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
                      {event.status || 'Scheduled'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {event.time || 'All Day'} • {event.type}
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
            {recentActivities.map((activity: any) => {
              const Icon = iconMap[activity.icon] || Clock;
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