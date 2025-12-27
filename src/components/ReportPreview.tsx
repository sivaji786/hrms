import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Filter,
  Calendar,
  Building2,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  RefreshCw,
  Mail,
  Printer,
  Share2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { DataTable, TableColumn } from './common';
import { Pagination } from './common';
import Breadcrumbs from './Breadcrumbs';
import toast from '../utils/toast';

interface ReportPreviewProps {
  reportType: string;
  onBack: () => void;
}

// Sample data for different report types
const employeeMasterData = [
  { id: 'EMP001', name: 'John Smith', department: 'Engineering', position: 'Senior Developer', email: 'john.smith@company.com', status: 'Active', joinDate: '2020-03-15' },
  { id: 'EMP002', name: 'Sarah Johnson', department: 'Sales', position: 'Sales Manager', email: 'sarah.johnson@company.com', status: 'Active', joinDate: '2019-07-22' },
  { id: 'EMP003', name: 'Michael Brown', department: 'Marketing', position: 'Marketing Lead', email: 'michael.brown@company.com', status: 'Active', joinDate: '2021-01-10' },
  { id: 'EMP004', name: 'Emily Davis', department: 'HR', position: 'HR Manager', email: 'emily.davis@company.com', status: 'Active', joinDate: '2018-11-05' },
  { id: 'EMP005', name: 'David Wilson', department: 'Finance', position: 'Financial Analyst', email: 'david.wilson@company.com', status: 'Active', joinDate: '2020-09-18' },
];

const attendanceData = [
  { employeeId: 'EMP001', name: 'John Smith', department: 'Engineering', present: 22, absent: 0, late: 2, leaves: 1, workingDays: 25, attendanceRate: '96%' },
  { employeeId: 'EMP002', name: 'Sarah Johnson', department: 'Sales', present: 23, absent: 1, late: 1, leaves: 0, workingDays: 25, attendanceRate: '96%' },
  { employeeId: 'EMP003', name: 'Michael Brown', department: 'Marketing', present: 21, absent: 0, late: 3, leaves: 1, workingDays: 25, attendanceRate: '92%' },
  { employeeId: 'EMP004', name: 'Emily Davis', department: 'HR', present: 24, absent: 0, late: 1, leaves: 0, workingDays: 25, attendanceRate: '100%' },
  { employeeId: 'EMP005', name: 'David Wilson', department: 'Finance', present: 23, absent: 1, late: 1, leaves: 0, workingDays: 25, attendanceRate: '96%' },
];

const payrollData = [
  { employeeId: 'EMP001', name: 'John Smith', department: 'Engineering', basicSalary: 75000, allowances: 15000, deductions: 9000, netSalary: 81000 },
  { employeeId: 'EMP002', name: 'Sarah Johnson', department: 'Sales', basicSalary: 65000, allowances: 13000, deductions: 7800, netSalary: 70200 },
  { employeeId: 'EMP003', name: 'Michael Brown', department: 'Marketing', basicSalary: 60000, allowances: 12000, deductions: 7200, netSalary: 64800 },
  { employeeId: 'EMP004', name: 'Emily Davis', department: 'HR', basicSalary: 58000, allowances: 11600, deductions: 6960, netSalary: 62640 },
  { employeeId: 'EMP005', name: 'David Wilson', department: 'Finance', basicSalary: 62000, allowances: 12400, deductions: 7440, netSalary: 66960 },
];

