import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import { useLanguage } from '../../contexts/LanguageContext';

interface AttendanceDetailsProps {
  employee: {
    id: string;
    name: string;
    department: string;
    checkIn: string;
    checkOut?: string;
    workHours: string;
    status: string;
    location?: string;
  };
  onBack: () => void;
}

export default function AttendanceDetails({ employee, onBack }: AttendanceDetailsProps) {
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-700 border-green-200';
      case 'Late': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Absent': return 'bg-red-100 text-red-700 border-red-200';
      case 'Half Day': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Late': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Absent': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'Half Day': return <AlertCircle className="w-5 h-5 text-blue-600" />;
      default: return null;
    }
  };

  const breadcrumbItems = [
    { label: t('nav.dashboard') },
    { label: t('attendance.title') },
    { label: t('attendance.details') },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{t('attendance.details')}</h1>
          <p className="text-gray-600 mt-1">{employee.name} ({employee.id})</p>
        </div>
      </div>

      {/* Employee Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('attendance.employeeInformation')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between py-3 border-b">
                <span className="text-sm text-gray-600">{t('employee.employeeId')}</span>
                <span className="font-medium">{employee.id}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-sm text-gray-600">{t('common.name')}</span>
                <span className="font-medium">{employee.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-sm text-gray-600">{t('common.department')}</span>
                <span className="font-medium">{employee.department}</span>
              </div>
              {employee.location && (
                <div className="flex justify-between py-3 border-b">
                  <span className="text-sm text-gray-600">{t('common.location')}</span>
                  <span className="font-medium">{employee.location}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between py-3 border-b">
                <span className="text-sm text-gray-600">{t('attendance.checkIn')}</span>
                <span className="font-medium">{employee.checkIn}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-sm text-gray-600">{t('attendance.checkOut')}</span>
                <span className="font-medium">{employee.checkOut || t('attendance.notCheckedOut')}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-sm text-gray-600">{t('attendance.workHours')}</span>
                <span className="font-medium">{employee.workHours}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-sm text-gray-600">{t('common.status')}</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(employee.status)}
                  <Badge variant="outline" className={getStatusColor(employee.status)}>
                    {employee.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t('attendance.additionalInfo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                {employee.status === 'Present' && t('attendance.presentInfo')}
                {employee.status === 'Late' && t('attendance.lateInfo')}
                {employee.status === 'Absent' && t('attendance.absentInfo')}
                {employee.status === 'Half Day' && t('attendance.halfDayInfo')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
