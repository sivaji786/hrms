import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import StatCard from './common/StatCard';
import {
  getEmployeeLeaveRequests,
  getEmployeeLeaveBalance,
  CURRENT_EMPLOYEE_ID
} from '../data/employeePortalData';

export default function MyLeaves() {
  const { t } = useLanguage();

  // Get employee leave data from shared data source
  const leaveBalance = getEmployeeLeaveBalance(CURRENT_EMPLOYEE_ID);
  const leaveRequestsData = getEmployeeLeaveRequests(CURRENT_EMPLOYEE_ID);

  const totalBalance = leaveBalance.casual + leaveBalance.sick + leaveBalance.privilege + leaveBalance.compensatory;
  const usedLeaves = 25 - totalBalance; // Assuming 25 is the annual quota
  const pendingCount = leaveRequestsData.filter(req => req.status === 'Pending').length;
  const approvedCount = leaveRequestsData.filter(req => req.status === 'Approved').length;

  const stats = [
    {
      title: t('employee.totalLeaveBalance'),
      value: totalBalance.toString(),
      subtitle: t('employee.daysRemaining'),
      icon: Calendar,
      trend: { value: 2, isPositive: true },
    },
    {
      title: t('employee.usedLeaves'),
      value: usedLeaves.toString(),
      subtitle: t('employee.thisYear'),
      icon: Calendar,
      trend: { value: 0, isPositive: true },
    },
    {
      title: t('employee.pendingRequests'),
      value: pendingCount.toString(),
      subtitle: t('employee.awaitingApproval'),
      icon: Calendar,
      trend: { value: 0, isPositive: true },
    },
    {
      title: t('employee.approvedLeaves'),
      value: approvedCount.toString(),
      subtitle: t('employee.thisYear'),
      icon: Calendar,
      trend: { value: 2, isPositive: true },
    },
  ];

  const leaveRequests = leaveRequestsData.map(req => ({
    id: req.id,
    type: req.leaveType,
    startDate: req.from,
    endDate: req.to,
    days: req.days,
    status: req.status,
    approvedBy: req.status === 'Approved' ? 'Manager' : '-',
    appliedOn: req.appliedOn,
  }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{t('common.approved')}</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">{t('common.pending')}</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{t('common.rejected')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <Plus className="w-4 h-4 mr-2" />
          {t('employee.requestLeave')}
        </Button>
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

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('employee.leaveHistory')}</CardTitle>
          <CardDescription>{t('employee.viewAllLeaveRequests')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('common.type')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('common.startDate')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('common.endDate')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('employee.days')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('common.status')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('employee.approvedBy')}</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((leave) => (
                  <tr key={leave.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{leave.type}</td>
                    <td className="py-3 px-4">{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{leave.days}</td>
                    <td className="py-3 px-4">{getStatusBadge(leave.status)}</td>
                    <td className="py-3 px-4 text-gray-600">{leave.approvedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}