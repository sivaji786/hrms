import { useState } from 'react';
import EmployeeList from './employees/EmployeeList';
import EmployeeProfile from './employees/EmployeeProfile';
import EditEmployee from './employees/EditEmployee';
import EmployeeAttendance from './employees/EmployeeAttendance';
import EmployeePayroll from './employees/EmployeePayroll';
import EmployeeOffboarding from './employees/EmployeeOffboarding';
import EmployeeDocuments from './employees/EmployeeDocuments';
import EmployeePayslipView from './employees/EmployeePayslipView';
import SubmitExpense from './SubmitExpense';
import RequestTravel from './RequestTravel';
import { useLanguage } from '../contexts/LanguageContext';

type ViewType = 'list' | 'profile' | 'edit' | 'attendance' | 'payroll' | 'offboard' | 'documents' | 'submit-expense' | 'request-travel' | 'payslip-view';

interface EmployeeManagementProps {
  onAddEmployee?: () => void;
}

export default function EmployeeManagement({ onAddEmployee }: EmployeeManagementProps) {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>('');
  const [selectedEmployeeCode, setSelectedEmployeeCode] = useState<string>('');
  const [selectedPayslipData, setSelectedPayslipData] = useState<any>(null);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState<any>(null);
  const { t } = useLanguage();

  const handleViewEmployee = (id: string) => {
    setSelectedEmployeeId(id);
    setCurrentView('profile');
  };

  const handleEditEmployee = (id: string) => {
    setSelectedEmployeeId(id);
    setCurrentView('edit');
  };

  const handleViewAttendance = (id: string) => {
    setSelectedEmployeeId(id);
    setCurrentView('attendance');
  };

  const handleViewPayroll = (id: string) => {
    setSelectedEmployeeId(id);
    setCurrentView('payroll');
  };

  const handleOffboardEmployee = (id: string) => {
    setSelectedEmployeeId(id);
    setCurrentView('offboard');
  };

  const handleViewDocuments = (id: string, name?: string, code?: string) => {
    setSelectedEmployeeId(id);
    setSelectedEmployeeName(name || 'Employee');
    setSelectedEmployeeCode(code || '');
    setCurrentView('documents');
  };

  const handleViewPayslipDetail = (employeeId: string, payslipData: any, employeeData: any) => {
    setSelectedEmployeeId(employeeId);
    setSelectedPayslipData(payslipData);
    setSelectedEmployeeData(employeeData);
    setCurrentView('payslip-view');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedEmployeeId(null);
    setSelectedEmployeeName('');
    setSelectedPayslipData(null);
    setSelectedEmployeeData(null);
  };

  const handleBackToPayroll = () => {
    setCurrentView('payroll');
    setSelectedPayslipData(null);
  };

  // If viewing a specific employee (profile, attendance, payroll, etc.)
  if (currentView !== 'list') {
    return (
      <div className="min-h-screen">
        {currentView === 'profile' && selectedEmployeeId && (
          <EmployeeProfile
            employeeId={selectedEmployeeId}
            onBack={handleBackToList}
            onViewProfile={handleViewEmployee}
            onEdit={handleEditEmployee}
            onViewAttendance={handleViewAttendance}
            onViewPayroll={handleViewPayroll}
            onOffboard={handleOffboardEmployee}
          />
        )}

        {currentView === 'attendance' && selectedEmployeeId && (
          <EmployeeAttendance
            employeeId={selectedEmployeeId}
            onBack={handleBackToList}
            onViewProfile={handleViewEmployee}
            onEdit={handleEditEmployee}
            onViewAttendance={handleViewAttendance}
            onViewPayroll={handleViewPayroll}
            onOffboard={handleOffboardEmployee}
          />
        )}

        {currentView === 'payroll' && selectedEmployeeId && (
          <EmployeePayroll
            employeeId={selectedEmployeeId}
            onBack={handleBackToList}
            onViewProfile={handleViewEmployee}
            onEdit={handleEditEmployee}
            onViewAttendance={handleViewAttendance}
            onViewPayroll={handleViewPayroll}
            onOffboard={handleOffboardEmployee}
            onViewPayslip={handleViewPayslipDetail}
          />
        )}

        {currentView === 'payslip-view' && selectedEmployeeId && (
          <EmployeePayslipView
            employeeId={selectedEmployeeId}
            payslipData={selectedPayslipData}
            employeeData={selectedEmployeeData}
            onBack={handleBackToPayroll}
          />
        )}

        {currentView === 'edit' && selectedEmployeeId && (
          <EditEmployee
            employeeId={selectedEmployeeId}
            onBack={handleBackToList}
            onViewProfile={handleViewEmployee}
            onEdit={handleEditEmployee}
            onViewAttendance={handleViewAttendance}
            onViewPayroll={handleViewPayroll}
            onOffboard={handleOffboardEmployee}
          />
        )}

        {currentView === 'offboard' && selectedEmployeeId && (
          <EmployeeOffboarding
            employeeId={selectedEmployeeId}
            onBack={handleBackToList}
            onViewProfile={handleViewEmployee}
            onEdit={handleEditEmployee}
            onViewAttendance={handleViewAttendance}
            onViewPayroll={handleViewPayroll}
            onOffboard={handleOffboardEmployee}
          />
        )}

        {currentView === 'documents' && selectedEmployeeId && (
          <EmployeeDocuments
            employeeId={selectedEmployeeId}
            employeeName={selectedEmployeeName}
            employeeCode={selectedEmployeeCode}
            onBack={handleBackToList}
          />
        )}

        {currentView === 'submit-expense' && (
          <SubmitExpense
            onBack={handleBackToList}
          />
        )}

        {currentView === 'request-travel' && (
          <RequestTravel
            onBack={handleBackToList}
          />
        )}
      </div>
    );
  }

  // Main view - just employee list without tabs
  return (
    <div className="space-y-6">
      <EmployeeList
        onViewEmployee={handleViewEmployee}
        onEditEmployee={handleEditEmployee}
        onViewAttendance={handleViewAttendance}
        onViewPayroll={handleViewPayroll}
        onOffboardEmployee={handleOffboardEmployee}
        onAddEmployee={onAddEmployee || (() => { })}
        onViewDocuments={handleViewDocuments}
      />
    </div>
  );
}