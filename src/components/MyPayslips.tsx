import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Download, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import StatCard from './common/StatCard';
import { CurrencyIcon } from './common';
import DataTable, { TableColumn } from './common/DataTable';

export default function MyPayslips() {
  const { t } = useLanguage();
  const { formatCurrency, convertAmount } = useCurrency();
  const [selectedPayslips, setSelectedPayslips] = useState<string[]>([]);

  const stats = [
    {
      title: t('employee.grossSalary'),
      value: formatCurrency(convertAmount(60000)),
      subtitle: t('employee.monthly'),
      icon: CurrencyIcon,
      trend: { value: 0, isPositive: true },
    },
    {
      title: t('employee.netSalary'),
      value: formatCurrency(convertAmount(52000)),
      subtitle: t('employee.afterDeductions'),
      icon: CurrencyIcon,
      trend: { value: 0, isPositive: true },
    },
    {
      title: t('employee.totalDeductions'),
      value: formatCurrency(convertAmount(8000)),
      subtitle: t('employee.thisMonth'),
      icon: CurrencyIcon,
      trend: { value: 0, isPositive: true },
    },
    {
      title: t('employee.ytdEarnings'),
      value: formatCurrency(convertAmount(572000)),
      subtitle: t('employee.yearToDate'),
      icon: CurrencyIcon,
      trend: { value: 8, isPositive: true },
    },
  ];

  const payslips = [
    {
      id: '1',
      month: 'November 2025',
      payDate: '2025-11-30',
      gross: 6000,
      deductions: 800,
      net: 5200,
      status: 'Processed',
    },
    {
      id: '2',
      month: 'October 2025',
      payDate: '2025-10-31',
      gross: 6000,
      deductions: 800,
      net: 5200,
      status: 'Paid',
    },
    {
      id: '3',
      month: 'September 2025',
      payDate: '2025-09-30',
      gross: 6000,
      deductions: 800,
      net: 5200,
      status: 'Paid',
    },
    {
      id: '4',
      month: 'August 2025',
      payDate: '2025-08-31',
      gross: 6000,
      deductions: 800,
      net: 5200,
      status: 'Paid',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <Badge className="bg-green-100 text-green-700 border-green-200">{t('employee.paid')}</Badge>;
      case 'Processed':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">{t('employee.processed')}</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">{t('employee.pending')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle checkbox selections for payslips
  const handleSelectAllPayslips = (checked: boolean) => {
    if (checked) {
      setSelectedPayslips(payslips.map(p => p.id));
    } else {
      setSelectedPayslips([]);
    }
  };

  const handleSelectPayslip = (payslipId: string | number, checked: boolean) => {
    if (checked) {
      setSelectedPayslips([...selectedPayslips, payslipId as string]);
    } else {
      setSelectedPayslips(selectedPayslips.filter(id => id !== payslipId));
    }
  };

  const selectedPayslipObjects = payslips.filter(p => selectedPayslips.includes(p.id));

  // Payslip columns for DataTable
  const payslipColumns: TableColumn[] = [
    {
      header: t('employee.month'),
      accessor: 'month',
      sortable: true,
      cell: (row) => <p className="font-medium">{row.month}</p>,
    },
    {
      header: t('employee.payDate'),
      accessor: 'payDate',
      sortable: true,
      cell: (row) => <p>{new Date(row.payDate).toLocaleDateString()}</p>,
    },
    {
      header: t('employee.grossSalary'),
      accessor: 'gross',
      sortable: true,
      cell: (row) => <p className="text-green-600">{formatCurrency(row.gross)}</p>,
    },
    {
      header: t('employee.deductions'),
      accessor: 'deductions',
      sortable: true,
      cell: (row) => <p className="text-red-600">{formatCurrency(row.deductions)}</p>,
    },
    {
      header: t('employee.netPay'),
      accessor: 'net',
      sortable: true,
      cell: (row) => <p className="font-semibold">{formatCurrency(row.net)}</p>,
    },
    {
      header: t('common.status'),
      accessor: 'status',
      sortable: true,
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: t('common.actions'),
      cell: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} variant="default" />
        ))}
      </div>

      {/* Latest Payslip */}
      <Card>
        <CardHeader>
          <CardTitle>{t('employee.latestPayslip')}</CardTitle>
          <CardDescription>{t('employee.latestPayslipDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-sm text-gray-600 mb-1">{t('employee.grossPay')}</p>
              <p className="text-xl font-semibold text-green-600">{formatCurrency(6000)}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-sm text-gray-600 mb-1">{t('employee.deductions')}</p>
              <p className="text-xl font-semibold text-red-600">{formatCurrency(800)}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-600 mb-1">{t('employee.netPay')}</p>
              <p className="text-xl font-semibold text-blue-600">{formatCurrency(5200)}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              {t('common.view')}
            </Button>
            <Button className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              {t('common.download')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payslips History with DataTable */}
      <Card>
        <CardHeader>
          <CardTitle>{t('employee.payslipHistory')}</CardTitle>
          <CardDescription>{t('employee.allPayslips')}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={payslipColumns}
            data={payslips}
            selectable
            selectedRows={selectedPayslipObjects}
            onSelectRow={handleSelectPayslip}
            onSelectAll={handleSelectAllPayslips}
            exportable
            sortable
            exportFileName="payslips"
            exportHeaders={['Month', 'Pay Date', 'Gross Salary', 'Deductions', 'Net Pay', 'Status']}
            headerStyle="gradient"
            cellPadding="relaxed"
            emptyMessage={t('employee.noPayslips')}
          />
        </CardContent>
      </Card>
    </div>
  );
}
