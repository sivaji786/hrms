import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { TrendingUp, TrendingDown, Download, Eye } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import { employeeService, payrollService } from '../../services/api';
import EmployeeInfoCard from './EmployeeInfoCard';
import { useCurrency } from '../../contexts/CurrencyContext';
import { CurrencyIcon } from '../common';
import toast from '../../utils/toast';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Payslip } from './Payslip';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

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
  const [employee, setEmployee] = useState<any>(null);
  const [payrollData, setPayrollData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Removed modal state logic


  useEffect(() => {
    fetchData();
  }, [employeeId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empData, payData] = await Promise.all([
        employeeService.getById(employeeId),
        payrollService.getEmployeePayroll(employeeId)
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
                Current Salary Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Earnings */}
                <div>
                  <h4 className="font-medium text-green-600 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Earnings
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Basic Salary</span>
                      <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.basicSalary)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">HRA (House Rent Allowance)</span>
                      <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.hra)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Special Allowance</span>
                      <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.specialAllowance)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Bonus</span>
                      <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.bonus)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-200">
                      <span className="font-medium text-gray-900">Gross Salary</span>
                      <span className="text-xl font-medium text-green-700">{formatCurrency(payrollData.currentSalary.grossSalary)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="font-medium text-red-600 mb-4 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    Deductions
                  </h4>
                  <div className="space-y-3">
                    {payrollData.currentSalary.pension > 0 && (
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-gray-700">Pension (UAE Nationals)</span>
                        <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.pension)}</span>
                      </div>
                    )}
                    {payrollData.currentSalary.loanDeductions > 0 && (
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-gray-700">Loan Deductions</span>
                        <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.loanDeductions)}</span>
                      </div>
                    )}
                    {payrollData.currentSalary.insuranceDeductions > 0 && (
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-gray-700">Insurance</span>
                        <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.insuranceDeductions)}</span>
                      </div>
                    )}
                    {payrollData.currentSalary.otherDeductions > 0 && (
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-gray-700">Other Deductions</span>
                        <span className="font-medium text-gray-900">{formatCurrency(payrollData.currentSalary.otherDeductions)}</span>
                      </div>
                    )}
                    {payrollData.currentSalary.totalDeductions === 0 && (
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">No Deductions</span>
                        <span className="font-medium text-green-600">{formatCurrency(0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg border-2 border-red-200">
                      <span className="font-medium text-gray-900">Total Deductions</span>
                      <span className="text-xl font-medium text-red-700">{formatCurrency(payrollData.currentSalary.totalDeductions)}</span>
                    </div>
                  </div>
                </div>

                {/* Net Salary */}
                <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-blue-100 mb-1">Monthly Net Salary</p>
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
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Number</p>
                <p className="font-medium text-gray-900">{employee.account_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Bank Name</p>
                <p className="font-medium text-gray-900">{employee.bank_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">IBAN</p>
                <p className="font-medium text-gray-900">{employee.iban || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Emirates ID</p>
                <p className="font-medium text-gray-900">{employee.emirates_id || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Salary Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Annual CTC</span>
                <span className="font-medium">{formatCurrency((payrollData.currentSalary.grossSalary * 12))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Gross</span>
                <span className="font-medium">{formatCurrency(payrollData.currentSalary.grossSalary)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Net</span>
                <span className="font-medium text-green-600">{formatCurrency(payrollData.currentSalary.netSalary)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payroll History */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700">Month</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700">Gross Salary</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700">Deductions</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700">Net Salary</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700">Payment Date</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700">Actions</th>
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