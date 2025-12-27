import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Download, TrendingUp, Users, Calendar, FileText, Send, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatCard, CurrencyDisplay, CurrencyIcon } from './common';
import Breadcrumbs from './Breadcrumbs';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import DisburseSalaries from './DisburseSalaries';
import DataTable, { TableColumn } from './common/DataTable';
import { AvatarCell, NumberCell } from './common/TableCells';
import toast from '../utils/toast';
import { payrollService } from '../services/api';

export default function PayrollManagement() {
  const { t } = useLanguage();
  const { formatCurrency, convertAmount } = useCurrency();
  const [activeTab, setActiveTab] = useState('salaries');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showDisbursementPage, setShowDisbursementPage] = useState(false);
  const itemsPerPage = 5;

  const [stats, setStats] = useState<any>(null);
  const [payrollHistory, setPayrollHistory] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Extract available months from data
  const availableMonths = Array.from(new Set(employees.map(e => e.month))).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime(); // Sort descending
  });

  // Set default month filter when data loads
  useEffect(() => {
    if (availableMonths.length > 0 && monthFilter === 'all') {
      // Optional: Set to latest month by default, or keep 'all'
      // setMonthFilter(availableMonths[0]); 
    }
  }, [availableMonths]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, payrollData, settlementsData] = await Promise.all([
        payrollService.getStats(),
        payrollService.getAll(), // This now returns employees with payroll info
        payrollService.getPendingSettlements()
      ]);

      setStats(statsData);
      setPayrollHistory(statsData.trend || []);
      console.log('Payroll Data:', payrollData);
      setEmployees(payrollData);
      setSettlements(settlementsData);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      toast.error('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: t('nav.dashboard') },
    { label: t('payroll.title') },
  ];

  // Filter employees
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.employee_code && employee.employee_code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    const matchesMonth = monthFilter === 'all' || employee.month === monthFilter; // Adjusted logic

    return matchesSearch && matchesDepartment && matchesStatus && matchesMonth;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const departments = ['all', ...Array.from(new Set(employees.map(e => e.department)))];

  // Handle checkbox selections
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(currentEmployees.map(emp => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (empId: string | number, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, empId as string]);
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== empId));
    }
  };

  const selectedEmployeeObjects = employees.filter(emp =>
    selectedEmployees.includes(emp.id)
  );

  const isAllSelected = currentEmployees.length > 0 && selectedEmployees.length === currentEmployees.length;
  const isSomeSelected = selectedEmployees.length > 0 && selectedEmployees.length < currentEmployees.length;

  const handleDisburseSalaries = () => {
    if (selectedEmployees.length === 0) {
      toast.warning('No Employees Selected', t('payroll.pleaseSelectEmployees') || 'Please select at least one employee to disburse salaries');
      return;
    }
    setShowDisbursementPage(true);
  };

  // If showing disbursement page, render it
  if (showDisbursementPage) {
    const disbursedEmployeesData = employees
      .filter(emp => selectedEmployees.includes(emp.id))
      .map(emp => ({
        id: emp.id,
        name: emp.name,
        department: emp.department,
        netSalary: emp.netSalary,
        month: emp.month,
      }));

    return (
      <DisburseSalaries
        onBack={() => {
          setShowDisbursementPage(false);
          setSelectedEmployees([]);
        }}
        selectedEmployees={disbursedEmployeesData}
      />
    );
  }

  const handleGeneratePayslips = () => {
    toast.info('Generating Payslips', 'Payslips will be generated for all pending employees.');
  };

  const handleSendPayslips = () => {
    toast.info('Sending Payslips', 'Payslips will be sent to all employee email addresses.');
  };

  const handleBulkDownload = () => {
    toast.info('Bulk Download', 'All payslips will be downloaded as a ZIP file.');
  };

  if (loading) {
    return <div className="p-8 text-center">Loading payroll data...</div>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('payroll.monthlyGross')}
          value={formatCurrency(convertAmount(stats?.monthlyGross || 0), { compact: true, decimals: 1 })}
          subtitle={t('payroll.currentMonth')}
          icon={CurrencyIcon}
          iconColor="text-green-500"
          variant="default"
        />
        <StatCard
          title={t('payroll.totalDeductions')}
          value={formatCurrency(convertAmount(stats?.totalDeductions || 0), { compact: true, decimals: 1 })}
          subtitle={`${stats?.monthlyGross ? Math.round((stats.totalDeductions / stats.monthlyGross) * 100) : 0}% ${t('payroll.ofGross')}`}
          icon={TrendingUp}
          iconColor="text-orange-500"
          variant="default"
        />
        <StatCard
          title={t('payroll.netPayroll')}
          value={formatCurrency(convertAmount(stats?.netPayroll || 0), { compact: true, decimals: 1 })}
          subtitle={`${stats?.totalEmployees || 0} ${t('payroll.employees')}`}
          icon={Users}
          iconColor="text-blue-500"
          variant="default"
        />
        <StatCard
          title={t('payroll.processingStatus')}
          value={`${stats?.payslipsGenerated || 0} / ${stats?.totalEmployees || 0}`}
          subtitle={t('payroll.payslipsGenerated')}
          icon={Calendar}
          iconColor="text-purple-500"
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payroll Trend */}
        <Card>
          <CardHeader>
            <CardTitle>{t('payroll.payrollTrend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={payrollHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(convertAmount(Number(value)), { compact: true, decimals: 1 })} />
                <Legend />
                <Line type="monotone" dataKey="gross" stroke="#3b82f6" name={t('payroll.grossSalary')} />
                <Line type="monotone" dataKey="deductions" stroke="#ef4444" name={t('payroll.deductions')} />
                <Line type="monotone" dataKey="net" stroke="#10b981" name={t('payroll.netSalary')} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Statutory Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>{t('payroll.statutoryCompliance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.compliance?.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.component}</p>
                    <p className="text-sm text-gray-600">{item.rate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      <CurrencyDisplay amount={item.amount} compact />
                    </p>
                    <Badge className="bg-green-100 text-green-700 mt-1">{t('payroll.calculated')}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="salaries">{t('payroll.employeeSalaries')}</TabsTrigger>
          <TabsTrigger value="payslips">{t('payroll.payslips')}</TabsTrigger>
          <TabsTrigger value="settlements">{t('payroll.settlements')}</TabsTrigger>
        </TabsList>

        <TabsContent value="salaries">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <CardTitle>{t('payroll.salaryDetails')} - {monthFilter}</CardTitle>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" onClick={handleDisburseSalaries} disabled={selectedEmployees.length === 0}>
                    <Send className="w-4 h-4 mr-2" />
                    {t('payroll.disburseSalaries')}
                    {selectedEmployees.length > 0 && ` (${selectedEmployees.length})`}
                  </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder={t('common.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t('common.department')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('common.allDepartments')}</SelectItem>
                      {departments.filter(d => d !== 'all').map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t('payroll.status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                      <SelectItem value="Processed">{t('payroll.processed')}</SelectItem>
                      <SelectItem value="Pending">{t('payroll.pending')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={monthFilter} onValueChange={setMonthFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t('common.month')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('common.allMonths')}</SelectItem>
                      {availableMonths.map((month) => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                data={currentEmployees}
                getRowId={(row) => row.record_id}
                columns={[
                  {
                    header: t('payroll.employee'),
                    accessor: 'name',
                    sortable: true,
                    cell: (employee) => (
                      <AvatarCell
                        name={employee.name}
                        subtitle={employee.department}
                      />
                    ),
                  },
                  {
                    header: t('payroll.basic'),
                    accessor: 'basic',
                    sortable: true,
                    cell: (employee) => <NumberCell value={employee.basic} useCurrencyContext={true} />,
                  },
                  {
                    header: t('payroll.hra'),
                    accessor: 'hra',
                    sortable: true,
                    cell: (employee) => <NumberCell value={employee.hra} useCurrencyContext={true} />,
                  },
                  {
                    header: t('payroll.allowances'),
                    accessor: 'allowances',
                    sortable: true,
                    cell: (employee) => <NumberCell value={employee.allowances} useCurrencyContext={true} />,
                  },
                  {
                    header: t('payroll.gross'),
                    accessor: 'gross',
                    sortable: true,
                    cell: (employee) => <NumberCell value={employee.gross} useCurrencyContext={true} className="font-medium" />,
                  },
                  {
                    header: t('payroll.deductions'),
                    accessor: 'deductions',
                    sortable: true,
                    cell: (employee) => <NumberCell value={employee.deductions} useCurrencyContext={true} className="text-red-600" />,
                  },
                  {
                    header: t('payroll.netSalary'),
                    accessor: 'netSalary',
                    sortable: true,
                    cell: (employee) => <NumberCell value={employee.netSalary} useCurrencyContext={true} className="font-medium text-green-600" />,
                  },
                  {
                    header: t('payroll.status'),
                    accessor: 'status',
                    sortable: true,
                    cell: (employee) => (
                      <Badge
                        className={
                          employee.status === 'Processed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }
                      >
                        {t(`payroll.${employee.status.toLowerCase()}`)}
                      </Badge>
                    ),
                  },
                ]}
                selectable
                exportable
                exportFileName="payroll-salaries"
                exportHeaders={['ID', 'Name', 'Department', 'Basic', 'HRA', 'Allowances', 'Gross', 'Deductions', 'Net Salary', 'Status']}
                selectedRows={selectedEmployeeObjects}
                onSelectRow={handleSelectEmployee}
                onSelectAll={handleSelectAll}
                headerStyle="simple"
                cellPadding="normal"
                emptyMessage={t('common.noRecordsFound')}
              />

              {/* Pagination */}
              {filteredEmployees.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-gray-500">
                    {t('common.showing')} {startIndex + 1} {t('common.to')} {Math.min(endIndex, filteredEmployees.length)} {t('common.of')} {filteredEmployees.length} {t('common.results')}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {t('common.previous')}
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      {t('common.next')}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payslips">
          <Card>
            <CardHeader>
              <CardTitle>{t('payroll.payslipGeneration')} - {monthFilter}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <FileText className="w-8 h-8 text-blue-600 mb-2" />
                    <h4 className="font-medium mb-1">{t('payroll.payslipsGeneratedCount')}</h4>
                    <p className="text-2xl">{stats?.payslipsGenerated || 0} / {stats?.totalEmployees || 0}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats?.totalEmployees ? Math.round(((stats.payslipsGenerated || 0) / stats.totalEmployees) * 100) : 0}% {t('payroll.complete')}
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <Send className="w-8 h-8 text-green-600 mb-2" />
                    <h4 className="font-medium mb-1">{t('payroll.payslipsSent')}</h4>
                    <p className="text-2xl">{stats?.payslipsSent || 0} / {stats?.payslipsGenerated || 0}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats?.payslipsGenerated ? Math.round(((stats.payslipsSent || 0) / stats.payslipsGenerated) * 100) : 0}% {t('payroll.delivered')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" onClick={handleGeneratePayslips}>
                    {t('payroll.generateRemaining')}
                  </Button>
                  <Button variant="outline" onClick={handleSendPayslips}>
                    {t('payroll.sendAllEmail')}
                  </Button>
                  <Button variant="outline" onClick={handleBulkDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    {t('payroll.bulkDownload')}
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-blue-900">{t('payroll.templateInfo')}</h5>
                      <p className="text-sm text-blue-700 mt-1">
                        {t('payroll.templateDescription')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlements">
          <Card>
            <CardHeader>
              <CardTitle>{t('payroll.fullFinalSettlements')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settlements.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">{t('payroll.noPendingSettlements')}</div>
                ) : (
                  settlements.map((settlement, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white">
                              {settlement.employee
                                .split(' ')
                                .map((n: string) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{settlement.employee}</h4>
                            <p className="text-sm text-gray-600">{settlement.department} • {t('payroll.lastDay')}: {settlement.lastDay}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{t('payroll.settlementAmount')}</p>
                          <p className="text-2xl font-medium text-green-600">
                            <CurrencyDisplay amount={settlement.pendingAmount} />
                          </p>
                          <Badge className="mt-2 bg-orange-100 text-orange-700">
                            {settlement.status === 'In Progress' ? t('payroll.inProgress') : t('payroll.pendingApproval')}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">{t('payroll.noticePayRecovery')}</p>
                          <p className="font-medium">
                            <CurrencyDisplay amount={0} />
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t('payroll.leaveEncashment')}</p>
                          <p className="font-medium text-green-600">
                            +<CurrencyDisplay amount={45200} />
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t('payroll.gratuity')}</p>
                          <p className="font-medium text-green-600">
                            +<CurrencyDisplay amount={142850} />
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t('payroll.otherAdjustments')}</p>
                          <p className="font-medium">
                            <CurrencyDisplay amount={0} />
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-indigo-600"
                          onClick={() => {
                            toast.success('Processing Settlement', `F&F settlement for ${settlement.employee} (${settlement.department}) will be processed. Amount: ${settlement.pendingAmount}`);
                          }}
                        >
                          {t('payroll.processSettlement')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast.info('Downloading Statement', `F&F settlement statement for ${settlement.employee} will be downloaded.`);
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {t('payroll.downloadStatement')}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}