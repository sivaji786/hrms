import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from '../../utils/toast';
import Breadcrumbs from '../Breadcrumbs';
import type { KRA } from '../../data/goalsData';

interface CreateKRAProps {
  onBack: () => void;
  kra?: KRA; // For edit mode
}

export default function CreateKRA({ onBack, kra }: CreateKRAProps) {
  const { t } = useLanguage();
  const isEditMode = !!kra;

  const [formData, setFormData] = useState({
    name: kra?.name || '',
    description: kra?.description || '',
    department: kra?.department || '',
    weight: kra?.weight?.toString() || '',
    measurementCriteria: kra?.measurementCriteria || '',
    status: kra?.status || 'Active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Operations', 'Finance', 'Customer Success', 'Legal', 'All'];
  const statuses = ['Active', 'Inactive'];

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'KRA name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.department) {
      newErrors.department = 'Please select a department';
    }

    if (!formData.weight || parseInt(formData.weight) <= 0 || parseInt(formData.weight) > 100) {
      newErrors.weight = 'Weight must be between 1 and 100';
    }

    if (!formData.measurementCriteria.trim()) {
      newErrors.measurementCriteria = 'Measurement criteria is required';
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
      toast.success(t('performance.kra.kraUpdated'));
    } else {
      toast.success(t('performance.kra.kraCreated'));
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
          { label: t('performance.kra.title'), path: '/performance/kras' },
          { label: isEditMode ? t('performance.kra.editKRA') : t('performance.kra.createKRA') },
        ]}
      />

      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl text-gray-900">
            {isEditMode ? t('performance.kra.editKRA') : t('performance.kra.createNewKRA')}
          </h2>
          <p className="text-gray-600 mt-1">{t('performance.kra.subtitle')}</p>
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
              {/* KRA Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('performance.kra.nameLabel')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder={t('performance.kra.namePlaceholder')}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  {t('performance.kra.descriptionLabel')} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder={t('performance.kra.descriptionPlaceholder')}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Department & Weight - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">
                    {t('performance.kra.departmentLabel')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t('performance.kra.selectDepartment')} />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">
                    {t('performance.kra.weightLabel')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder={t('performance.kra.weightPlaceholder')}
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    min="1"
                    max="100"
                    className={errors.weight ? 'border-red-500' : ''}
                  />
                  {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
                </div>
              </div>

              {/* Measurement Criteria */}
              <div className="space-y-2">
                <Label htmlFor="measurementCriteria">
                  {t('performance.kra.measurementCriteriaLabel')} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="measurementCriteria"
                  placeholder={t('performance.kra.measurementCriteriaPlaceholder')}
                  value={formData.measurementCriteria}
                  onChange={(e) => handleInputChange('measurementCriteria', e.target.value)}
                  rows={3}
                  className={errors.measurementCriteria ? 'border-red-500' : ''}
                />
                {errors.measurementCriteria && <p className="text-sm text-red-500">{errors.measurementCriteria}</p>}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">
                  {t('performance.kra.statusLabel')} <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`performance.kra.${status.toLowerCase()}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onBack}>
              {t('performance.kra.cancel')}
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600">
              {t('performance.kra.saveKRA')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
