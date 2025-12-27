import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ArrowLeft, Plus, Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { kras } from '../../data/goalsData';
import { StatCard, DataTable, Pagination, PageHeader, EmptyState } from '../common';
import { TableColumn } from '../common/DataTable';
import Breadcrumbs from '../Breadcrumbs';
import type { KRA } from '../../data/goalsData';

interface KRAManagementProps {
  onBack: () => void;
  onCreateKRA: () => void;
  onViewKRA: (kraId: string) => void;
}

export default function KRAManagement({ onBack, onCreateKRA, onViewKRA }: KRAManagementProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter KRAs
  const filteredKRAs = useMemo(() => {
    return kras.filter((kra) => {
      const matchesSearch =
        searchQuery === '' ||
        kra.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kra.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kra.department.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredKRAs.length / itemsPerPage);
  const paginatedKRAs = filteredKRAs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Stats
  const stats = {
    totalKRAs: kras.length,
    activeKRAs: kras.filter((k) => k.status === 'Active').length,
    totalGoals: kras.reduce((sum, k) => sum + k.goals, 0),
  };

  // Table columns
  const columns: TableColumn[] = [
    {
      header: t('performance.kra.name'),
      accessor: 'name',
      sortable: true,
      cell: (row: KRA) => (
        <div className="min-w-[250px]">
          <div
            className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
            onClick={() => onViewKRA(row.id)}
          >
            {row.name}
          </div>
          <div className="text-sm text-gray-500 mt-1">{row.description}</div>
        </div>
      ),
    },
    {
      header: t('performance.kra.department'),
      accessor: 'department',
      sortable: true,
      cell: (row: KRA) => <div className="text-sm">{row.department}</div>,
    },
    {
      header: t('performance.kra.weight'),
      accessor: 'weight',
      sortable: true,
      cell: (row: KRA) => (
        <div className="flex items-center gap-2">
          <div className="w-16">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${row.weight}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium">{row.weight}%</span>
        </div>
      ),
    },
    {
      header: t('performance.kra.goalsLinked'),
      accessor: 'goals',
      sortable: true,
      cell: (row: KRA) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {row.goals} {row.goals === 1 ? 'goal' : 'goals'}
        </Badge>
      ),
    },
    {
      header: t('performance.kra.status'),
      accessor: 'status',
      sortable: true,
      cell: (row: KRA) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'default'}>
          {t(`performance.kra.${row.status.toLowerCase()}`)}
        </Badge>
      ),
    },
    {
      header: t('performance.kra.actions'),
      cell: (row: KRA) => (
        <Button size="sm" variant="outline" onClick={() => onViewKRA(row.id)}>
          {t('performance.kra.view')}
        </Button>
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
          { label: t('performance.kra.title') },
        ]}
      />

      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl text-gray-900">{t('performance.kra.title')}</h2>
          <p className="text-gray-600 mt-1">{t('performance.kra.subtitle')}</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" onClick={onCreateKRA}>
          <Plus className="w-4 h-4 mr-2" />
          {t('performance.kra.createKRA')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={t('performance.kra.totalKRAs')}
          value={stats.totalKRAs.toString()}
          icon={Target}
          variant="default"
        />
        <StatCard
          title={t('performance.kra.activeKRAs')}
          value={stats.activeKRAs.toString()}
          icon={CheckCircle2}
          variant="default"
        />
        <StatCard
          title={t('performance.kra.linkedGoals')}
          value={stats.totalGoals.toString()}
          icon={TrendingUp}
          variant="default"
        />
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <Input
            placeholder={t('performance.goals.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* KRAs Table */}
      <Card>
        <CardContent className="p-0">
          {filteredKRAs.length === 0 ? (
            <EmptyState
              icon={Target}
              title={searchQuery ? t('performance.goals.noResults') : t('performance.kra.noKRAs')}
              description={
                searchQuery ? t('performance.goals.noResultsDescription') : 'Create your first KRA to get started'
              }
              action={
                !searchQuery
                  ? {
                    label: t('performance.kra.createKRA'),
                    onClick: onCreateKRA,
                  }
                  : undefined
              }
            />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={paginatedKRAs}
                exportable
                sortable
                exportFileName="kras"
                headerStyle="gradient"
                cellPadding="relaxed"
              />
              {totalPages > 1 && (
                <div className="p-4 border-t">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredKRAs.length}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
