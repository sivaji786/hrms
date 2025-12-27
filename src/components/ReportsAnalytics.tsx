import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Download, FileText, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatCard, CurrencyIcon } from './common';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useState } from 'react';

const headcountTrend = [
  { month: 'Jan', total: 1186, joined: 24, exited: 8 },
  { month: 'Feb', total: 1202, joined: 19, exited: 3 },
  { month: 'Mar', total: 1220, joined: 22, exited: 4 },
  { month: 'Apr', total: 1235, joined: 18, exited: 3 },
  { month: 'May', total: 1242, joined: 15, exited: 8 },
  { month: 'Jun', total: 1248, joined: 12, exited: 6 },
];

const attendanceTrend = [
  { month: 'Jan', avgAttendance: 94.2, lateArrivals: 3.5, leaves: 2.3 },
  { month: 'Feb', avgAttendance: 93.8, lateArrivals: 3.8, leaves: 2.4 },
  { month: 'Mar', avgAttendance: 94.5, lateArrivals: 3.2, leaves: 2.3 },
  { month: 'Apr', avgAttendance: 93.6, lateArrivals: 4.1, leaves: 2.3 },
  { month: 'May', avgAttendance: 94.1, lateArrivals: 3.6, leaves: 2.3 },
  { month: 'Jun', avgAttendance: 94.8, lateArrivals: 3.1, leaves: 2.1 },
];

const payrollTrend = [
  { month: 'Jan', gross: 82.5, net: 66.0 },
  { month: 'Feb', gross: 81.8, net: 65.4 },
  { month: 'Mar', gross: 84.2, net: 67.4 },
  { month: 'Apr', gross: 83.5, net: 66.8 },
  { month: 'May', gross: 85.8, net: 68.6 },
  { month: 'Jun', gross: 87.2, net: 69.8 },
];

const ageDistribution = [
  { range: '20-25', count: 142 },
  { range: '26-30', count: 385 },
  { range: '31-35', count: 428 },
  { range: '36-40', count: 195 },
  { range: '41-45', count: 72 },
  { range: '46+', count: 26 },
];

const attritionData = [
  { month: 'Jan', voluntary: 6, involuntary: 2 },
  { month: 'Feb', voluntary: 2, involuntary: 1 },
  { month: 'Mar', voluntary: 3, involuntary: 1 },
  { month: 'Apr', voluntary: 2, involuntary: 1 },
  { month: 'May', voluntary: 7, involuntary: 1 },
  { month: 'Jun', voluntary: 5, involuntary: 1 },
];

interface ReportsAnalyticsProps {
  onPreviewReport?: (reportType: string) => void;
}

