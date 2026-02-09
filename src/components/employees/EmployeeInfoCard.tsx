import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Edit, Clock, UserMinus, User } from 'lucide-react';
import { CurrencyIcon } from '../common';
import { useLanguage } from '../../contexts/LanguageContext';

interface EmployeeInfoCardProps {
  employee: {
    id: string;
    name: string;
    role: string;
    status: string;
    department: string;
    employeeCode?: string;
  };
  currentView: 'profile' | 'attendance' | 'payroll' | 'offboard' | 'edit';
  onViewProfile?: (id: string) => void;
  onEdit: (id: string) => void;
  onViewAttendance: (id: string) => void;
  onViewPayroll: (id: string) => void;
  onOffboard: (id: string) => void;
}

export default function EmployeeInfoCard({
  employee,
  currentView,
  onViewProfile,
  onEdit,
  onViewAttendance,
  onViewPayroll,
  onOffboard,
}: EmployeeInfoCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="border-t-4 border-t-blue-600">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xl">
                {employee.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-medium text-gray-900">{employee.name}</h2>
              <p className="text-gray-600 mt-0.5">{employee.role}</p>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  {employee.employeeCode || ''}
                </Badge>
                <Badge
                  className={
                    employee.status === 'Active'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-orange-100 text-orange-700 border-orange-200'
                  }
                >
                  {employee.status}
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">{employee.department}</Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {onViewProfile && (
              <Button
                onClick={() => onViewProfile(employee.id)}
                variant={currentView === 'profile' ? 'default' : 'outline'}
                className={currentView === 'profile' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : ''}
              >
                <User className="w-4 h-4 mr-2" />
                {t('employee.viewProfile')}
              </Button>
            )}
            <Button
              onClick={() => onEdit(employee.id)}
              variant={currentView === 'edit' ? 'default' : 'outline'}
              className={currentView === 'edit' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : ''}
            >
              <Edit className="w-4 h-4 mr-2" />
              {t('employee.editProfile')}
            </Button>
            <Button
              onClick={() => onViewAttendance(employee.id)}
              variant={currentView === 'attendance' ? 'default' : 'outline'}
              className={currentView === 'attendance' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : ''}
            >
              <Clock className="w-4 h-4 mr-2" />
              {t('employee.attendance')}
            </Button>
            <Button
              onClick={() => onViewPayroll(employee.id)}
              variant={currentView === 'payroll' ? 'default' : 'outline'}
              className={currentView === 'payroll' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : ''}
            >
              <CurrencyIcon className="w-4 h-4 mr-2" />
              {t('employee.payroll')}
            </Button>
            <Button
              onClick={() => onOffboard(employee.id)}
              variant="outline"
              className={currentView === 'offboard' ? 'bg-orange-100 text-orange-700' : 'text-orange-600 hover:bg-orange-50'}
            >
              <UserMinus className="w-4 h-4 mr-2" />
              {t('employee.offboard')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
