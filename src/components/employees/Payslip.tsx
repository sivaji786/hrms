import React, { forwardRef, useEffect, useState } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { companySettingsService } from '../../services/api';

interface PayslipProps {
    employee: {
        name: string;
        id: string;
        designation: string;
        department: string;
        joiningDate: string;
        bankName?: string;
        accountNumber?: string;
    };
    salaryDetails: {
        month: string;
        year: string;
        basicSalary: number;
        hra: number;
        transportAllowance: number;
        otherAllowances: number;
        grossSalary: number;
        pension?: number; // Pension (UAE nationals only)
        loanDeductions?: number; // Loan repayments
        insuranceDeductions?: number; // Insurance deductions
        otherDeductions: number;
        totalDeductions: number;
        netSalary: number;
        paymentDate: string;
    };
}

export const Payslip = forwardRef<HTMLDivElement, PayslipProps>(({ employee, salaryDetails }, ref) => {
    const { formatCurrency } = useCurrency();
    const [companySettings, setCompanySettings] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await companySettingsService.getSettings();
                // Handle nested response structure: response.data.data
                const settings = response.data?.data || response.data || {};
                setCompanySettings(settings);
            } catch (error) {
                console.error('Failed to fetch company settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const companyName = companySettings?.company_name || 'COMPANY NAME';
    const companyAddress = companySettings?.address || '123 Business Bay, Dubai, UAE';
    const companyPhone = companySettings?.phone || '+971 4 123 4567';
    const companyEmail = companySettings?.email || 'hr@company.com';

    return (
        <div ref={ref} className="p-8 bg-white text-black max-w-4xl mx-auto print:p-0">
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 uppercase">{companyName}</h1>
                        <p className="text-gray-600 mt-1 whitespace-pre-line">{companyAddress}</p>
                        <p className="text-gray-600">Phone: {companyPhone} | Email: {companyEmail}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-semibold text-gray-800 uppercase tracking-wide">Payslip</h2>
                        <p className="text-lg text-gray-600 mt-1">{salaryDetails.month}</p>
                    </div>
                </div>
            </div>

            {/* Employee Details */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Employee Name</p>
                    <p className="font-semibold text-lg">{employee.name}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Employee ID</p>
                    <p className="font-semibold text-lg">{employee.id}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Designation</p>
                    <p className="font-semibold">{employee.designation}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Department</p>
                    <p className="font-semibold">{employee.department}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Bank Name</p>
                    <p className="font-semibold">{employee.bankName || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Account Number</p>
                    <p className="font-semibold">{employee.accountNumber || 'N/A'}</p>
                </div>
            </div>

            {/* Salary Details Table */}
            <div className="border border-gray-300 mb-8">
                <div className="grid grid-cols-2">
                    {/* Earnings */}
                    <div className="border-r border-gray-300">
                        <div className="bg-gray-100 p-3 border-b border-gray-300 font-bold text-center uppercase text-sm">Earnings</div>
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between">
                                <span>Basic Salary</span>
                                <span className="font-medium">{formatCurrency(salaryDetails.basicSalary)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Housing Allowance (HRA)</span>
                                <span className="font-medium">{formatCurrency(salaryDetails.hra)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Transport Allowance</span>
                                <span className="font-medium">{formatCurrency(salaryDetails.transportAllowance)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Other Allowances</span>
                                <span className="font-medium">{formatCurrency(salaryDetails.otherAllowances)}</span>
                            </div>
                        </div>
                        <div className="border-t border-gray-300 p-3 bg-gray-50 flex justify-between font-bold">
                            <span>Total Earnings</span>
                            <span>{formatCurrency(salaryDetails.grossSalary)}</span>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div>
                        <div className="bg-gray-100 p-3 border-b border-gray-300 font-bold text-center uppercase text-sm">Deductions</div>
                        <div className="p-4 space-y-3">
                            {(salaryDetails.pension ?? 0) > 0 && (
                                <div className="flex justify-between">
                                    <span>Pension Contribution</span>
                                    <span className="font-medium">{formatCurrency(salaryDetails.pension ?? 0)}</span>
                                </div>
                            )}
                            {(salaryDetails.loanDeductions ?? 0) > 0 && (
                                <div className="flex justify-between">
                                    <span>Loan Deductions</span>
                                    <span className="font-medium">{formatCurrency(salaryDetails.loanDeductions ?? 0)}</span>
                                </div>
                            )}
                            {(salaryDetails.insuranceDeductions ?? 0) > 0 && (
                                <div className="flex justify-between">
                                    <span>Insurance</span>
                                    <span className="font-medium">{formatCurrency(salaryDetails.insuranceDeductions ?? 0)}</span>
                                </div>
                            )}
                            {(salaryDetails.otherDeductions ?? 0) > 0 && (
                                <div className="flex justify-between">
                                    <span>Other Deductions</span>
                                    <span className="font-medium">{formatCurrency(salaryDetails.otherDeductions)}</span>
                                </div>
                            )}
                            {salaryDetails.totalDeductions === 0 && (
                                <div className="flex justify-between text-gray-500">
                                    <span>No deductions</span>
                                    <span className="font-medium">{formatCurrency(0)}</span>
                                </div>
                            )}
                        </div>
                        <div className="border-t border-gray-300 p-3 bg-gray-50 flex justify-between font-bold">
                            <span>Total Deductions</span>
                            <span>{formatCurrency(salaryDetails.totalDeductions)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Net Pay */}
            <div className="bg-gray-900 p-6 rounded-lg mb-12 flex justify-between items-center print:bg-gray-200 print:text-black print:border print:border-gray-900">
                <div>
                    <p className="text-sm opacity-80 uppercase tracking-wider mb-1">Net Payable Amount</p>
                    <p className="text-3xl font-bold">{formatCurrency(salaryDetails.netSalary)}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm opacity-80">Payment Date</p>
                    <p className="font-semibold">{salaryDetails.paymentDate}</p>
                </div>
            </div>

            {/* Footer / Signatures */}
            <div className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-2 gap-20">
                <div className="text-center">
                    <div className="h-16 border-b border-gray-400 mb-2"></div>
                    <p className="font-semibold">Employer Signature</p>
                </div>
                <div className="text-center">
                    <div className="h-16 border-b border-gray-400 mb-2"></div>
                    <p className="font-semibold">Employee Signature</p>
                </div>
            </div>

            <div className="mt-12 text-center text-xs text-gray-500">
                <p>This is a computer-generated document and does not require a physical signature.</p>
            </div>
        </div>
    );
});

Payslip.displayName = 'Payslip';
