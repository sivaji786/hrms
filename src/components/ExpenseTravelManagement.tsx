import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { TrendingUp, Clock, CheckCircle, Search, Plus, Download, Calendar, MapPin, Plane, CreditCard, Filter, Receipt, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Pagination } from './common';

import { StatCard, StatusBadge, CurrencyDisplay } from './common';
import { toast } from '../utils/toast';
import type { Expense, TravelRequest } from '../data/expenseData';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import DataTable, { TableColumn } from './common/DataTable';
import { AvatarCell } from './common/TableCells';
import ExpenseDetails from './expense/ExpenseDetails';
import TravelDetails from './expense/TravelDetails';
import SubmitExpensePage from './expense/SubmitExpensePage';
import RequestTravelPage from './expense/RequestTravelPage';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { expenseService, travelService } from '../services/api';


export default function ExpenseTravelManagement() {
  const { t } = useLanguage();
  const { formatCurrency, convertAmount } = useCurrency();
  const [activeTab, setActiveTab] = useState<string>('expenses');
  const [view, setView] = useState<'list' | 'submit-expense' | 'request-travel'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [travelCurrentPage, setTravelCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [travelSearchTerm, setTravelSearchTerm] = useState('');
  const [travelStatusFilter, setTravelStatusFilter] = useState('all');
  const [travelTypeFilter, setTravelTypeFilter] = useState('all');
  const itemsPerPage = 10;

  // Data states
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [travelRequests, setTravelRequests] = useState<TravelRequest[]>([]);
  const [expenseStats, setExpenseStats] = useState<any>({
    totalExpenses: 0,
    pendingApproval: 0,
    pendingAmount: 0,
    reimbursedExpenses: 0
  });
  const [travelStats, setTravelStats] = useState<any>({
    totalRequests: 0,
    pendingRequests: 0,
    completedTrips: 0,
    totalEstimatedCost: 0,
    totalActualCost: 0,
    savings: 0
  });
  const [expenseCategoryData, setExpenseCategoryData] = useState<any[]>([]);
  const [monthlyExpenseData, setMonthlyExpenseData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Expense detail sheet
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isExpenseSheetOpen, setIsExpenseSheetOpen] = useState(false);

  // Travel detail sheet
  const [selectedTravel, setSelectedTravel] = useState<TravelRequest | null>(null);
  const [isTravelSheetOpen, setIsTravelSheetOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [expensesData, travelData, expStats, travStats] = await Promise.all([
        expenseService.getAll(),
        travelService.getAll(),
        expenseService.getStats(),
        travelService.getStats()
      ]);
      setExpenses(expensesData);
      setTravelRequests(travelData);
      setExpenseStats(expStats);
      setTravelStats(travStats);
      setExpenseCategoryData(expStats.categoryData || []);
      setMonthlyExpenseData(expStats.monthlyData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = () => {
    toast.success('Export Started', 'Expense & Travel data will be downloaded as CSV file.');
  };

  const handleApproveExpense = async (expense: Expense) => {
    try {
      await expenseService.update(expense.id, { status: 'Approved' });
      toast.success(t('expense.approved'), `${t('expense.expense')} ${expense.id} ${t('common.approved')} (${formatCurrency(convertAmount(expense.amount))}) has been approved!`);
      fetchData();
    } catch (error) {
      toast.error('Failed to approve expense');
    }
  };

  const handleRejectExpense = async (expense: Expense) => {
    try {
      await expenseService.update(expense.id, { status: 'Rejected' });
      toast.error('Expense Rejected', `Expense claim for ${expense.employeeName} (${formatCurrency(convertAmount(expense.amount))}) has been rejected.`);
      fetchData();
    } catch (error) {
      toast.error('Failed to reject expense');
    }
  };

  const handleApproveTravel = async (travel: TravelRequest) => {
    try {
      await travelService.update(travel.id, { status: 'Approved' });
      toast.success(t('expense.approved'), `${t('travel.request')} ${travel.id} ${t('common.approved')} to ${travel.to} has been approved!`);
      fetchData();
    } catch (error) {
      toast.error('Failed to approve travel request');
    }
  };

  const handleRejectTravel = async (travel: TravelRequest) => {
    try {
      await travelService.update(travel.id, { status: 'Rejected' });
      toast.error('Travel Request Rejected', `Travel request for ${travel.employeeName} to ${travel.to} has been rejected.`);
      fetchData();
    } catch (error) {
      toast.error('Failed to reject travel request');
    }
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = (expense.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    const matchesType = typeFilter === 'all' || expense.category === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalExpensePages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const expenseStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(expenseStartIndex, expenseStartIndex + itemsPerPage);

  // Filter travel requests
  const filteredTravelRequests = travelRequests.filter((travel) => {
    const matchesSearch = (travel.employeeName || '').toLowerCase().includes(travelSearchTerm.toLowerCase()) ||
      (travel.purpose || '').toLowerCase().includes(travelSearchTerm.toLowerCase()) ||
      (travel.to || '').toLowerCase().includes(travelSearchTerm.toLowerCase());
    const matchesStatus = travelStatusFilter === 'all' || travel.status === travelStatusFilter;
    const matchesType = travelTypeFilter === 'all' || travel.tripType === travelTypeFilter; // Note: travel.type changed to travel.tripType based on data
    return matchesSearch && matchesStatus && matchesType;
  });


  const travelStartIndex = (travelCurrentPage - 1) * itemsPerPage;
  const paginatedTravelRequests = filteredTravelRequests.slice(travelStartIndex, travelStartIndex + itemsPerPage);







  // Expense columns for DataTable
  const expenseColumns: TableColumn[] = [
    {
      header: t('expense.employee'),
      accessor: 'employeeName',
      sortable: true,
      cell: (row) => (
        <AvatarCell
          name={row.employeeName}
          subtitle={row.department}
        />
      ),
    },
    {
      header: t('expense.category'),
      accessor: 'category',
      sortable: true,
      cell: (row) => (
        <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">{row.category}</Badge>
      ),
    },
    {
      header: t('expense.description'),
      accessor: 'description',
      sortable: true,
    },
    {
      header: t('expense.date'),
      accessor: 'date',
      sortable: true,
      cell: (row) => (
        <p className="text-gray-600">{new Date(row.date).toLocaleDateString()}</p>
      ),
    },
    {
      header: t('expense.amount'),
      accessor: 'amount',
      sortable: true,
      cell: (row) => (
        <p className="font-medium text-gray-900"><CurrencyDisplay amount={row.amount} /></p>
      ),
    },
    {
      header: t('expense.status'),
      accessor: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: t('expense.receipts'),
      accessor: 'receipts',
      sortable: true,
      cell: (row) => (
        <p className="text-gray-600">{row.receipts || 0} {t('expense.file')}</p>
      ),
    },
    {
      header: t('expense.actions'),
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setSelectedExpense(row); setIsExpenseSheetOpen(true); }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {row.status === 'Pending' && (
            <>
              <Button
                className="bg-green-600 hover:bg-green-700"
                size="sm"
                onClick={() => handleApproveExpense(row)}
              >
                {t('expense.approve')}
              </Button>
              <Button
                variant="outline"
                className="text-red-600"
                size="sm"
                onClick={() => handleRejectExpense(row)}
              >
                {t('expense.reject')}
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (view === 'submit-expense') {
    return (
      <SubmitExpensePage
        onBack={() => setView('list')}
        onSuccess={() => {
          setView('list');
          fetchData();
        }}
      />
    );
  }

  if (view === 'request-travel') {
    return (
      <RequestTravelPage
        onBack={() => setView('list')}
        onSuccess={() => {
          setView('list');
          fetchData();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('expense.title')}</h2>
          <p className="text-gray-600">{t('expense.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setView('submit-expense')} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            {t('expense.submitExpense')}
          </Button>
          <Button onClick={() => setView('request-travel')} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
            <Plane className="w-4 h-4" />
            {t('expense.requestTravel')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeTab === 'expenses' ? (
          <>
            <StatCard
              title={t('expense.totalExpenses')}
              value={<CurrencyDisplay amount={expenseStats.totalExpenses || 0} />}
              icon={CreditCard}
              trend={{ value: 12.5, isPositive: true }}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
              borderColor="border-t-blue-600"
            />
            <StatCard
              title={t('expense.pendingApproval')}
              value={expenseStats.pendingApproval || 0}
              icon={Clock}
              subtitle={formatCurrency(convertAmount(expenseStats.pendingAmount || 0))}
              iconColor="text-yellow-600"
              iconBgColor="bg-yellow-100"
              borderColor="border-t-yellow-600"
            />
            <StatCard
              title={t('expense.reimbursed')}
              value={expenseStats.reimbursedExpenses || 0}
              icon={CheckCircle}
              trend={{ value: 5.2, isPositive: true }}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
              borderColor="border-t-green-600"
            />
            <StatCard
              title="Avg. Processing Time"
              value="2.5 Days"
              icon={TrendingUp}
              trend={{ value: 10, isPositive: true }}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
              borderColor="border-t-purple-600"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Total Requests"
              value={travelStats.totalRequests || 0}
              icon={Plane}
              trend={{ value: 8.5, isPositive: true }}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
              borderColor="border-t-purple-600"
            />
            <StatCard
              title="Pending Approval"
              value={travelStats.pendingRequests || 0}
              icon={Clock}
              subtitle="Requires Action"
              iconColor="text-yellow-600"
              iconBgColor="bg-yellow-100"
              borderColor="border-t-yellow-600"
            />
            <StatCard
              title="Completed Trips"
              value={travelStats.completedTrips || 0}
              icon={CheckCircle}
              trend={{ value: 12, isPositive: true }}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
              borderColor="border-t-green-600"
            />
            <StatCard
              title="Travel Budget"
              value={<CurrencyDisplay amount={travelStats.totalEstimatedCost || 0} />}
              icon={CreditCard}
              subtitle={`Actual: ${formatCurrency(convertAmount(travelStats.totalActualCost || 0))}`}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
              borderColor="border-t-blue-600"
            />
          </>
        )}
      </div>

      <Tabs defaultValue="expenses" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="expenses" className="gap-2">
            <Receipt className="w-4 h-4" />
            {t('expense.expenseClaims')}
          </TabsTrigger>
          <TabsTrigger value="travel" className="gap-2">
            <Plane className="w-4 h-4" />
            {t('expense.travelRequests')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t('expense.monthlyTrend')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyExpenseData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(convertAmount(value))}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('expense.byCategory')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {expenseCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(convertAmount(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>{t('expense.recentClaims')}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder={t('common.search')}
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="w-4 h-4 mr-2 text-gray-500" />
                      <SelectValue placeholder={t('common.status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Reimbursed">Reimbursed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    {t('common.export')}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={expenseColumns}
                data={paginatedExpenses}
                loading={isLoading}
                onRowClick={(row) => {
                  setSelectedExpense(row);
                  setIsExpenseSheetOpen(true);
                }}
              />

              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalExpensePages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="travel" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>{t('expense.travelRequests')}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder={t('common.search')}
                      className="pl-9"
                      value={travelSearchTerm}
                      onChange={(e) => setTravelSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={travelStatusFilter} onValueChange={setTravelStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="w-4 h-4 mr-2 text-gray-500" />
                      <SelectValue placeholder={t('common.status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={travelTypeFilter} onValueChange={setTravelTypeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Plane className="w-4 h-4 mr-2 text-gray-500" />
                      <SelectValue placeholder="Trip Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Domestic">Domestic</SelectItem>
                      <SelectItem value="International">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTravelRequests.map((travel) => (
                  <Card
                    key={travel.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedTravel(travel);
                      setIsTravelSheetOpen(true);
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{travel.purpose}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{travel.employeeName} • {travel.department}</p>
                        </div>
                        <StatusBadge status={travel.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">{travel.from} → {travel.to}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge className={travel.tripType === 'Domestic' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-purple-100 text-purple-700 border-purple-200'}>
                            {travel.tripType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{new Date(travel.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Plane className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{travel.travelMode}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <p className="text-sm text-gray-600">{t('expense.estimatedCost')}</p>
                          <p className="font-medium text-gray-900"><CurrencyDisplay amount={travel.estimatedCost} /></p>
                        </div>
                        {travel.actualCost && (
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Actual Cost</p>
                            <p className="font-medium text-gray-900"><CurrencyDisplay amount={travel.actualCost} /></p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {paginatedTravelRequests.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No travel requests found matching your filters.
                </div>
              )}

              <div className="mt-6">
                <Pagination
                  currentPage={travelCurrentPage}
                  totalPages={Math.ceil(filteredTravelRequests.length / itemsPerPage)}
                  onPageChange={setTravelCurrentPage}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Expense Details Sheet */}
      <Sheet open={isExpenseSheetOpen} onOpenChange={setIsExpenseSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Expense Details</SheetTitle>
            <SheetDescription>View and manage expense claim details</SheetDescription>
          </SheetHeader>
          {selectedExpense && (
            <ExpenseDetails
              expense={selectedExpense}
              onBack={() => setIsExpenseSheetOpen(false)}
              onApprove={() => handleApproveExpense(selectedExpense)}
              onReject={() => handleRejectExpense(selectedExpense)}
              onClose={() => setIsExpenseSheetOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Travel Details Sheet */}
      <Sheet open={isTravelSheetOpen} onOpenChange={setIsTravelSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Travel Request Details</SheetTitle>
            <SheetDescription>View and manage travel request details</SheetDescription>
          </SheetHeader>
          {selectedTravel && (
            <TravelDetails
              travel={selectedTravel}
              onBack={() => setIsTravelSheetOpen(false)}
              onApprove={() => handleApproveTravel(selectedTravel)}
              onReject={() => handleRejectTravel(selectedTravel)}
              onClose={() => setIsTravelSheetOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}