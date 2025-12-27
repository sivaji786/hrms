import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Target, TrendingUp, Users, Award, Plus, Star } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { StatCard } from './common';
import { useLanguage } from '../contexts/LanguageContext';
import StartAppraisalCycle from './StartAppraisalCycle';
import AppraisalDetails from './AppraisalDetails';
import DataTable, { TableColumn } from './common/DataTable';
import { AvatarCell } from './common/TableCells';
import Goals from './performance/Goals';
import { performanceService } from '../services/api';

export default function PerformanceManagement() {
  const [activeTab, setActiveTab] = useState('appraisal');
  const [showStartAppraisal, setShowStartAppraisal] = useState(false);
  const [selectedAppraisals, setSelectedAppraisals] = useState<string[]>([]);
  const [viewingAppraisalId, setViewingAppraisalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // API Data State
  const [stats, setStats] = useState<any>(null);
  const [appraisalCycles, setAppraisalCycles] = useState<any[]>([]);
  const [departmentPerformance, setDepartmentPerformance] = useState<any[]>([]);
  const [feedbackData, setFeedbackData] = useState<any[]>([]);

  const { t } = useLanguage();

  // Fetch data on component mount
  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);

      // Fetch all performance data in parallel
      const [statsData, cyclesData, deptStatsData, feedback] = await Promise.all([
        performanceService.getStats(),
        performanceService.getCycles(),
        performanceService.getDepartmentStats(),
        performanceService.getFeedback(),
      ]);

      setStats(statsData);
      setAppraisalCycles(cyclesData || []);
      setDepartmentPerformance(deptStatsData || []);
      setFeedbackData(feedback || []);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Completed: 'bg-green-100 text-green-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      Pending: 'bg-orange-100 text-orange-700',
      'On Track': 'bg-blue-100 text-blue-700',
      'At Risk': 'bg-red-100 text-red-700',
      Draft: 'bg-gray-100 text-gray-700',
      Active: 'bg-blue-100 text-blue-700',
    };
    return variants[status] || 'bg-gray-100 text-gray-700';
  };

  // Handle viewing appraisal details
  const handleViewAppraisal = (appraisalId: string) => {
    setViewingAppraisalId(appraisalId);
  };

  // Handle checkbox selections
  const handleSelectAllAppraisals = (checked: boolean) => {
    if (checked) {
      setSelectedAppraisals(appraisalCycles.map(a => a.id));
    } else {
      setSelectedAppraisals([]);
    }
  };

  const handleSelectAppraisal = (aprId: string | number, checked: boolean) => {
    if (checked) {
      setSelectedAppraisals([...selectedAppraisals, aprId as string]);
    } else {
      setSelectedAppraisals(selectedAppraisals.filter(id => id !== aprId));
    }
  };

  const selectedAppraisalObjects = appraisalCycles.filter(a =>
    selectedAppraisals.includes(a.id)
  );

  // Appraisal columns for DataTable
  const appraisalColumns: TableColumn[] = [
    {
      header: t('performance.cycleName'),
      accessor: 'name',
      sortable: true,
    },
    {
      header: t('performance.period'),
      accessor: 'description',
      sortable: true,
      cell: (row) => (
        <span className="text-sm text-gray-600">{row.description || '-'}</span>
      ),
    },
    {
      header: t('performance.totalEmployees'),
      accessor: 'total_employees',
      sortable: true,
      cell: (row) => (
        <span className="font-medium">{row.total_employees || 0}</span>
      ),
    },
    {
      header: t('performance.completedReviews'),
      accessor: 'completed_reviews',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-green-600">{row.completed_reviews || 0}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{row.total_employees || 0}</span>
        </div>
      ),
    },
    {
      header: t('performance.pendingReviews'),
      accessor: 'pending_reviews',
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-orange-600">{row.pending_reviews || 0}</span>
      ),
    },
    {
      header: t('performance.status'),
      accessor: 'status',
      sortable: true,
      cell: (row) => (
        <Badge className={getStatusBadge(row.status)}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: t('performance.actions'),
      cell: (row) => (
        <Button size="sm" variant="outline" onClick={() => handleViewAppraisal(row.id)}>
          {t('performance.viewDetails')}
        </Button>
      ),
    },
  ];

  if (showStartAppraisal) {
    return <StartAppraisalCycle onBack={() => {
      setShowStartAppraisal(false);
      fetchPerformanceData(); // Refresh data after creating cycle
    }} />;
  }

  if (viewingAppraisalId) {
    const appraisal = appraisalCycles.find(a => a.id === viewingAppraisalId);
    if (appraisal) {
      return <AppraisalDetails appraisal={appraisal} onBack={() => setViewingAppraisalId(null)} />;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading performance data...</div>
      </div>
    );
  }

  // Calculate average rating from feedback
  const calculateAverageRating = () => {
    if (!feedbackData || feedbackData.length === 0) return '0.0';
    const ratings = feedbackData.filter(f => f.rating).map(f => parseFloat(f.rating));
    if (ratings.length === 0) return '0.0';
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  };

  // Get top performer data from feedback
  const getTopPerformerData = () => {
    if (!feedbackData || feedbackData.length === 0) return null;

    // Find feedback with highest ratings
    const topFeedback = feedbackData.reduce((prev, current) =>
      (current.rating > (prev?.rating || 0)) ? current : prev
      , feedbackData[0]);

    return {
      technical: topFeedback?.technical_skills || 0,
      communication: topFeedback?.communication || 0,
      leadership: topFeedback?.leadership || 0,
      teamwork: topFeedback?.teamwork || 0,
      initiative: topFeedback?.initiative || 0,
    };
  };

  const topPerformerData = getTopPerformerData();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('performance.avgRating')}
          value={`${calculateAverageRating()}/5.0`}
          icon={Star}
          iconColor="text-yellow-500"
          variant="default"
        />
        <StatCard
          title={t('performance.completedAppraisals')}
          value={stats?.completed?.toString() || '0'}
          icon={Award}
          iconColor="text-green-500"
          variant="default"
        />
        <StatCard
          title={t('performance.activeGoals')}
          value={stats?.total_reviews?.toString() || '0'}
          icon={Target}
          iconColor="text-blue-500"
          variant="default"
        />
        <StatCard
          title={t('performance.inProgress')}
          value={stats?.in_progress?.toString() || '0'}
          icon={TrendingUp}
          iconColor="text-purple-500"
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle>{t('performance.departmentWisePerformance')}</CardTitle>
          </CardHeader>
          <CardContent>
            {departmentPerformance && departmentPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department_name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avg_rating" fill="#3b82f6" name={t('performance.avgRatingLabel')} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No department performance data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Radar */}
        <Card>
          <CardHeader>
            <CardTitle>{t('performance.topPerformerSkillAnalysis')}</CardTitle>
          </CardHeader>
          <CardContent>
            {topPerformerData ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={[topPerformerData]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="Skills" dataKey="technical" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-xs text-gray-600">{t('performance.technical')}</p>
                    <p className="font-medium">{topPerformerData.technical}%</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-xs text-gray-600">{t('performance.communication')}</p>
                    <p className="font-medium">{topPerformerData.communication}%</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <p className="text-xs text-gray-600">{t('performance.leadership')}</p>
                    <p className="font-medium">{topPerformerData.leadership}%</p>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <p className="text-xs text-gray-600">{t('performance.teamwork')}</p>
                    <p className="font-medium">{topPerformerData.teamwork}%</p>
                  </div>
                  <div className="text-center p-2 bg-pink-50 rounded">
                    <p className="text-xs text-gray-600">{t('performance.initiative')}</p>
                    <p className="font-medium">{topPerformerData.initiative}%</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No feedback data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="appraisal">{t('performance.appraisalCycle')}</TabsTrigger>
            <TabsTrigger value="goals">{t('performance.goalsKRAs')}</TabsTrigger>
            <TabsTrigger value="feedback">{t('performance.feedback360')}</TabsTrigger>
          </TabsList>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => {
            setShowStartAppraisal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            {t('performance.startNewAppraisalCycle')}
          </Button>
        </div>

        <TabsContent value="appraisal">
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.appraisalCycleTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={appraisalColumns}
                data={appraisalCycles}
                selectable
                selectedRows={selectedAppraisalObjects}
                onSelectRow={handleSelectAppraisal}
                onSelectAll={handleSelectAllAppraisals}
                exportable
                sortable
                exportFileName="appraisals"
                exportHeaders={['ID', 'Name', 'Description', 'Total Employees', 'Completed Reviews', 'Pending Reviews', 'Status']}
                headerStyle="gradient"
                cellPadding="relaxed"
                emptyMessage={t('performance.noAppraisals')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Goals />
        </TabsContent>

        <TabsContent value="feedback">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>360° Feedback Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {feedbackData && feedbackData.length > 0 ? (
                  <div className="space-y-4">
                    {feedbackData.slice(0, 3).map((feedback, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{feedback.feedback_type}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{feedback.rating}/5.0</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{feedback.comments || 'No comments'}</p>
                        {feedback.strengths && (
                          <p className="text-sm text-green-600 mt-2">
                            <strong>Strengths:</strong> {feedback.strengths}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No feedback data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}