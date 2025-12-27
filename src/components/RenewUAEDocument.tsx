import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Save, Upload, AlertCircle, Calendar, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Breadcrumbs from './Breadcrumbs';
import toast from '../utils/toast';

interface RenewUAEDocumentProps {
  onBack: () => void;
  employeeName: string;
  employeeId: string;
  documentName: string;
  documentType: string;
  currentExpiryDate?: string;
}

export default function RenewUAEDocument({
  onBack,
  employeeName,
  employeeId,
  documentName,
  documentType,
  currentExpiryDate
}: RenewUAEDocumentProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    newExpiryDate: '',
    issueDate: '',
    documentNumber: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('documents.documentRenewed'), `${documentName} has been renewed successfully`);
    onBack();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const breadcrumbItems = [
    { label: t('nav.dashboard') },
    { label: t('employees.title') },
    { label: employeeName },
    { label: t('documents.title') },
    { label: t('documents.renewDocument') },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('documents.backToDocuments')}
        </Button>

        <Breadcrumbs items={breadcrumbItems} />

        <div>
          <h1 className="text-2xl">{t('documents.renewDocument')}</h1>
          <p className="text-gray-600">{t('documents.renewDocumentFor')} {employeeName} ({employeeId})</p>
        </div>
      </div>

      {/* Current Document Info */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900">{t('documents.currentDocumentInfo')}</h3>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-orange-700">{t('documents.documentName')}</p>
                  <p className="font-medium text-orange-900">{documentName}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-700">{t('documents.documentType')}</p>
                  <p className="font-medium text-orange-900">{documentType}</p>
                </div>
                {currentExpiryDate && (
                  <div>
                    <p className="text-sm text-orange-700">{t('documents.currentExpiryDate')}</p>
                    <p className="font-medium text-orange-900">{currentExpiryDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Renewal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('documents.renewalInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">
                    {t('documents.newIssueDate')} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="issueDate"
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => handleChange('issueDate', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newExpiryDate">
                    {t('documents.newExpiryDate')} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="newExpiryDate"
                      type="date"
                      value={formData.newExpiryDate}
                      onChange={(e) => handleChange('newExpiryDate', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentNumber">
                    {t('documents.documentNumber')}
                  </Label>
                  <Input
                    id="documentNumber"
                    value={formData.documentNumber}
                    onChange={(e) => handleChange('documentNumber', e.target.value)}
                    placeholder={t('documents.enterDocumentNumber')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">
                    {t('documents.notes')}
                  </Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder={t('documents.addNotesOptional')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('documents.uploadRenewedDocument')}</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">{t('documents.clickToUpload')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('documents.fileFormats')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* UAE Document Specific Reminders */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900">{t('documents.uaeDocumentReminders')}</h3>
                  <ul className="mt-2 space-y-1 text-sm text-blue-700">
                    <li>• {t('documents.reminder1')}</li>
                    <li>• {t('documents.reminder2')}</li>
                    <li>• {t('documents.reminder3')}</li>
                    <li>• {t('documents.reminder4')}</li>
                  </ul>
                </div>
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
              {t('documents.saveRenewal')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
