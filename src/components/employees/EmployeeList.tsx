import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Plus, Mail, Phone, MapPin, Eye, Edit, Clock, UserMinus, Filter, FileText } from 'lucide-react';
import { Pagination, CurrencyIcon } from '../common';
import { employeeService } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from '../../utils/toast';
import DataTable, { TableColumn } from '../common/DataTable';
import { AvatarCell, IconTextCell } from '../common/TableCells';

interface EmployeeListProps {
  onViewEmployee: (id: string) => void;
  onEditEmployee: (id: string) => void;
  onViewAttendance: (id: string) => void;
  onViewPayroll: (id: string) => void;
  onOffboardEmployee: (id: string) => void;
  onAddEmployee: () => void;
  onViewDocuments: (id: string, name: string, code: string) => void;
}

export default function EmployeeList({
  onViewEmployee,
  onEditEmployee,
  onViewAttendance,
  onViewPayroll,
  onOffboardEmployee,
  onAddEmployee,
  onViewDocuments,
}: EmployeeListProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const itemsPerPage = 10;
  const { t } = useLanguage();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getAll();
      // Handle the nested response structure from the API
      // API returns { status: 'success', data: { employees: [...], pager: {...} } }
      const employeeData = response.data?.employees || [];

      const mappedEmployees = employeeData.map((emp: any) => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        email: emp.email,
        phone: emp.phone || 'N/A',
        department: emp.department_name || 'Unassigned',
        role: emp.designation || 'N/A',
        location: emp.location_name || 'Unassigned',
        status: emp.status,
      }));

      setEmployees(mappedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
      setEmployees([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    const matchesLocation = filterLocation === 'all' || emp.location === filterLocation;
    return matchesSearch && matchesDepartment && matchesStatus && matchesLocation;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const departments = ['all', ...Array.from(new Set(employees.map((e) => e.department)))];
  const locations = ['all', ...Array.from(new Set(employees.map((e) => e.location)))];
  const statuses = ['all', 'Active', 'Notice Period', 'On Leave'];

  // Handle checkbox selections
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(paginatedEmployees.map(emp => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (empId: string | number, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, empId as string]);
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== empId));
    }
  };

  const selectedEmployeeObjects = employees.filter(emp =>
    selectedEmployees.includes(emp.id)
  );

  const columns: TableColumn[] = [
    {
      header: t('employees.employee'),
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <AvatarCell
          name={row.name}
          subtitle={row.id}
        />
      ),
    },
    {
      header: t('employees.contact'),
      accessor: 'email',
      sortable: true,
      cell: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail className="w-4 h-4 text-gray-400" />
            {row.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400" />
            {row.phone}
          </div>
        </div>
      ),
    },
    {
      header: t('employees.departmentRole'),
      accessor: 'department',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.department}</p>
          <p className="text-sm text-gray-600">{row.role}</p>
        </div>
      ),
    },
    {
      header: t('employees.location'),
      accessor: 'location',
      sortable: true,
      cell: (row) => (
        <IconTextCell
          icon={MapPin}
          text={row.location}
          iconClassName="w-4 h-4 text-gray-400"
          textClassName="text-sm text-gray-700"
        />
      ),
    },
    {
      header: t('common.status'),
      accessor: 'status',
      sortable: true,
      cell: (row) => (
        <Badge
          className={
            row.status === 'Active'
              ? 'bg-green-100 text-green-700 border-green-200'
              : 'bg-orange-100 text-orange-700 border-orange-200'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: t('common.actions'),
      cell: (row) => (
        <div className="grid grid-cols-3 gap-1 w-fit">
          <Button
            variant="ghost"
            size="sm"
            title={t('employees.viewProfile')}
            onClick={(e) => {
              e.stopPropagation();
              onViewEmployee(row.id);
            }}
            className="hover:bg-blue-50"
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title={t('employees.checkAttendance')}
            onClick={(e) => {
              e.stopPropagation();
              onViewAttendance(row.id);
            }}
            className="hover:bg-green-50"
          >
            <Clock className="w-4 h-4 text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title={t('employees.checkPayroll')}
            onClick={(e) => {
              e.stopPropagation();
              onViewPayroll(row.id);
            }}
            className="hover:bg-purple-50"
          >
            <CurrencyIcon className="w-4 h-4 text-purple-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title={t('employees.viewDocuments')}
            onClick={(e) => {
              e.stopPropagation();
              onViewDocuments(row.id, row.name, row.employeeId);
            }}
            className="hover:bg-gray-50"
          >
            <FileText className="w-4 h-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title={t('employees.editDetails')}
            onClick={(e) => {
              e.stopPropagation();
              onEditEmployee(row.id);
            }}
            className="hover:bg-indigo-50"
          >
            <Edit className="w-4 h-4 text-indigo-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title={t('employees.initiateOffboarding')}
            onClick={(e) => {
              e.stopPropagation();
              onOffboardEmployee(row.id);
            }}
            className="hover:bg-orange-50"
          >
            <UserMinus className="w-4 h-4 text-orange-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-medium text-gray-900">{t('employees.title')}</h2>
          <p className="text-sm text-gray-600 mt-1">{t('employees.subtitle')}</p>
        </div>
        <Button onClick={onAddEmployee} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          {t('employees.addEmployee')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <h3 className="font-medium text-gray-900">{t('common.filter')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('employees.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={filterDepartment}
              onValueChange={(value: string) => {
                setFilterDepartment(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('employees.department')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('employees.allDepartments')}</SelectItem>
                {departments.slice(1).map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterLocation}
              onValueChange={(value: string) => {
                setFilterLocation(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('employees.location')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('dashboard.allLocations')}</SelectItem>
                {locations.slice(1).map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterStatus}
              onValueChange={(value: string) => {
                setFilterStatus(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('common.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('employees.allStatus')}</SelectItem>
                {statuses.slice(1).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {t('employees.showing', { current: filteredEmployees.length, total: employees.length })}
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <DataTable
        columns={columns}
        data={paginatedEmployees}
        selectable
        selectedRows={selectedEmployeeObjects}
        onSelectRow={handleSelectEmployee}
        onSelectAll={handleSelectAll}
        exportable
        exportFileName="employees"
        exportHeaders={['ID', 'Name', 'Email', 'Phone', 'Department', 'Role', 'Location', 'Status', 'Join Date', 'Manager']}
        sortable
        headerStyle="gradient"
        cellPadding="relaxed"
        emptyMessage={t('employees.noEmployees')}
      />

      {filteredEmployees.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredEmployees.length}
        />
      )}
    </div>
  );
}