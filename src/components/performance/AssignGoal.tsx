import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { ArrowLeft, Users, Target, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { goals } from '../../data/goalsData';
import { toast } from '../../utils/toast';
import Breadcrumbs from '../Breadcrumbs';
import { StatCard } from '../common';

interface AssignGoalProps {
  onBack: () => void;
}

export default function AssignGoal({ onBack }: AssignGoalProps) {
  const { t } = useLanguage();
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Mock employees data
  const employees = [
    { id: 'EMP001', name: 'John Smith', department: 'Engineering', avatar: 'JS' },
    { id: 'EMP002', name: 'Rahul Sharma', department: 'Engineering', avatar: 'RS' },
    { id: 'EMP003', name: 'Priya Patel', department: 'Marketing', avatar: 'PP' },
    { id: 'EMP004', name: 'Amit Kumar', department: 'Sales', avatar: 'AK' },
    { id: 'EMP005', name: 'Sneha Reddy', department: 'HR', avatar: 'SR' },
    { id: 'EMP006', name: 'Vikram Singh', department: 'Operations', avatar: 'VS' },
    { id: 'EMP007', name: 'Sarah Johnson', department: 'Engineering', avatar: 'SJ' },
    { id: 'EMP008', name: 'Michael Chen', department: 'Engineering', avatar: 'MC' },
    { id: 'EMP009', name: 'Lisa Wong', department: 'Marketing', avatar: 'LW' },
    { id: 'EMP010', name: 'David Brown', department: 'Sales', avatar: 'DB' },
    { id: 'EMP011', name: 'Emily Davis', department: 'HR', avatar: 'ED' },
    { id: 'EMP012', name: 'James Wilson', department: 'Operations', avatar: 'JW' },
  ];

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        searchQuery === '' ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, departmentFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(filteredEmployees.map((e) => e.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    } else {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));
    }
  };

  const handleAssign = () => {
    if (!selectedGoalId) {
      toast.error('Please select a goal to assign');
      return;
    }

    if (selectedEmployees.length === 0) {
      toast.error(t('performance.selectAtLeastOneEmployee'));
      return;
    }

    // In a real app, this would make an API call
    toast.success(t('performance.goals.goalsAssigned'));
    onBack();
  };

  const selectedGoal = goals.find((g) => g.id === selectedGoalId);
  const allSelected = filteredEmployees.length > 0 && selectedEmployees.length === filteredEmployees.length;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t('navigation.dashboard'), path: '/dashboard' },
          { label: t('navigation.performance'), path: '/performance' },
          { label: t('performance.goals.title'), path: '/performance/goals' },
          { label: t('performance.goals.assignGoalTitle') },
        ]}
      />

      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl text-gray-900">{t('performance.goals.assignGoalTitle')}</h2>
          <p className="text-gray-600 mt-1">{t('performance.goals.bulkAssignment')}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Available Employees"
          value={employees.length.toString()}
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Selected Employees"
          value={selectedEmployees.length.toString()}
          icon={CheckCircle2}
          variant="default"
        />
        <StatCard
          title="Available Goals"
          value={goals.length.toString()}
          icon={Target}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Select Goal */}
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.goals.selectGoalToAssign')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal..." />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedGoal && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">{selectedGoal.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{selectedGoal.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="bg-white">
                            {selectedGoal.kraName}
                          </Badge>
                          <Badge variant="outline" className="bg-white">
                            {selectedGoal.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Employee List */}
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.goals.selectEmployeesToAssign')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search and Filter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('performance.goals.filterByDepartment')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('performance.goals.allDepartments')}</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Select All */}
                <div className="flex items-center gap-2 py-2 border-b">
                  <Checkbox
                    id="select-all"
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="cursor-pointer">
                    Select All ({filteredEmployees.length})
                  </Label>
                </div>

                {/* Employee List */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        id={employee.id}
                        checked={selectedEmployees.includes(employee.id)}
                        onCheckedChange={(checked) => handleSelectEmployee(employee.id, checked as boolean)}
                      />
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                        <span className="text-sm">{employee.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={employee.id} className="cursor-pointer font-medium">
                          {employee.name}
                        </Label>
                        <p className="text-sm text-gray-600">{employee.department}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredEmployees.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No employees found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignment Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.goals.assignmentSummary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Selected Goal</p>
                  <p className="font-medium mt-1">
                    {selectedGoal ? selectedGoal.title : 'No goal selected'}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">Employees to Assign</p>
                  <p className="text-2xl font-medium mt-1 text-blue-600">
                    {selectedEmployees.length}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedEmployees.length === 1
                      ? '1 employee selected'
                      : `${selectedEmployees.length} ${t('performance.goals.employeesSelected')}`}
                  </p>
                </div>

                {selectedEmployees.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Selected:</p>
                    <div className="space-y-1 max-h-[200px] overflow-y-auto">
                      {selectedEmployees.map((empId) => {
                        const emp = employees.find((e) => e.id === empId);
                        return emp ? (
                          <div key={empId} className="flex items-center gap-2 text-sm">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs">
                              {emp.avatar}
                            </div>
                            <span className="truncate">{emp.name}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                    onClick={handleAssign}
                    disabled={!selectedGoalId || selectedEmployees.length === 0}
                  >
                    {t('performance.goals.assignGoals')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
