import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { 
  Bell, 
  Check, 
  X, 
  Search, 
  Filter, 
  Settings, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  Info, 
  XCircle, 
  Clock, 
  Calendar, 
  DollarSign, 
  Users, 
  Award, 
  Briefcase, 
  Package, 
  Receipt, 
  FileText, 
  MessageSquare, 
  Megaphone, 
  CheckCheck, 
  Archive, 
  Trash2,
  Download 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import toast from '../utils/toast';
import { 
  notifications as initialNotifications, 
  defaultNotificationPreferences,
  notificationStats,
  type Notification,
  type NotificationPreferences 
} from '../data/notificationData';
import { DataTable, TableColumn, StatCard } from './common';
import { Pagination } from './common';

export default function Notifications() {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationList, setNotificationList] = useState(initialNotifications);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences);
  const [activeTab, setActiveTab] = useState('all');
  const itemsPerPage = 10;

  // Filter notifications
  const filteredNotifications = notificationList.filter((notification) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'unread' && !notification.isRead) ||
                         (statusFilter === 'read' && notification.isRead) ||
                         (statusFilter === 'archived' && notification.isArchived);
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);

  const getNotificationIcon = (type: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      'System': <Settings className="w-5 h-5" />,
      'Leave': <Calendar className="w-5 h-5" />,
      'Payroll': <DollarSign className="w-5 h-5" />,
      'Attendance': <Clock className="w-5 h-5" />,
      'Performance': <Award className="w-5 h-5" />,
      'Recruitment': <Users className="w-5 h-5" />,
      'Training': <Briefcase className="w-5 h-5" />,
      'Asset': <Package className="w-5 h-5" />,
      'Expense': <Receipt className="w-5 h-5" />,
      'Document': <FileText className="w-5 h-5" />,
      'Ticket': <MessageSquare className="w-5 h-5" />,
      'Announcement': <Megaphone className="w-5 h-5" />,
    };
    return iconMap[type] || <Bell className="w-5 h-5" />;
  };

  const getNotificationColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      'System': 'bg-gray-100 text-gray-700 border-gray-200',
      'Leave': 'bg-blue-100 text-blue-700 border-blue-200',
      'Payroll': 'bg-green-100 text-green-700 border-green-200',
      'Attendance': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Performance': 'bg-purple-100 text-purple-700 border-purple-200',
      'Recruitment': 'bg-pink-100 text-pink-700 border-pink-200',
      'Training': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Asset': 'bg-orange-100 text-orange-700 border-orange-200',
      'Expense': 'bg-red-100 text-red-700 border-red-200',
      'Document': 'bg-teal-100 text-teal-700 border-teal-200',
      'Ticket': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'Announcement': 'bg-violet-100 text-violet-700 border-violet-200',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('notifications.just_now');
    if (diffInMinutes < 60) return t('notifications.minutes_ago', { count: diffInMinutes });
    if (diffInMinutes < 1440) return t('notifications.hours_ago', { count: Math.floor(diffInMinutes / 60) });
    if (diffInMinutes < 10080) return t('notifications.days_ago', { count: Math.floor(diffInMinutes / 1440) });
    return t('notifications.weeks_ago', { count: Math.floor(diffInMinutes / 10080) });
  };

  const handleMarkAsRead = (id: string) => {
    setNotificationList(notificationList.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllRead = () => {
    setNotificationList(notificationList.map(n => ({ ...n, isRead: true })));
    toast.success(t('notifications.markAllReadSuccess'));
  };

  const handleDelete = (id: string) => {
    setNotificationList(notificationList.filter(n => n.id !== id));
    toast.success(t('notifications.deleteSuccess'));
  };

  const handleArchive = (id: string) => {
    setNotificationList(notificationList.map(n => 
      n.id === id ? { ...n, isArchived: true } : n
    ));
    toast.success(t('notifications.archiveSuccess'));
  };

  const handleExport = () => {
    toast.info('Exporting Notifications', 'Notifications will be downloaded as CSV file.');
  };

  const handleSaveSettings = () => {
    toast.success(t('notifications.settingsSaved'));
    setShowSettings(false);
  };

  // Define table columns
  const tableColumns: TableColumn[] = [
    {
      header: t('notifications.notification'),
      cell: (notification: Notification) => (
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.isRead ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'}`}>
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className={`${notification.isRead ? 'text-gray-900' : 'text-gray-900 font-medium'} truncate`}>
                {notification.title}
              </p>
              {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
            {notification.sender && (
              <p className="text-xs text-gray-500 mt-1">From: {notification.sender}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: t('notifications.type'),
      cell: (notification: Notification) => (
        <Badge className={getNotificationColor(notification.type)}>
          {t(`notifications.${notification.type.toLowerCase()}`)}
        </Badge>
      ),
    },
    {
      header: t('notifications.priority'),
      cell: (notification: Notification) => (
        <Badge className={getPriorityColor(notification.priority)}>
          {t(`notifications.${notification.priority.toLowerCase()}`)}
        </Badge>
      ),
    },
    {
      header: t('notifications.time'),
      cell: (notification: Notification) => (
        <div className="text-sm">
          <p className="text-gray-900">{getTimeAgo(notification.timestamp)}</p>
          <p className="text-xs text-gray-500">{new Date(notification.timestamp).toLocaleString()}</p>
        </div>
      ),
    },
    {
      header: t('notifications.status'),
      cell: (notification: Notification) => (
        <Badge variant="outline" className={notification.isRead ? 'bg-gray-50' : 'bg-blue-50 text-blue-700'}>
          {notification.isRead ? t('notifications.read') : t('notifications.unread')}
        </Badge>
      ),
    },
    {
      header: t('notifications.actions'),
      cell: (notification: Notification) => (
        <div className="flex gap-2">
          {!notification.isRead && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleArchive(notification.id)}
          >
            <Archive className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDelete(notification.id)}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Settings View
  if (showSettings) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-900">{t('notifications.notificationSettings')}</h2>
            <p className="text-gray-600 mt-1">{t('notifications.preferencesSubtitle')}</p>
          </div>
          <Button variant="outline" onClick={() => setShowSettings(false)}>
            {t('notifications.cancelSettings')}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Channels */}
          <Card>
            <CardHeader>
              <CardTitle>{t('notifications.notificationChannels')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('notifications.emailNotifications')}</Label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('notifications.pushNotifications')}</Label>
                  <p className="text-sm text-gray-600">Receive push notifications</p>
                </div>
                <Switch 
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) => setPreferences({...preferences, pushNotifications: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('notifications.smsNotifications')}</Label>
                  <p className="text-sm text-gray-600">Receive SMS notifications</p>
                </div>
                <Switch 
                  checked={preferences.smsNotifications}
                  onCheckedChange={(checked) => setPreferences({...preferences, smsNotifications: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('notifications.inAppNotifications')}</Label>
                  <p className="text-sm text-gray-600">Receive in-app notifications</p>
                </div>
                <Switch 
                  checked={preferences.inAppNotifications}
                  onCheckedChange={(checked) => setPreferences({...preferences, inAppNotifications: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Frequency */}
          <Card>
            <CardHeader>
              <CardTitle>{t('notifications.emailFrequency')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={preferences.emailFrequency} onValueChange={(value: any) => setPreferences({...preferences, emailFrequency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">{t('notifications.instant')}</SelectItem>
                  <SelectItem value="daily">{t('notifications.daily')}</SelectItem>
                  <SelectItem value="weekly">{t('notifications.weekly')}</SelectItem>
                  <SelectItem value="never">{t('notifications.never')}</SelectItem>
                </SelectContent>
              </Select>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label>{t('notifications.enableQuietHours')}</Label>
                    <p className="text-sm text-gray-600">{t('notifications.quietHoursDesc')}</p>
                  </div>
                  <Switch 
                    checked={preferences.quietHoursEnabled}
                    onCheckedChange={(checked) => setPreferences({...preferences, quietHoursEnabled: checked})}
                  />
                </div>
                {preferences.quietHoursEnabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('notifications.quietHoursStart')}</Label>
                      <Input 
                        type="time" 
                        value={preferences.quietHoursStart}
                        onChange={(e) => setPreferences({...preferences, quietHoursStart: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>{t('notifications.quietHoursEnd')}</Label>
                      <Input 
                        type="time" 
                        value={preferences.quietHoursEnd}
                        onChange={(e) => setPreferences({...preferences, quietHoursEnd: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Type Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>{t('notifications.notificationTypes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Leave Notifications */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">{t('notifications.leaveNotifications')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.leaveApprovalNotif')}</Label>
                    <Switch 
                      checked={preferences.leaveNotifications.approval}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        leaveNotifications: {...preferences.leaveNotifications, approval: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.leaveRejectionNotif')}</Label>
                    <Switch 
                      checked={preferences.leaveNotifications.rejection}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        leaveNotifications: {...preferences.leaveNotifications, rejection: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.leaveRequestNotif')}</Label>
                    <Switch 
                      checked={preferences.leaveNotifications.newRequest}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        leaveNotifications: {...preferences.leaveNotifications, newRequest: checked}
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Payroll Notifications */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">{t('notifications.payrollNotifications')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.payslipGeneratedNotif')}</Label>
                    <Switch 
                      checked={preferences.payrollNotifications.payslipGenerated}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        payrollNotifications: {...preferences.payrollNotifications, payslipGenerated: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.salaryProcessedNotif')}</Label>
                    <Switch 
                      checked={preferences.payrollNotifications.salaryProcessed}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        payrollNotifications: {...preferences.payrollNotifications, salaryProcessed: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.bonusNotif')}</Label>
                    <Switch 
                      checked={preferences.payrollNotifications.bonus}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        payrollNotifications: {...preferences.payrollNotifications, bonus: checked}
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Attendance Notifications */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">{t('notifications.attendanceNotifications')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.lateCheckInNotif')}</Label>
                    <Switch 
                      checked={preferences.attendanceNotifications.lateCheckIn}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        attendanceNotifications: {...preferences.attendanceNotifications, lateCheckIn: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.missedCheckOutNotif')}</Label>
                    <Switch 
                      checked={preferences.attendanceNotifications.missedCheckOut}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        attendanceNotifications: {...preferences.attendanceNotifications, missedCheckOut: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.overtimeNotif')}</Label>
                    <Switch 
                      checked={preferences.attendanceNotifications.overtime}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        attendanceNotifications: {...preferences.attendanceNotifications, overtime: checked}
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Performance Notifications */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">{t('notifications.performanceNotifications')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.reviewDueNotif')}</Label>
                    <Switch 
                      checked={preferences.performanceNotifications.reviewDue}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        performanceNotifications: {...preferences.performanceNotifications, reviewDue: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.reviewCompletedNotif')}</Label>
                    <Switch 
                      checked={preferences.performanceNotifications.reviewCompleted}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        performanceNotifications: {...preferences.performanceNotifications, reviewCompleted: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.goalNotif')}</Label>
                    <Switch 
                      checked={preferences.performanceNotifications.goals}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        performanceNotifications: {...preferences.performanceNotifications, goals: checked}
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* System Notifications */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">{t('notifications.systemNotifications')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.systemUpdateNotif')}</Label>
                    <Switch 
                      checked={preferences.systemNotifications.systemUpdates}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        systemNotifications: {...preferences.systemNotifications, systemUpdates: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.maintenanceNotif')}</Label>
                    <Switch 
                      checked={preferences.systemNotifications.maintenance}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        systemNotifications: {...preferences.systemNotifications, maintenance: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.securityNotif')}</Label>
                    <Switch 
                      checked={preferences.systemNotifications.security}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        systemNotifications: {...preferences.systemNotifications, security: checked}
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Announcement Notifications */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">{t('notifications.announcementNotifications')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.companyNewsNotif')}</Label>
                    <Switch 
                      checked={preferences.announcementNotifications.companyNews}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        announcementNotifications: {...preferences.announcementNotifications, companyNews: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.policyUpdateNotif')}</Label>
                    <Switch 
                      checked={preferences.announcementNotifications.policyUpdates}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        announcementNotifications: {...preferences.announcementNotifications, policyUpdates: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('notifications.generalAnnouncementNotif')}</Label>
                    <Switch 
                      checked={preferences.announcementNotifications.general}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        announcementNotifications: {...preferences.announcementNotifications, general: checked}
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowSettings(false)}>
            {t('notifications.cancelSettings')}
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" onClick={handleSaveSettings}>
            {t('notifications.saveSettings')}
          </Button>
        </div>
      </div>
    );
  }

  // Main Notifications View
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl text-gray-900">{t('notifications.title')}</h2>
          <p className="text-gray-600 mt-1">{t('notifications.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            {t('notifications.markAllRead')}
          </Button>
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="w-4 h-4 mr-2" />
            {t('notifications.settings')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('notifications.totalNotifications')}
          value={notificationStats.totalNotifications}
          icon={Bell}
          iconColor="text-blue-600"
          variant="default"
        />
        
        <StatCard
          title={t('notifications.unreadNotifications')}
          value={notificationStats.unreadNotifications}
          icon={AlertCircle}
          iconColor="text-red-600"
          variant="default"
        />
        
        <StatCard
          title={t('notifications.todayNotifications')}
          value={notificationStats.todayNotifications}
          icon={Clock}
          iconColor="text-green-600"
          variant="default"
        />
        
        <StatCard
          title={t('notifications.thisWeekNotifications')}
          value={notificationStats.thisWeekNotifications}
          icon={Calendar}
          iconColor="text-purple-600"
          variant="default"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">{t('notifications.allNotifications')}</TabsTrigger>
          <TabsTrigger value="unread">{t('notifications.unread')}</TabsTrigger>
          <TabsTrigger value="read">{t('notifications.read')}</TabsTrigger>
          <TabsTrigger value="archived">{t('notifications.archived')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={t('notifications.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('notifications.type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('notifications.allTypes')}</SelectItem>
                    <SelectItem value="System">{t('notifications.system')}</SelectItem>
                    <SelectItem value="Leave">{t('notifications.leave')}</SelectItem>
                    <SelectItem value="Payroll">{t('notifications.payroll')}</SelectItem>
                    <SelectItem value="Attendance">{t('notifications.attendance')}</SelectItem>
                    <SelectItem value="Performance">{t('notifications.performance')}</SelectItem>
                    <SelectItem value="Recruitment">{t('notifications.recruitment')}</SelectItem>
                    <SelectItem value="Training">{t('notifications.training')}</SelectItem>
                    <SelectItem value="Asset">{t('notifications.asset')}</SelectItem>
                    <SelectItem value="Expense">{t('notifications.expense')}</SelectItem>
                    <SelectItem value="Document">{t('notifications.document')}</SelectItem>
                    <SelectItem value="Ticket">{t('notifications.ticket')}</SelectItem>
                    <SelectItem value="Announcement">{t('notifications.announcement')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('notifications.priority')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('notifications.allPriorities')}</SelectItem>
                    <SelectItem value="Urgent">{t('notifications.urgent')}</SelectItem>
                    <SelectItem value="High">{t('notifications.high')}</SelectItem>
                    <SelectItem value="Medium">{t('notifications.medium')}</SelectItem>
                    <SelectItem value="Low">{t('notifications.low')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('notifications.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('notifications.allNotifications')}</SelectItem>
                    <SelectItem value="unread">{t('notifications.unread')}</SelectItem>
                    <SelectItem value="read">{t('notifications.read')}</SelectItem>
                    <SelectItem value="archived">{t('notifications.archived')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2" onClick={handleExport}>
                  <Download className="w-4 h-4" />
                  {t('notifications.export')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Table */}
          <DataTable
            columns={tableColumns}
            data={paginatedNotifications}
            emptyMessage={t('notifications.noNotificationsFound')}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-6">
          <DataTable
            columns={tableColumns}
            data={notificationList.filter(n => !n.isRead).slice(0, itemsPerPage)}
            emptyMessage={t('notifications.noNotificationsFound')}
          />
        </TabsContent>

        <TabsContent value="read" className="space-y-6">
          <DataTable
            columns={tableColumns}
            data={notificationList.filter(n => n.isRead && !n.isArchived).slice(0, itemsPerPage)}
            emptyMessage={t('notifications.noNotificationsFound')}
          />
        </TabsContent>

        <TabsContent value="archived" className="space-y-6">
          <DataTable
            columns={tableColumns}
            data={notificationList.filter(n => n.isArchived).slice(0, itemsPerPage)}
            emptyMessage={t('notifications.noNotificationsFound')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}