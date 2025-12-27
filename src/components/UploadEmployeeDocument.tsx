import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ArrowLeft, Save, FileText, Upload, Calendar, CheckCircle2, File, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import toast from '../utils/toast';

interface UploadEmployeeDocumentProps {
  onBack: () => void;
  employeeName: string;
  employeeId: string;
  replacingDocument?: any;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export default function UploadEmployeeDocument({ onBack, employeeName, employeeId, replacingDocument }: UploadEmployeeDocumentProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    documentType: replacingDocument?.type || '',
    documentName: replacingDocument?.name || '',
    expiryDate: replacingDocument?.expiryDate || '',
    notes: '',
  });
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getExpiryStatus = (expiryDate: string) => {
    if (!expiryDate) return { status: 'none', message: '', color: '' };

    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return {
        status: 'expired',
        message: 'Expired',
        color: 'red',
        days: Math.abs(daysUntilExpiry),
      };
    } else if (daysUntilExpiry <= 30) {
      return {
        status: 'expiring-soon',
        message: `Expires in ${daysUntilExpiry} days`,
        color: 'orange',
        days: daysUntilExpiry,
      };
    } else if (daysUntilExpiry <= 90) {
      return {
        status: 'warning',
        message: `Expires in ${daysUntilExpiry} days`,
        color: 'yellow',
        days: daysUntilExpiry,
      };
    } else {
      return {
        status: 'valid',
        message: `Valid until ${new Date(expiryDate).toLocaleDateString('en-AE')}`,
        color: 'green',
        days: daysUntilExpiry,
      };
    }
  };

  const documentsRequiringExpiry = [
    'Emirates ID',
    'Passport',
    'UAE Visa',
    'Labour Card',
    'Health Insurance Card',
    'UAE Driving License',
  ];

  const requiresExpiryDate = () => {
    return documentsRequiringExpiry.some(doc =>
      formData.documentName.toLowerCase().includes(doc.toLowerCase()) ||
      formData.documentType === 'uae'
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File Too Large', `${file.name} exceeds 10MB limit`);
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid File Type', 'Please upload PDF, JPG, PNG, or DOC files only');
        return;
      }

      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        const fileInfo: UploadedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
        };
        setUploadedFile(fileInfo);
        setIsUploading(false);
        toast.success('File Ready', `${file.name} is ready to upload`);
      }, 1000);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    toast.info('File Removed', 'You can select a different file');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedFile) {
      toast.error('No File Selected', 'Please select a file to upload');
      return;
    }

    if (requiresExpiryDate() && !formData.expiryDate) {
      toast.error('Expiry Date Required', 'This document type requires an expiry date');
      return;
    }

    if (formData.expiryDate) {
      const status = getExpiryStatus(formData.expiryDate);
      if (status.status === 'expired') {
        toast.error('Document Expired', 'Cannot upload an already expired document');
        return;
      }
    }

    // Handle form submission
    const action = replacingDocument ? 'replaced' : 'uploaded';
    toast.success(`Document ${action === 'replaced' ? 'Replaced' : 'Uploaded'}`, `${formData.documentName} has been ${action} successfully`);
    onBack();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExpiryDateChange = (expiryDate: string) => {
    setFormData(prev => ({ ...prev, expiryDate }));

    if (expiryDate) {
      const status = getExpiryStatus(expiryDate);
      if (status.status === 'expired') {
        toast.warning('Document Expired', 'This document has already expired. Please upload a valid document.');
      } else if (status.status === 'expiring-soon') {
        toast.warning('Expiring Soon', `This document will expire in ${status.days} days.`);
      }
    }
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
          {t('documents.employeeDocuments')}
        </button>
        <span>/</span>
        <span className="text-gray-900">{t('documents.uploadDocument')}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl">
              {replacingDocument ? `Replace: ${replacingDocument.name}` : t('documents.uploadEmployeeDocument')}
            </h1>
            <p className="text-sm text-gray-600">
              {replacingDocument
                ? `Upload new version for ${employeeName} (${employeeId})`
                : `${t('documents.uploadNewDocumentFor')} ${employeeName} (${employeeId})`
              }
            </p>
          </div>
        </div>
        {replacingDocument && (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-sm px-3 py-1">
            🔄 Replacing Document
          </Badge>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Document Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('documents.documentInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentType">
                    {t('documents.documentType')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.documentType} onValueChange={(value) => handleChange('documentType', value)}>
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder={t('documents.selectDocumentType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uae">{t('documents.uaeDocuments')}</SelectItem>
                      <SelectItem value="identity">{t('documents.identityProof')}</SelectItem>
                      <SelectItem value="education">{t('documents.educationalCertificate')}</SelectItem>
                      <SelectItem value="employment">{t('documents.employmentDocuments')}</SelectItem>
                      <SelectItem value="medical">{t('documents.medicalRecords')}</SelectItem>
                      <SelectItem value="financial">{t('documents.financialDocuments')}</SelectItem>
                      <SelectItem value="other">{t('documents.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentName">
                    {t('documents.documentName')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="documentName"
                    value={formData.documentName}
                    onChange={(e) => handleChange('documentName', e.target.value)}
                    placeholder={t('documents.documentNamePlaceholder')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">
                    {t('documents.notes')} (Optional)
                  </Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Add any notes about this document"
                  />
                </div>
              </div>

              {/* Expiry Date Section - Prominent for UAE docs */}
              {requiresExpiryDate() && (
                <div className={`p-4 rounded-lg border-2 border-dashed ${formData.expiryDate
                    ? 'border-transparent bg-transparent'
                    : 'border-orange-300 bg-orange-50'
                  }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <Label htmlFor="expiryDate" className="text-sm font-medium">
                      📅 Document Expiry Date <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleExpiryDateChange(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    placeholder="Select expiry date"
                    required
                    className={
                      formData.expiryDate
                        ? getExpiryStatus(formData.expiryDate).status === 'expired'
                          ? 'border-red-500 focus:border-red-500'
                          : getExpiryStatus(formData.expiryDate).status === 'expiring-soon'
                            ? 'border-orange-500 focus:border-orange-500'
                            : 'border-green-500 focus:border-green-500'
                        : 'border-orange-400'
                    }
                  />
                  {formData.expiryDate && (
                    <div className="flex items-center gap-2 mt-2">
                      {getExpiryStatus(formData.expiryDate).status === 'expired' ? (
                        <Badge className="bg-red-100 text-red-700 border-red-200">
                          ⚠️ {getExpiryStatus(formData.expiryDate).message}
                        </Badge>
                      ) : getExpiryStatus(formData.expiryDate).status === 'expiring-soon' ? (
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                          ⏰ {getExpiryStatus(formData.expiryDate).message}
                        </Badge>
                      ) : getExpiryStatus(formData.expiryDate).status === 'warning' ? (
                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                          📅 {getExpiryStatus(formData.expiryDate).message}
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          ✓ {getExpiryStatus(formData.expiryDate).message}
                        </Badge>
                      )}
                    </div>
                  )}
                  {!formData.expiryDate && (
                    <div className="flex items-start gap-2 mt-2 p-2 bg-white rounded border border-orange-200">
                      <span className="text-orange-600 text-xs">⚡</span>
                      <p className="text-xs text-orange-700 font-medium">
                        Required: Enter expiry date to enable automatic renewal alerts
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* File Upload Section */}
              <div className="space-y-2">
                <Label>{t('documents.uploadFile')} <span className="text-red-500">*</span></Label>
                {!uploadedFile ? (
                  <div>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,image/jpeg,image/jpg,image/png,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                    <div
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-12 h-12 mx-auto mb-2 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                          <p className="text-sm text-blue-600 font-medium">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          <p className="text-sm text-gray-600 group-hover:text-blue-600">{t('documents.clickToUpload')}</p>
                          <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOC (max 10MB)</p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <File className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {uploadedFile.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-600">
                            {formatFileSize(uploadedFile.size)}
                          </p>
                          <span className="text-gray-400">•</span>
                          <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Ready to upload
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
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
              {t('documents.upload')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}