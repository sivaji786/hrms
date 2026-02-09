import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, Download, Eye, Clock } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import { employeeService, payrollService } from '../../services/api';
import EmployeeInfoCard from './EmployeeInfoCard';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { CurrencyIcon } from '../common';
import toast from '../../utils/toast';

interface EmployeePayrollProps {
  employeeId: string;
  onBack: () => void;
  onViewProfile: (id: string) => void;
  onEdit: (id: string) => void;
  onViewAttendance: (id: string) => void;
  onViewPayroll: (id: string) => void;
  onOffboard: (id: string) => void;
  onViewPayslip: (employeeId: string, payslipData: any, employeeData: any) => void;
}

export default function EmployeePayroll({
  employeeId,
  onBack,
  onViewProfile,
  onEdit,
  onViewAttendance,
  onViewPayroll,
  onOffboard,
  onViewPayslip
}: EmployeePayrollProps) {
  const { formatCurrency } = useCurrency();
  const { t } = useLanguage();
  const [employee, setEmployee] = useState<any>(null);
  const [payrollData, setPayrollData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [gratuityData, setGratuityData] = useState<any>(null);
  const [gratuityHistory, setGratuityHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [employeeId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empData, payData, gratuity, history] = await Promise.all([
        employeeService.getById(employeeId),
        payrollService.getEmployeePayroll(employeeId),
        payrollService.getEmployeeGratuity(employeeId),
        payrollService.getEmployeeGratuityHistory(employeeId)
      ]);
      setEmployee(empData);

      // Map payroll data
      const mappedHistory = payData.recentPayslips.map((p: any) => ({
        month: new Date(0, p.month - 1).toLocaleString('default', { month: 'long' }) + ' ' + p.year,
        gross: parseFloat(p.basic_salary) + parseFloat(p.total_allowances),
        deductions: parseFloat(p.total_deductions),
        net: parseFloat(p.net_salary),
        status: p.status,
        date: p.payment_date,
        salary_breakdown: p.salary_breakdown // Include the breakdown from API
      }));

      setPayrollData({
        currentSalary: {
          basicSalary: parseFloat(payData.currentSalary.basicSalary) || 0,
          hra: parseFloat(payData.currentSalary.hra) || 0,
          specialAllowance: parseFloat(payData.currentSalary.specialAllowance) || 0,
          transportAllowance: parseFloat(payData.currentSalary.transportAllowance) || 0,
          bonus: parseFloat(payData.currentSalary.bonus) || 0,
          grossSalary: parseFloat(payData.currentSalary.grossSalary) || 0,
          pension: parseFloat(payData.currentSalary.pension) || 0,
          loanDeductions: parseFloat(payData.currentSalary.loanDeductions) || 0,
          insuranceDeductions: parseFloat(payData.currentSalary.insuranceDeductions) || 0,
          otherDeductions: parseFloat(payData.currentSalary.otherDeductions) || 0,
          totalDeductions: parseFloat(payData.currentSalary.totalDeductions) || 0,
          netSalary: parseFloat(payData.currentSalary.netSalary) || 0,
        },
        recentPayslips: mappedHistory
      });

      // Set gratuity data from API
      if (gratuity) {
        setGratuityData({
          amount: parseFloat(gratuity.current_amount),
          yearsOfService: parseFloat(gratuity.years_of_service).toFixed(2),
          dailyWage: parseFloat(gratuity.daily_wage).toFixed(2),
          lastUpdated: gratuity.last_updated
        });
      }

      if (history) {
        setGratuityHistory(history);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayslipClick = (payslip: any) => {
    // Use historical breakdown if available, otherwise fallback to current structure (legacy support)
    const breakdown = payslip.salary_breakdown || {
      basicSalary: payrollData.currentSalary.basicSalary,
      hra: payrollData.currentSalary.hra,
      transportAllowance: payrollData.currentSalary.transportAllowance,
      otherAllowances: payrollData.currentSalary.specialAllowance,
      pf: payrollData.currentSalary.pf,
      tax: payrollData.currentSalary.tds,
      otherDeductions: payrollData.currentSalary.otherDeductions
    };

    const payslipWithBreakdown = {
      ...payslip,
      breakdown: breakdown
    };
    onViewPayslip(employee.id, payslipWithBreakdown, employee);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Employee not found</p>
        <Button onClick={onBack} className="mt-4">
          Back to Employee List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Employees', onClick: onBack },
          { label: employee.first_name + ' ' + employee.last_name, onClick: () => { } },
          { label: 'Payroll' },
        ]}
      />

      {/* Employee Info Card */}
      <EmployeeInfoCard
        employee={{
          id: employee.id,
          name: `${employee.first_name} ${employee.last_name}`,
          role: employee.designation || 'N/A',
          status: employee.status || 'Active',
          department: employee.department_name || employee.department_id || 'N/A',
          employeeCode: employee.employee_code,
        }}
        currentView="payroll"
        onViewProfile={onViewProfile}
        onEdit={onEdit}
        onViewAttendance={onViewAttendance}
        onViewPayroll={onViewPayroll}
        onOffboard={onOffboard}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Salary Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-t-4 border-t-green-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                {t('employee.currentSalaryBreakdown')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Earnings */}
                <div>
                  <h4 className="font-medium text-green-600 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {t('employee.earnings')}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">{t('employee.basicSalary')}</span>
                      <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.basicSalary)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">{t('employee.hra')}</span>
                      <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.hra)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">{t('employee.specialAllowance')}</span>
                      <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.specialAllowance)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">{t('employee.bonus')}</span>
                      <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.bonus)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-200">
                      <span className="font-medium text-gray-900">{t('employee.grossSalary')}</span>
                      <span className="text-xl font-medium text-green-700">{formatCurrency(payrollData.currentSalary.grossSalary)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="font-medium text-red-600 mb-4 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    {t('employee.deductions')}
                  </h4>
                  <div className="space-y-3">
                    {payrollData.currentSalary.pension > 0 && (
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-gray-700">{t('employee.pension')}</span>
                        <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.pension)}</span>
                      </div>
                    )}
                    {payrollData.currentSalary.loanDeductions > 0 && (
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-gray-700">{t('employee.loanDeductions')}</span>
                        <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.loanDeductions)}</span>
                      </div>
                    )}
                    {payrollData.currentSalary.insuranceDeductions > 0 && (
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-gray-700">{t('employee.insurance')}</span>
                        <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.insuranceDeductions)}</span>
                      </div>
                    )}
                    {payrollData.currentSalary.otherDeductions > 0 && (
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-gray-700">{t('employee.otherDeductions')}</span>
                        <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.otherDeductions)}</span>
                      </div>
                    )}
                    {payrollData.currentSalary.totalDeductions === 0 && (
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">{t('employee.noDeductions')}</span>
                        <span className="font-medium text-green-600">{formatCurrency(0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg border-2 border-red-200">
                      <span className="font-medium text-gray-900">{t('employee.totalDeductions')}</span>
                      <span className="text-xl font-medium text-red-700">{formatCurrency(payrollData.currentSalary.totalDeductions)}</span>
                    </div>
                  </div>
                </div>

                {/* Net Salary */}
                <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-blue-100 mb-1">{t('employee.monthlyNetSalary')}</p>
                      <p className="text-4xl font-medium">{formatCurrency(payrollData.currentSalary.netSalary)}</p>
                    </div>
                    <CurrencyIcon className="w-16 h-16 text-blue-300 opacity-50" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bank Details & Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('employee.paymentDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('employee.accountNumber')}</p>
                <p className="font-medium text-gray-900">{employee.account_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('employee.bankName')}</p>
                <p className="font-medium text-gray-900">{employee.bank_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('employee.iban')}</p>
                <p className="font-medium text-gray-900">{employee.iban || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('employee.emiratesId')}</p>
                <p className="font-medium text-gray-900">{employee.emirates_id || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Accumulated Gratuity */}
          {gratuityData && gratuityData.amount > 0 && (
            <Card className="border-t-4 border-t-amber-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CurrencyIcon className="w-5 h-5 text-amber-600" />
                  {t('employee.accumulatedGratuity')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-gray-600 mb-1">{t('employee.accruedAmount')}</p>
                  <p className="text-2xl font-bold text-amber-700">{formatCurrency(gratuityData.amount)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">{t('employee.yearsOfService')}</p>
                    <p className="font-medium text-gray-900">{gratuityData.yearsOfService} {t('employee.years')}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">{t('employee.dailyWage')}</p>
                    <p className="font-medium text-gray-900">{formatCurrency(parseFloat(gratuityData.dailyWage))}</p>
                  </div>
                </div>
                {gratuityData.lastUpdated && (
                  <p className="text-xs text-gray-500 text-right">
                    Last updated: {new Date(gratuityData.lastUpdated).toLocaleDateString()}
                  </p>
                )}
                <p className="text-xs text-gray-500 italic">{t('employee.basedOnUAELaw')}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{t('employee.salarySummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('employee.annualCTC')}</span>
                <span className="font-medium">{formatCurrency((payrollData.currentSalary.grossSalary * 12))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('employee.monthlyGross')}</span>
                <span className="font-medium">{formatCurrency(payrollData.currentSalary.grossSalary)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('employee.monthlyNet')}</span>
                <span className="font-medium text-green-600">{formatCurrency(payrollData.currentSalary.netSalary)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gratuity History */}
      {gratuityHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t('employee.gratuityHistory') || 'Gratuity History'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">{t('employee.date') || 'Date'}</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">{t('employee.type') || 'Type'}</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">{t('employee.amount') || 'Amount'}</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">{t('employee.yearsOfService')}</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">{t('employee.notes') || 'Notes'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gratuityHistory.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{new Date(item.calculation_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 capitalize">{item.calculation_type}</td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">{formatCurrency(parseFloat(item.amount))}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{parseFloat(item.years_of_service).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payroll History */}
      <Card>
        <CardHeader>
          <CardTitle>{t('employee.payrollHistory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700">{t('employee.month')}</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700">{t('employee.grossSalary')}</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700">{t('employee.deductions')}</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700">{t('employee.netSalary')}</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700">{t('employee.status')}</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700">{t('employee.paymentDate')}</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700">{t('employee.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {payrollData.recentPayslips.map((payslip: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{payslip.month}</td>
                    <td className="px-6 py-4 text-gray-700">{formatCurrency(payslip.gross)}</td>
                    <td className="px-6 py-4 text-red-600">{formatCurrency(payslip.deductions)}</td>
                    <td className="px-6 py-4 font-medium text-green-600">{formatCurrency(payslip.net)}</td>
                    <td className="px-6 py-4">
                      <Badge className="bg-green-100 text-green-700 border-green-200">{payslip.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payslip.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-blue-50"
                          onClick={() => handleViewPayslipClick(payslip)}
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-green-50"
                          onClick={() => handleViewPayslipClick(payslip)}
                        >
                          <Download className="w-4 h-4 text-green-600" />
                        </Button>
                      </div>
                    </td>
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