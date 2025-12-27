import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Mail, Phone, MapPin, Calendar, Briefcase, User, CreditCard, FileText } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import { employeeService, documentService } from '../../services/api';
import EmployeeInfoCard from './EmployeeInfoCard';
import toast from '../../utils/toast';

interface EmployeeProfileProps {
  employeeId: string;
  onBack: () => void;
  onViewProfile: (id: string) => void;
  onEdit: (id: string) => void;
  onViewAttendance: (id: string) => void;
  onViewPayroll: (id: string) => void;
  onOffboard: (id: string) => void;
}

export default function EmployeeProfile({
  employeeId,
  onBack,
  onViewProfile,
  onEdit,
  onViewAttendance,
  onViewPayroll,
  onOffboard,
}: EmployeeProfileProps) {
  const [employee, setEmployee] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [empData, docData] = await Promise.all([
          employeeService.getById(employeeId),
          documentService.getEmployeeDocuments(employeeId)
        ]);
        setEmployee(empData);
        setDocuments(docData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchData();
    }
  }, [employeeId]);

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
          { label: employee.first_name + ' ' + employee.last_name },
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
        currentView="profile"
        onViewProfile={onViewProfile}
        onEdit={onEdit}
        onViewAttendance={onViewAttendance}
        onViewPayroll={onViewPayroll}
        onOffboard={onOffboard}
      />

      {/* Employee Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="font-medium text-gray-900 flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                {employee.date_of_birth || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-medium text-gray-900 mt-1">{employee.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Marital Status</p>
              <p className="font-medium text-gray-900 mt-1">{employee.marital_status || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nationality</p>
              <p className="font-medium text-gray-900 mt-1">{employee.nationality || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900 flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-gray-400" />
                {employee.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900 flex items-center gap-2 mt-1">
                <Phone className="w-4 h-4 text-gray-400" />
                {employee.phone}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium text-gray-900 flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                {employee.address || employee.location || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-medium text-gray-900 mt-1">{employee.department_name || employee.department_id || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Position</p>
              <p className="font-medium text-gray-900 mt-1">{employee.designation || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Join Date</p>
              <p className="font-medium text-gray-900 flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                {employee.date_of_joining || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Employment Type</p>
              <p className="font-medium text-gray-900 mt-1">{employee.employment_type || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-600" />
              Bank Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Bank Name</p>
              <p className="font-medium text-gray-900 mt-1">{employee.bank_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">IBAN</p>
              <p className="font-medium text-gray-900 mt-1">{employee.iban || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Number</p>
              <p className="font-medium text-gray-900 mt-1">{employee.account_number || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="hover:shadow-lg transition-shadow lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {documents.slice(0, 4).map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-[150px]">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.type}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No documents found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
