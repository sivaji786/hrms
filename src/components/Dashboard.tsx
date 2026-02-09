import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import {
  Users,
  Clock,
  Calendar,
  CalendarDays,
  UserPlus,
  FileText,
  Bell,
  Settings,
  LayoutDashboard,
  Menu,
  LogOut,
  Ticket,
  DollarSign,
  TrendingUp,
  GraduationCap,
  Package,
  Plane,
} from 'lucide-react';
import hrmsLogo from '../hrms_logo.png';
import DashboardHome from './DashboardHome';
import EmployeeManagement from './EmployeeManagement';
import LeaveManagement from './LeaveManagement';
import Recruitment from './Recruitment';
import ReportsAnalytics from './ReportsAnalytics';
import ReportPreview from './ReportPreview';
import AddEmployee from './AddEmployee';
import AdminRoles from './AdminRoles';
import DocumentsPolicy from './DocumentsPolicy';
import ShiftManagement from './ShiftManagement';
import TicketingSystem from './TicketingSystem';
import Notifications from './Notifications';
import LanguageSelector from './LanguageSelector';
import CurrencyDropdown from './common/CurrencyDropdown';
import { useLanguage } from '../contexts/LanguageContext';
import { notifications } from '../data/notificationData';
import AttendanceTracking from './AttendanceTracking';
import PayrollManagement from './PayrollManagement';
import PerformanceManagement from './PerformanceManagement';
import TrainingDevelopment from './TrainingDevelopment';
import AssetManagement from './AssetManagement';
import ExpenseTravelManagement from './ExpenseTravelManagement';
import HolidayManagement from './HolidayManagement';

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [reportPreviewType, setReportPreviewType] = useState<string | null>(null);
  const { t } = useLanguage();

  // Calculate unread notifications count
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const menuGroups = [
    {
      title: t('nav.group.core'),
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
        { id: 'holidays', icon: CalendarDays, label: t('nav.holidays') },
      ]
    },
    {
      title: t('nav.group.employeeManagement'),
      items: [
        { id: 'employees', icon: Users, label: t('nav.employees') },
        { id: 'recruitment', icon: UserPlus, label: t('nav.recruitment') },
      ]
    },
    {
      title: t('nav.group.timeAttendance'),
      items: [
        { id: 'attendance', icon: Clock, label: t('nav.attendance') },
        { id: 'shifts', icon: Clock, label: t('nav.shifts') },
        { id: 'leave', icon: Calendar, label: t('nav.leave') },
      ]
    },
    {
      title: t('nav.group.financial'),
      items: [
        { id: 'payroll', icon: DollarSign, label: t('nav.payroll') },
        { id: 'expense', icon: Plane, label: t('nav.expense') },
      ]
    },
    {
      title: t('nav.group.developmentSupport'),
      items: [
        { id: 'performance', icon: TrendingUp, label: t('nav.performance') },
        { id: 'training', icon: GraduationCap, label: t('nav.training') },
        { id: 'assets', icon: Package, label: t('nav.assets') },
        { id: 'tickets', icon: Ticket, label: t('nav.tickets') },
      ]
    },
    {
      title: t('nav.group.system'),
      items: [
        { id: 'documents', icon: FileText, label: t('nav.documents') },
        { id: 'reports', icon: FileText, label: t('nav.reports') },
        { id: 'admin', icon: Settings, label: t('nav.admin') },
      ]
    },
  ];

  // Flatten for backward compatibility with getPageTitle
  const menuItems = menuGroups.flatMap(group => group.items);

  const getPageTitle = () => {
    if (activeModule === 'add-employee') {
      return t('employees.addNewEmployee');
    }
    if (activeModule === 'report-preview') {
      return t('reports.reportPreview');
    }
    return menuItems.find((item) => item.id === activeModule)?.label || t('nav.dashboard');
  };

  const handlePreviewReport = (reportType: string) => {
    setReportPreviewType(reportType);
    setActiveModule('report-preview');
  };

  const renderContent = () => {
    // Handle sub-views
    if (activeModule === 'add-employee') {
      return (
        <AddEmployee
          onBack={() => setActiveModule('employees')}
          onSave={() => {
            setActiveModule('employees');
            // Show success message or refresh employee list
          }}
        />
      );
    }

    if (activeModule === 'report-preview' && reportPreviewType) {
      return (
        <ReportPreview
          reportType={reportPreviewType}
          onBack={() => {
            setActiveModule('reports');
            setReportPreviewType(null);
          }}
        />
      );
    }

    // Main module views
    switch (activeModule) {
      case 'dashboard':
        return <DashboardHome onNavigate={(id) => setActiveModule(id)} />;
      case 'employees':
        return <EmployeeManagement onAddEmployee={() => setActiveModule('add-employee')} />;
      case 'attendance':
        return <AttendanceTracking />;
      case 'payroll':
        return <PayrollManagement />;
      case 'performance':
        return <PerformanceManagement />;
      case 'training':
        return <TrainingDevelopment />;
      case 'assets':
        return <AssetManagement />;
      case 'expense':
        return <ExpenseTravelManagement />;
      case 'shifts':
        return <ShiftManagement />;
      case 'leave':
        return <LeaveManagement />;
      case 'recruitment':
        return <Recruitment />;
      case 'holidays':
        return <HolidayManagement />;
      case 'reports':
        return <ReportsAnalytics onPreviewReport={handlePreviewReport} />;
      case 'documents':
        return <DocumentsPolicy />;
      case 'admin':
        return <AdminRoles />;
      case 'tickets':
        return <TicketingSystem />;
      case 'notifications':
        return <Notifications />;
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500">{t('common.underDevelopment')}</p>
          </div>
        );
    }
  };

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={hrmsLogo} alt="HRMS Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="font-semibold">{t('common.hrSystem')}</h2>
            <p className="text-xs text-gray-400">{t('common.adminPortal')}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-2">
        {menuGroups.map((group, groupIndex) => (
          <div key={group.title}>
            {groupIndex > 0 && <div className="border-t border-gray-700 my-2"></div>}
            <div className="px-3 py-1.5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {group.title}
              </h3>
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveModule(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-all text-sm ${activeModule === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
                      : 'hover:bg-gray-700/50'
                      }`}
                  >
                    <span className="text-sm truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full justify-start gap-3 bg-gray-800 border-gray-600 hover:bg-gray-700 text-white"
        >
          <LogOut className="w-5 h-5" />
          {t('common.logout')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 border-r">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Main navigation sidebar</SheetDescription>
          </SheetHeader>
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-gray-500">{t('common.welcomeBack')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => setActiveModule('notifications')}
            >
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </Button>
            <CurrencyDropdown />
            <LanguageSelector />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{renderContent()}</main>
      </div>
    </div>
  );
}