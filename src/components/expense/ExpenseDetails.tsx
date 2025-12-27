
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ArrowLeft, Receipt, Calendar, User, DollarSign, FileText } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import { useLanguage } from '../../contexts/LanguageContext';

import { StatusBadge, CurrencyDisplay } from '../common';
import type { Expense } from '../../data/expenseData';

interface ExpenseDetailsProps {
  expense: Expense;
  onBack: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onClose?: () => void;
}

export default function ExpenseDetails({ expense, onBack, onApprove, onReject }: ExpenseDetailsProps) {
  const { t } = useLanguage();


  const breadcrumbItems = [
    { label: t('nav.dashboard') },
    { label: t('expense.title') || 'Expense & Travel' },
    { label: t('expense.claimDetails') || 'Expense Claim Details' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{t('expense.claimDetails') || 'Expense Claim Details'}</h1>
          <p className="text-gray-600 mt-1">{t('expense.claimId') || 'Claim ID'}: {expense.id}</p>
        </div>
        <StatusBadge status={expense.status} />
      </div>

      {/* Employee Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('expense.employeeInfo') || 'Employee Information'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 ring-2 ring-gray-200">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg">
                {expense.employeeName.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{expense.employeeName}</h3>
              <p className="text-gray-600">{expense.employeeId} • {expense.department}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claim Amount Highlight */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            <p className="text-sm text-gray-700">{t('expense.claimAmount') || 'Claim Amount'}</p>
          </div>
          <p className="text-4xl font-semibold text-green-700"><CurrencyDisplay amount={expense.amount} /></p>
        </CardContent>
      </Card>

      {/* Expense Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('expense.expenseInformation') || 'Expense Information'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('expense.category')}</p>
                <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 mt-1">
                  {expense.category}
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('expense.date')}</p>
                <p className="font-medium mt-1">
                  {new Date(expense.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:col-span-2">
              <div className="p-2 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">{t('expense.description')}</p>
                <p className="font-medium mt-1">{expense.description}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Receipt className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('expense.receipts')}</p>
                <p className="font-medium mt-1">{expense.receipts} {t('expense.files') || 'file(s)'}</p>
              </div>
            </div>

            {expense.projectCode && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('expense.projectCode')}</p>
                  <p className="font-medium mt-1">{expense.projectCode}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approval Information Card (if exists) */}
      {expense.approver && (
        <Card>
          <CardHeader>
            <CardTitle>{t('expense.approvalInfo') || 'Approval Information'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('expense.approver')}</p>
                  <p className="font-medium mt-1">{expense.approver}</p>
                </div>
              </div>

              {expense.approvalDate && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('expense.approvalDate')}</p>
                    <p className="font-medium mt-1">
                      {new Date(expense.approvalDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes Card (if exists) */}
      {expense.notes && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle>{t('expense.notes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{expense.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {expense.status === 'Pending' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('common.actions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600" onClick={onApprove}>
                {t('expense.approve') || 'Approve'}
              </Button>
              <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={onReject}>
                {t('expense.reject') || 'Reject'}
              </Button>
              <Button variant="outline">
                {t('expense.requestInfo') || 'Request More Info'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
