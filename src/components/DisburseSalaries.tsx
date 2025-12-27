import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, Download, CheckCircle, Calendar } from 'lucide-react';
import { StatCard, CurrencyDisplay, CurrencyIcon } from './common';
import Breadcrumbs from './Breadcrumbs';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import DataTable, { TableColumn } from './common/DataTable';
import { AvatarCell } from './common/TableCells';

interface DisburseSalariesProps {
  onBack: () => void;
  selectedEmployees: Array<{
    id: string;
    name: string;
    department: string;
    netSalary: number;
    month: string;
  }>;
}

export default function DisburseSalaries({ onBack, selectedEmployees }: DisburseSalariesProps) {
  const { t } = useLanguage();
  const { formatCurrency, convertAmount } = useCurrency();
  const disbursementDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const disbursementTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalAmount = selectedEmployees.reduce((sum, emp) => sum + emp.netSalary, 0);
  const transactionId = `TXN${Date.now().toString().slice(-10)}`;

  const breadcrumbItems = [
    { label: t('nav.dashboard') },
    { label: t('payroll.title') },
    { label: t('payroll.disburseSalaries') },
  ];

  const handleExport = () => {
    const headers = ['Employee ID', 'Employee Name', 'Department', 'Net Salary', 'Month', 'Status', 'Transaction Date'];
    const csvContent = [
      headers.join(','),
      ...selectedEmployees.map((emp) =>
        [
          emp.id,
          emp.name,
          emp.department,
          emp.netSalary,
          emp.month,
          'Disbursed',
          disbursementDate,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salary-disbursement-${transactionId}.csv`;
    a.click();
  };

  // Disbursed employees columns for DataTable
  const disbursedColumns: TableColumn[] = [
    {
      header: t('payroll.employee'),
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <AvatarCell
          name={row.name}
          subtitle={row.id}
        />
      ),
    },
    {
      header: t('payroll.department'),
      accessor: 'department',
      sortable: true,
    },
    {
      header: t('payroll.month'),
      accessor: 'month',
      sortable: true,
    },
    {
      header: t('payroll.netSalary'),
      accessor: 'netSalary',
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-green-600"><CurrencyDisplay amount={row.netSalary} /></span>
      ),
    },
    {
      header: t('payroll.status'),
      cell: (row) => (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          {t('payroll.disbursed')}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('payroll.backToPayroll')}
        </Button>
        
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl text-gray-900">{t('payroll.disburseSalaries')}</h2>
            <p className="text-gray-600 mt-1">{t('payroll.salariesDisbursedSuccessfully')}</p>
          </div>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            {t('payroll.exportReport')}
          </Button>
        </div>
      </div>

      {/* Success Message */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">{t('payroll.disbursementSuccessful')}</h3>
              <p className="text-sm text-green-700 mt-1">
                {t('payroll.salariesDisbursedTo')} {selectedEmployees.length} {t('payroll.employees')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600">{t('payroll.totalDisbursed')}</p>
              <p className="font-semibold text-green-900 text-xl"><CurrencyDisplay amount={totalAmount} /></p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('payroll.employeesPaid')}
          value={selectedEmployees.length}
          subtitle={t('payroll.thisMonth')}
          icon={CheckCircle}
          iconColor="text-green-600"
          variant="default"
        />
        <StatCard
          title={t('payroll.totalAmount')}
          value={formatCurrency(convertAmount(totalAmount), { compact: true, decimals: 2 })}
          subtitle={t('payroll.disbursed')}
          icon={CurrencyIcon}
          iconColor="text-blue-600"
          variant="default"
        />
        <StatCard
          title={t('payroll.transactionId')}
          value={transactionId.slice(-6)}
          subtitle={t('payroll.reference')}
          icon={Calendar}
          iconColor="text-purple-600"
          variant="default"
        />
        <StatCard
          title={t('payroll.status')}
          value="100%"
          subtitle={t('payroll.completed')}
          icon={CheckCircle}
          iconColor="text-green-600"
          variant="default"
        />
      </div>

      {/* Disbursed Employees Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('payroll.disbursedEmployeesList')}</CardTitle>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              {selectedEmployees.length} {t('payroll.employees')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={disbursedColumns}
            data={selectedEmployees}
            selectable={false}
            sortable
            headerStyle="gradient"
            cellPadding="relaxed"
            emptyMessage={t('payroll.noEmployees')}
          />
          
          {/* Footer with Total */}
          <div className="bg-gray-50 border-t-2 border-gray-300 px-6 py-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">{t('payroll.totalAmount')}</span>
              <span className="font-semibold text-green-600 text-lg">
                <CurrencyDisplay amount={totalAmount} />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details */}
      <Card>
        <CardHeader>
          <CardTitle>{t('payroll.transactionDetails')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">{t('payroll.transactionId')}</p>
                <p className="font-medium text-gray-900">{transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('payroll.disbursementDate')}</p>
                <p className="font-medium text-gray-900">{disbursementDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('payroll.disbursementTime')}</p>
                <p className="font-medium text-gray-900">{disbursementTime}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">{t('payroll.paymentMethod')}</p>
                <p className="font-medium text-gray-900">{t('payroll.bankTransfer')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('payroll.processedBy')}</p>
                <p className="font-medium text-gray-900">{t('payroll.hrManager')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('payroll.transactionStatus')}</p>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {t('payroll.completed')}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          {t('payroll.backToPayroll')}
        </Button>
        <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          {t('payroll.downloadReport')}
        </Button>
      </div>
    </div>
  );
}
