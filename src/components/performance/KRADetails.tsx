import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Edit, Trash2, Target, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { kras, goals } from '../../data/goalsData';
import { toast } from '../../utils/toast';
import Breadcrumbs from '../Breadcrumbs';
import { ConfirmDialog, DataTable } from '../common';
import { TableColumn } from '../common/DataTable';
import { Progress } from '../ui/progress';
import type { KRA, Goal } from '../../data/goalsData';

interface KRADetailsProps {
  kraId: string;
  onBack: () => void;
  onEdit: (kraId: string) => void;
  onViewGoal?: (goalId: string) => void;
}

export default function KRADetails({ kraId, onBack, onEdit, onViewGoal }: KRADetailsProps) {
  const { t } = useLanguage();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const kra = kras.find((k) => k.id === kraId);
  const linkedGoals = goals.filter((g) => g.kraId === kraId);

  if (!kra) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: t('navigation.dashboard'), path: '/dashboard' },
            { label: t('navigation.performance'), path: '/performance' },
            { label: t('performance.goals.title'), path: '/performance/goals' },
            { label: t('performance.kra.title'), path: '/performance/kras' },
            { label: t('performance.kra.kraDetails') },
          ]}
        />
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">KRA not found</p>
            <Button className="mt-4" onClick={onBack}>
              {t('performance.kra.backToKRAs')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = () => {
    // In a real app, this would make an API call
    toast.success(t('performance.kra.kraDeleted'));
    setShowDeleteDialog(false);
    onBack();
  };

  // Calculate average progress of linked goals
  const avgProgress = linkedGoals.length > 0
    ? Math.round(linkedGoals.reduce((sum, g) => sum + g.progress, 0) / linkedGoals.length)
    : 0;

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
      'Not Started': 'default',
      'In Progress': 'default',
      'On Track': 'success',
      'At Risk': 'warning',
      Completed: 'success',
      Overdue: 'destructive',
      Cancelled: 'default',
    };
    return variants[status] || 'default';
  };

  // Goals table columns
  const goalColumns: TableColumn[] = [
    {
      header: t('performance.goals.goalTitle'),
      accessor: 'title',
      sortable: true,
      cell: (row: Goal) => (
        <div className="min-w-[250px]">
          <div
            className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
            onClick={() => onViewGoal && onViewGoal(row.id)}
          >
            {row.title}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {row.employeeName} • {row.department}
          </div>
        </div>
      ),
    },
    {
      header: t('performance.goals.progress'),
      accessor: 'progress',
      sortable: true,
      cell: (row: Goal) => (
        <div className="min-w-[150px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">{row.progress}%</span>
          </div>
          <Progress value={row.progress} className="h-2" />
        </div>
      ),
    },
    {
      header: t('performance.goals.dueDate'),
      accessor: 'endDate',
      sortable: true,
      cell: (row: Goal) => (
        <div className="text-sm">
          {new Date(row.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      ),
    },
    {
      header: t('performance.goals.status'),
      accessor: 'status',
      sortable: true,
      cell: (row: Goal) => (
        <Badge variant={getStatusVariant(row.status)}>
          {t(`performance.goals.${row.status.toLowerCase().replace(/ /g, '')}`)}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t('navigation.dashboard'), path: '/dashboard' },
          { label: t('navigation.performance'), path: '/performance' },
          { label: t('performance.goals.title'), path: '/performance/goals' },
          { label: t('performance.kra.title'), path: '/performance/kras' },
          { label: t('performance.kra.kraDetails') },
        ]}
      />

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl text-gray-900">{kra.name}</h2>
            <p className="text-gray-600 mt-1">{t('performance.kra.kraDetails')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(kra.id)}>
            <Edit className="w-4 h-4 mr-2" />
            {t('performance.kra.edit')}
          </Button>
          <Button variant="outline" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            {t('performance.kra.delete')}
          </Button>
        </div>
      </div>

      {/* KRA Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('performance.kra.kraInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Badge */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={kra.status === 'Active' ? 'success' : 'default'}>
                {t(`performance.kra.${kra.status.toLowerCase()}`)}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {kra.department}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm text-gray-600 mb-2">{t('performance.kra.description')}</h4>
              <p className="text-gray-900">{kra.description}</p>
            </div>

            {/* Measurement Criteria */}
            <div>
              <h4 className="text-sm text-gray-600 mb-2">{t('performance.kra.measurementCriteria')}</h4>
              <p className="text-gray-900">{kra.measurementCriteria}</p>
            </div>

            {/* Grid Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">{t('performance.kra.weight')}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ width: `${kra.weight}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-lg font-medium">{kra.weight}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('performance.kra.createdDate')}</p>
                <p className="text-lg font-medium mt-1">
                  {new Date(kra.createdDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Goals Count */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('performance.kra.linkedGoals')}</p>
                  <p className="text-2xl font-medium">{kra.goals}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active:</span>
                  <span className="font-medium">
                    {linkedGoals.filter((g) => ['In Progress', 'On Track'].includes(g.status)).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">
                    {linkedGoals.filter((g) => g.status === 'Completed').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Progress */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-medium">{avgProgress}%</p>
                </div>
              </div>
              <Progress value={avgProgress} className="h-2" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Linked Goals */}
      <Card>
        <CardHeader>
          <CardTitle>{t('performance.kra.linkedGoalsList')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {linkedGoals.length === 0 ? (
            <div className="p-12 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No goals linked to this KRA yet</p>
            </div>
          ) : (
            <DataTable
              columns={goalColumns}
              data={linkedGoals}
              exportable
              sortable
              exportFileName={`kra-${kra.id}-goals`}
              headerStyle="gradient"
              cellPadding="relaxed"
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title={t('performance.goals.deleteKRAConfirmTitle')}
        message={t('performance.goals.deleteKRAConfirmMessage')}
        confirmText={t('common.delete')}
        variant="danger"
      />
    </div>
  );
}
