import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Star, TrendingUp, Calendar, User, Award, Target, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { CurrencyDisplay } from './common';

interface Appraisal {
  id: string;
  employee: string;
  department: string;
  period: string;
  selfRating: number;
  managerRating: number | null;
  finalRating: number | null;
  increment: string | null;
  status: string;
}

interface AppraisalDetailsProps {
  appraisal: Appraisal;
  onBack: () => void;
}

export default function AppraisalDetails({ appraisal, onBack }: AppraisalDetailsProps) {
  const { t } = useLanguage();
  const { formatCurrency, convertAmount } = useCurrency();

  // Mock extended data - in real app, fetch based on appraisal data
  const appraisalDetails = {
    ...appraisal,
    employeeId: 'EMP001',
    role: 'Senior Software Engineer',
    manager: 'Amit Kumar',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    reviewDate: '2025-04-15',
    bonus: 50000,
    promotion: 'None',
  };

  const competencies = [
    { name: 'Technical Skills', selfRating: 4.5, managerRating: 4.7, weight: 30 },
    { name: 'Communication', selfRating: 4.0, managerRating: 4.3, weight: 20 },
    { name: 'Leadership', selfRating: 3.8, managerRating: 4.2, weight: 20 },
    { name: 'Problem Solving', selfRating: 4.3, managerRating: 4.6, weight: 15 },
    { name: 'Teamwork', selfRating: 4.4, managerRating: 4.5, weight: 15 },
  ];

  const goals = [
    { 
      title: 'Complete Cloud Migration Project', 
      kra: 'Project Delivery',
      target: '100%', 
      achieved: '95%', 
      status: 'Achieved',
      selfComment: 'Successfully migrated 95% of services to cloud infrastructure.',
      managerComment: 'Excellent progress. Minor delays due to unforeseen technical challenges.'
    },
    { 
      title: 'Mentor 2 Junior Engineers', 
      kra: 'Team Development',
      target: '2', 
      achieved: '2', 
      status: 'Achieved',
      selfComment: 'Mentored Priya and Karan, both showing significant improvement.',
      managerComment: 'Great mentorship skills demonstrated. Both mentees performing well.'
    },
    { 
      title: 'Reduce Bug Rate by 20%', 
      kra: 'Quality Improvement',
      target: '20%', 
      achieved: '18%', 
      status: 'Partially Achieved',
      selfComment: 'Implemented code review process, reduced bugs by 18%.',
      managerComment: 'Good effort. Continue focusing on quality improvements.'
    },
  ];

  const feedback360 = [
    { from: 'Priya Patel', role: 'Team Member', rating: 4.5, comment: 'Excellent mentor and team player. Always willing to help.' },
    { from: 'Karan Mehta', role: 'Team Member', rating: 4.3, comment: 'Great technical skills and leadership qualities.' },
    { from: 'Neha Gupta', role: 'Cross-functional', rating: 4.0, comment: 'Good collaboration on design projects.' },
  ];

  const timeline = [
    { date: '2025-01-01', event: 'Appraisal Cycle Started', status: 'completed' },
    { date: '2025-01-15', event: 'Self Assessment Submitted', status: 'completed' },
    { date: '2025-02-01', event: 'Manager Review Submitted', status: 'completed' },
    { date: '2025-02-10', event: '360 Feedback Collected', status: 'completed' },
    { date: '2025-03-01', event: 'One-on-One Discussion', status: 'completed' },
    { date: '2025-04-15', event: 'Final Rating & Increment Approved', status: 'completed' },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Completed: 'bg-green-100 text-green-700 border-green-200',
      'In Progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Pending: 'bg-orange-100 text-orange-700 border-orange-200',
      Achieved: 'bg-green-100 text-green-700 border-green-200',
      'Partially Achieved': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Not Achieved': 'bg-red-100 text-red-700 border-red-200',
    };
    return variants[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const calculateWeightedRating = (rating: number, weight: number) => {
    return ((rating * weight) / 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumb */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>
        <div className="flex-1">
          <nav className="text-sm text-gray-600 mb-1">
            <span className="hover:text-gray-900 cursor-pointer" onClick={onBack}>
              {t('performance.title')}
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{t('performance.appraisalDetails')}</span>
          </nav>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl text-gray-900">{appraisalDetails.employee}</h2>
            <Badge className={getStatusBadge(appraisalDetails.status)}>{appraisalDetails.status}</Badge>
          </div>
          <p className="text-gray-600 mt-1">{appraisalDetails.period} Performance Review</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('performance.selfRating')}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <p className="text-2xl font-medium text-gray-900">{appraisalDetails.selfRating}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('performance.managerRating')}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <p className="text-2xl font-medium text-gray-900">{appraisalDetails.managerRating}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('performance.finalRating')}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-5 h-5 text-green-500 fill-green-500" />
                  <p className="text-2xl font-medium text-green-600">{appraisalDetails.finalRating}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('performance.increment')}</p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <p className="text-2xl font-medium text-green-600">{appraisalDetails.increment}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.employeeInformation')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">{t('employees.employeeId')}</p>
                  <p className="font-medium text-gray-900 mt-1">{appraisalDetails.employeeId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('employees.department')}</p>
                  <p className="font-medium text-gray-900 mt-1">{appraisalDetails.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('employees.role')}</p>
                  <p className="font-medium text-gray-900 mt-1">{appraisalDetails.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('performance.reportingManager')}</p>
                  <p className="font-medium text-gray-900 mt-1">{appraisalDetails.manager}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('performance.reviewPeriod')}</p>
                  <p className="font-medium text-gray-900 mt-1">{appraisalDetails.period}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('performance.reviewDate')}</p>
                  <p className="font-medium text-gray-900 mt-1">{new Date(appraisalDetails.reviewDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competency Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.competencyAssessment')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {competencies.map((competency, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">{competency.name}</p>
                          <span className="text-sm text-gray-600">Weight: {competency.weight}%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">{t('performance.selfRating')}</p>
                            <div className="flex items-center gap-2">
                              <Progress value={(competency.selfRating / 5) * 100} className="h-2" />
                              <span className="text-sm font-medium text-gray-900 min-w-8">{competency.selfRating}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">{t('performance.managerRating')}</p>
                            <div className="flex items-center gap-2">
                              <Progress value={(competency.managerRating / 5) * 100} className="h-2" />
                              <span className="text-sm font-medium text-gray-900 min-w-8">{competency.managerRating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{t('performance.weightedAverage')}</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-green-500 fill-green-500" />
                    <span className="text-xl font-medium text-green-600">{appraisalDetails.finalRating}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals & KRAs */}
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.goalsKRAs')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {goals.map((goal, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-4 h-4 text-blue-600" />
                          <p className="font-medium text-gray-900">{goal.title}</p>
                        </div>
                        <p className="text-sm text-gray-600">KRA: {goal.kra}</p>
                      </div>
                      <Badge className={getStatusBadge(goal.status)}>{goal.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">{t('performance.target')}</p>
                        <p className="font-medium text-gray-900">{goal.target}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">{t('performance.achieved')}</p>
                        <p className="font-medium text-green-600">{goal.achieved}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">{t('performance.selfComment')}</p>
                        <p className="text-sm text-gray-700">{goal.selfComment}</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">{t('performance.managerComment')}</p>
                        <p className="text-sm text-gray-700">{goal.managerComment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 360 Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.feedback360')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback360.map((feedback, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{feedback.from}</p>
                        <p className="text-sm text-gray-600">{feedback.role}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium text-gray-900">{feedback.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{feedback.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Rewards & Recognition */}
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.rewardsRecognition')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">{t('performance.salaryIncrement')}</p>
                <p className="text-xl font-medium text-green-600 mt-1">{appraisalDetails.increment}</p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">{t('performance.performanceBonus')}</p>
                <p className="text-xl font-medium text-green-600 mt-1"><CurrencyDisplay amount={appraisalDetails.bonus} /></p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">{t('performance.promotion')}</p>
                <p className="font-medium text-gray-900 mt-1">{appraisalDetails.promotion}</p>
              </div>
            </CardContent>
          </Card>

          {/* Appraisal Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.appraisalTimeline')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.status === 'completed' 
                          ? 'bg-green-100' 
                          : 'bg-gray-100'
                      }`}>
                        {item.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-200 my-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-gray-900">{item.event}</p>
                      <p className="text-xs text-gray-600 mt-1">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                {t('performance.addComment')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Award className="w-4 h-4 mr-2" />
                {t('performance.viewCertificate')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                {t('performance.scheduleFollowUp')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}