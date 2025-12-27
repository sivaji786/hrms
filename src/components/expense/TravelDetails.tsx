import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ArrowLeft, Plane, Calendar, MapPin, User, Building, DollarSign, FileText, Hotel, CreditCard } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { StatusBadge, CurrencyDisplay } from '../common';
import type { TravelRequest } from '../../data/expenseData';

interface TravelDetailsProps {
  travel: TravelRequest;
  onBack: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onClose?: () => void;
}

export default function TravelDetails({ travel, onBack, onApprove, onReject }: TravelDetailsProps) {
  const { t } = useLanguage();
  const { formatCurrency, convertAmount } = useCurrency();

  const breadcrumbItems = [
    { label: t('nav.dashboard') },
    { label: t('expense.title') || 'Expense & Travel' },
    { label: t('travel.requestDetails') || 'Travel Request Details' },
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
          <h1 className="text-2xl font-semibold">{t('travel.requestDetails') || 'Travel Request Details'}</h1>
          <p className="text-gray-600 mt-1">{t('travel.requestId') || 'Request ID'}: {travel.id}</p>
        </div>
        <StatusBadge status={travel.status} />
      </div>

      {/* Employee Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('expense.employeeInfo') || 'Employee Information'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 ring-2 ring-gray-200">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-lg">
                {travel.employeeName.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{travel.employeeName}</h3>
              <p className="text-gray-600">{travel.employeeId} • {travel.department}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('travel.tripInfo') || 'Trip Information'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3 md:col-span-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">{t('travel.purpose')}</p>
                <p className="font-medium mt-1">{travel.purpose}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('travel.from')}</p>
                <p className="font-medium mt-1">{travel.from}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('travel.to')}</p>
                <p className="font-medium mt-1">{travel.to}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('travel.departureDate')}</p>
                <p className="font-medium mt-1">
                  {new Date(travel.startDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('travel.returnDate')}</p>
                <p className="font-medium mt-1">
                  {new Date(travel.endDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-pink-50 rounded-lg">
                <Plane className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('travel.travelType')}</p>
                <Badge className="bg-pink-100 text-pink-700 border-pink-200 mt-1">
                  {travel.tripType}
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-teal-50 rounded-lg">
                <FileText className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('travel.duration')}</p>
                <p className="font-medium mt-1">
                  {Math.ceil((new Date(travel.endDate).getTime() - new Date(travel.startDate).getTime()) / (1000 * 60 * 60 * 24))} {t('travel.days') || 'days'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travel Requirements Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('travel.requirements') || 'Travel Requirements'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Plane className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">{t('travel.travelMode') || 'Travel Mode'}</p>
                <p className="text-sm text-blue-700">{travel.travelMode}</p>
              </div>
            </div>

            {travel.accommodationRequired && (
              <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <Hotel className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">{t('travel.hotelRequired')}</p>
                  <p className="text-sm text-purple-700">Accommodation Requested</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estimated Cost Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            <p className="text-sm text-gray-700">{t('travel.estimatedCost') || 'Estimated Cost'}</p>
          </div>
          <p className="text-4xl font-semibold text-green-700"><CurrencyDisplay amount={travel.estimatedCost} /></p>
        </CardContent>
      </Card>

      {/* Approval Information Card (if exists) */}
      {travel.approver && (
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
                  <p className="font-medium mt-1">{travel.approver}</p>
                </div>
              </div>

              {travel.approvalDate && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('expense.approvalDate')}</p>
                    <p className="font-medium mt-1">
                      {new Date(travel.approvalDate).toLocaleDateString('en-US', {
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
      {travel.notes && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle>{t('expense.notes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{travel.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {travel.status === 'Pending' && (
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
