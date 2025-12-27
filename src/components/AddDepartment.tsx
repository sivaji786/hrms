import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AddDepartmentProps {
  onBack: () => void;
}

export default function AddDepartment({ onBack }: AddDepartmentProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    manager: '',
    description: '',
    location: '',
    budget: '',
    headcount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    // Show success message and navigate back
    onBack();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <button onClick={onBack} className="hover:text-gray-900">
          {t('admin.title')}
        </button>
        <span>/</span>
        <button onClick={onBack} className="hover:text-gray-900">
          {t('admin.departmentsTab')}
        </button>
        <span>/</span>
        <span className="text-gray-900">{t('admin.addDepartment')}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl">{t('admin.addDepartment')}</h1>
            <p className="text-sm text-gray-600">{t('admin.addDepartmentDesc')}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {t('admin.basicInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {t('admin.departmentName')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder={t('admin.enterDepartmentName')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">
                    {t('admin.departmentCode')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value)}
                    placeholder={t('admin.enterDepartmentCode')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager">
                    {t('admin.departmentManager')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.manager} onValueChange={(value) => handleChange('manager', value)}>
                    <SelectTrigger id="manager">
                      <SelectValue placeholder={t('admin.selectManager')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="jane">Jane Smith</SelectItem>
                      <SelectItem value="mike">Mike Johnson</SelectItem>
                      <SelectItem value="sarah">Sarah Williams</SelectItem>
                      <SelectItem value="rahul">Rahul Sharma</SelectItem>
                      <SelectItem value="priya">Priya Patel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    {t('admin.location')}
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder={t('admin.enterLocation')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">
                    {t('admin.departmentBudget')}
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                    placeholder={t('admin.enterBudget')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headcount">
                    {t('admin.targetHeadcount')}
                  </Label>
                  <Input
                    id="headcount"
                    type="number"
                    value={formData.headcount}
                    onChange={(e) => handleChange('headcount', e.target.value)}
                    placeholder={t('admin.enterHeadcount')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {t('admin.description')}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder={t('admin.enterDescription')}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onBack}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Save className="w-4 h-4 mr-2" />
              {t('admin.saveDepartment')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}