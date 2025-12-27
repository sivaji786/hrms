import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Clock, Users, Plus, Edit, Trash2, Search, Calendar, TrendingUp, UserCheck, X, Save, AlertTriangle } from 'lucide-react';
import { Pagination } from './common';
import { shiftStats } from '../data/shiftData';
import { StatCard } from './common';
import { useLanguage } from '../contexts/LanguageContext';
import AddNewShift from './AddNewShift';
import DataTable, { TableColumn } from './common/DataTable';
import { AvatarCell } from './common/TableCells';
import { shiftService } from '../services/api';
import { toast } from '../utils/toast';
import { useCallback, useEffect } from 'react';

// Mock data removed
// const employeeShiftAssignments = ...

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ShiftManagement() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('shifts');
  const [shifts, setShifts] = useState<any[]>([]); // Initialize with empty array
  const [assignments, setAssignments] = useState<any[]>([]); // Assignments state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [assignSearchTerm, setAssignSearchTerm] = useState('');
  const [assignFilterDepartment, setAssignFilterDepartment] = useState('all');
  const [assignFilterShift, setAssignFilterShift] = useState('all');
  const [assignCurrentPage, setAssignCurrentPage] = useState(1);
  const assignItemsPerPage = 8;

  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [bulkShiftId, setBulkShiftId] = useState('');
  const [showBulkAssign, setShowBulkAssign] = useState(false);

  // Edit state
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  // Delete state
  const [deletingShiftId, setDeletingShiftId] = useState<string | null>(null);
  const [targetShiftForReassign, setTargetShiftForReassign] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);

  const fetchShifts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await shiftService.getShifts();
      // Map backend data to frontend model
      const shiftsArray = Array.isArray(data) ? data : [];
      const mappedShifts = shiftsArray.map((s: any) => {
        // Handle work_days safely
        let parsedWorkDays: string[] = [];
        try {
          if (Array.isArray(s.work_days)) {
            parsedWorkDays = s.work_days;
          } else if (typeof s.work_days === 'string') {
            // Try JSON parse first
            if (s.work_days.trim().startsWith('[')) {
              parsedWorkDays = JSON.parse(s.work_days);
            } else {
              // Fallback to comma separation
              parsedWorkDays = s.work_days.split(',').map((d: string) => d.trim().replace(/"/g, ''));
            }
          }
        } catch (e) {
          console.warn('Failed to parse work_days for shift', s.id, s.work_days);
          parsedWorkDays = [];
        }

        return {
          ...s,
          startTime: s.start_time,
          endTime: s.end_time,
          timing: `${s.start_time} - ${s.end_time}`,
          breakMinutes: s.break_duration,
          workDays: parsedWorkDays,
          employeeCount: 0, // Backend doesn't return this yet, would need a join or count
        };
      });
      setShifts(mappedShifts);
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
      toast.error("Failed to load shifts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);


  const filteredShifts = shifts.filter((shift) =>
    shift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shift.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);
  const fetchAssignments = useCallback(async () => {
    try {
      setIsLoadingAssignments(true);
      const data = await shiftService.getEmployeeShifts();
      const assignmentsArray = Array.isArray(data) ? data : (data.data || []);

      const mapped = assignmentsArray.map((a: any) => ({
        id: a.employee_id, // Use employee_id as row ID for table purposes
        name: a.employee_name || `${a.first_name} ${a.last_name}`,
        department: a.department,
        shiftId: a.shift_id,
        shiftName: a.shift_name,
        shiftCode: a.shift_code,
        assignedDate: a.effective_from,
        timing: `${a.start_time?.substring(0, 5)} - ${a.end_time?.substring(0, 5)}`
      }));
      setAssignments(mapped);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
      toast.error("Failed to load assignments");
    } finally {
      setIsLoadingAssignments(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'assignments') {
      fetchAssignments();
    }
  }, [activeTab, fetchAssignments]);

  const filteredAssignments = assignments.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(assignSearchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(assignSearchTerm.toLowerCase());
    const matchesDepartment = assignFilterDepartment === 'all' || emp.department === assignFilterDepartment;
    const matchesShift = assignFilterShift === 'all' || emp.shiftId === assignFilterShift;
    return matchesSearch && matchesDepartment && matchesShift;
  });

  const totalPages = Math.ceil(filteredShifts.length / itemsPerPage);
  const paginatedShifts = filteredShifts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const assignTotalPages = Math.ceil(filteredAssignments.length / assignItemsPerPage);
  const paginatedAssignments = filteredAssignments.slice(
    (assignCurrentPage - 1) * assignItemsPerPage,
    assignCurrentPage * assignItemsPerPage
  );

  // Calculate departments dynamically from fetched assignments
  const departments = ['all', ...Array.from(new Set(assignments.map((e) => e.department).filter(Boolean)))];

  const handleSelectEmployee = (empId: string | number, checked: boolean) => {
    if (checked) {
      setSelectedEmployees((prev) => [...prev, empId as string]);
    } else {
      setSelectedEmployees((prev) => prev.filter((id) => id !== empId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(paginatedAssignments.map((emp) => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleBulkAssign = async () => {
    try {
      await shiftService.assignShift({
        employeeIds: selectedEmployees,
        shiftId: bulkShiftId
      });
      toast.success("Shift assigned successfully");
      setShowBulkAssign(false);
      setSelectedEmployees([]);
      setBulkShiftId('');
      fetchAssignments(); // Refresh list
    } catch (error) {
      console.error("Failed to assign shift:", error);
      toast.error("Failed to assign shift");
    }
  };

  const handleStartEdit = (shift: any) => {
    setEditingShiftId(shift.id);
    setEditFormData({ ...shift });
  };

  const handleCancelEdit = () => {
    setEditingShiftId(null);
    setEditFormData({});
  };

  const handleSaveEdit = async () => {
    if (!editingShiftId) return;
    try {
      const payload = {
        name: editFormData.name,
        start_time: editFormData.startTime,
        end_time: editFormData.endTime,
        break_duration: editFormData.breakMinutes,
        work_days: JSON.stringify(editFormData.workDays),
        status: editFormData.status
      };
      await shiftService.updateShift(editingShiftId, payload);
      toast.success("Shift updated successfully");
      fetchShifts(); // Refresh list
      setEditingShiftId(null);
      setEditFormData({});
    } catch (error) {
      console.error("Failed to update shift:", error);
      toast.error("Failed to update shift");
    }
  };

  const handleDeleteShift = (shiftId: string) => {
    setDeletingShiftId(shiftId);
  };

  const handleConfirmDelete = async () => {
    const shiftId = deletingShiftId;
    if (!shiftId) return;

    try {
      await shiftService.deleteShift(shiftId);
      toast.success("Shift deleted successfully");
      fetchShifts(); // Refresh list
    } catch (error) {
      console.error("Failed to delete shift:", error);
      toast.error("Failed to delete shift");
    } finally {
      setDeletingShiftId(null);
      setTargetShiftForReassign('');
    }
  };

  const handleWorkDayToggle = (day: string) => {
    setEditFormData((prev: any) => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter((d: string) => d !== day)
        : [...prev.workDays, day],
    }));
  };

  const handleAddShift = () => {
    setShowAddShift(true);
  };

  const handleSubmitNewShift = async (data: any) => {
    try {
      const payload = {
        name: data.name,
        start_time: data.startTime,
        end_time: data.endTime,
        break_duration: data.breakMinutes,
        work_days: JSON.stringify(data.workDays),
        status: data.status || 'Active'
      };
      await shiftService.createShift(payload);
      toast.success("Shift created successfully");
      fetchShifts();
      setShowAddShift(false);
    } catch (error) {
      console.error("Failed to create shift:", error);
      toast.error("Failed to create shift");
    }
  };

  const selectedEmployeeObjects = assignments.filter(emp => selectedEmployees.includes(emp.id));

  // Assignment columns for DataTable
  const assignmentColumns: TableColumn[] = [
    {
      header: t('shifts.employee'),
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
      header: t('shifts.department'),
      accessor: 'department',
      sortable: true,
    },
    {
      header: t('shifts.currentShift'),
      accessor: 'shiftName',
      sortable: true,
      cell: (row) => (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          {row.shiftName}
        </Badge>
      ),
    },
    {
      header: t('shifts.shiftTiming'),
      accessor: 'shiftId',
      cell: (row) => {
        const currentShift = shifts.find(s => s.id === row.shiftId);
        return (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Clock className="w-4 h-4 text-gray-400" />
            {currentShift?.timing}
          </div>
        );
      },
    },
    {
      header: t('shifts.assignedSince'),
      accessor: 'assignedDate',
      sortable: true,
      cell: (row) => (
        <p className="text-sm text-gray-600">{row.assignedDate}</p>
      ),
    },
    {
      header: t('shifts.actions'),
      cell: () => (
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Change Shift
        </Button>
      ),
    },
  ];

  if (showAddShift) {
    return <AddNewShift onBack={() => setShowAddShift(false)} onSave={handleSubmitNewShift} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl text-gray-900">{t('shifts.title')}</h2>
          <p className="text-gray-600 mt-1">{t('shifts.subtitle')}</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" onClick={handleAddShift}>
          <Plus className="w-4 h-4 mr-2" />
          {t('shifts.addShift')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('shifts.totalShifts')}
          value={shiftStats.totalShifts}
          subtitle={t('shifts.configured')}
          icon={Clock}
          variant="default"
        />
        <StatCard
          title={t('shifts.activeShifts')}
          value={shiftStats.activeShifts}
          subtitle={t('shifts.inOperation')}
          icon={TrendingUp}
          variant="default"
        />
        <StatCard
          title={t('shifts.employeesAssigned')}
          value={shiftStats.totalAssigned}
          subtitle={t('shifts.total')}
          icon={Users}
          variant="default"
        />
        <StatCard
          title={t('shifts.shiftsToday')}
          value={shiftStats.activeShifts}
          subtitle={t('shifts.running')}
          icon={UserCheck}
          variant="default"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="shifts">{t('shifts.shiftsList')}</TabsTrigger>
          <TabsTrigger value="assignments">{t('shifts.shiftAssignments')}</TabsTrigger>
        </TabsList>

        <TabsContent value="shifts" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('shifts.searchShifts')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Shifts Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedShifts.map((shift) => (
              <Card key={shift.id} className="hover:shadow-lg transition-shadow">
                {editingShiftId === shift.id ? (
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{t('shifts.editShift')}</h3>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label>{t('shifts.shiftName')}</Label>
                        <Input
                          value={editFormData.name}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>{t('shifts.startTime')}</Label>
                          <Input
                            type="time"
                            value={editFormData.startTime}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, startTime: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>{t('shifts.endTime')}</Label>
                          <Input
                            type="time"
                            value={editFormData.endTime}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, endTime: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label>{t('shifts.workingDays')}</Label>
                        <div className="flex gap-2 mt-2">
                          {DAYS_OF_WEEK.map((day) => (
                            <Button
                              key={day}
                              type="button"
                              variant={editFormData.workDays?.includes(day) ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleWorkDayToggle(day)}
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>{t('shifts.status')}</Label>
                        <Select
                          value={editFormData.status}
                          onValueChange={(value: string) =>
                            setEditFormData({ ...editFormData, status: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                ) : (
                  <>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{shift.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{shift.code || shift.id}</p>
                        </div>
                        <Badge
                          className={
                            shift.status === 'Active'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }
                        >
                          {shift.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{shift.timing}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {shift.employeeCount} {t('shifts.employees')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div className="flex gap-1">
                            {shift.workDays.map((day: string) => (
                              <Badge
                                key={day}
                                variant="outline"
                                className="text-xs py-0 px-1.5"
                              >
                                {day}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleStartEdit(shift)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {t('shifts.edit')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteShift(shift.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={t('shifts.searchEmployees')}
                    value={assignSearchTerm}
                    onChange={(e) => setAssignSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={assignFilterDepartment} onValueChange={setAssignFilterDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('shifts.department')} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept === 'all' ? t('shifts.allDepartments') : dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={assignFilterShift} onValueChange={setAssignFilterShift}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('shifts.shift')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('shifts.allShifts')}</SelectItem>
                    {shifts.map((shift) => (
                      <SelectItem key={shift.id} value={shift.id}>
                        {shift.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  disabled={selectedEmployees.length === 0}
                  onClick={() => setShowBulkAssign(true)}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  {t('shifts.bulkAssign')} ({selectedEmployees.length})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Assign Section */}
          {showBulkAssign && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-3">
                      {t('shifts.assigningTo')} {selectedEmployees.length} {t('shifts.selectedEmployees')}
                    </p>
                    <Select value={bulkShiftId} onValueChange={setBulkShiftId}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('shifts.selectShift')} />
                      </SelectTrigger>
                      <SelectContent>
                        {shifts.filter(s => s.status === 'Active').map((shift) => (
                          <SelectItem key={shift.id} value={shift.id}>
                            {shift.name} - {shift.timing}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleBulkAssign} disabled={!bulkShiftId} className="bg-purple-600 hover:bg-purple-700">
                      Assign Now
                    </Button>
                    <Button variant="outline" onClick={() => setShowBulkAssign(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assignments Table with DataTable */}
          <Card>
            <CardHeader>
              <CardTitle>{t('shifts.employeeShiftAssignments')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={assignmentColumns}
                data={paginatedAssignments}
                selectable
                selectedRows={selectedEmployeeObjects}
                onSelectRow={handleSelectEmployee}
                onSelectAll={handleSelectAll}
                exportable
                sortable
                exportFileName="shift-assignments"
                exportHeaders={['Employee ID', 'Employee Name', 'Department', 'Shift ID', 'Shift Name', 'Shift Timing', 'Assigned Since']}
                headerStyle="gradient"
                cellPadding="relaxed"
                loading={isLoading}
                emptyMessage={t('shifts.noAssignmentsFound')}
              />
            </CardContent>
          </Card>

          {assignTotalPages > 1 && (
            <Pagination
              currentPage={assignCurrentPage}
              totalPages={assignTotalPages}
              onPageChange={setAssignCurrentPage}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation */}
      {deletingShiftId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                {t('shifts.deleteShift')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                {t('shifts.deleteConfirmation')}
              </p>
              <div className="space-y-2">
                <Label>{t('shifts.reassignEmployees')}</Label>
                <Select
                  value={targetShiftForReassign}
                  onValueChange={setTargetShiftForReassign}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('shifts.selectShift')} />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts
                      .filter((s) => s.id !== deletingShiftId && s.status === 'Active')
                      .map((shift) => (
                        <SelectItem key={shift.id} value={shift.id}>
                          {shift.name} - {shift.timing}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeletingShiftId(null)}
                >
                  {t('shifts.cancel')}
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleConfirmDelete}
                  disabled={!targetShiftForReassign}
                >
                  {t('shifts.delete')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}