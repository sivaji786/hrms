import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  FileText,
  AlertCircle,
  CheckCircle,
  Download,
  Upload,
  Search,
  Filter,
  Users,
  AlertTriangle,
  IdCard,
  Briefcase
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { StatCard, DataTable, TableColumn, Pagination } from './common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { documentService } from '../services/documentService';
import { employeeService } from '../services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import toast from '../utils/toast';

// UAE Document Templates
const uaeDocumentTemplates = [
  {
    id: 'emirates_id',
    nameKey: 'documents.emiratesId',
    descKey: 'documents.emiratesIdDesc',
    icon: IdCard,
    color: 'from-blue-500 to-indigo-500',
    expiryMonths: 60, // 5 years
    required: true,
  },
  {
    id: 'uae_visa',
    nameKey: 'documents.uaeResidenceVisa',
    descKey: 'documents.uaeResidenceVisaDesc',
    icon: FileText,
    color: 'from-green-500 to-teal-500',
    expiryMonths: 36, // 3 years
    required: true,
  },
  {
    id: 'labour_card',
    nameKey: 'documents.labourCard',
    descKey: 'documents.labourCardDesc',
    icon: Briefcase,
    color: 'from-purple-500 to-pink-500',
    expiryMonths: 36, // 3 years
    required: true,
  },
  {
    id: 'work_permit',
    nameKey: 'documents.workPermit',
    descKey: 'documents.workPermitDesc',
    icon: FileText,
    color: 'from-orange-500 to-red-500',
    expiryMonths: 36, // 3 years
    required: true,
  },
  {
    id: 'health_insurance',
    nameKey: 'documents.healthInsuranceCard',
    descKey: 'documents.healthInsuranceCardDesc',
    icon: FileText,
    color: 'from-cyan-500 to-blue-500',
    expiryMonths: 12, // 1 year
    required: true,
  },
  {
    id: 'employment_contract',
    nameKey: 'documents.employmentContract',
    descKey: 'documents.employmentContractDesc',
    icon: FileText,
    color: 'from-gray-500 to-gray-600',
    expiryMonths: null,
    required: true,
  },
];

// Sample data removed - now data is fetched dynamically.

