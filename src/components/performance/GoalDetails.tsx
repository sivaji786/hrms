import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ArrowLeft, Edit, Trash2, Target, Calendar, User, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { goals } from '../../data/goalsData';
import { toast } from '../../utils/toast';
import Breadcrumbs from '../Breadcrumbs';
import { ConfirmDialog } from '../common';
import type { Goal } from '../../data/goalsData';

interface GoalDetailsProps {
  goalId: string;
  onBack: () => void;
  onEdit: (goalId: string) => void;
}

export default function GoalDetails({ goalId, onBack, onEdit }: GoalDetailsProps) {
  const { t } = useLanguage();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const goal = goals.find((g) => g.id === goalId);

  if (!goal) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: t('navigation.dashboard'), path: '/dashboard' },
            { label: t('navigation.performance'), path: '/performance' },
            { label: t('performance.goals.title'), path: '/performance/goals' },
            { label: t('performance.goals.goalDetails') },
          ]}
        />
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Goal not found</p>
            <Button className="mt-4" onClick={onBack}>
              {t('performance.goals.backToGoals')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Status badge variant
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

  const handleDelete = () => {
    // In a real app, this would make an API call
    toast.success(t('performance.goals.goalDeleted'));
    setShowDeleteDialog(false);
    onBack();
  };

  const calculateDaysRemaining = () => {
    const endDate = new Date(goal.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t('navigation.dashboard'), path: '/dashboard' },
          { label: t('navigation.performance'), path: '/performance' },
          { label: t('performance.goals.title'), path: '/performance/goals' },
          { label: t('performance.goals.goalDetails') },
        ]}
      />

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl text-gray-900">{goal.title}</h2>
            <p className="text-gray-600 mt-1">{t('performance.goals.goalDetails')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(goal.id)}>
            <Edit className="w-4 h-4 mr-2" />
            {t('performance.goals.editGoal')}
          </Button>
          <Button variant="outline" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            {t('performance.goals.deleteGoal')}
          </Button>
        </div>
      </div>

      {/* Goal Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('performance.goals.goalInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={getStatusVariant(goal.status)}>
                {t(`performance.goals.${goal.status.toLowerCase().replace(/ /g, '')}`)}
              </Badge>
              <Badge className={getPriorityColor(goal.priority)}>
                {t(`performance.goals.${goal.priority.toLowerCase()}`)}
              </Badge>
              <Badge className={getTypeColor(goal.type)}>
                {t(`performance.goals.${goal.type.toLowerCase()}`)}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm text-gray-600 mb-2">{t('performance.goals.description')}</h4>
              <p className="text-gray-900">{goal.description}</p>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">{t('performance.goals.progress')}</span>
                <span className="text-2xl font-medium text-blue-600">{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-3" />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {t('performance.goals.currentValue')}: {goal.currentValue}
                </span>
                <span className="text-sm text-gray-500">
                  {t('performance.goals.targetValue')}: {goal.targetValue}
                </span>
              </div>
            </div>

            {/* Measurement Criteria */}
            <div>
              <h4 className="text-sm text-gray-600 mb-2">{t('performance.goals.measurementCriteria')}</h4>
              <p className="text-gray-900">{goal.measurementCriteria}</p>
            </div>

            {/* Grid Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">{t('performance.goals.weight')}</p>
                <p className="text-lg font-medium">{goal.weight}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('performance.goals.kra')}</p>
                <p className="text-lg font-medium">{goal.kraName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('performance.goals.startDate')}</p>
                <p className="text-lg font-medium">
                  {new Date(goal.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('performance.goals.dueDate')}</p>
                <p className="text-lg font-medium">
                  {new Date(goal.endDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Employee Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('performance.employee')}</p>
                  <p className="font-medium">{goal.employeeName}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{goal.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('performance.goals.assignedBy')}:</span>
                  <span className="font-medium">{goal.assignedBy}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timeline</p>
                  <p className="font-medium">
                    {daysRemaining > 0 ? `${daysRemaining} days left` : `${Math.abs(daysRemaining)} days overdue`}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {Math.ceil(
                      (new Date(goal.endDate).getTime() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24)
                    )}{' '}
                    days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {new Date(goal.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Milestones */}
      {goal.milestones && goal.milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('performance.goals.milestones')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goal.milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.status === 'Completed'
                        ? 'bg-green-100 text-green-600'
                        : milestone.status === 'Overdue'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {milestone.status === 'Completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{milestone.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Target: {new Date(milestone.targetDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        {milestone.completedDate && (
                          <p className="text-sm text-green-600 mt-1">
                            Completed: {new Date(milestone.completedDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={
                          milestone.status === 'Completed'
                            ? 'success'
                            : milestone.status === 'Overdue'
                            ? 'destructive'
                            : 'default'
                        }
                      >
                        {milestone.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Updates */}
      {goal.updates && goal.updates.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('performance.goals.updates')}</CardTitle>
              <Button size="sm" variant="outline">
                {t('performance.goals.addUpdate')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goal.updates.map((update) => (
                <div key={update.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{update.updatedBy}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(update.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <Badge>{update.progress}% complete</Badge>
                  </div>
                  <p className="text-gray-900">{update.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title={t('performance.goals.deleteConfirmTitle')}
        message={t('performance.goals.deleteConfirmMessage')}
        confirmText={t('common.delete')}
        variant="danger"
      />
    </div>
  );
}
