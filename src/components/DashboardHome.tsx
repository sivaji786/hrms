import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Users, Clock, Calendar, TrendingUp, ArrowUpRight, MapPin, UserPlus, CheckCircle, UserX, Award, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatCard, CurrencyIcon } from './common';
import { useMemo, useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import toast from '../utils/toast';

// Initial state for stats
const initialStats = {
  totalEmployees: 0,
  presentToday: 0,
  onLeave: 0,
  monthlyPayroll: 0,
  presentPercentage: '0',
  leavePercentage: '0',
};

const initialAttendanceData = [
  { name: 'Mon', present: 0, absent: 0 },
  { name: 'Tue', present: 0, absent: 0 },
  { name: 'Wed', present: 0, absent: 0 },
  { name: 'Thu', present: 0, absent: 0 },
  { name: 'Fri', present: 0, absent: 0 },
];

const initialLeaveData = [
  { month: 'Jan', casual: 0, sick: 0, privilege: 0 },
  { month: 'Feb', casual: 0, sick: 0, privilege: 0 },
  { month: 'Mar', casual: 0, sick: 0, privilege: 0 },
  { month: 'Apr', casual: 0, sick: 0, privilege: 0 },
  { month: 'May', casual: 0, sick: 0, privilege: 0 },
  { month: 'Jun', casual: 0, sick: 0, privilege: 0 },
];

const iconMap: any = {
  Users,
  Calendar,
  UserX,
  Award,
  AlertCircle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  UserPlus,
  CheckCircle
};

export default function DashboardHome() {
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const { t } = useLanguage();
  const { formatCurrency, convertAmount } = useCurrency();

  const [stats, setStats] = useState(initialStats);
  const [attendanceData, setAttendanceData] = useState(initialAttendanceData);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [locationCounts, setLocationCounts] = useState<Record<string, number>>({});
  const [leaveData, setLeaveData] = useState(initialLeaveData);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedLocation]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats(selectedLocation);
      if (data) {
        setStats(data.stats);
        setLocationCounts(data.locationCounts || {});
        setDepartmentData(data.departmentData || []);
        if (data.attendanceData) setAttendanceData(data.attendanceData);
        if (data.leaveData) setLeaveData(data.leaveData);
        if (data.recentActivities) setRecentActivities(data.recentActivities);
        if (data.upcomingEvents) setUpcomingEvents(data.upcomingEvents);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { title: t('dashboard.totalEmployees'), value: stats.totalEmployees.toLocaleString(), change: '+12%', icon: Users, color: 'from-blue-500 to-blue-600' },
    { title: t('dashboard.presentToday'), value: stats.presentToday.toLocaleString(), change: `${stats.presentPercentage}%`, icon: Clock, color: 'from-green-500 to-green-600' },
    { title: t('dashboard.onLeave'), value: stats.onLeave.toString(), change: `${stats.leavePercentage}%`, icon: Calendar, color: 'from-orange-500 to-orange-600' },
    { title: t('dashboard.monthlyPayroll'), value: formatCurrency(convertAmount(stats.monthlyPayroll), { compact: true, decimals: 1 }), change: '+5%', icon: CurrencyIcon, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Location Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-medium text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-600 mt-1">{t('dashboard.welcome')}</p>
        </div>
        <div className="flex items-center gap-3 bg-white border rounded-lg px-4 py-2 shadow-sm">
          <MapPin className="w-5 h-5 text-gray-400" />
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-48 border-0 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Locations">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  {t('dashboard.allLocations')}
                </div>
              </SelectItem>
              {Object.keys(locationCounts)
                .filter(loc => loc !== 'All Locations')
                .map((location) => (
                  <SelectItem key={location} value={location}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      {location}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={Icon}
              iconColor={`text-${stat.color.split('-')[1]}-600`}
              trend={stat.change}
              variant="default"
            />
          );
        })}
      </div>

      {/* Location Badge */}
      {selectedLocation !== 'All Locations' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-900">
              {t('dashboard.showingStatsFor')} <span className="font-medium">{selectedLocation}</span> {t('dashboard.office')}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{t('dashboard.weeklyAttendance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#10b981" name={t('dashboard.present')} radius={[8, 8, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" name={t('dashboard.absent')} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{t('dashboard.departmentDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Leave Trends */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{t('dashboard.leaveTrends')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={leaveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="casual" stroke="#3b82f6" strokeWidth={2} name={t('dashboard.casualLeave')} />
              <Line type="monotone" dataKey="sick" stroke="#ef4444" strokeWidth={2} name={t('dashboard.sickLeave')} />
              <Line type="monotone" dataKey="privilege" stroke="#10b981" strokeWidth={2} name={t('dashboard.privilegeLeave')} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivities')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = iconMap[activity.icon] || Users;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-lg ${activity.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{activity.type}</p>
                      <p className="text-sm text-gray-600">{activity.employee} - {activity.department}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{t('dashboard.upcomingEvents')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{event.date}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}