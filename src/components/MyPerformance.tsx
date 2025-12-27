import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Award, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import StatCard from './common/StatCard';
import { useEffect, useState } from 'react';
import { performanceService } from '../services/api';

export default function MyPerformance() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    fetchMyPerformance();
  }, []);

  const fetchMyPerformance = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (user.id) {
        const [reviewsData, goalsData] = await Promise.all([
          performanceService.getEmployeeReviews(user.id),
          performanceService.getEmployeeGoals(user.id),
        ]);

        setReviews(reviewsData || []);
        setGoals(goalsData || []);
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallRating = () => {
    if (!reviews || reviews.length === 0) return '0.0';
    const ratings = reviews.filter(r => r.final_rating).map(r => parseFloat(r.final_rating));
    if (ratings.length === 0) return '0.0';
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  };

  const calculateGoalsProgress = () => {
    if (!goals || goals.length === 0) return { completed: 0, total: 0 };
    const completed = goals.filter(g => g.status === 'Completed').length;
    return { completed, total: goals.length };
  };

  const goalsProgress = calculateGoalsProgress();

  const stats = [
    {
      title: t('employee.overallRating'),
      value: calculateOverallRating(),
      subtitle: t('employee.outOf5'),
      icon: Award,
      trend: { value: 5, isPositive: true },
    },
    {
      title: t('employee.completedGoals'),
      value: `${goalsProgress.completed}/${goalsProgress.total}`,
      subtitle: t('employee.thisQuarter'),
      icon: TrendingUp,
      trend: { value: 20, isPositive: true },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading your performance data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} variant="default" />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('employee.performanceReviews')}</CardTitle>
          <CardDescription>{t('employee.reviewHistory')}</CardDescription>
        </CardHeader>
        <CardContent>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((review, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{review.cycle_name}</h4>
                      <p className="text-sm text-gray-600">Status: {review.status}</p>
                    </div>
                    {review.final_rating && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{review.final_rating}</div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </div>
                    )}
                  </div>
                  {review.feedback && (
                    <p className="text-sm text-gray-700 mt-2">{review.feedback}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{t('employee.noReviewsYet')}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Goals</CardTitle>
          <CardDescription>Track your goals and progress</CardDescription>
        </CardHeader>
        <CardContent>
          {goals && goals.length > 0 ? (
            <div className="space-y-3">
              {goals.map((goal, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{goal.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${goal.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        goal.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          goal.status === 'At Risk' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                      }`}>
                      {goal.status}
                    </span>
                  </div>
                  {goal.description && (
                    <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${goal.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{goal.progress || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No goals assigned yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}