const leaveBalanceData = [
  { employeeId: 'EMP001', name: 'John Smith', department: 'Engineering', annualLeave: '12/20', sickLeave: '5/10', casualLeave: '3/5', totalAvailable: 20, totalUsed: 20 },
  { employeeId: 'EMP002', name: 'Sarah Johnson', department: 'Sales', annualLeave: '15/20', sickLeave: '7/10', casualLeave: '4/5', totalAvailable: 26, totalUsed: 9 },
  { employeeId: 'EMP003', name: 'Michael Brown', department: 'Marketing', annualLeave: '10/20', sickLeave: '4/10', casualLeave: '2/5', totalAvailable: 16, totalUsed: 19 },
  { employeeId: 'EMP004', name: 'Emily Davis', department: 'HR', annualLeave: '18/20', sickLeave: '9/10', casualLeave: '5/5', totalAvailable: 32, totalUsed: 3 },
  { employeeId: 'EMP005', name: 'David Wilson', department: 'Finance', annualLeave: '14/20', sickLeave: '6/10', casualLeave: '3/5', totalAvailable: 23, totalUsed: 12 },
];

const performanceData = [
  { employeeId: 'EMP001', name: 'John Smith', department: 'Engineering', lastReview: '2024-06-15', rating: 4.5, status: 'Excellent', goals: '8/10', feedback: 'Outstanding performance' },
  { employeeId: 'EMP002', name: 'Sarah Johnson', department: 'Sales', lastReview: '2024-06-10', rating: 4.2, status: 'Very Good', goals: '9/10', feedback: 'Exceeded targets' },
  { employeeId: 'EMP003', name: 'Michael Brown', department: 'Marketing', lastReview: '2024-06-20', rating: 3.8, status: 'Good', goals: '7/10', feedback: 'Good progress' },
  { employeeId: 'EMP004', name: 'Emily Davis', department: 'HR', lastReview: '2024-06-08', rating: 4.7, status: 'Excellent', goals: '10/10', feedback: 'Exceptional work' },
  { employeeId: 'EMP005', name: 'David Wilson', department: 'Finance', lastReview: '2024-06-12', rating: 4.0, status: 'Very Good', goals: '8/10', feedback: 'Meeting expectations' },
];

const headcountData = [
  { department: 'Engineering', total: 420, male: 315, female: 98, other: 7, newHires: 12, exits: 3 },
  { department: 'Sales', total: 285, male: 171, female: 110, other: 4, newHires: 8, exits: 5 },
  { department: 'Marketing', total: 168, male: 84, female: 82, other: 2, newHires: 5, exits: 2 },
  { department: 'HR', total: 95, male: 38, female: 55, other: 2, newHires: 2, exits: 1 },
  { department: 'Finance', total: 142, male: 85, female: 56, other: 1, newHires: 3, exits: 2 },
  { department: 'Operations', total: 138, male: 83, female: 54, other: 1, newHires: 4, exits: 1 },
];

const attritionData = [
  { month: 'January 2024', voluntary: 6, involuntary: 2, total: 8, rate: '0.64%', avgTenure: '2.3 years' },
  { month: 'February 2024', voluntary: 2, involuntary: 1, total: 3, rate: '0.24%', avgTenure: '1.8 years' },
  { month: 'March 2024', voluntary: 3, involuntary: 1, total: 4, rate: '0.32%', avgTenure: '2.1 years' },
  { month: 'April 2024', voluntary: 2, involuntary: 1, total: 3, rate: '0.24%', avgTenure: '1.5 years' },
  { month: 'May 2024', voluntary: 7, involuntary: 1, total: 8, rate: '0.64%', avgTenure: '2.7 years' },
  { month: 'June 2024', voluntary: 5, involuntary: 1, total: 6, rate: '0.48%', avgTenure: '2.0 years' },
];

const recruitmentData = [
  { position: 'Senior Developer', department: 'Engineering', openings: 5, applications: 124, screened: 45, interviewed: 18, offered: 8, hired: 6 },
  { position: 'Sales Executive', department: 'Sales', openings: 8, applications: 89, screened: 35, interviewed: 15, offered: 10, hired: 8 },
  { position: 'Marketing Manager', department: 'Marketing', openings: 2, applications: 67, screened: 28, interviewed: 12, offered: 3, hired: 2 },
  { position: 'HR Specialist', department: 'HR', openings: 3, applications: 54, screened: 22, interviewed: 10, offered: 4, hired: 3 },
  { position: 'Financial Analyst', department: 'Finance', openings: 4, applications: 78, screened: 32, interviewed: 14, offered: 5, hired: 4 },
];

