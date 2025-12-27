import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Laptop, Monitor, Keyboard, MousePointer, Smartphone, Printer, Headphones, Camera, Trash2, Search, Plus, Download, Eye, Edit, Filter, TrendingUp, Calendar, Wrench, FileText, ArrowLeft, AlertCircle, Package } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Pagination } from './common';
import { StatCard, CurrencyDisplay, CurrencyIcon } from './common';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import DataTable, { TableColumn } from './common/DataTable';
import { AvatarCell } from './common/TableCells';
import { assetService } from '../services/api';
import toast from '../utils/toast';
import { useEffect } from 'react';

// Interfaces
interface Asset {
  id: string;
  name: string;
  assetType: string;
  serialNumber: string;
  category: string;
  status: string;
  assignedTo?: string;
  assignedToName?: string;
  assignedDate?: string;
  condition: string;
  value: number;
  purchaseDate: string;
  warranty?: string;
  warrantyExpiry?: string;
  location: string;
  vendor?: string;
  description?: string;
}

interface AssetAssignment {
  id: string;
  assetId: string;
  assetName: string;
  employeeId: string;
  employeeName: string;
  assignedDate: string;
  returnDate?: string;
  status: string;
  notes?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

type ViewMode = 'list' | 'addAsset' | 'assignAsset' | 'assignmentDetails' | 'assetDetails';

export default function AssetManagement() {
  const { t } = useLanguage();
  const { formatCurrency, convertAmount } = useCurrency();
  const [activeTab, setActiveTab] = useState('assets');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [assignmentsCurrentPage, setAssignmentsCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [assignmentSearchTerm, setAssignmentSearchTerm] = useState('');
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState('all');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
  const itemsPerPage = 10;

  const [assets, setAssets] = useState<Asset[]>([]);
  const [assignments, setAssignments] = useState<AssetAssignment[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<AssetAssignment | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assetsData, assignmentsData, categoriesData] = await Promise.all([
        assetService.getAssets().catch(() => ({ data: [] })),
        assetService.getAssignments().catch(() => ({ data: [] })),
        assetService.getCategories().catch(() => ({ data: [] }))
      ]);

      // Map API response to frontend format
      const mappedAssets = Array.isArray(assetsData?.data) ? assetsData.data.map((asset: any) => ({
        id: asset.id,
        name: asset.name,
        assetType: asset.name, // Using name as assetType since it's not in API
        serialNumber: asset.serial_number,
        category: asset.category || 'Uncategorized',
        status: asset.status,
        assignedTo: asset.assigned_to,
        assignedToName: asset.assigned_to_name,
        assignedDate: asset.assigned_date,
        condition: asset.condition || 'Good',
        value: parseFloat(asset.value) || 0,
        purchaseDate: asset.purchase_date,
        warranty: asset.warranty_expiry,
        warrantyExpiry: asset.warranty_expiry,
        location: asset.location_id || 'Unknown',
        vendor: asset.vendor,
        description: asset.description
      })) : [];

      setAssets(mappedAssets);
      setAssignments(Array.isArray(assignmentsData?.data) ? assignmentsData.data : []);
      setCategories(Array.isArray(categoriesData?.data) ? categoriesData.data : []);
    } catch (error) {
      console.error('Error fetching asset data:', error);
      toast.error('Failed to load asset data');
      // Set empty arrays as fallback
      setAssets([]);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // Assignment form state
  const [assignmentForm, setAssignmentForm] = useState({
    assetId: '',
    employeeId: '',
    assignedDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Add asset form state
  const [newAssetForm, setNewAssetForm] = useState({
    category: '',
    name: '',
    serialNumber: '',
    purchaseDate: '',
    purchaseValue: '',
    condition: 'Excellent',
    location: '',
    notes: '',
  });

  const handleExport = () => {
    toast.info('Exporting Asset Data', 'Asset data will be downloaded as CSV file.');
  };

  // Calculate asset statistics
  const assetStats = {
    totalAssets: assets.length,
    availableAssets: assets.filter(a => a?.status === 'Available').length,
    assignedAssets: assets.filter(a => a?.status === 'Assigned').length,
    underMaintenance: assets.filter(a => a?.status === 'Under Maintenance').length,
    totalValue: assets.reduce((sum, a) => sum + (a?.value || 0), 0),
  };

  // Filter assets
  const filteredAssets = assets.filter((asset) => {
    if (!asset || !asset.name || !asset.serialNumber) return false;
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
    const matchesCondition = conditionFilter === 'all' || asset.condition === conditionFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesCondition;
  });

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700 border-green-200';
      case 'Assigned': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Under Maintenance': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Retired': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-700 border-green-200';
      case 'Good': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Fair': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Poor': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleViewAssignment = (assignment: AssetAssignment) => {
    setSelectedAssignment(assignment);
    setViewMode('assignmentDetails');
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setViewMode('assetDetails');
  };

  const handleAddAsset = () => {
    setViewMode('addAsset');
  };

  const handleSubmitAsset = async () => {
    try {
      // Prepare payload matching backend expectation
      const payload = {
        name: newAssetForm.name,
        category: newAssetForm.category, // Backend handles name or ID
        serial_number: newAssetForm.serialNumber,
        purchase_date: newAssetForm.purchaseDate,
        value: newAssetForm.purchaseValue,
        condition: newAssetForm.condition,
        location_id: newAssetForm.location,
        description: newAssetForm.notes,
        status: 'Available',
        warranty_expiry: newAssetForm.purchaseDate // Assuming warranty same as purchase for now, or add field
      };

      await assetService.createAsset(payload);
      toast.success('Asset added successfully!');
      fetchData();
      setViewMode('list');
      setNewAssetForm({
        category: '',
        name: '',
        serialNumber: '',
        purchaseDate: '',
        purchaseValue: '',
        condition: 'Excellent',
        location: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error adding asset:', error);
      toast.error('Failed to add asset');
    }
  };

  const handleBackToList = () => {
    setSelectedAssignment(null);
    setSelectedAsset(null);
    setViewMode('list');
  };

  const handleAssignAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setAssignmentForm({
      ...assignmentForm,
      assetId: asset.id,
      assetName: asset.name
    } as any);
    setViewMode('assignAsset');
  };

  const handleSubmitAssignment = async () => {
    try {
      const payload = {
        asset_id: selectedAsset?.id,
        employeeId: assignmentForm.employeeId,
        assigned_date: assignmentForm.assignedDate,
        notes: assignmentForm.notes,
        status: 'Active'
      };

      await assetService.assignAsset(payload);
      toast.success('Asset assigned successfully!');
      fetchData();
      setViewMode('list');
      setAssignmentForm({
        assetId: '',
        employeeId: '',
        assignedDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    } catch (error) {
      console.error('Error assigning asset:', error);
      toast.error('Failed to assign asset');
    }
  };

  // Handle checkbox selections for assets
  const handleSelectAllAssets = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(paginatedAssets.map(a => a.id));
    } else {
      setSelectedAssets([]);
    }
  };

  const handleSelectAsset = (assetId: string | number, checked: boolean) => {
    if (checked) {
      setSelectedAssets([...selectedAssets, assetId as string]);
    } else {
      setSelectedAssets(selectedAssets.filter(id => id !== assetId));
    }
  };

  const selectedAssetObjects = assets.filter(a => selectedAssets.includes(a.id));

  // Handle checkbox selections for assignments
  const handleSelectAllAssignments = (checked: boolean) => {
    if (checked) {
      setSelectedAssignments(filteredAssignmentData.map(a => a.id));
    } else {
      setSelectedAssignments([]);
    }
  };

  const handleSelectAssignment = (assignmentId: string | number, checked: boolean) => {
    if (checked) {
      setSelectedAssignments([...selectedAssignments, assignmentId as string]);
    } else {
      setSelectedAssignments(selectedAssignments.filter(id => id !== assignmentId));
    }
  };

  // Filter assignments
  const filteredAssignmentData = assignments.filter((assignment) => {
    if (!assignment || !assignment.assetName || !assignment.employeeName) return false;
    const matchesSearch = assignment.assetName.toLowerCase().includes(assignmentSearchTerm.toLowerCase()) ||
      assignment.employeeName.toLowerCase().includes(assignmentSearchTerm.toLowerCase());
    const matchesStatus = assignmentStatusFilter === 'all' || assignment.status === assignmentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedAssignments = filteredAssignmentData.slice(
    (assignmentsCurrentPage - 1) * itemsPerPage,
    assignmentsCurrentPage * itemsPerPage
  );

  const selectedAssignmentObjects = assignments.filter(a => selectedAssignments.includes(a.id));

  // Assets columns for DataTable
  const assetColumns: TableColumn[] = [
    {
      header: t('assets.assetName'),
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-sm text-gray-600">{row.assetType}</p>
        </div>
      ),
    },
    {
      header: t('assets.serialNumber'),
      accessor: 'serialNumber',
      sortable: true,
      cell: (row) => (
        <p className="text-gray-600 font-mono text-sm">{row.serialNumber}</p>
      ),
    },
    {
      header: t('assets.category'),
      accessor: 'category',
      sortable: true,
      cell: (row) => (
        <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">{row.category}</Badge>
      ),
    },
    {
      header: t('assets.status'),
      accessor: 'status',
      sortable: true,
      cell: (row) => (
        <Badge className={getStatusColor(row.status)}>{row.status}</Badge>
      ),
    },
    {
      header: t('assets.assignedTo'),
      accessor: 'assignedToName',
      sortable: true,
      cell: (row) =>
        row.assignedToName ? (
          <div>
            <p className="text-gray-900">{row.assignedToName}</p>
            <p className="text-sm text-gray-600">{row.assignedTo}</p>
          </div>
        ) : (
          <p className="text-gray-400">-</p>
        ),
    },
    {
      header: t('assets.condition'),
      accessor: 'condition',
      sortable: true,
      cell: (row) => (
        <Badge className={getConditionColor(row.condition)}>{row.condition}</Badge>
      ),
    },
    {
      header: t('assets.value'),
      accessor: 'value',
      sortable: true,
      cell: (row) => (
        <p className="font-medium text-gray-900"><CurrencyDisplay amount={row.value} /></p>
      ),
    },
    {
      header: t('assets.actions'),
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewAsset(row)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {row.status === 'Available' && (
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
              onClick={() => handleAssignAsset(row)}
            >
              {t('assets.assign')}
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Assignments columns for DataTable
  const assignmentColumns: TableColumn[] = [
    {
      header: t('assets.asset'),
      accessor: 'assetName',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.assetName}</p>
          <p className="text-sm text-gray-600">{row.assetId}</p>
        </div>
      ),
    },
    {
      header: t('assets.employee'),
      accessor: 'employeeName',
      sortable: true,
      cell: (row) => (
        <AvatarCell
          name={row.employeeName}
          subtitle={row.employeeId}
        />
      ),
    },
    {
      header: t('assets.assignedDate'),
      accessor: 'assignedDate',
      sortable: true,
      cell: (row) => (
        <p className="text-gray-600">{new Date(row.assignedDate).toLocaleDateString()}</p>
      ),
    },
    {
      header: t('assets.returnDate'),
      accessor: 'returnDate',
      sortable: true,
      cell: (row) => (
        <p className="text-gray-600">
          {row.returnDate ? new Date(row.returnDate).toLocaleDateString() : '-'}
        </p>
      ),
    },
    {
      header: t('assets.status'),
      accessor: 'status',
      sortable: true,
      cell: (row) => (
        <Badge className={
          row.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
            row.status === 'Returned' ? 'bg-blue-100 text-blue-700 border-blue-200' :
              'bg-red-100 text-red-700 border-red-200'
        }>
          {row.status}
        </Badge>
      ),
    },
    {
      header: t('assets.notes'),
      accessor: 'notes',
      cell: (row) => (
        <p className="text-gray-600 text-sm truncate max-w-xs">
          {row.notes || '-'}
        </p>
      ),
    },
    {
      header: t('assets.actions'),
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewAssignment(row)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  // Asset Details View
  if (viewMode === 'assetDetails' && selectedAsset) {
    const assignmentHistory = assignments.filter(a => a.assetId === selectedAsset.id);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
          <div className="flex-1">
            <h2 className="text-2xl text-gray-900">{selectedAsset.name}</h2>
            <p className="text-gray-600 mt-1">{selectedAsset.assetType}</p>
          </div>
          <Badge className={getStatusColor(selectedAsset.status)}>
            {selectedAsset.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('assets.assetDetails')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('assets.category')}</p>
                    <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 mt-1">{selectedAsset.category}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('assets.serialNumber')}</p>
                    <p className="text-gray-900 mt-1 font-mono">{selectedAsset.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('assets.condition')}</p>
                    <Badge className={`${getConditionColor(selectedAsset.condition)} mt-1`}>{selectedAsset.condition}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('assets.purchaseDate')}</p>
                    <p className="text-gray-900 mt-1">{new Date(selectedAsset.purchaseDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('assets.value')}</p>
                    <p className="text-gray-900 mt-1 font-medium">
                      <CurrencyDisplay amount={selectedAsset.value} />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('assets.location')}</p>
                    <p className="text-gray-900 mt-1">{selectedAsset.location}</p>
                  </div>
                  {selectedAsset.assignedToName && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">{t('assets.assignedTo')}</p>
                        <p className="text-gray-900 mt-1">{selectedAsset.assignedToName}</p>
                        <p className="text-sm text-gray-600">{selectedAsset.assignedTo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('assets.assignedDate')}</p>
                        <p className="text-gray-900 mt-1">{new Date(selectedAsset.assignedDate!).toLocaleDateString()}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {assignmentHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('assets.assignmentHistory')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignmentHistory.map((assignment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{assignment.employeeName}</p>
                          <p className="text-sm text-gray-600">{assignment.employeeId}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(assignment.assignedDate).toLocaleDateString()}
                            {assignment.returnDate && ` - ${new Date(assignment.returnDate).toLocaleDateString()}`}
                          </p>
                        </div>
                        <Badge className={
                          assignment.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
                            assignment.status === 'Returned' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                              'bg-red-100 text-red-700 border-red-200'
                        }>
                          {assignment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('common.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedAsset.status === 'Available' && (
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                    onClick={() => handleAssignAsset(selectedAsset)}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    {t('assets.assign')}
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  <Edit className="w-4 h-4 mr-2" />
                  {t('common.edit')}
                </Button>
                <Button variant="outline" className="w-full">
                  <Wrench className="w-4 h-4 mr-2" />
                  {t('assets.maintenance')}
                </Button>
                <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('common.delete')}
                </Button>
              </CardContent>
            </Card>

            {selectedAsset.warranty && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('assets.warranty')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">{t('assets.expiryDate')}</p>
                      <p className="text-gray-900 mt-1">{new Date(selectedAsset.warranty).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('assets.daysRemaining')}</p>
                      <p className="text-gray-900 mt-1 font-medium">
                        {Math.ceil((new Date(selectedAsset.warranty).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Assignment Details View
  if (viewMode === 'assignmentDetails' && selectedAssignment) {
    const asset = assets.find(a => a.id === selectedAssignment.assetId);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('assets.backToAssignments')}
          </Button>
          <div className="flex-1">
            <h2 className="text-2xl text-gray-900">{selectedAssignment.assetName}</h2>
            <p className="text-gray-600 mt-1">{t('assets.assignedTo')} {selectedAssignment.employeeName}</p>
          </div>
          <Badge className={
            selectedAssignment.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
              selectedAssignment.status === 'Returned' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                'bg-red-100 text-red-700 border-red-200'
          }>
            {selectedAssignment.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('assets.assignmentDetails')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('assets.employee')}</p>
                    <p className="font-medium text-gray-900 mt-1">{selectedAssignment.employeeName}</p>
                    <p className="text-sm text-gray-600">{selectedAssignment.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('assets.assignedDate')}</p>
                    <p className="text-gray-900 mt-1">{new Date(selectedAssignment.assignedDate).toLocaleDateString()}</p>
                  </div>
                  {selectedAssignment.returnDate && (
                    <div>
                      <p className="text-sm text-gray-600">{t('assets.returnDate')}</p>
                      <p className="text-gray-900 mt-1">{new Date(selectedAssignment.returnDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">{t('assets.status')}</p>
                    <Badge className={
                      selectedAssignment.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
                        selectedAssignment.status === 'Returned' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          'bg-red-100 text-red-700 border-red-200'
                    }>
                      {selectedAssignment.status}
                    </Badge>
                  </div>
                </div>

                {selectedAssignment.notes && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">{t('assets.notes')}</p>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{selectedAssignment.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {asset && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('assets.assetInformation')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">{t('assets.assetName')}</p>
                      <p className="text-gray-900 mt-1">{asset.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('assets.type')}</p>
                      <p className="text-gray-900 mt-1">{asset.assetType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('assets.serialNumber')}</p>
                      <p className="text-gray-900 mt-1 font-mono text-sm">{asset.serialNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('assets.category')}</p>
                      <Badge className="mt-1 bg-indigo-100 text-indigo-700 border-indigo-200">{asset.category}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('assets.condition')}</p>
                      <Badge className={getConditionColor(asset.condition)}>{asset.condition}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('assets.value')}</p>
                      <p className="text-gray-900 mt-1"><CurrencyDisplay amount={asset.value} /></p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">{t('assets.description')}</p>
                    <p className="text-gray-900 mt-1">{asset.description}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('assets.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedAssignment.status === 'Active' && (
                  <>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      {t('assets.returnAsset')}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Wrench className="w-4 h-4 mr-2" />
                      {t('assets.reportIssue')}
                    </Button>
                  </>
                )}
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  {t('assets.viewHistory')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  {t('assets.downloadReport')}
                </Button>
              </CardContent>
            </Card>

            {asset && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('assets.warrantyInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">{t('assets.purchaseDate')}</p>
                    <p className="text-gray-900 mt-1">{new Date(asset.purchaseDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('assets.warrantyExpiry')}</p>
                    <p className="text-gray-900 mt-1">{asset.warrantyExpiry ? new Date(asset.warrantyExpiry).toLocaleDateString() : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('assets.vendor')}</p>
                    <p className="text-gray-900 mt-1">{asset.vendor}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Add Asset Form View
  if (viewMode === 'addAsset') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
          <div className="flex-1">
            <h2 className="text-2xl text-gray-900">{t('assets.addNewAsset')}</h2>
            <p className="text-gray-600 mt-1">{t('assets.registerNewAsset')}</p>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>{t('assets.assetInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{t('assets.assetNameLabel')} *</Label>
                <Input
                  value={newAssetForm.name}
                  onChange={(e) => setNewAssetForm({ ...newAssetForm, name: e.target.value })}
                  placeholder="e.g., MacBook Pro 16&quot;"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.assetType')} *</Label>
                <Input
                  value={newAssetForm.name}
                  onChange={(e) => setNewAssetForm({ ...newAssetForm, name: e.target.value })}
                  placeholder="e.g., Laptop, Monitor, Chair"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.category')} *</Label>
                <div className="flex gap-2">
                  <Select
                    value={categories.some(c => c.name === newAssetForm.category) ? newAssetForm.category : (newAssetForm.category ? 'new' : '')}
                    onValueChange={(value: string) => {
                      if (value === 'new') {
                        setNewAssetForm({ ...newAssetForm, category: '' });
                      } else {
                        setNewAssetForm({ ...newAssetForm, category: value });
                      }
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={t('assets.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">+ Add New Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(!categories.some(c => c.name === newAssetForm.category) && (newAssetForm.category === '' || !categories.length)) && (
                  <Input
                    placeholder={t('assets.enterNewCategoryName')}
                    value={newAssetForm.category}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, category: e.target.value })}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>{t('assets.serialNumberLabel')} *</Label>
                <Input
                  value={newAssetForm.serialNumber}
                  onChange={(e) => setNewAssetForm({ ...newAssetForm, serialNumber: e.target.value })}
                  placeholder="e.g., MBP2024-001"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.purchaseDate')} *</Label>
                <Input
                  type="date"
                  value={newAssetForm.purchaseDate}
                  onChange={(e) => setNewAssetForm({ ...newAssetForm, purchaseDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.warrantyExpiry')} *</Label>
                <Input
                  type="date"
                  value={newAssetForm.purchaseDate}
                  onChange={(e) => setNewAssetForm({ ...newAssetForm, purchaseDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.value')} *</Label>
                <Input
                  type="number"
                  value={newAssetForm.purchaseValue}
                  onChange={(e) => setNewAssetForm({ ...newAssetForm, purchaseValue: e.target.value })}
                  placeholder="e.g., 250000"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.location')} *</Label>
                <Select value={newAssetForm.location} onValueChange={(value: string) => setNewAssetForm({ ...newAssetForm, location: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('assets.selectLocation')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                    <SelectItem value="Dubai">Dubai</SelectItem>
                    <SelectItem value="Sharjah">Sharjah</SelectItem>
                    <SelectItem value="Ajman">Ajman</SelectItem>
                    <SelectItem value="Ras Al Khaimah">Ras Al Khaimah</SelectItem>
                    <SelectItem value="Fujairah">Fujairah</SelectItem>
                    <SelectItem value="Umm Al Quwain">Umm Al Quwain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('assets.conditionLabel')} *</Label>
                <Select value={newAssetForm.condition} onValueChange={(value: any) => setNewAssetForm({ ...newAssetForm, condition: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('assets.vendor')} *</Label>
                <Input
                  value={newAssetForm.name}
                  onChange={(e) => setNewAssetForm({ ...newAssetForm, name: e.target.value })}
                  placeholder="e.g., Apple Inc."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>{t('assets.description')}</Label>
                <Textarea
                  value={newAssetForm.notes}
                  onChange={(e) => setNewAssetForm({ ...newAssetForm, notes: e.target.value })}
                  placeholder={t('assets.enterDescription')}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={handleBackToList}>
                {t('common.cancel')}
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                onClick={handleSubmitAsset}
                disabled={!newAssetForm.name || !newAssetForm.serialNumber || !newAssetForm.purchaseValue}
              >
                {t('assets.addAsset')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assign Asset Form View
  if (viewMode === 'assignAsset' && selectedAsset) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
          <div className="flex-1">
            <h2 className="text-2xl text-gray-900">{t('assets.assignAsset')}</h2>
            <p className="text-gray-600 mt-1">{t('assets.assignAssetToEmployee', { name: selectedAsset.name })}</p>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>{t('assets.assignmentInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{t('assets.assetName')}</Label>
                <Input
                  value={selectedAsset.name}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.assetType')}</Label>
                <Input
                  value={selectedAsset.assetType}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.category')}</Label>
                <Input
                  value={selectedAsset.category}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.serialNumber')}</Label>
                <Input
                  value={selectedAsset.serialNumber}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.purchaseDate')}</Label>
                <Input
                  type="date"
                  value={selectedAsset.purchaseDate}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.warrantyExpiry')}</Label>
                <Input
                  type="date"
                  value={selectedAsset.warrantyExpiry}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.value')}</Label>
                <Input
                  type="number"
                  value={selectedAsset.value}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.location')}</Label>
                <Input
                  value={selectedAsset.location}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.condition')}</Label>
                <Input
                  value={selectedAsset.condition}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.vendor')}</Label>
                <Input
                  value={selectedAsset.vendor}
                  readOnly
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>{t('assets.description')}</Label>
                <Textarea
                  value={selectedAsset.description}
                  readOnly
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.employeeId')} *</Label>
                <Input
                  value={assignmentForm.employeeId}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, employeeId: e.target.value })}
                  placeholder="e.g., EMP123"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('assets.assignedDate')} *</Label>
                <Input
                  type="date"
                  value={assignmentForm.assignedDate}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, assignedDate: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>{t('assets.notes')}</Label>
                <Textarea
                  value={assignmentForm.notes}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, notes: e.target.value })}
                  placeholder={t('assets.enterNotes')}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={handleBackToList}>
                {t('common.cancel')}
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                onClick={handleSubmitAssignment}
                disabled={!assignmentForm.employeeId}
              >
                {t('assets.assignAsset')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Assets List View
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl text-gray-900">{t('assets.title')}</h2>
          <p className="text-gray-600 mt-1">{t('assets.subtitle')}</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" onClick={handleAddAsset}>
          <Plus className="w-4 h-4 mr-2" />
          {t('assets.addAsset')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('assets.totalAssets')}
          value={assetStats.totalAssets}
          subtitle={t('assets.thisMonth')}
          icon={Package}
          variant="default"
        />
        <StatCard
          title={t('assets.availableAssets')}
          value={assetStats.availableAssets}
          subtitle={t('assets.ofTotal')}
          icon={TrendingUp}
          variant="default"
        />
        <StatCard
          title={t('assets.underMaintenance')}
          value={assetStats.underMaintenance}
          subtitle={t('assets.needsAttention')}
          icon={AlertCircle}
          variant="default"
        />
        <StatCard
          title={t('assets.totalValue')}
          value={formatCurrency(convertAmount(assetStats.totalValue), { compact: true, decimals: 1 })}
          subtitle={t('assets.assetWorth')}
          icon={CurrencyIcon}
          variant="default"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="assets">{t('assets.allAssets')}</TabsTrigger>
          <TabsTrigger value="assignments">{t('assets.assignments')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('assets.analytics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={t('assets.searchAssets')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('assets.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('assets.allStatus')}</SelectItem>
                    <SelectItem value="Available">{t('assets.available')}</SelectItem>
                    <SelectItem value="Assigned">{t('assets.assigned')}</SelectItem>
                    <SelectItem value="Under Maintenance">{t('assets.maintenance')}</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('assets.category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('assets.allCategories')}</SelectItem>
                    <SelectItem value="IT Equipment">{t('assets.itEquipment')}</SelectItem>
                    <SelectItem value="Furniture">{t('assets.furniture')}</SelectItem>
                    <SelectItem value="Vehicle">{t('assets.vehicle')}</SelectItem>
                    <SelectItem value="Office Equipment">{t('assets.officeEquipment')}</SelectItem>
                    <SelectItem value="Software">{t('assets.software')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={conditionFilter} onValueChange={setConditionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('assets.condition')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('assets.allConditions')}</SelectItem>
                    <SelectItem value="Excellent">{t('assets.excellent')}</SelectItem>
                    <SelectItem value="Good">{t('assets.good')}</SelectItem>
                    <SelectItem value="Fair">{t('assets.fair')}</SelectItem>
                    <SelectItem value="Poor">{t('assets.poor')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Assets Table with DataTable */}
          <Card>
            <CardContent className="p-0">
              <DataTable
                columns={assetColumns}
                data={paginatedAssets}
                selectable
                selectedRows={selectedAssetObjects}
                onSelectRow={handleSelectAsset}
                onSelectAll={handleSelectAllAssets}
                exportable
                sortable
                exportFileName="assets"
                exportHeaders={['Asset Name', 'Type', 'Serial Number', 'Category', 'Status', 'Assigned To', 'Condition', 'Value']}
                headerStyle="gradient"
                cellPadding="relaxed"
                emptyMessage={t('assets.noAssets')}
              />
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={t('assets.searchAssignments')}
                    value={assignmentSearchTerm}
                    onChange={(e) => setAssignmentSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={assignmentStatusFilter} onValueChange={setAssignmentStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('assets.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('assets.allStatus')}</SelectItem>
                    <SelectItem value="Active">{t('assets.active')}</SelectItem>
                    <SelectItem value="Returned">{t('assets.returned')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Assignments Table with DataTable */}
          <Card>
            <CardContent className="p-0">
              <DataTable
                columns={assignmentColumns}
                data={paginatedAssignments}
                selectable
                selectedRows={selectedAssignmentObjects}
                onSelectRow={handleSelectAssignment}
                onSelectAll={handleSelectAllAssignments}
                exportable
                sortable
                exportFileName="asset-assignments"
                exportHeaders={['Asset ID', 'Asset Name', 'Employee ID', 'Employee Name', 'Assigned Date', 'Return Date', 'Status', 'Notes']}
                headerStyle="gradient"
                cellPadding="relaxed"
                emptyMessage={t('assets.noAssignmentsFound')}
              />
            </CardContent>
          </Card>

          {Math.ceil(filteredAssignmentData.length / itemsPerPage) > 1 && (
            <Pagination
              currentPage={assignmentsCurrentPage}
              totalPages={Math.ceil(filteredAssignmentData.length / itemsPerPage)}
              onPageChange={setAssignmentsCurrentPage}
            />
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Asset Distribution Chart */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>{t('assets.categoryDistribution')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={(() => {
                        // Calculate asset category distribution
                        const categoryCount: Record<string, number> = {};
                        assets.forEach(asset => {
                          if (asset?.category) {
                            categoryCount[asset.category] = (categoryCount[asset.category] || 0) + 1;
                          }
                        });
                        return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
                      })()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(() => {
                        const categoryCount: Record<string, number> = {};
                        assets.forEach(asset => {
                          if (asset?.category) {
                            categoryCount[asset.category] = (categoryCount[asset.category] || 0) + 1;
                          }
                        });
                        return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
                      })().map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('assets.assetConditionOverview')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={(() => {
                        const conditionCount: Record<string, number> = {};
                        assets.forEach(asset => {
                          if (asset?.condition) {
                            conditionCount[asset.condition] = (conditionCount[asset.condition] || 0) + 1;
                          }
                        });
                        return Object.entries(conditionCount).map(([name, value]) => ({ name, value }));
                      })()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(() => {
                        const conditionCount: Record<string, number> = {};
                        assets.forEach(asset => {
                          if (asset?.condition) {
                            conditionCount[asset.condition] = (conditionCount[asset.condition] || 0) + 1;
                          }
                        });
                        return Object.entries(conditionCount).map(([name, value]) => ({ name, value }));
                      })().map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}