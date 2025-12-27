import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Receipt, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import StatCard from './common/StatCard';

export default function MyExpenses() {
  const { t } = useLanguage();
  const { formatCurrency, convertAmount } = useCurrency();

  const stats = [
    {
      title: t('employee.totalExpenses'),
      value: formatCurrency(convertAmount(1250)),
      subtitle: t('employee.thisMonth'),
      icon: Receipt,
      trend: { value: 15, isPositive: false },
    },
    {
      title: t('employee.pendingClaims'),
      value: '2',
      subtitle: t('employee.awaitingApproval'),
      icon: Receipt,
      trend: { value: 0, isPositive: true },
    },
  ];

  const expenses = [
    { date: '2025-11-15', category: 'Travel', amount: formatCurrency(convertAmount(350)), status: 'Pending' },
    { date: '2025-11-10', category: 'Meals', amount: formatCurrency(convertAmount(120)), status: 'Approved' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <Plus className="w-4 h-4 mr-2" />
          {t('employee.submitExpense')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} variant="default" />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('employee.recentExpenses')}</CardTitle>
          <CardDescription>{t('employee.expenseHistory')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenses.map((expense, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{expense.category}</p>
                  <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="font-semibold">{expense.amount}</p>
                  <Badge variant="outline">{expense.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}