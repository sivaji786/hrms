import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Save, FileText, Upload, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { policyService, Policy } from '../services/policyService';
import toast from '../utils/toast';

interface AddPolicyProps {
  onBack: () => void;
  initialData?: Policy | null;
}

export default function AddPolicy({ onBack, initialData }: AddPolicyProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    version: '',
    effectiveDate: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        category: initialData.category,
        version: initialData.version,
        effectiveDate: initialData.effectiveDate,
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('version', formData.version);
      data.append('effectiveDate', formData.effectiveDate);
      data.append('description', formData.description);

      if (file) {
        data.append('file', file);
      }

      if (initialData) {
        await policyService.update(initialData.id, data);
        toast.success(t('documents.policyUpdatedSuccessfully') || 'Policy updated successfully'); // Fallback translation
      } else {
        await policyService.create(data);
        toast.success(t('documents.policyCreatedSuccessfully'));
      }
      onBack();
    } catch (error: any) {
      console.error('Failed to save policy:', error);
      toast.error(error.message || t('common.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <button onClick={onBack} className="hover:text-gray-900">
          {t('nav.documents')}
        </button>
        <span>/</span>
        <button onClick={onBack} className="hover:text-gray-900">
          {t('documents.companyPolicies')}
        </button>
        <span>/</span>
        <span className="text-gray-900">{initialData ? t('documents.editPolicy') : t('documents.addNewPolicy')}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl">{initialData ? t('documents.editPolicy') : t('documents.addNewPolicy')}</h1>
            <p className="text-sm text-gray-600">
              {initialData ? t('documents.editPolicyDescription') || 'Update policy details' : t('documents.createNewCompanyPolicy')}
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
                <FileText className="w-5 h-5" />
                {t('documents.policyInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    {t('documents.policyTitle')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder={t('documents.policyTitlePlaceholder')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    {t('documents.category')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder={t('documents.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">{t('documents.general')}</SelectItem>
                      <SelectItem value="HR">{t('documents.hr')}</SelectItem>
                      <SelectItem value="IT">{t('documents.it')}</SelectItem>
                      <SelectItem value="Finance">{t('documents.finance')}</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version">
                    {t('documents.version')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => handleChange('version', e.target.value)}
                    placeholder={t('documents.versionPlaceholder')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">
                    {t('documents.effectiveDate')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => handleChange('effectiveDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {t('documents.description')}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder={t('documents.descriptionPlaceholder')}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('documents.uploadPolicyDocument')}</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  {file ? (
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 mb-2 text-green-500" />
                      <p className="text-sm font-medium text-green-700">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">{initialData ? t('documents.clickToUploadUpdate') || 'Click to upload new version' : t('documents.clickToUpload')}</p>
                      <p className="text-xs text-gray-400 mt-1">{t('documents.uploadPdfDocument')}</p>
                    </>
                  )}
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
              {loading ? (initialData ? t('documents.updating') || 'Updating...' : t('documents.creating')) : (initialData ? t('documents.updatePolicy') || 'Update Policy' : t('documents.createPolicy'))}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}