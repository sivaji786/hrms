import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Building2, Edit } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  getEmployeePersonalInfo,
  getEmployeeEmploymentInfo,
  getEmployeeEmergencyContact,
  CURRENT_EMPLOYEE_ID
} from '../data/employeePortalData';

export default function MyProfile() {
  const { t } = useLanguage();

  // Get employee data from shared data source
  const personalInfo = getEmployeePersonalInfo(CURRENT_EMPLOYEE_ID) || {
    fullName: 'John Smith',
    employeeId: 'EMP001',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    address: '123 Main Street, New York, NY 10001',
    nationality: 'American',
  };

  const employmentInfo = getEmployeeEmploymentInfo(CURRENT_EMPLOYEE_ID) || {
    department: 'Engineering',
    position: 'Software Engineer',
    employmentType: 'Full-time',
    joinDate: '2022-01-15',
    reportingTo: 'Sarah Johnson',
    location: 'New York Office',
    workSchedule: 'Monday - Friday, 9:00 AM - 5:00 PM',
  };

  const emergencyContact = getEmployeeEmergencyContact(CURRENT_EMPLOYEE_ID) || {
    name: 'Jane Smith',
    relationship: 'Spouse',
    phone: '+1 (555) 987-6543',
    email: 'jane.smith@email.com',
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <Edit className="w-4 h-4 mr-2" />
          {t('common.edit')}
        </Button>
      </div>

      {/* Profile Header Card */}
      <Card className="border-l-4 border-l-blue-600">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
              {getInitials(personalInfo.fullName)}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl mb-1">{personalInfo.fullName}</h3>
                  <p className="text-gray-500 mb-2">{employmentInfo.position}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {employmentInfo.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {personalInfo.employeeId}
                    </span>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  {t('common.active')}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {t('employee.personalInformation')}
            </CardTitle>
            <CardDescription>{t('employee.basicDetails')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{t('common.fullName')}</p>
                <p className="font-medium">{personalInfo.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('employee.employeeId')}</p>
                <p className="font-medium">{personalInfo.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('common.email')}</p>
                <p className="font-medium flex items-center gap-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {personalInfo.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('common.phone')}</p>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {personalInfo.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('employee.dateOfBirth')}</p>
                <p className="font-medium">{new Date(personalInfo.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('employee.gender')}</p>
                <p className="font-medium">{personalInfo.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('employee.nationality')}</p>
                <p className="font-medium">{personalInfo.nationality}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('common.address')}</p>
              <p className="font-medium flex items-start gap-1">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                {personalInfo.address}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {t('employee.employmentInformation')}
            </CardTitle>
            <CardDescription>{t('employee.jobDetails')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{t('common.department')}</p>
                <p className="font-medium">{employmentInfo.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('common.position')}</p>
                <p className="font-medium">{employmentInfo.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('employee.employmentType')}</p>
                <p className="font-medium">{employmentInfo.employmentType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('employee.joinDate')}</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(employmentInfo.joinDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('employee.reportingTo')}</p>
                <p className="font-medium">{employmentInfo.reportingTo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('employee.location')}</p>
                <p className="font-medium">{employmentInfo.location}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('employee.workSchedule')}</p>
              <p className="font-medium">{employmentInfo.workSchedule}</p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              {t('employee.emergencyContact')}
            </CardTitle>
            <CardDescription>{t('employee.emergencyContactInfo')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{t('common.name')}</p>
                <p className="font-medium">{emergencyContact.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('employee.relationship')}</p>
                <p className="font-medium">{emergencyContact.relationship}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('common.phone')}</p>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {emergencyContact.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('common.email')}</p>
                <p className="font-medium flex items-center gap-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {emergencyContact.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}