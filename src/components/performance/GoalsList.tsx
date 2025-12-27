import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Target, Plus, Filter, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { goals, goalStats, kras } from '../../data/goalsData';
import { StatCard, DataTable, Pagination, PageHeader, FilterBar, EmptyState } from '../common';
import { TableColumn } from '../common/DataTable';
import { StatusBadge } from '../common';
import Breadcrumbs from '../Breadcrumbs';
import type { Goal } from '../../data/goalsData';

interface GoalsListProps {
  onCreateGoal: () => void;
  onViewGoal: (goalId: string) => void;
  onManageKRAs: () => void;
  onAssignGoal: () => void;
}

export default function GoalsList({ onCreateGoal, onViewGoal, onManageKRAs, onAssignGoal }: GoalsListProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [kraFilter, setKraFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique values for filters
  const departments = Array.from(new Set(goals.map((g) => g.department)));
  const statuses = ['Not Started', 'In Progress', 'On Track', 'At Risk', 'Completed', 'Overdue', 'Cancelled'];
  const priorities = ['Critical', 'High', 'Medium', 'Low'];
  const types = ['Individual', 'Team', 'Organizational'];

  // Filter goals
  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      const matchesSearch =
        searchQuery === '' ||
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || goal.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || goal.priority === priorityFilter;
      const matchesType = typeFilter === 'all' || goal.type === typeFilter;
      const matchesDepartment = departmentFilter === 'all' || goal.department === departmentFilter;
      const matchesKRA = kraFilter === 'all' || goal.kraId === kraFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesDepartment && matchesKRA;
    });
  }, [searchQuery, statusFilter, priorityFilter, typeFilter, departmentFilter, kraFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredGoals.length / itemsPerPage);
  const paginatedGoals = filteredGoals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, priorityFilter, typeFilter, departmentFilter, kraFilter]);

  // Status badge variants
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

  // Priority badge colors
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      Critical: 'bg-red-100 text-red-700 border-red-200',
      High: 'bg-orange-100 text-orange-700 border-orange-200',
      Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Low: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  // Type badge colors
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Individual: 'bg-blue-100 text-blue-700',
      Team: 'bg-green-100 text-green-700',
      Organizational: 'bg-purple-100 text-purple-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setTypeFilter('all');
    setDepartmentFilter('all');
    setKraFilter('all');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    typeFilter !== 'all' ||
    departmentFilter !== 'all' ||
    kraFilter !== 'all';

  // Table columns
  const columns: TableColumn[] = [
    {
      header: t('performance.goals.goalTitle'),
      accessor: 'title',
      sortable: true,
      cell: (row: Goal) => (
        <div className="min-w-[250px]">
          <div
            className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
            onClick={() => onViewGoal(row.id)}
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
      header: t('performance.goals.kra'),
      accessor: 'kraName',
      sortable: true,
      cell: (row: Goal) => (
        <div className="min-w-[180px]">
          <div className="text-sm">{row.kraName}</div>
        </div>
      ),
    },
    {
      header: t('performance.goals.type'),
      accessor: 'type',
      sortable: true,
      cell: (row: Goal) => (
        <Badge className={getTypeColor(row.type)}>
          {t(`performance.goals.${row.type.toLowerCase()}`)}
        </Badge>
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
            <span className="text-xs text-gray-500">
              {row.currentValue} / {row.targetValue}
            </span>
          </div>
          <Progress value={row.progress} className="h-2" />
        </div>
      ),
    },
    {
      header: t('performance.goals.priority'),
      accessor: 'priority',
      sortable: true,
      cell: (row: Goal) => (
        <Badge className={getPriorityColor(row.priority)}>
          {t(`performance.goals.${row.priority.toLowerCase()}`)}
        </Badge>
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
        <StatusBadge status={row.status} variant={getStatusVariant(row.status)}>
          {t(`performance.goals.${row.status.toLowerCase().replace(/ /g, '')}`)}
        </StatusBadge>
      ),
    },
    {
      header: t('performance.status'),
      cell: (row: Goal) => (
        <Button size="sm" variant="outline" onClick={() => onViewGoal(row.id)}>
          {t('performance.viewDetails')}
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
          { label: t('performance.goals.title') },
        ]}
      />

      {/* Page Header */}
      <PageHeader
        title={t('performance.goals.title')}
        description={t('performance.goals.subtitle')}
        rightElement={
          <div className="flex gap-2">
            <Button variant="outline" onClick={onManageKRAs}>
              <Filter className="w-4 h-4 mr-2" />
              {t('performance.goals.manageKRAs')}
            </Button>
            <Button variant="outline" onClick={onAssignGoal}>
              {t('performance.goals.assignGoal')}
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" onClick={onCreateGoal}>
              <Plus className="w-4 h-4 mr-2" />
              {t('performance.goals.createGoal')}
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('performance.goals.totalGoals')}
          value={goalStats.totalGoals.toString()}
          icon={Target}
          variant="default"
        />
        <StatCard
          title={t('performance.goals.activeGoals')}
          value={goalStats.activeGoals.toString()}
          subtitle={`${goalStats.onTrackPercentage}% ${t('performance.goals.onTrack').toLowerCase()}`}
          icon={TrendingUp}
          variant="default"
        />
        <StatCard
          title={t('performance.goals.completedGoals')}
          value={goalStats.completedGoals.toString()}
          icon={CheckCircle2}
          variant="default"
        />
        <StatCard
          title={t('performance.goals.atRiskGoals')}
          value={goalStats.atRiskGoals.toString()}
          subtitle={`${goalStats.avgProgress}% ${t('performance.goals.avgProgress').toLowerCase()}`}
          icon={AlertTriangle}
          variant="default"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder={t('performance.goals.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('performance.goals.filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('performance.goals.allStatuses')}</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {t(`performance.goals.${status.toLowerCase().replace(/ /g, '')}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('performance.goals.filterByPriority')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('performance.goals.allPriorities')}</SelectItem>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {t(`performance.goals.${priority.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('performance.goals.filterByType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('performance.goals.allTypes')}</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`performance.goals.${type.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('performance.goals.filterByDepartment')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('performance.goals.allDepartments')}</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={kraFilter} onValueChange={setKraFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('performance.goals.filterByKRA')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('performance.goals.allKRAs')}</SelectItem>
                  {kras.map((kra) => (
                    <SelectItem key={kra.id} value={kra.id}>
                      {kra.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  {t('performance.goals.clearFilters')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Goals Table */}
      <Card>
        <CardContent className="p-0">
          {filteredGoals.length === 0 ? (
            <EmptyState
              icon={Target}
              title={hasActiveFilters ? t('performance.goals.noResults') : t('performance.goals.noGoals')}
              description={
                hasActiveFilters
                  ? t('performance.goals.noResultsDescription')
                  : t('performance.goals.noGoalsDescription')
              }
              action={
                !hasActiveFilters
                  ? {
                    label: t('performance.goals.createGoal'),
                    onClick: onCreateGoal,
                  }
                  : undefined
              }
            />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={paginatedGoals}
                exportable
                sortable
                exportFileName="goals"
                headerStyle="gradient"
                cellPadding="relaxed"
              />
              {totalPages > 1 && (
                <div className="p-4 border-t">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredGoals.length}
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
