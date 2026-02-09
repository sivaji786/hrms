import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { FileText, Download, Eye, Plus, Edit, CheckCircle, AlertCircle, Bell, ArrowLeft, Archive } from 'lucide-react';
import { StatCard } from './common';
import { useLanguage } from '../contexts/LanguageContext';
import AddPolicy from './AddPolicy';
import EmiratesDocumentsManager from './EmiratesDocumentsManager';
import { policyService, Policy } from '../services/policyService';
import { Avatar, AvatarFallback } from './ui/avatar';
import { employees } from '../data/employeeData';
import toast from '../utils/toast';

type ViewMode = 'list' | 'add' | 'view' | 'edit';

// Use Policy interface from service

export default function DocumentsPolicy() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('all-policies');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await policyService.getAll();
      setPolicies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error(t('documents.loadingPoliciesFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleViewPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setViewMode('view');
  };

  const handleBackToList = () => {
    setSelectedPolicy(null);
    setViewMode('list');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <AddPolicy
        onBack={() => {
          setViewMode('list');
          setSelectedPolicy(null);
          loadData();
        }}
        initialData={viewMode === 'edit' ? selectedPolicy : null}
      />
    );
  }

  // Policy Details View
  const handleDownload = async (policy: Policy) => {
    try {
      await policyService.download(policy.id, `${policy.title}.pdf`);
      toast.success(t('documents.downloadStarted'));
    } catch (error) {
      console.error('Download failed', error);
      toast.error(t('documents.failedToDownload'));
    }
  };

  const handleEditPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setViewMode('edit');
  };

  if (viewMode === 'view' && selectedPolicy) {
    // Defensive coding: ensure valid data display even if backend returns inconsistent numbers
    const safeTotal = Math.max(selectedPolicy.totalEmployees, selectedPolicy.acknowledged);
    const safeAcknowledged = Math.min(selectedPolicy.acknowledged, safeTotal);

    const acknowledgedEmployeesList = employees.slice(0, safeAcknowledged);
    const pendingEmployeesList = employees.slice(safeAcknowledged, safeTotal);
    const completionRate = safeTotal > 0 ? Math.round((safeAcknowledged / safeTotal) * 100) : 0;

    return (
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button onClick={handleBackToList} className="hover:text-gray-900">
            {t('documents.companyPolicies')}
          </button>
          <span>/</span>
          <span className="text-gray-900">{selectedPolicy.title}</span>
        </div>

        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('documents.backToPolicies')}
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl text-gray-900">{selectedPolicy.title}</h2>
              <Badge variant="outline">v{selectedPolicy.version}</Badge>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {t(`documents.${selectedPolicy.status.toLowerCase()}`) !== `documents.${selectedPolicy.status.toLowerCase()}`
                  ? t(`documents.${selectedPolicy.status.toLowerCase()}`)
                  : selectedPolicy.status}
              </Badge>
            </div>
            <p className="text-gray-600 mt-1">
              {t(`documents.${selectedPolicy.category.toLowerCase()}`) !== `documents.${selectedPolicy.category.toLowerCase()}`
                ? t(`documents.${selectedPolicy.category.toLowerCase()}`)
                : selectedPolicy.category}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleDownload(selectedPolicy)}>
              <Download className="w-4 h-4 mr-2" />
              {t('documents.download')}
            </Button>
            <Button variant="outline" onClick={() => handleEditPolicy(selectedPolicy)}>
              <Edit className="w-4 h-4 mr-2" />
              {t('documents.editPolicy')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Policy Content */}
            <Card>
              <CardHeader>
                <CardTitle>{t('documents.policyContent')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{t('documents.policyDescription')}</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedPolicy.description || t('documents.noDescriptionAvailable')}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full" onClick={() => handleDownload(selectedPolicy)}>
                    <FileText className="w-4 h-4 mr-2" />
                    {t('documents.viewDocument')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Acknowledgement Progress */}
            <Card>
              <CardHeader>
                <CardTitle>{t('documents.acknowledgementProgress')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-3xl font-medium text-green-700">{selectedPolicy.acknowledged}</div>
                    <div className="text-sm text-gray-600 mt-1">{t('documents.employeesAcknowledged')}</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-3xl font-medium text-orange-700">
                      {safeTotal - safeAcknowledged}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{t('documents.employeesPending')}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('documents.completionRate')}</span>
                    <span className="font-medium text-gray-900">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-3" />
                </div>

                {/* Acknowledge Button for Staff */}
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={async () => {
                    try {
                      await policyService.acknowledge(selectedPolicy.id);
                      toast.success(t('documents.successfullyAcknowledged'), t('documents.youHaveAcknowledged'));
                      loadData(); // Reload to update stats
                    } catch (error) {
                      toast.error(t('documents.failedToAcknowledge'));
                    }
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t('documents.acknowledge')}
                </Button>
              </CardContent>
            </Card>

            {/* Acknowledged Employees */}
            {selectedPolicy.acknowledged > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t('documents.acknowledgedEmployees')}</CardTitle>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      {selectedPolicy.acknowledged} / {selectedPolicy.totalEmployees}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {acknowledgedEmployeesList.slice(0, 10).map((employee) => (
                      <div key={employee.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-green-100 text-green-700">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{employee.name}</p>
                          <p className="text-sm text-gray-600 truncate">{employee.department}</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                  {selectedPolicy.acknowledged > 10 && (
                    <p className="text-center text-sm text-gray-600 mt-4">
                      {t('documents.moreEmployees', { count: selectedPolicy.acknowledged - 10 })}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Pending Employees */}
            {selectedPolicy.acknowledged < selectedPolicy.totalEmployees && (
              <Card className="border-orange-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      {t('documents.pendingEmployees')}
                    </CardTitle>
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                      {selectedPolicy.totalEmployees - selectedPolicy.acknowledged} / {selectedPolicy.totalEmployees}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pendingEmployeesList.slice(0, 10).map((employee) => (
                      <div key={employee.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-orange-100 text-orange-700">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{employee.name}</p>
                          <p className="text-sm text-gray-600 truncate">{employee.department}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast.success(t('documents.reminderSent'), t('documents.reminderSentTo', { name: employee.name }));
                          }}
                        >
                          <Bell className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {(selectedPolicy.totalEmployees - selectedPolicy.acknowledged) > 10 && (
                    <p className="text-center text-sm text-gray-600 mt-4">
                      {t('documents.moreEmployees', { count: (selectedPolicy.totalEmployees - selectedPolicy.acknowledged) - 10 })}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Policy Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t('documents.policyInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">{t('documents.category')}</p>
                  <p className="text-gray-900 mt-1">
                    {t(`documents.${selectedPolicy.category.toLowerCase()}`) !== `documents.${selectedPolicy.category.toLowerCase()}`
                      ? t(`documents.${selectedPolicy.category.toLowerCase()}`)
                      : selectedPolicy.category}
                  </p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">{t('documents.version')}</p>
                  <p className="text-gray-900 mt-1">v{selectedPolicy.version}</p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">{t('documents.effectiveDate')}</p>
                  <p className="text-gray-900 mt-1">{selectedPolicy.effectiveDate}</p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">{t('documents.lastUpdated')}</p>
                  <p className="text-gray-900 mt-1">{selectedPolicy.lastUpdated}</p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">{t('documents.status')}</p>
                  <Badge className="bg-green-100 text-green-700 border-green-200 mt-1">
                    {t(`documents.${selectedPolicy.status.toLowerCase()}`) !== `documents.${selectedPolicy.status.toLowerCase()}`
                      ? t(`documents.${selectedPolicy.status.toLowerCase()}`)
                      : selectedPolicy.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Policy Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('documents.policyActions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => handleDownload(selectedPolicy)}>
                  <Download className="w-4 h-4 mr-2" />
                  {t('documents.download')}
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleEditPolicy(selectedPolicy)}>
                  <Edit className="w-4 h-4 mr-2" />
                  {t('documents.editPolicy')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={async () => {
                    try {
                      await policyService.sendReminder(selectedPolicy.id);
                      toast.success(t('documents.reminderSent'));
                    } catch (error) {
                      toast.error('Failed to send reminder');
                    }
                  }}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  {t('documents.sendReminder')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-orange-600 hover:bg-orange-50"
                  onClick={async () => {
                    try {
                      if (window.confirm('Are you sure you want to archive this policy?')) {
                        await policyService.archive(selectedPolicy.id);
                        toast.success('Policy archived');
                        handleBackToList();
                        loadData();
                      }
                    } catch (error) {
                      toast.error('Failed to archive policy');
                    }
                  }}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  {t('documents.archivePolicy')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats for list view
  const totalPolicies = policies.length;
  const activePolicies = policies.filter(p => p.status === 'Active').length;
  // Prevent division by zero
  const averageAcknowledgement = totalPolicies > 0
    ? Math.round((policies.reduce((sum, p) => sum + (p.totalEmployees > 0 ? (Math.min(p.acknowledged, p.totalEmployees) / p.totalEmployees) * 100 : 0), 0) / totalPolicies))
    : 0;

  const pendingAcknowledgements = policies.reduce(
    (sum, p) => sum + Math.max(0, p.totalEmployees - p.acknowledged),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl text-gray-900">{t('documents.companyPolicies')}</h2>
          <p className="text-gray-600 mt-1">{t('documents.managePolicies')}</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => setViewMode('add')}>
          <Plus className="w-4 h-4 mr-2" />
          {t('documents.addPolicy')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('documents.totalPolicies')}
          value={totalPolicies}
          subtitle={t('documents.published')}
          icon={FileText}
          iconColor="text-blue-600"
          variant="default"
        />
        <StatCard
          title={t('documents.activePolicies')}
          value={activePolicies}
          subtitle={t('documents.inEffect')}
          icon={CheckCircle}
          iconColor="text-green-600"
          variant="default"
        />
        <StatCard
          title={t('documents.avgAcknowledgement')}
          value={`${averageAcknowledgement}%`}
          subtitle={t('documents.completion')}
          icon={CheckCircle}
          iconColor="text-purple-600"
          variant="default"
        />
        <StatCard
          title={t('documents.pendingAck')}
          value={pendingAcknowledgements}
          subtitle={t('documents.employees')}
          icon={AlertCircle}
          iconColor="text-orange-600"
          variant="default"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all-policies">{t('documents.allPolicies')}</TabsTrigger>
          <TabsTrigger value="emirates-docs">{t('documents.uaeDocuments')}</TabsTrigger>
          <TabsTrigger value="by-category">{t('documents.byCategory')}</TabsTrigger>
          <TabsTrigger value="acknowledgements">{t('documents.acknowledgements')}</TabsTrigger>
        </TabsList>

        {/* Emirates Documents */}
        <TabsContent value="emirates-docs">
          <EmiratesDocumentsManager />
        </TabsContent>

        {/* All Policies */}
        <TabsContent value="all-policies">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {policies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{policy.title}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">
                          {t(`documents.${policy.category.toLowerCase()}`) !== `documents.${policy.category.toLowerCase()}`
                            ? t(`documents.${policy.category.toLowerCase()}`)
                            : policy.category}
                        </Badge>
                        <Badge variant="outline">v{policy.version}</Badge>
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          {t(`documents.${policy.status.toLowerCase()}`) !== `documents.${policy.status.toLowerCase()}`
                            ? t(`documents.${policy.status.toLowerCase()}`)
                            : policy.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleViewPolicy(policy)}>
                      <Eye className="w-4 h-4 mr-2" />
                      {t('documents.view')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">{t('documents.effectiveDate')}</p>
                      <p className="font-medium text-gray-900">{policy.effectiveDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">{t('documents.lastUpdated')}</p>
                      <p className="font-medium text-gray-900">{policy.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t('documents.acknowledgement')}</span>
                      <span className="font-medium">
                        {Math.min(policy.acknowledged, policy.totalEmployees)}/{policy.totalEmployees}
                      </span>
                    </div>
                    <Progress value={(Math.min(policy.acknowledged, policy.totalEmployees) / policy.totalEmployees) * 100} className="h-2" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownload(policy)}>
                      <Download className="w-4 h-4 mr-2" />
                      {t('documents.download')}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Bell className="w-4 h-4 mr-2" />
                      {t('documents.sendReminder')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* By Category */}
        <TabsContent value="by-category">
          <div className="space-y-6">
            {['General', 'HR', 'Operations', 'IT', 'Finance'].map((category) => {
              const categoryPolicies = policies.filter(p => p.category === category);

              if (categoryPolicies.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {categoryPolicies.map((policy) => (
                      <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{policy.title}</CardTitle>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline">v{policy.version}</Badge>
                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                  {t(`documents.${policy.status.toLowerCase()}`) !== `documents.${policy.status.toLowerCase()}`
                                    ? t(`documents.${policy.status.toLowerCase()}`)
                                    : policy.status}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleViewPolicy(policy)}>
                              <Eye className="w-4 h-4 mr-2" />
                              {t('documents.view')}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">{t('documents.acknowledgement')}</span>
                              <span className="font-medium">
                                {Math.min(policy.acknowledged, policy.totalEmployees)}/{policy.totalEmployees}
                              </span>
                            </div>
                            <Progress value={(Math.min(policy.acknowledged, policy.totalEmployees) / policy.totalEmployees) * 100} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Acknowledgements */}
        <TabsContent value="acknowledgements">
          <div className="space-y-4">
            {policies
              .filter(p => p.acknowledged < p.totalEmployees)
              .map((policy) => (
                <Card key={policy.id} className="border-orange-200 bg-orange-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <AlertCircle className="w-5 h-5 text-orange-600" />
                          <div>
                            <h3 className="font-medium text-gray-900">{policy.title}</h3>
                            <p className="text-sm text-gray-600">
                              {Math.max(0, policy.totalEmployees - policy.acknowledged)} {t('documents.employeesHaventAcknowledged')}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500">{t('documents.acknowledgement')}</span>
                            <span className="font-medium">
                              {Math.min(policy.acknowledged, policy.totalEmployees)}/{policy.totalEmployees} ({Math.round((Math.min(policy.acknowledged, policy.totalEmployees) / policy.totalEmployees) * 100)}%)
                            </span>
                          </div>
                          <Progress value={(Math.min(policy.acknowledged, policy.totalEmployees) / policy.totalEmployees) * 100} className="h-2" />
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Bell className="w-4 h-4 mr-2" />
                        {t('documents.sendReminder')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {policies.filter(p => p.acknowledged < p.totalEmployees).length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
                  <p className="text-gray-500">{t('documents.allPoliciesAcknowledged')}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}