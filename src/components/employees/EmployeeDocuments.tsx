import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ArrowLeft, Upload, Download, Eye, Trash2, FileText, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatCard } from '../common';
import Breadcrumbs from '../Breadcrumbs';
import DataTable, { TableColumn } from '../common/DataTable';
import UploadEmployeeDocument from '../UploadEmployeeDocument';
import ViewDocument from './ViewDocument';
import DeleteDocumentDialog from './DeleteDocumentDialog';
import toast from '../../utils/toast';
import { documentService } from '../../services/api';
import { useEffect } from 'react';

interface EmployeeDocumentsProps {
  onBack: () => void;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
}

export default function EmployeeDocuments({ onBack, employeeId, employeeName, employeeCode }: EmployeeDocumentsProps) {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await documentService.getEmployeeDocuments(employeeId);
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchDocuments();
    }
  }, [employeeId]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [showUploadDocument, setShowUploadDocument] = useState(false);
  const [replacingDocument, setReplacingDocument] = useState<any>(null);
  const [viewingDocument, setViewingDocument] = useState<any>(null);
  const [deletingDocument, setDeletingDocument] = useState<any>(null);

  // Handle download document
  const handleDownload = (document: any) => {
    // Create a dummy PDF blob for demo
    const content = `Document: ${document.name}\nType: ${document.type}\nEmployee: ${employeeName} (${employeeId})\nUpload Date: ${document.uploadDate}\nStatus: ${document.status}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.name.replace(/\s+/g, '_')}.txt`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(t('documents.downloadSuccess'));
  };

  // Handle delete document
  const handleDelete = (document: any) => {
    setDocuments(documents.filter(doc => doc.id !== document.id));
    setDeletingDocument(null);
    toast.success(t('documents.documentDeleted'));
  };

  if (showUploadDocument || replacingDocument) {
    return (
      <UploadEmployeeDocument
        onBack={() => {
          setShowUploadDocument(false);
          setReplacingDocument(null);
        }}
        employeeName={employeeName}
        employeeId={employeeId}
        replacingDocument={replacingDocument}
      />
    );
  }

  if (viewingDocument) {
    return (
      <ViewDocument
        onBack={() => {
          setViewingDocument(null);
          // Refresh documents when returning from view
          const fetchDocuments = async () => {
            try {
              const data = await documentService.getEmployeeDocuments(employeeId);
              setDocuments(data);
            } catch (error) {
              console.error('Error fetching documents:', error);
            }
          };
          fetchDocuments();
        }}
        document={viewingDocument}
        employeeName={employeeName}
        employeeId={employeeCode}
        onDownload={() => handleDownload(viewingDocument)}
        onDelete={() => {
          setViewingDocument(null);
          setDeletingDocument(viewingDocument);
        }}
      />
    );
  }

  if (deletingDocument) {
    return (
      <DeleteDocumentDialog
        onBack={() => setDeletingDocument(null)}
        document={deletingDocument}
        onDelete={() => handleDelete(deletingDocument)}
      />
    );
  }

  const verifiedDocs = documents.filter(doc => doc.status === 'Verified').length;
  const expiringDocs = documents.filter(doc => doc.status === 'Expiring Soon').length;
  const expiredDocs = documents.filter(doc => doc.status === 'Expired').length;

  const breadcrumbItems = [
    { label: t('nav.dashboard') },
    { label: t('employees.title') },
    { label: employeeName },
    { label: t('documents.title') },
  ];

  // Handle checkbox selections
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocs(documents.map(doc => doc.id));
    } else {
      setSelectedDocs([]);
    }
  };

  const handleSelectDoc = (docId: string | number, checked: boolean) => {
    if (checked) {
      setSelectedDocs([...selectedDocs, docId as string]);
    } else {
      setSelectedDocs(selectedDocs.filter(id => id !== docId));
    }
  };

  const selectedDocObjects = documents.filter(doc => selectedDocs.includes(doc.id));

  // Document columns for DataTable
  const documentColumns: TableColumn[] = [
    {
      header: t('documents.document'),
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      header: t('documents.type'),
      accessor: 'type',
      sortable: true,
      cell: (row) => <Badge variant="outline">{row.type === 'application/pdf' ? 'PDF' : row.type.split('/')[1]?.toUpperCase() || 'FILE'}</Badge>,
    },
    {
      header: t('documents.uploadDate'),
      accessor: 'created_at',
      sortable: true,
      cell: (row) => <p className="text-sm text-gray-600">{row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}</p>,
    },
    {
      header: t('documents.expiryDateShort'),
      accessor: 'expiry_date',
      sortable: true,
      cell: (row) => <p className="text-sm text-gray-600">{row.expiry_date ? new Date(row.expiry_date).toLocaleDateString() : t('documents.na')}</p>,
    },
    {
      header: t('documents.status'),
      accessor: 'status',
      sortable: true,
      cell: (row) => (
        <Badge
          className={
            row.status === 'Verified'
              ? 'bg-green-100 text-green-700 border-green-200'
              : row.status === 'Expiring Soon'
                ? 'bg-orange-100 text-orange-700 border-orange-200'
                : row.status === 'Expired'
                  ? 'bg-red-100 text-red-700 border-red-200'
                  : 'bg-yellow-100 text-yellow-700 border-yellow-200'
          }
        >
          {row.status === 'Verified' ? t('documents.verified') :
            row.status === 'Expiring Soon' ? t('documents.expiringSoonStatus') :
              row.status === 'Expired' ? t('documents.expired') : row.status}
        </Badge>
      ),
    },
    {
      header: t('documents.actions'),
      cell: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" title={t('documents.view')} onClick={() => {
            setViewingDocument(row);
          }}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Replace Document" onClick={() => {
            setReplacingDocument(row);
          }} className="hover:bg-orange-50">
            <RefreshCw className="w-4 h-4 text-orange-600" />
          </Button>
          <Button variant="ghost" size="sm" title={t('documents.download')} onClick={() => handleDownload(row)}>
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title={t('documents.delete')} onClick={() => {
            setDeletingDocument(row);
          }}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('employees.backToEmployees')}
        </Button>

        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                {employeeName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl text-gray-900">{employeeName}</h2>
              <p className="text-gray-600">{employeeId} - {t('documents.employeeDocuments')}</p>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
            onClick={() => setShowUploadDocument(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            {t('documents.uploadDocument')}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('documents.totalDocuments')}
          value={documents.length}
          subtitle={t('documents.uploaded')}
          icon={FileText}
          iconColor="text-blue-600"
          variant="default"
        />
        <StatCard
          title={t('documents.verifiedDocs')}
          value={verifiedDocs}
          subtitle={t('documents.verified')}
          icon={CheckCircle}
          iconColor="text-green-600"
          variant="default"
        />
        <StatCard
          title={t('documents.expiringDocs')}
          value={expiringDocs}
          subtitle={t('documents.needsAttention')}
          icon={AlertCircle}
          iconColor="text-orange-600"
          variant="default"
        />
        <StatCard
          title={t('documents.expiredDocs')}
          value={expiredDocs}
          subtitle={t('documents.expired')}
          icon={AlertCircle}
          iconColor="text-red-600"
          variant="default"
        />
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('documents.allDocuments')}</CardTitle>
            <Badge variant="outline">{documents.length} {t('documents.documents')}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={documentColumns}
            data={documents}
            selectable
            selectedRows={selectedDocObjects}
            onSelectRow={handleSelectDoc}
            onSelectAll={handleSelectAll}
            exportable
            sortable
            exportFileName={`${employeeId}-documents`}
            exportHeaders={['Document Name', 'Type', 'Upload Date', 'Expiry Date', 'Size', 'Status']}
            headerStyle="gradient"
            cellPadding="relaxed"
            emptyMessage={t('documents.noDocuments')}
          />
        </CardContent>
      </Card>

      {/* Expired Documents Alert */}
      {expiredDocs > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">{t('documents.expiredDocumentsAlert')}</h3>
                <p className="text-sm text-red-700 mt-1">
                  {expiredDocs} {expiredDocs === 1 ? t('documents.documentHas') : t('documents.documentsHave')} {t('documents.alreadyExpired')}
                </p>
                <div className="mt-3 space-y-2">
                  {documents
                    .filter(doc => doc.status === 'Expired')
                    .map(doc => (
                      <div key={doc.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-200">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-gray-900">{doc.name}</span>
                          <span className="text-sm text-red-600">- {t('documents.expiredOn')}: {doc.expiryDate}</span>
                        </div>
                        <Button
                          className="bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                          onClick={() => setReplacingDocument(doc)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          {t('documents.renewNow')}
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expiring Documents Warning */}
      {expiringDocs > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">{t('documents.expiringDocumentsWarning')}</h3>
                <p className="text-sm text-orange-700 mt-1">
                  {expiringDocs} {expiringDocs === 1 ? t('documents.documentIs') : t('documents.documentsAre')} {t('documents.expiringSoon')}
                </p>
                <div className="mt-3 space-y-2">
                  {documents
                    .filter(doc => doc.status === 'Expiring Soon')
                    .map(doc => (
                      <div key={doc.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-orange-200">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-gray-900">{doc.name}</span>
                          <span className="text-sm text-gray-600">- {t('documents.expires')}: {doc.expiryDate}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReplacingDocument(doc)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          {t('documents.renew')}
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}