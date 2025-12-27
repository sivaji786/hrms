import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { ArrowLeft, Download, Trash2, FileText, Calendar, User, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import Breadcrumbs from '../Breadcrumbs';
import toast from '../../utils/toast';
import { documentService } from '../../services/api';

interface ViewDocumentProps {
  onBack: () => void;
  document: {
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    expiryDate: string | null;
    status: string;
    size: string;
  };
  employeeName: string;
  employeeId: string;
  onDownload: () => void;
  onDelete: () => void;
}

export default function ViewDocument({
  onBack,
  document,
  employeeName,
  employeeId,
  onDownload,
  onDelete
}: ViewDocumentProps) {
  const { t } = useLanguage();
  const [documentStatus, setDocumentStatus] = useState(document.status);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationHistory, setVerificationHistory] = useState<Array<{
    action: string;
    by: string;
    date: string;
    notes?: string;
  }>>([
    ...(document.status === 'Verified' ? [{
      action: 'verified',
      by: 'Admin User',
      date: document.uploadDate,
      notes: 'Document verified and approved'
    }] : []),
    {
      action: 'uploaded',
      by: employeeName,
      date: document.uploadDate,
    }
  ]);

  const handleVerifyDocument = async () => {
    try {
      await documentService.update(document.id, { status: 'Verified' });
      setDocumentStatus('Verified');
      const newHistory = {
        action: 'verified',
        by: 'Admin User',
        date: new Date().toLocaleDateString('en-AE'),
        notes: verificationNotes || 'Document verified and approved'
      };
      setVerificationHistory([newHistory, ...verificationHistory]);
      setVerificationNotes('');
      setIsVerifying(false);
      toast.success('Document Verified', { description: `${document.name} has been verified successfully` });
      if (onBack) onBack(); // Go back to refresh list
    } catch (error) {
      console.error('Error verifying document:', error);
      toast.error('Verification Failed', { description: 'Failed to verify document' });
    }
  };

  const handleRejectDocument = async () => {
    if (!verificationNotes.trim()) {
      toast.error('Rejection Reason Required', { description: 'Please provide a reason for rejection' });
      return;
    }

    try {
      await documentService.update(document.id, { status: 'Rejected' });
      setDocumentStatus('Rejected');
      const newHistory = {
        action: 'rejected',
        by: 'Admin User',
        date: new Date().toLocaleDateString('en-AE'),
        notes: verificationNotes
      };
      setVerificationHistory([newHistory, ...verificationHistory]);
      setVerificationNotes('');
      setIsVerifying(false);
      toast.error('Document Rejected', { description: `${document.name} has been rejected` });
      if (onBack) onBack(); // Go back to refresh list
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast.error('Rejection Failed', { description: 'Failed to reject document' });
    }
  };

  const breadcrumbItems = [
    { label: t('nav.dashboard') },
    { label: t('employees.title') },
    { label: employeeName },
    { label: t('documents.title') },
    { label: document.name },
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl text-gray-900">{document.name}</h2>
              <p className="text-gray-600">{employeeName} - {employeeId}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {documentStatus === 'Pending' && !isVerifying && (
              <Button
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                onClick={() => setIsVerifying(true)}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Verify Document
              </Button>
            )}
            {documentStatus === 'Verified' && (
              <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-2 text-sm">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Verified
              </Badge>
            )}
            {documentStatus === 'Rejected' && (
              <Badge className="bg-red-100 text-red-700 border-red-200 px-4 py-2 text-sm">
                <XCircle className="w-4 h-4 mr-2" />
                Rejected
              </Badge>
            )}
            <Button variant="outline" onClick={onDownload}>
              <Download className="w-4 h-4 mr-2" />
              {t('documents.download')}
            </Button>
            <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              {t('documents.delete')}
            </Button>
          </div>
        </div>
      </div>

      {/* Verification Action Card */}
      {isVerifying && (
        <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <CheckCircle2 className="w-5 h-5" />
              Verify Document: {document.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-medium mb-2">
                ℹ️ Document Verification
              </p>
              <p className="text-sm text-blue-800">
                Please review the document carefully before verifying or rejecting.
                Add notes to provide feedback to the employee.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationNotes">
                Verification Notes (Optional for verification, Required for rejection)
              </Label>
              <Textarea
                id="verificationNotes"
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Add notes about the document verification..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                onClick={handleVerifyDocument}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Verify & Approve
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleRejectDocument}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Document
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsVerifying(false);
                  setVerificationNotes('');
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('documents.documentInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('documents.documentName')}</p>
              <p className="font-medium text-gray-900">{document.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('documents.type')}</p>
              <Badge variant="outline">{document.type}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('documents.status')}</p>
              <Badge
                className={
                  documentStatus === 'Verified'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : documentStatus === 'Rejected'
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : documentStatus === 'Expiring Soon'
                        ? 'bg-orange-100 text-orange-700 border-orange-200'
                        : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                }
              >
                {documentStatus === 'Verified' ? t('documents.verified') :
                  documentStatus === 'Rejected' ? 'Rejected' :
                    documentStatus === 'Expiring Soon' ? t('documents.expiringSoonStatus') : documentStatus}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('documents.size')}</p>
              <p className="font-medium text-gray-900">{document.size}</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-500">{t('documents.uploadDate')}</p>
                <p className="font-medium text-gray-900">{document.uploadDate}</p>
              </div>
            </div>
            {document.expiryDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-500">{t('documents.expiryDateShort')}</p>
                  <p className="font-medium text-gray-900">{document.expiryDate}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-500">{t('employees.employee')}</p>
                <p className="font-medium text-gray-900">{employeeName}</p>
              </div>
            </div>

            {/* Quick Verification Action */}
            {documentStatus === 'Pending' && !isVerifying && (
              <div className="pt-4 border-t">
                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  onClick={() => setIsVerifying(true)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Verify This Document
                </Button>
              </div>
            )}
            {documentStatus === 'Rejected' && (
              <div className="pt-4 border-t">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    This document was rejected
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('documents.documentPreview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">{document.name}</h3>
              <p className="text-sm text-gray-600 mb-6">
                {t('documents.previewNotAvailable')}
              </p>
              <Button onClick={onDownload}>
                <Download className="w-4 h-4 mr-2" />
                {t('documents.downloadToView')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document History */}
      <Card>
        <CardHeader>
          <CardTitle>{t('documents.documentHistory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verificationHistory.map((entry, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${entry.action === 'verified' ? 'bg-green-500' :
                  entry.action === 'rejected' ? 'bg-red-500' :
                    entry.action === 'uploaded' ? 'bg-blue-500' :
                      'bg-gray-500'
                  }`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">
                      {entry.action === 'verified' && (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Document Verified
                        </span>
                      )}
                      {entry.action === 'rejected' && (
                        <span className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          Document Rejected
                        </span>
                      )}
                      {entry.action === 'uploaded' && (
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          {t('documents.documentUploaded')}
                        </span>
                      )}
                    </p>
                    <span className="text-sm text-gray-500">{entry.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {entry.action === 'verified' && `Verified by ${entry.by}`}
                    {entry.action === 'rejected' && `Rejected by ${entry.by}`}
                    {entry.action === 'uploaded' && t('documents.uploadedBy', { name: entry.by })}
                  </p>
                  {entry.notes && (
                    <div className={`mt-2 p-3 rounded-lg ${entry.action === 'verified' ? 'bg-green-50 border border-green-200' :
                      entry.action === 'rejected' ? 'bg-red-50 border border-red-200' :
                        'bg-gray-50 border border-gray-200'
                      }`}>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Notes: </span>
                        {entry.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
