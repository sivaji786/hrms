import React, { useRef } from 'react';
import { Button } from '../ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import { Payslip } from './Payslip';
import { useReactToPrint } from 'react-to-print';
import Breadcrumbs from '../Breadcrumbs';

interface EmployeePayslipViewProps {
    employeeId: string;
    payslipData: any; // Passed from parent or fetched if needed
    employeeData: any;
    onBack: () => void;
}

export default function EmployeePayslipView({
    employeeId,
    payslipData,
    employeeData,
    onBack
}: EmployeePayslipViewProps) {
    const payslipRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: payslipRef,
        documentTitle: `Payslip-${employeeData?.first_name}-${payslipData?.month}`,
    });

    if (!payslipData || !employeeData) {
        return <div>Loading or No Data...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Breadcrumbs
                    items={[
                        { label: 'Employees', onClick: onBack }, // Ideally goes back to list, but for now back to payroll
                        { label: `${employeeData.first_name} ${employeeData.last_name}`, onClick: onBack },
                        { label: 'Payroll', onClick: onBack },
                        { label: `Payslip - ${payslipData.month}` },
                    ]}
                />
                <Button onClick={handlePrint} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download / Print
                </Button>
            </div>

            <div className="border rounded-lg overflow-y-auto max-h-[calc(100vh-200px)] bg-white shadow-sm">
                <Payslip
                    ref={payslipRef}
                    employee={{
                        name: `${employeeData.first_name} ${employeeData.last_name}`,
                        id: employeeData.employee_code,
                        designation: employeeData.designation,
                        department: employeeData.department_name || 'N/A',
                        joiningDate: employeeData.date_of_joining,
                        bankName: employeeData.bank_name,
                        accountNumber: employeeData.account_number
                    }}
                    salaryDetails={{
                        month: payslipData.month,
                        year: '',
                        basicSalary: payslipData.breakdown?.basicSalary || 0,
                        hra: payslipData.breakdown?.hra || 0,
                        transportAllowance: payslipData.breakdown?.transportAllowance || 0,
                        otherAllowances: payslipData.breakdown?.otherAllowances || 0,
                        grossSalary: payslipData.gross,
                        pension: payslipData.breakdown?.pension || 0,
                        loanDeductions: payslipData.breakdown?.loanDeductions || 0,
                        insuranceDeductions: payslipData.breakdown?.insuranceDeductions || 0,
                        otherDeductions: payslipData.breakdown?.otherDeductions || 0,
                        totalDeductions: payslipData.deductions,
                        netSalary: payslipData.net,
                        paymentDate: payslipData.date
                    }}
                />
            </div>
        </div>
    );
}