export default function ReportsAnalytics({ onPreviewReport }: ReportsAnalyticsProps = {}) {
  const [activeTab, setActiveTab] = useState('overview');
  const { t } = useLanguage();
  const { formatCurrency, convertAmount } = useCurrency();

  const departmentDistribution = [
    { name: t('reports.engineering'), value: 420, color: '#3b82f6' },
    { name: t('reports.sales'), value: 285, color: '#8b5cf6' },
    { name: t('reports.marketing'), value: 168, color: '#ec4899' },
    { name: t('reports.hr'), value: 95, color: '#f59e0b' },
    { name: t('reports.finance'), value: 142, color: '#10b981' },
    { name: t('reports.operations'), value: 138, color: '#6366f1' },
  ];

  const genderDistribution = [
    { name: t('reports.male'), value: 748, color: '#3b82f6' },
    { name: t('reports.female'), value: 472, color: '#ec4899' },
    { name: t('reports.other'), value: 28, color: '#8b5cf6' },
  ];

  const reportTemplates = [
    { id: 'employeeMaster', name: t('reports.employeeMasterReport'), description: t('reports.employeeMasterDesc'), icon: Users },
    { id: 'attendance', name: t('reports.monthlyAttendanceReport'), description: t('reports.monthlyAttendanceDesc'), icon: Calendar },
    { id: 'payroll', name: t('reports.payrollSummaryReport'), description: t('reports.payrollSummaryDesc'), icon: DollarSign },
    { id: 'leaveBalance', name: t('reports.leaveBalanceReport'), description: t('reports.leaveBalanceDesc'), icon: Calendar },
    { id: 'performance', name: t('reports.performanceReport'), description: t('reports.performanceDesc'), icon: TrendingUp },
    { id: 'headcount', name: t('reports.headcountReport'), description: t('reports.headcountDesc'), icon: Users },
    { id: 'attrition', name: t('reports.attritionReport'), description: t('reports.attritionDesc'), icon: FileText },
    { id: 'recruitment', name: t('reports.recruitmentReport'), description: t('reports.recruitmentDesc'), icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('reports.totalHeadcount')}
          value="1,248"
          subtitle={`+6 ${t('reports.thisMonth')}`}
          icon={Users}
          iconColor="text-blue-500"
          variant="default"
        />
        <StatCard
          title={t('reports.avgAttendance')}
          value="94.8%"
          subtitle={`+0.7% ${t('reports.fromLastMonth')}`}
          icon={Calendar}
          iconColor="text-green-500"
          variant="default"
        />
        <StatCard
          title={t('reports.attritionRate')}
          value="2.1%"
          subtitle={`6 ${t('reports.exitsThisMonth')}`}
          icon={TrendingUp}
          iconColor="text-orange-500"
          variant="default"
        />
        <StatCard
          title={t('reports.totalPayroll')}
          value={formatCurrency(convertAmount(8720000), { compact: true, decimals: 1 })}
          subtitle={`+1.6% ${t('reports.growth')}`}
          icon={CurrencyIcon}
          iconColor="text-purple-500"
          variant="default"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="overview">{t('reports.overview')}</TabsTrigger>
            <TabsTrigger value="headcount">{t('reports.headcountAnalytics')}</TabsTrigger>
            <TabsTrigger value="attendance">{t('reports.attendanceAnalytics')}</TabsTrigger>
            <TabsTrigger value="payroll">{t('reports.payrollAnalytics')}</TabsTrigger>
            <TabsTrigger value="templates">{t('reports.reportTemplates')}</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Select defaultValue="6months">
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('reports.selectPeriod')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">{t('reports.lastMonth')}</SelectItem>
                <SelectItem value="3months">{t('reports.last3Months')}</SelectItem>
                <SelectItem value="6months">{t('reports.last6Months')}</SelectItem>
                <SelectItem value="1year">{t('reports.lastYear')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('reports.headcountTrend6Months')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={headcountTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#3b82f6" name={t('reports.totalEmployees')} strokeWidth={2} />
                    <Line type="monotone" dataKey="joined" stroke="#10b981" name={t('reports.joined')} />
                    <Line type="monotone" dataKey="exited" stroke="#ef4444" name={t('reports.exited')} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('reports.departmentDistribution')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('reports.attendanceTrend')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgAttendance" stroke="#10b981" name={t('reports.avgAttendanceLabel')} strokeWidth={2} />
                    <Line type="monotone" dataKey="lateArrivals" stroke="#f59e0b" name={t('reports.lateArrivals')} />
                    <Line type="monotone" dataKey="leaves" stroke="#8b5cf6" name={t('reports.leaves')} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('reports.payrollTrend')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={payrollTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="gross" fill="#3b82f6" name={t('reports.grossSalary')} />
                    <Bar dataKey="net" fill="#10b981" name={t('reports.netSalary')} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="headcount" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('reports.ageDistribution')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ageDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" name={t('reports.employees')} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('reports.genderDistribution')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genderDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t('reports.attritionTrend')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attritionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="voluntary" fill="#ef4444" name={t('reports.voluntary')} />
                    <Bar dataKey="involuntary" fill="#f59e0b" name={t('reports.involuntary')} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.attendanceMetrics')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgAttendance" stroke="#10b981" name={t('reports.avgAttendancePercent')} strokeWidth={3} />
                  <Line type="monotone" dataKey="lateArrivals" stroke="#f59e0b" name={t('reports.lateArrivalsPercent')} />
                  <Line type="monotone" dataKey="leaves" stroke="#8b5cf6" name={t('reports.leavesPercent')} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.payrollTrendLast6Months')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={payrollTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(convertAmount(Number(value) * 100000), { compact: true, decimals: 1 })} />
                  <Legend />
                  <Bar dataKey="gross" fill="#3b82f6" name={t('reports.grossSalaryLakhs')} />
                  <Bar dataKey="net" fill="#10b981" name={t('reports.netSalaryLakhs')} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template, index) => {
              const Icon = template.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{template.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => onPreviewReport?.(template.id)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            {t('reports.preview')}
                          </Button>
                          <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600">
                            <Download className="w-4 h-4 mr-2" />
                            {t('reports.download')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}