export default function EmiratesDocumentsManager() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [docsStatusData, setDocsStatusData] = useState<any[]>([]);

  // Upload State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadForm, setUploadForm] = useState({
    employeeId: '',
    docType: '',
    expiryDate: ''
  });

  const fetchData = async () => {
    try {
      const employeesData = await employeeService.getAll();
      const documentsData = await documentService.getMyDocuments(); // Fetch all as admin, or use dedicated endpoint if available

      // Assuming documentsData is array of all documents. 
      // Since getAll usually returns filtered by user, as Admin I see all.
      const employees = Array.isArray(employeesData?.data) ? employeesData.data : (Array.isArray(employeesData) ? employeesData : []);
      const documents = Array.isArray(documentsData) ? documentsData : [];

      // Helper to find doc status
      const getDocInfo = (empId: string, type: string) => {
        const doc = documents.find((d: any) => d.employee_id === empId && d.type === type);
        if (!doc) {
          return { status: 'Missing', expiryDate: 'N/A', daysLeft: 0, id: null };
        }

        const now = new Date();
        const expiry = doc.expiry_date ? new Date(doc.expiry_date) : null;
        let daysLeft = 0;
        let status = doc.status;

        if (expiry) {
          daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysLeft < 0) status = 'Expired';
          else if (daysLeft < 60) status = 'Expiring'; // Or 'Expiring Soon'
          else status = 'Valid';
        }

        return { status, expiryDate: doc.expiry_date || 'N/A', daysLeft, id: doc.id };
      };

      const processedData = employees.map((emp: any) => {
        const emiratesId = getDocInfo(emp.id, 'Emirates ID');
        const visa = getDocInfo(emp.id, 'UAE Residence Visa'); // Adjust type string to match seeder
        const labourCard = getDocInfo(emp.id, 'Labour Card');
        const workPermit = getDocInfo(emp.id, 'Work Permit'); // Adjust type if needed, Seeder used 'Work Permit' etc.
        const healthInsurance = getDocInfo(emp.id, 'Health Insurance Card');

        // Compliance Logic
        let compliance = 'Compliant';
        const docs = [emiratesId, visa, labourCard, workPermit, healthInsurance];
        if (docs.some(d => d.status === 'Expired' || d.status === 'Missing')) compliance = 'Critical';
        else if (docs.some(d => d.status === 'Expiring' || d.status === 'Expiring Soon')) compliance = 'Warning';

        return {
          id: emp.id,
          displayId: emp.employee_code || emp.id, // Use employee_code for display if avail
          name: `${emp.first_name} ${emp.last_name}`,
          department: emp.department || 'General', // Department name might be needed via join or extra fetch if ID only. Assuming string for now based on previous components.
          emiratesId,
          visa,
          labourCard,
          workPermit,
          healthInsurance,
          compliance
        };
      });

      setDocsStatusData(processedData);

    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !uploadForm.employeeId || !uploadForm.docType) {
      toast.error(t('documents.pleaseFillAllRequiredFields'));
      return;
    }

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('employee_id', uploadForm.employeeId);
      formData.append('type', uploadForm.docType);
      formData.append('name', uploadForm.docType); // Use type as name for now
      formData.append('expiry_date', uploadForm.expiryDate);
      formData.append('status', 'Active');

      await documentService.upload(formData);
      toast.success(t('documents.documentUploadedSuccessfully'));
      setIsUploadOpen(false);
      setSelectedFile(null);
      setUploadForm({ employeeId: '', docType: '', expiryDate: '' });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Upload failed', error);
      toast.error(t('documents.failedToUploadDocument'));
    } finally {
      setUploadLoading(false);
    }
  };

  // Calculate statistics
  const totalEmployees = docsStatusData.length;
  const compliantEmployees = docsStatusData.filter(e => e.compliance === 'Compliant').length;
  const warningEmployees = docsStatusData.filter(e => e.compliance === 'Warning').length;
  const criticalEmployees = docsStatusData.filter(e => e.compliance === 'Critical').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Valid':
        return <Badge className="bg-green-100 text-green-700 border-green-200">{t('documents.valid')}</Badge>;
      case 'Expiring':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">{t('documents.expiring')}</Badge>;
      case 'Expired':
        return <Badge className="bg-red-100 text-red-700 border-red-200">{t('documents.expired')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getComplianceBadge = (compliance: string) => {
    switch (compliance) {
      case 'Compliant':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {t('documents.compliant')}
          </Badge>
        );
      case 'Warning':
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {t('documents.warning')}
          </Badge>
        );
      case 'Critical':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {t('documents.critical')}
          </Badge>
        );
      default:
        return <Badge variant="outline">{compliance}</Badge>;
    }
  };

  // Table columns
  const columns: TableColumn[] = [
    {
      header: t('reports.employeeId'),
      accessor: 'id',
    },
    {
      header: t('reports.employeeName'),
      accessor: 'name',
    },
    {
      header: t('reports.department'),
      accessor: 'department',
    },
    {
      header: t('documents.emiratesId'),
      accessor: 'emiratesId',
      cell: (row: any) => getStatusBadge(row.emiratesId.status),
    },
    {
      header: t('documents.uaeResidenceVisa'),
      accessor: 'visa',
      cell: (row: any) => getStatusBadge(row.visa?.status || 'N/A'),
    },
    {
      header: t('documents.labourCard'),
      accessor: 'labourCard',
      cell: (row: any) => getStatusBadge(row.labourCard?.status || 'N/A'),
    },
    {
      header: t('documents.workPermit'),
      accessor: 'workPermit',
      cell: (row: any) => getStatusBadge(row.workPermit?.status || 'N/A'),
    },
    {
      header: t('documents.healthInsuranceCard'),
      accessor: 'healthInsurance',
      cell: (row: any) => getStatusBadge(row.healthInsurance?.status || 'N/A'),
    },
    {
      header: t('documents.complianceStatus'),
      accessor: 'compliance',
      cell: (row: any) => getComplianceBadge(row.compliance),
    },
    {
      header: t('common.actions'),
      cell: () => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" title={t('documents.view')}>
            <FileText className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title={t('documents.sendReminder')}>
            <AlertCircle className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl">{t('documents.emiratesDocumentsManager')}</h1>
        <p className="text-gray-600">{t('documents.manageUAEDocuments')}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('documents.totalEmployees')}
          value={totalEmployees}
          subtitle={t('documents.tracked')}
          icon={Users}
          variant="default"
        />
        <StatCard
          title={t('documents.compliant')}
          value={compliantEmployees}
          subtitle={`${Math.round((compliantEmployees / totalEmployees) * 100)}% ${t('documents.ofTotal')}`}
          icon={CheckCircle}
          variant="default"
        />
        <StatCard
          title={t('documents.warnings')}
          value={warningEmployees}
          subtitle={t('documents.expiringDocuments')}
          icon={AlertCircle}
          variant="default"
        />
        <StatCard
          title={t('documents.critical')}
          value={criticalEmployees}
          subtitle={t('documents.expiredDocuments')}
          icon={AlertTriangle}
          variant="default"
        />
      </div>

      {/* UAE Document Templates */}
      <Card>
        <CardHeader>
          <CardTitle>{t('documents.requiredUAEDocuments')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uaeDocumentTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${template.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{t(template.nameKey)}</h4>
                        <p className="text-xs text-gray-600 mb-2">{t(template.descKey)}</p>
                        {template.required && (
                          <Badge variant="outline" className="text-xs">
                            {t('documents.required')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {t('common.filters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('documents.searchEmployees')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('documents.allStatuses')}</SelectItem>
                <SelectItem value="compliant">{t('documents.compliant')}</SelectItem>
                <SelectItem value="warning">{t('documents.warning')}</SelectItem>
                <SelectItem value="critical">{t('documents.critical')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allDepartments')}</SelectItem>
                <SelectItem value="engineering">{t('reports.engineering')}</SelectItem>
                <SelectItem value="sales">{t('reports.sales')}</SelectItem>
                <SelectItem value="marketing">{t('reports.marketing')}</SelectItem>
                <SelectItem value="hr">{t('reports.hr')}</SelectItem>
                <SelectItem value="finance">{t('reports.finance')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Documents Status Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('documents.employeeDocumentsStatus')}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                {t('reports.download')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsUploadOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                {t('documents.uploadDocument')}
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <AlertCircle className="w-4 h-4 mr-2" />
                {t('documents.sendBulkReminder')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={docsStatusData}
            exportable
            sortable
            exportFileName="uae-documents-status"
            headerStyle="gradient"
            cellPadding="relaxed"
            emptyMessage={t('documents.noDocuments')}
          />
          <div className="p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(docsStatusData.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {criticalEmployees > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">{t('documents.criticalDocumentAlert')}</h3>
                <p className="text-sm text-red-700 mt-1">
                  {criticalEmployees} {criticalEmployees === 1 ? t('documents.employeeHas') : t('documents.employeesHave')} {t('documents.expiredCriticalDocuments')}
                </p>
                <div className="mt-3 space-y-2">
                  {docsStatusData
                    .filter(emp => emp.compliance === 'Critical')
                    .map(emp => (
                      <div key={emp.displayId} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-200">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-gray-900">{emp.name}</span>
                          <span className="text-sm text-gray-600">({emp.displayId})</span>
                          <Badge className="bg-red-100 text-red-700 border-red-200">
                            {emp.department}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => {
                          setUploadForm(prev => ({ ...prev, employeeId: emp.id }));
                          setIsUploadOpen(true);
                        }}>
                          <Upload className="w-4 h-4 mr-2" />
                          {t('documents.uploadMissing')}
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('documents.uploadDocument')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee">{t('reports.employeeName')}</Label>
              <Select
                value={uploadForm.employeeId}
                onValueChange={(val) => setUploadForm({ ...uploadForm, employeeId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('documents.selectEmployee')} />
                </SelectTrigger>
                <SelectContent>
                  {docsStatusData.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">{t('documents.documentType')}</Label>
              <Select
                value={uploadForm.docType}
                onValueChange={(val) => setUploadForm({ ...uploadForm, docType: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('documents.selectFunction')} />
                </SelectTrigger>
                <SelectContent>
                  {uaeDocumentTemplates.map(tmpl => (
                    <SelectItem key={tmpl.id} value={t(tmpl.nameKey)}>{t(tmpl.nameKey)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">{t('documents.expiryDate')}</Label>
              <Input
                type="date"
                value={uploadForm.expiryDate}
                onChange={(e) => setUploadForm({ ...uploadForm, expiryDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t('documents.uploadDocument')}</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileRef}
                  className="hidden"
                  onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    {selectedFile.name}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>{t('documents.clickToUpload')}</p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>{t('common.cancel')}</Button>
              <Button type="submit" disabled={uploadLoading}>
                {uploadLoading ? t('documents.uploading') : t('documents.save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
