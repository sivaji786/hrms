import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { organizationService, employeeService } from '../services/api'; // Import services
import toast from '../utils/toast';

interface AddDepartmentProps {
  onBack: () => void;
  initialData?: any; // Add initialData prop
}

export default function AddDepartment({ onBack, initialData }: AddDepartmentProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    // Pre-fill form if editing
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        manager: initialData.manager_id || '',
        location: initialData.location_id || '',
      });
    }

    // Fetch dependencies
    const fetchDependencies = async () => {
      try {
        const [locs, emps] = await Promise.all([
          organizationService.getLocations(),
          employeeService.getAll(),
        ]);
        setLocations(locs.data || locs || []);
        setEmployees(emps.data || emps || []);
      } catch (error) {
        console.error('Error fetching dependencies:', error);
        toast.error('Failed to load form data');
      }
    };
    fetchDependencies();
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        manager_id: formData.manager,
        location_id: formData.location,
      };

      if (initialData?.id) {
        await organizationService.updateDepartment(initialData.id, payload);
        toast.success(t('admin.departmentUpdated') || 'Department updated successfully');
      } else {
        await organizationService.createDepartment(payload);
        toast.success(t('admin.departmentCreated') || 'Department created successfully');
      }
      onBack();
    } catch (error: any) {
      console.error('Error saving department:', error);
      toast.error(error.response?.data?.message || 'Failed to save department');
    } finally {
      setLoading(false);
    }
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
        <span className="text-gray-900">
          {initialData ? t('admin.editDepartment') || 'Edit Department' : t('admin.addDepartment')}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl">
              {initialData ? t('admin.editDepartment') || 'Edit Department' : t('admin.addDepartment')}
            </h1>
            <p className="text-sm text-gray-600">
              {initialData ? 'Update department details' : t('admin.addDepartmentDesc')}
            </p>
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
                  <Label htmlFor="manager">
                    {t('admin.departmentManager')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.manager} onValueChange={(value) => handleChange('manager', value)}>
                    <SelectTrigger id="manager">
                      <SelectValue placeholder={t('admin.selectManager')} />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.first_name} {emp.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    {t('admin.location')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.location} onValueChange={(value) => handleChange('location', value)}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder={t('admin.selectLocation') || 'Select Location'} />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? (initialData ? 'Updating...' : 'Saving...') : (initialData ? t('admin.update') || 'Update' : t('admin.saveDepartment'))}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}