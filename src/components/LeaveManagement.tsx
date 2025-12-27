import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { CheckCircle, XCircle, Clock, Search, Filter, Users, UserPlus, X } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Pagination } from './common';
import { leaveService, LeaveRequest, LeaveBalance, LeaveStats } from '../services/leaveService';
// import { employees } from '../data/employeeData';
// import HolidayManagement from './HolidayManagement';
import { StatCard } from './common';
import { useLanguage } from '../contexts/LanguageContext';
import DataTable, { TableColumn } from './common/DataTable';
import { AvatarCell } from './common/TableCells';
import toast from '../utils/toast';

export default function LeaveManagement() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('requests');

  // Data State
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance[]>([]);
  const [leaveStats, setLeaveStats] = useState<LeaveStats>({
    pendingRequests: 0,
    approvedThisMonth: 0,
    rejectedThisMonth: 0,
    onLeaveToday: 0
  });
  const [employees, setEmployees] = useState<any[]>([]);


  // Computed Charts State
  const [leaveTypeData, setLeaveTypeData] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);

  const fetchLeaveData = async () => {
    try {
      const [requestsRes, balanceRes, statsRes, employeesRes] = await Promise.all([
        leaveService.getLeaves(),
        leaveService.getBalances(),
        leaveService.getStats(),
        leaveService.getEmployees()
      ]);

      setLeaveRequests(requestsRes.data || []);
      setLeaveBalance(balanceRes.data || []);
      setLeaveStats(statsRes.data || {
        pendingRequests: 0,
        approvedThisMonth: 0,
        rejectedThisMonth: 0,
        onLeaveToday: 0
      });
      // Handle Employee Response structure: { employees: [], pager: {} }
      // Assuming api returns data wrapped in data: res.data.employees
      // If codeigniter returns { data: { employees: ... } }
      // Check structure carefully.
      // Usually api.ts handles axios response.
      // Let's safe access:
      const empData = employeesRes.data?.employees || employeesRes.data || [];
      setEmployees(Array.isArray(empData) ? empData : empData.employees || []);

      // Compute Charts
      computeCharts(requestsRes.data || []);

    } catch (error) {
      console.error('Error fetching leave data:', error);
      toast.error('Error', 'Failed to load leave data');
    } finally {
      // setLoading(false);
    }
  };

  const computeCharts = (requests: LeaveRequest[]) => {
    // 1. Leave Type Distribution
    const typeCounts: { [key: string]: number } = {};
    requests.forEach(req => {
      typeCounts[req.leaveType] = (typeCounts[req.leaveType] || 0) + 1;
    });
    const typeData = Object.keys(typeCounts).map((key, index) => ({
      name: key,
      value: typeCounts[key],
      color: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'][index % 5]
    }));
    setLeaveTypeData(typeData);

    // 2. Monthly Trend (Approved/Rejected/Pending)
    const trend: { [key: string]: { month: string, approved: number, pending: number, rejected: number } } = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    requests.forEach(req => {
      const date = new Date(req.created_at || new Date()); // fallback if created_at missing
      const monthIndex = date.getMonth();
      const monthName = months[monthIndex];

      if (!trend[monthName]) {
        trend[monthName] = { month: monthName, approved: 0, pending: 0, rejected: 0 };
      }

      if (req.status === 'Approved') trend[monthName].approved++;
      else if (req.status === 'Pending') trend[monthName].pending++;
      else if (req.status === 'Rejected') trend[monthName].rejected++;
    });

    // Sort by month index if needed, or just values. Simple map for now.
    // Ensure all months? Or just active ones. Let's keep active ones.
    setMonthlyTrend(Object.values(trend));
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'Approved' | 'Rejected', employeeName: string) => {
    try {
      await leaveService.updateStatus(id, status);
      toast.success(`Leave ${status}`, `Leave request for ${employeeName} has been ${status.toLowerCase()}.`);
      fetchLeaveData(); // Refresh data
    } catch (error) {
      toast.error('Error', `Failed to update leave status.`);
    }
  };

  const handleApplyLeaveBatch = async () => {
    if (selectedEmployeesForLeave.length === 0 || !adminLeaveForm.leaveType || !adminLeaveForm.fromDate || !adminLeaveForm.toDate) {
      toast.warning('Required Fields Missing', 'Please fill all required fields');
      return;
    }

    try {
      // Loop through selected employees and apply
      const promises = selectedEmployeesForLeave.map(empId => {
        return leaveService.applyLeave({
          employee_id: empId,
          leave_type: adminLeaveForm.leaveType,
          start_date: adminLeaveForm.fromDate,
          end_date: adminLeaveForm.toDate,
          reason: adminLeaveForm.reason || 'Admin Batch Apply'
        });
      });

      await Promise.all(promises);

      toast.success(
        'Leave Applied Successfully',
        `Successfully applied ${adminLeaveForm.leaveType} for ${selectedEmployeesForLeave.length} employee(s).`
      );

      setShowAdminApplyLeave(false);
      setSelectedEmployeesForLeave([]);
      setAdminLeaveForm({ leaveType: '', fromDate: '', toDate: '', reason: '' });
      fetchLeaveData();
    } catch (error) {
      console.error(error);
      toast.error('Error', 'Failed to apply leave');
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLeaveType, setFilterLeaveType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeaveRequests, setSelectedLeaveRequests] = useState<string[]>([]);
  const itemsPerPage = 6;

  const [balanceSearchTerm, setBalanceSearchTerm] = useState('');
  const [balanceFilterDepartment, setBalanceFilterDepartment] = useState('all');
  const [balanceCurrentPage, setBalanceCurrentPage] = useState(1);
  const [selectedBalanceRecords, setSelectedBalanceRecords] = useState<string[]>([]);
  const balanceItemsPerPage = 6;

  // Admin Apply Leave State
  const [showAdminApplyLeave, setShowAdminApplyLeave] = useState(false);
  const [selectedEmployeesForLeave, setSelectedEmployeesForLeave] = useState<string[]>([]);
  const [adminLeaveForm, setAdminLeaveForm] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.empId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || request.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesLeaveType = filterLeaveType === 'all' || request.leaveType === filterLeaveType;
    return matchesSearch && matchesDepartment && matchesStatus && matchesLeaveType;
  });

  const filteredBalance = leaveBalance.filter((balance) => {
    const matchesSearch =
      balance.employee.toLowerCase().includes(balanceSearchTerm.toLowerCase()) ||
      balance.empId.toLowerCase().includes(balanceSearchTerm.toLowerCase());
    const matchesDepartment = balanceFilterDepartment === 'all' || balance.department === balanceFilterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const balanceTotalPages = Math.ceil(filteredBalance.length / balanceItemsPerPage);
  const paginatedBalance = filteredBalance.slice(
    (balanceCurrentPage - 1) * balanceItemsPerPage,
    balanceCurrentPage * balanceItemsPerPage
  );

  const departments = ['all', ...Array.from(new Set(leaveRequests.map((e) => e.department)))];
  const statuses = ['all', 'Pending', 'Approved', 'Rejected'];
  const leaveTypes = ['all', 'Casual Leave', 'Sick Leave', 'Privilege Leave', 'Compensatory Off'];

  // Handle checkbox selections for leave requests
  const handleSelectAllRequests = (checked: boolean) => {
    if (checked) {
      setSelectedLeaveRequests(paginatedRequests.map(req => req.id));
    } else {
      setSelectedLeaveRequests([]);
    }
  };

  const handleSelectRequest = (reqId: string | number, checked: boolean) => {
    if (checked) {
      setSelectedLeaveRequests([...selectedLeaveRequests, reqId as string]);
    } else {
      setSelectedLeaveRequests(selectedLeaveRequests.filter(id => id !== reqId));
    }
  };

  const selectedRequestObjects = leaveRequests.filter(req =>
    selectedLeaveRequests.includes(req.id)
  );

  // Handle checkbox selections for leave balance
  const handleSelectAllBalance = (checked: boolean) => {
    if (checked) {
      setSelectedBalanceRecords(paginatedBalance.map(bal => bal.empId));
    } else {
      setSelectedBalanceRecords([]);
    }
  };

  const handleSelectBalance = (empId: string | number, checked: boolean) => {
    if (checked) {
      setSelectedBalanceRecords([...selectedBalanceRecords, empId as string]);
    } else {
      setSelectedBalanceRecords(selectedBalanceRecords.filter(id => id !== empId));
    }
  };

  const selectedBalanceObjects = leaveBalance.filter(bal =>
    selectedBalanceRecords.includes(bal.empId)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  // Leave Requests DataTable columns
  const leaveRequestsColumns: TableColumn[] = [
    {
      header: t('leave.requestId'),
      accessor: 'id',
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-blue-600">{row.id}</span>
      ),
    },
    {
      header: t('leave.employee'),
      accessor: 'employee',
      sortable: true,
      cell: (row) => (
        <AvatarCell
          name={row.employee}
          subtitle={`${row.empId} • ${row.department}`}
        />
      ),
    },
    {
      header: t('leave.leaveType'),
      accessor: 'leaveType',
      sortable: true,
      cell: (row) => (
        <Badge variant="outline" className="border-blue-200 text-blue-700">{row.leaveType}</Badge>
      ),
    },
    {
      header: t('leave.duration'),
      accessor: 'from',
      sortable: true,
      cell: (row) => (
        <div className="text-sm">
          <p className="font-medium text-gray-900">{row.from}</p>
          <p className="text-gray-500">to {row.to}</p>
        </div>
      ),
    },
    {
      header: t('leave.days'),
      accessor: 'days',
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-gray-900">{row.days} day{row.days > 1 ? 's' : ''}</span>
      ),
    },
    {
      header: t('leave.reason'),
      accessor: 'reason',
      cell: (row) => (
        <span className="text-sm text-gray-600">{row.reason}</span>
      ),
    },
    {
      header: t('leave.status'),
      accessor: 'status',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(row.status)}
          <Badge className={getStatusBadge(row.status)}>{row.status}</Badge>
        </div>
      ),
    },
    {
      header: t('leave.actions'),
      cell: (row) => (
        row.status === 'Pending' ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleUpdateStatus(row.id, 'Approved', row.employee)}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={() => handleUpdateStatus(row.id, 'Rejected', row.employee)}
            >
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-sm text-gray-500">No action</span>
        )
      ),
    },
  ];

  // Leave Balance DataTable columns
  const leaveBalanceColumns: TableColumn[] = [
    {
      header: t('leave.employee'),
      accessor: 'employee',
      sortable: true,
      cell: (row) => (
        <AvatarCell
          name={row.employee}
          subtitle={`${row.empId} • ${row.department}`}
        />
      ),
    },
    {
      header: t('leave.casualLeave'),
      accessor: 'casual',
      sortable: true,
      cell: (row) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">{row.casual}</span>
      ),
    },
    {
      header: t('leave.sickLeave'),
      accessor: 'sick',
      sortable: true,
      cell: (row) => (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">{row.sick}</span>
      ),
    },
    {
      header: t('leave.privilegeLeave'),
      accessor: 'privilege',
      sortable: true,
      cell: (row) => (
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">{row.privilege}</span>
      ),
    },
    {
      header: t('leave.compOff'),
      accessor: 'compensatory',
      sortable: true,
      cell: (row) => (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">{row.compensatory}</span>
      ),
    },
    {
      header: t('leave.totalAvailable'),
      sortable: true,
      cell: (row) => (
        <div>
          <span className="text-xl font-medium text-gray-900">
            {row.casual + row.sick + row.privilege + row.compensatory}
          </span>
          <span className="text-sm text-gray-500 ml-1">{t('leave.days')}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-medium text-gray-900">{t('leave.title')}</h1>
        <p className="text-gray-600 mt-1">{t('leave.subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('leave.pendingRequests')}
          value={leaveStats.pendingRequests?.toString() || '0'}
          subtitle={`+5% ${t('common.fromLastMonth')}`}
          icon={Clock}
          iconColor="text-yellow-600"
          variant="default"
        />

        <StatCard
          title={t('leave.approvedThisMonth')}
          value={leaveStats.approvedThisMonth?.toString() || '0'}
          subtitle={`+12% ${t('common.fromLastMonth')}`}
          icon={CheckCircle}
          iconColor="text-green-600"
          variant="default"
        />

        <StatCard
          title={t('leave.rejectedThisMonth')}
          value={leaveStats.rejectedThisMonth?.toString() || '0'}
          subtitle={`-3% ${t('common.fromLastMonth')}`}
          icon={XCircle}
          iconColor="text-red-600"
          variant="default"
        />

        <StatCard
          title={t('leave.onLeaveToday')}
          value={leaveStats.onLeaveToday?.toString() || '0'}
          subtitle={`${Math.round((leaveStats.onLeaveToday / 500) * 100)}% ${t('common.ofTotal')}`}
          icon={Users}
          iconColor="text-blue-600"
          variant="default"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('leave.leaveRequestTrends')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" fill="#10b981" name={t('leave.approved')} />
                <Bar dataKey="pending" fill="#f59e0b" name={t('leave.pending')} />
                <Bar dataKey="rejected" fill="#ef4444" name={t('leave.rejected')} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('leave.leaveDistributionByType')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leaveTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leaveTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">{t('leave.requests')}</TabsTrigger>
          <TabsTrigger value="balance">{t('leave.balance')}</TabsTrigger>


        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <h3 className="font-medium text-gray-900">{t('leave.filters')}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search-requests"
                    name="search"
                    placeholder={t('leave.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={filterDepartment}
                  onValueChange={(value: string) => {
                    setFilterDepartment(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('leave.departmentPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('leave.allDepartments')}</SelectItem>
                    {departments.slice(1).map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filterStatus}
                  onValueChange={(value: string) => {
                    setFilterStatus(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('leave.statusPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('leave.allStatuses')}</SelectItem>
                    {statuses.slice(1).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filterLeaveType}
                  onValueChange={(value: string) => {
                    setFilterLeaveType(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('leave.leaveTypePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('leave.allLeaveTypes')}</SelectItem>
                    {leaveTypes.slice(1).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {t('leave.showingRequests', { current: filteredRequests.length, total: leaveRequests.length })}
                </div>
                <Button
                  onClick={() => setShowAdminApplyLeave(!showAdminApplyLeave)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('leave.applyLeaveBatch')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Apply Leave Panel */}
          {showAdminApplyLeave && (
            <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-purple-900 flex items-center gap-2">
                    <UserPlus className="w-6 h-6" />
                    Apply Leave to Employees (Admin)
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAdminApplyLeave(false);
                      setSelectedEmployeesForLeave([]);
                      setAdminLeaveForm({ leaveType: '', fromDate: '', toDate: '', reason: '' });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-purple-700 mt-1">
                  Select employee(s) and apply auto-approved leave. This feature is only available for administrators.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Employee Selection */}
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <Label className="text-purple-900 mb-3 block">Select Employees</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                    {employees.map((emp) => (
                      <div key={emp.id} className="flex items-center gap-2 p-2 hover:bg-purple-50 rounded">
                        {/* @ts-ignore */}
                        <Checkbox
                          checked={selectedEmployeesForLeave.includes(emp.id)}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              setSelectedEmployeesForLeave([...selectedEmployeesForLeave, emp.id]);
                            } else {
                              setSelectedEmployeesForLeave(selectedEmployeesForLeave.filter(id => id !== emp.id));
                            }
                          }}
                        />
                        <label className="cursor-pointer flex-1">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{emp.first_name} {emp.last_name}</p>
                            <p className="text-xs text-gray-500">{emp.employee_code || emp.id} • {emp.department_name || emp.department}</p>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedEmployeesForLeave.length > 0 && (
                    <div className="mt-3 p-2 bg-purple-100 rounded text-sm text-purple-900">
                      <strong>{selectedEmployeesForLeave.length}</strong> employee(s) selected
                    </div>
                  )}
                </div>

                {/* Leave Details Form */}
                <div className="bg-white rounded-lg p-4 border border-purple-200 space-y-4">
                  <h4 className="font-medium text-purple-900">Leave Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Leave Type</Label>
                      <Select
                        value={adminLeaveForm.leaveType}
                        onValueChange={(value: string) => setAdminLeaveForm({ ...adminLeaveForm, leaveType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                          <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                          <SelectItem value="Privilege Leave">Privilege Leave</SelectItem>
                          <SelectItem value="Compensatory Off">Compensatory Off</SelectItem>
                          <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                          <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>From Date</Label>
                      <Input
                        id="admin-leave-from"
                        name="fromDate"
                        type="date"
                        value={adminLeaveForm.fromDate}
                        onChange={(e) => setAdminLeaveForm({ ...adminLeaveForm, fromDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>To Date</Label>
                      <Input
                        id="admin-leave-to"
                        name="toDate"
                        type="date"
                        value={adminLeaveForm.toDate}
                        onChange={(e) => setAdminLeaveForm({ ...adminLeaveForm, toDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Total Days</Label>
                      <Input
                        id="admin-leave-days"
                        name="totalDays"
                        type="text"
                        value={
                          adminLeaveForm.fromDate && adminLeaveForm.toDate
                            ? Math.ceil((new Date(adminLeaveForm.toDate).getTime() - new Date(adminLeaveForm.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
                            : 0
                        }
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Reason (Optional)</Label>
                    <Textarea
                      id="admin-leave-reason"
                      name="reason"
                      placeholder="Enter reason for leave..."
                      value={adminLeaveForm.reason}
                      onChange={(e) => setAdminLeaveForm({ ...adminLeaveForm, reason: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAdminApplyLeave(false);
                      setSelectedEmployeesForLeave([]);
                      setAdminLeaveForm({ leaveType: '', fromDate: '', toDate: '', reason: '' });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                    onClick={handleApplyLeaveBatch}
                    disabled={selectedEmployeesForLeave.length === 0 || !adminLeaveForm.leaveType || !adminLeaveForm.fromDate || !adminLeaveForm.toDate}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Apply Leave (Auto-Approved)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leave Requests Table */}
          <DataTable
            columns={leaveRequestsColumns}
            data={paginatedRequests}
            selectable
            selectedRows={selectedRequestObjects}
            onSelectRow={handleSelectRequest}
            onSelectAll={handleSelectAllRequests}
            exportable
            sortable
            exportFileName="leave-requests"
            exportHeaders={['Request ID', 'Employee', 'Emp ID', 'Department', 'Leave Type', 'From', 'To', 'Days', 'Reason', 'Status']}
            headerStyle="gradient"
            cellPadding="relaxed"
            emptyMessage={t('leave.noRequests')}
          />

          {filteredRequests.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredRequests.length}
            />
          )}
        </TabsContent>

        <TabsContent value="balance" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <h3 className="font-medium text-gray-900">{t('leave.filters')}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={t('leave.searchEmployeesPlaceholder')}
                    value={balanceSearchTerm}
                    onChange={(e) => {
                      setBalanceSearchTerm(e.target.value);
                      setBalanceCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={balanceFilterDepartment}
                  onValueChange={(value: string) => {
                    setBalanceFilterDepartment(value);
                    setBalanceCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('leave.departmentPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('leave.allDepartments')}</SelectItem>
                    {departments.slice(1).map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                {t('common.showing')} {filteredBalance.length} {t('common.of')} {leaveBalance.length} {t('common.employees')}
              </div>
            </CardContent>
          </Card>

          {/* Leave Balance Table */}
          <DataTable
            columns={leaveBalanceColumns}
            data={paginatedBalance}
            selectable
            selectedRows={selectedBalanceObjects}
            onSelectRow={handleSelectBalance}
            onSelectAll={handleSelectAllBalance}
            getRowId={(row) => row.empId}
            exportable
            sortable
            exportFileName="leave-balance"
            exportHeaders={['Employee', 'Emp ID', 'Department', 'Casual Leave', 'Sick Leave', 'Privilege Leave', 'Comp Off', 'Total Available']}
            headerStyle="gradient"
            cellPadding="relaxed"
            emptyMessage={t('leave.noBalance')}
          />

          {filteredBalance.length > 0 && (
            <Pagination
              currentPage={balanceCurrentPage}
              totalPages={balanceTotalPages}
              onPageChange={setBalanceCurrentPage}
              itemsPerPage={balanceItemsPerPage}
              totalItems={filteredBalance.length}
            />
          )}
        </TabsContent>




      </Tabs>
    </div >
  );
}