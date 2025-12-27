import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { kras } from '../../data/goalsData';
import { toast } from '../../utils/toast';
import Breadcrumbs from '../Breadcrumbs';
import PageHeader from '../common/PageHeader';
import type { Goal } from '../../data/goalsData';

interface CreateGoalProps {
  onBack: () => void;
  goal?: Goal; // For edit mode
}

export default function CreateGoal({ onBack, goal }: CreateGoalProps) {
  const { t } = useLanguage();
  const isEditMode = !!goal;

  const [formData, setFormData] = useState({
    title: goal?.title || '',
    description: goal?.description || '',
    employeeId: goal?.employeeId || '',
    employeeName: goal?.employeeName || '',
    department: goal?.department || '',
    kraId: goal?.kraId || '',
    type: goal?.type || 'Individual',
    measurementCriteria: goal?.measurementCriteria || '',
    targetValue: goal?.targetValue || '',
    weight: goal?.weight?.toString() || '',
    startDate: goal?.startDate || '',
    endDate: goal?.endDate || '',
    priority: goal?.priority || 'Medium',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock employees data
  const employees = [
    { id: 'EMP001', name: 'John Smith', department: 'Engineering' },
    { id: 'EMP002', name: 'Rahul Sharma', department: 'Engineering' },
    { id: 'EMP003', name: 'Priya Patel', department: 'Marketing' },
    { id: 'EMP004', name: 'Amit Kumar', department: 'Sales' },
    { id: 'EMP005', name: 'Sneha Reddy', department: 'HR' },
    { id: 'EMP006', name: 'Vikram Singh', department: 'Operations' },
  ];

  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Operations', 'Finance', 'Customer Success'];
  const types = ['Individual', 'Team', 'Organizational'];
  const priorities = ['Critical', 'High', 'Medium', 'Low'];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (employee) {
      setFormData((prev) => ({
        ...prev,
        employeeId: employee.id,
        employeeName: employee.name,
        department: employee.department,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Goal title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.employeeId) {
      newErrors.employeeId = 'Please select an employee';
    }

    if (!formData.kraId) {
      newErrors.kraId = 'Please select a KRA';
    }

    if (!formData.measurementCriteria.trim()) {
      newErrors.measurementCriteria = 'Measurement criteria is required';
    }

    if (!formData.targetValue.trim()) {
      newErrors.targetValue = 'Target value is required';
    }

    if (!formData.weight || parseInt(formData.weight) <= 0 || parseInt(formData.weight) > 100) {
      newErrors.weight = 'Weight must be between 1 and 100';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = t('performance.endDateMustBeAfterStartDate');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, this would make an API call
    if (isEditMode) {
      toast.success(t('performance.goals.goalUpdated'));
    } else {
      toast.success(t('performance.goals.goalCreated'));
    }

    onBack();
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t('navigation.dashboard'), path: '/dashboard' },
          { label: t('navigation.performance'), path: '/performance' },
          { label: t('performance.goals.title'), path: '/performance/goals' },
          { label: isEditMode ? t('performance.goals.editGoal') : t('performance.goals.createGoal') },
        ]}
      />

      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl text-gray-900">
            {isEditMode ? t('performance.goals.editExistingGoal') : t('performance.goals.createNewGoal')}
          </h2>
          <p className="text-gray-600 mt-1">{t('performance.goals.subtitle')}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.goals.basicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Goal Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  {t('performance.goals.goalTitleLabel')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder={t('performance.goals.goalTitlePlaceholder')}
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  {t('performance.goals.descriptionLabel')} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder={t('performance.goals.descriptionPlaceholder')}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Assign To & KRA - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">
                    {t('performance.goals.assignTo')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.employeeId} onValueChange={handleEmployeeChange}>
                    <SelectTrigger className={errors.employeeId ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t('performance.goals.selectEmployee')} />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name} - {emp.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.employeeId && <p className="text-sm text-red-500">{errors.employeeId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kra">
                    {t('performance.goals.kra')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.kraId} onValueChange={(value) => handleInputChange('kraId', value)}>
                    <SelectTrigger className={errors.kraId ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t('performance.goals.selectKRA')} />
                    </SelectTrigger>
                    <SelectContent>
                      {kras
                        .filter((k) => k.status === 'Active')
                        .map((kra) => (
                          <SelectItem key={kra.id} value={kra.id}>
                            {kra.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.kraId && <p className="text-sm text-red-500">{errors.kraId}</p>}
                </div>
              </div>

              {/* Type & Priority - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">
                    {t('performance.goals.goalType')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('performance.goals.selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`performance.goals.${type.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">
                    {t('performance.goals.priorityLabel')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('performance.goals.selectPriority')} />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {t(`performance.goals.${priority.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Measurement & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.goals.measurement')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Measurement Criteria */}
              <div className="space-y-2">
                <Label htmlFor="measurementCriteria">
                  {t('performance.goals.measurementCriteriaLabel')} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="measurementCriteria"
                  placeholder={t('performance.goals.measurementCriteriaPlaceholder')}
                  value={formData.measurementCriteria}
                  onChange={(e) => handleInputChange('measurementCriteria', e.target.value)}
                  rows={3}
                  className={errors.measurementCriteria ? 'border-red-500' : ''}
                />
                {errors.measurementCriteria && <p className="text-sm text-red-500">{errors.measurementCriteria}</p>}
              </div>

              {/* Target Value & Weight - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetValue">
                    {t('performance.goals.targetValueLabel')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="targetValue"
                    placeholder={t('performance.goals.targetValuePlaceholder')}
                    value={formData.targetValue}
                    onChange={(e) => handleInputChange('targetValue', e.target.value)}
                    className={errors.targetValue ? 'border-red-500' : ''}
                  />
                  {errors.targetValue && <p className="text-sm text-red-500">{errors.targetValue}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">
                    {t('performance.goals.weightLabel')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder={t('performance.goals.weightPlaceholder')}
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    min="1"
                    max="100"
                    className={errors.weight ? 'border-red-500' : ''}
                  />
                  {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
                </div>
              </div>

              {/* Start Date & End Date - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    {t('performance.goals.startDateLabel')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={errors.startDate ? 'border-red-500' : ''}
                  />
                  {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">
                    {t('performance.goals.endDateLabel')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={errors.endDate ? 'border-red-500' : ''}
                  />
                  {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onBack}>
              {t('performance.goals.cancel')}
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600">
              {t('performance.goals.saveGoal')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