export default function ReportPreview({ reportType, onBack }: ReportPreviewProps) {
  const { t } = useLanguage();
  const { formatCurrency, convertAmount } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState('currentMonth');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getReportTitle = () => {
    switch (reportType) {
      case 'employeeMaster':
        return t('reports.employeeMasterReport');
      case 'attendance':
        return t('reports.monthlyAttendanceReport');
      case 'payroll':
        return t('reports.payrollSummaryReport');
      case 'leaveBalance':
        return t('reports.leaveBalanceReport');
      case 'performance':
        return t('reports.performanceReport');
      case 'headcount':
        return t('reports.headcountReport');
      case 'attrition':
        return t('reports.attritionReport');
      case 'recruitment':
        return t('reports.recruitmentReport');
      default:
        return t('reports.reportPreview');
    }
  };

  const getReportIcon = () => {
    switch (reportType) {
      case 'employeeMaster':
        return Users;
      case 'attendance':
        return Clock;
      case 'payroll':
        return DollarSign;
      case 'leaveBalance':
        return Calendar;
      case 'performance':
        return TrendingUp;
      case 'headcount':
        return Users;
      case 'attrition':
        return FileText;
      case 'recruitment':
        return Users;
      default:
        return FileText;
    }
  };

  const handleDownload = (format: string) => {
    toast.success(t('reports.downloadStarted', { format: format.toUpperCase() }));
  };

  const handleEmail = () => {
    toast.success(t('reports.emailSent'));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    toast.success(t('reports.dataRefreshed'));
  };

  // Render different table structures based on report type
  const renderEmployeeMasterTable = () => {
    const columns: TableColumn<typeof employeeMasterData[0]>[] = [
      { header: t('reports.employeeId'), accessor: 'id' },
      { header: t('reports.employeeName'), accessor: 'name' },
      { header: t('reports.department'), accessor: 'department' },
      { header: t('reports.position'), accessor: 'position' },
      { header: t('reports.email'), accessor: 'email' },
      { header: t('reports.joinDate'), accessor: 'joinDate' },
      { 
        header: t('reports.status'), 
        accessor: 'status',
        cell: (row) => (
          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
            {row.status}
          </span>
        )
      },
    ];

    return <DataTable columns={columns} data={employeeMasterData} />;
  };

  const renderAttendanceTable = () => {
    const columns: TableColumn<typeof attendanceData[0]>[] = [
      { header: t('reports.employeeId'), accessor: 'employeeId' },
      { header: t('reports.employeeName'), accessor: 'name' },
      { header: t('reports.department'), accessor: 'department' },
      { header: t('reports.present'), accessor: 'present' },
      { header: t('reports.absent'), accessor: 'absent' },
      { header: t('reports.late'), accessor: 'late' },
      { header: t('reports.leaves'), accessor: 'leaves' },
      { header: t('reports.workingDays'), accessor: 'workingDays' },
      { 
        header: t('reports.attendanceRate'), 
        accessor: 'attendanceRate',
        cell: (row) => (
          <span className="font-medium text-green-600">{row.attendanceRate}</span>
        )
      },
    ];

    return <DataTable columns={columns} data={attendanceData} />;
  };

  const renderPayrollTable = () => {
    const columns: TableColumn<typeof payrollData[0]>[] = [
      { header: t('reports.employeeId'), accessor: 'employeeId' },
      { header: t('reports.employeeName'), accessor: 'name' },
      { header: t('reports.department'), accessor: 'department' },
      { 
        header: t('reports.basicSalary'), 
        accessor: 'basicSalary',
        cell: (row) => formatCurrency(convertAmount(row.basicSalary))
      },
      { 
        header: t('reports.allowances'), 
        accessor: 'allowances',
        cell: (row) => formatCurrency(convertAmount(row.allowances))
      },
      { 
        header: t('reports.deductions'), 
        accessor: 'deductions',
        cell: (row) => formatCurrency(convertAmount(row.deductions))
      },
      { 
        header: t('reports.netSalary'), 
        accessor: 'netSalary',
        cell: (row) => <span className="font-medium">{formatCurrency(convertAmount(row.netSalary))}</span>
      },
    ];

    return <DataTable columns={columns} data={payrollData} />;
  };

  const renderLeaveBalanceTable = () => {
    const columns: TableColumn<typeof leaveBalanceData[0]>[] = [
      { header: t('reports.employeeId'), accessor: 'employeeId' },
      { header: t('reports.employeeName'), accessor: 'name' },
      { header: t('reports.department'), accessor: 'department' },
      { header: t('reports.annualLeave'), accessor: 'annualLeave' },
      { header: t('reports.sickLeave'), accessor: 'sickLeave' },
      { header: t('reports.casualLeave'), accessor: 'casualLeave' },
      { header: t('reports.totalUsed'), accessor: 'totalUsed' },
      { header: t('reports.totalAvailable'), accessor: 'totalAvailable' },
    ];

    return <DataTable columns={columns} data={leaveBalanceData} />;
  };

  const renderPerformanceTable = () => {
    const columns: TableColumn<typeof performanceData[0]>[] = [
      { header: t('reports.employeeId'), accessor: 'employeeId' },
      { header: t('reports.employeeName'), accessor: 'name' },
      { header: t('reports.department'), accessor: 'department' },
      { header: t('reports.lastReview'), accessor: 'lastReview' },
      { 
        header: t('reports.rating'), 
        accessor: 'rating',
        cell: (row) => (
          <div className="flex items-center gap-1">
            <span className="font-medium">{row.rating}</span>
            <span className="text-yellow-500">★</span>
          </div>
        )
      },
      { 
        header: t('reports.status'), 
        accessor: 'status',
        cell: (row) => {
          const colors = {
            'Excellent': 'bg-green-100 text-green-700',
            'Very Good': 'bg-blue-100 text-blue-700',
            'Good': 'bg-gray-100 text-gray-700',
          };
          return (
            <span className={`px-2 py-1 rounded-full text-xs ${colors[row.status as keyof typeof colors] || 'bg-gray-100 text-gray-700'}`}>
              {row.status}
            </span>
          );
        }
      },
      { header: t('reports.goalsAchieved'), accessor: 'goals' },
      { header: t('reports.feedback'), accessor: 'feedback' },
    ];

    return <DataTable columns={columns} data={performanceData} />;
  };

  const renderHeadcountTable = () => {
    const columns: TableColumn<typeof headcountData[0]>[] = [
      { header: t('reports.department'), accessor: 'department' },
      { header: t('reports.totalEmployees'), accessor: 'total' },
      { header: t('reports.male'), accessor: 'male' },
      { header: t('reports.female'), accessor: 'female' },
      { header: t('reports.other'), accessor: 'other' },
      { header: t('reports.newHires'), accessor: 'newHires' },
      { header: t('reports.exits'), accessor: 'exits' },
    ];

    return <DataTable columns={columns} data={headcountData} />;
  };

  const renderAttritionTable = () => {
    const columns: TableColumn<typeof attritionData[0]>[] = [
      { header: t('reports.month'), accessor: 'month' },
      { header: t('reports.voluntary'), accessor: 'voluntary' },
      { header: t('reports.involuntary'), accessor: 'involuntary' },
      { header: t('reports.totalExits'), accessor: 'total' },
      { 
        header: t('reports.attritionRate'), 
        accessor: 'rate',
        cell: (row) => <span className="font-medium">{row.rate}</span>
      },
      { header: t('reports.avgTenure'), accessor: 'avgTenure' },
    ];

    return <DataTable columns={columns} data={attritionData} />;
  };

  const renderRecruitmentTable = () => {
    const columns: TableColumn<typeof recruitmentData[0]>[] = [
      { header: t('reports.position'), accessor: 'position' },
      { header: t('reports.department'), accessor: 'department' },
      { header: t('reports.openings'), accessor: 'openings' },
      { header: t('reports.applications'), accessor: 'applications' },
      { header: t('reports.screened'), accessor: 'screened' },
      { header: t('reports.interviewed'), accessor: 'interviewed' },
      { header: t('reports.offered'), accessor: 'offered' },
      { header: t('reports.hired'), accessor: 'hired' },
    ];

    return <DataTable columns={columns} data={recruitmentData} />;
  };

  const renderReportTable = () => {
    switch (reportType) {
      case 'employeeMaster':
        return renderEmployeeMasterTable();
      case 'attendance':
        return renderAttendanceTable();
      case 'payroll':
        return renderPayrollTable();
      case 'leaveBalance':
        return renderLeaveBalanceTable();
      case 'performance':
        return renderPerformanceTable();
      case 'headcount':
        return renderHeadcountTable();
      case 'attrition':
        return renderAttritionTable();
      case 'recruitment':
        return renderRecruitmentTable();
      default:
        return renderEmployeeMasterTable();
    }
  };

  const ReportIcon = getReportIcon();

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t('nav.reports'), onClick: onBack },
          { label: getReportTitle() },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <ReportIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl">{getReportTitle()}</h1>
                <p className="text-sm text-gray-600">{t('reports.generatedOn')}: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('common.refresh')}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            {t('common.print')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleEmail}>
            <Mail className="w-4 h-4 mr-2" />
            {t('common.email')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {t('common.filters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>{t('reports.dateRange')}</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="currentMonth">{t('reports.currentMonth')}</SelectItem>
                  <SelectItem value="lastMonth">{t('reports.lastMonth')}</SelectItem>
                  <SelectItem value="last3Months">{t('reports.last3Months')}</SelectItem>
                  <SelectItem value="last6Months">{t('reports.last6Months')}</SelectItem>
                  <SelectItem value="lastYear">{t('reports.lastYear')}</SelectItem>
                  <SelectItem value="custom">{t('reports.customRange')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('reports.department')}</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allDepartments')}</SelectItem>
                  <SelectItem value="engineering">{t('reports.engineering')}</SelectItem>
                  <SelectItem value="sales">{t('reports.sales')}</SelectItem>
                  <SelectItem value="marketing">{t('reports.marketing')}</SelectItem>
                  <SelectItem value="hr">{t('reports.hr')}</SelectItem>
                  <SelectItem value="finance">{t('reports.finance')}</SelectItem>
                  <SelectItem value="operations">{t('reports.operations')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(reportType === 'employeeMaster' || reportType === 'performance') && (
              <div className="space-y-2">
                <Label>{t('reports.status')}</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                    <SelectItem value="active">{t('common.active')}</SelectItem>
                    <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>{t('reports.exportFormat')}</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload('pdf')} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload('excel')} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload('csv')} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('reports.reportPreview')}</CardTitle>
            <span className="text-sm text-gray-600">
              {t('reports.showingResults')}: {employeeMasterData.length}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {renderReportTable()}
          
          {/* Pagination */}
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(employeeMasterData.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Report Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.reportSummary')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('reports.totalRecords')}</p>
                  <p className="text-2xl font-medium mt-1">{employeeMasterData.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('reports.generatedAt')}</p>
                  <p className="text-2xl font-medium mt-1">{new Date().toLocaleTimeString()}</p>
                </div>
                <Clock className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('reports.reportPeriod')}</p>
                  <p className="text-2xl font-medium mt-1">{t('reports.currentMonth')}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
