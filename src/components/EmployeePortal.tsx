import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import {
  User,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  Bell,
  LayoutDashboard,
  Menu,
  LogOut,
  Building2,
  Award,
  BookOpen,
  Receipt,
  Ticket,
} from 'lucide-react';
import EmployeeDashboardHome from './EmployeeDashboardHome';
import MyProfile from './MyProfile';
import MyAttendance from './MyAttendance';
import MyLeaves from './MyLeaves';
import MyPayslips from './MyPayslips';
import MyPerformance from './MyPerformance';
import MyTraining from './MyTraining';
import MyDocuments from './MyDocuments';
import MyExpenses from './MyExpenses';
import MyTickets from './MyTickets';
import LanguageSelector from './LanguageSelector';
import CurrencyDropdown from './common/CurrencyDropdown';
import { useLanguage } from '../contexts/LanguageContext';
import { notifications } from '../data/notificationData';

interface EmployeePortalProps {
  onLogout: () => void;
}

export default function EmployeePortal({ onLogout }: EmployeePortalProps) {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  // Calculate unread notifications count
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('employee.dashboard') },
    { id: 'profile', icon: User, label: t('employee.myProfile') },
    { id: 'attendance', icon: Clock, label: t('employee.myAttendance') },
    { id: 'leaves', icon: Calendar, label: t('employee.myLeaves') },
    { id: 'payslips', icon: DollarSign, label: t('employee.myPayslips') },
    { id: 'performance', icon: Award, label: t('employee.myPerformance') },
    { id: 'training', icon: BookOpen, label: t('employee.myTraining') },
    { id: 'expenses', icon: Receipt, label: t('employee.myExpenses') },
    { id: 'documents', icon: FileText, label: t('employee.myDocuments') },
    { id: 'tickets', icon: Ticket, label: t('employee.myTickets') },
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <EmployeeDashboardHome />;
      case 'profile':
        return <MyProfile />;
      case 'attendance':
        return <MyAttendance />;
      case 'leaves':
        return <MyLeaves />;
      case 'payslips':
        return <MyPayslips />;
      case 'performance':
        return <MyPerformance />;
      case 'training':
        return <MyTraining />;
      case 'expenses':
        return <MyExpenses />;
      case 'documents':
        return <MyDocuments />;
      case 'tickets':
        return <MyTickets />;
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500">{t('common.underDevelopment')}</p>
          </div>
        );
    }
  };

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-900 to-indigo-800 text-white">
      <div className="p-6 border-b border-indigo-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-semibold">{t('employee.portal')}</h2>
            <p className="text-xs text-indigo-300">{t('employee.selfService')}</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-indigo-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="font-medium">John Smith</p>
            <p className="text-xs text-indigo-300">Software Engineer</p>
            <p className="text-xs text-indigo-400">EMP-2024-001</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeModule === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
                  : 'hover:bg-indigo-700/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-indigo-700">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full justify-start gap-3 bg-indigo-800 border-indigo-600 hover:bg-indigo-700 text-white"
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
            <SheetDescription>Employee portal navigation sidebar</SheetDescription>
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
                {menuItems.find((item) => item.id === activeModule)?.label || t('employee.dashboard')}
              </h1>
              <p className="text-sm text-gray-500">{t('employee.welcomeMessage')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="relative">
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