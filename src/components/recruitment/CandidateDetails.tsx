import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ArrowLeft, Mail, Phone, Building, Calendar, DollarSign, Clock, FileText } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import { useLanguage } from '../../contexts/LanguageContext';

interface CandidateDetailsProps {
  candidate: {
    id: string;
    name: string;
    position: string;
    email: string;
    phone: string;
    experience: string;
    currentCompany: string;
    expectedSalary: string;
    noticePeriod: string;
    appliedDate: string;
    stage: string;
    status: string;
  };
  onBack: () => void;
}

export default function CandidateDetails({ candidate, onBack }: CandidateDetailsProps) {
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Shortlisted: 'bg-blue-100 text-blue-700 border-blue-200',
      'Interview Scheduled': 'bg-purple-100 text-purple-700 border-purple-200',
      'Offer Extended': 'bg-green-100 text-green-700 border-green-200',
      Rejected: 'bg-red-100 text-red-700 border-red-200',
      'Application Review': 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return variants[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const breadcrumbItems = [
    { label: t('nav.dashboard') },
    { label: t('recruitment.title') || 'Recruitment' },
    { label: t('recruitment.candidateProfile') || 'Candidate Profile' },
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
          <h1 className="text-2xl font-semibold">{t('recruitment.candidateProfile') || 'Candidate Profile'}</h1>
          <p className="text-gray-600 mt-1">{t('recruitment.candidateId') || 'Candidate ID'}: {candidate.id}</p>
        </div>
      </div>

      {/* Candidate Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{candidate.name}</h2>
              <p className="text-gray-600 mt-1">{candidate.position}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{candidate.phone}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant="outline" className="justify-center">
                {candidate.stage}
              </Badge>
              <Badge className={getStatusBadge(candidate.status)} variant="outline">
                {candidate.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recruitment.professionalDetails') || 'Professional Details'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('recruitment.experience') || 'Experience'}</p>
                <p className="font-medium">{candidate.experience}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('recruitment.currentCompany') || 'Current Company'}</p>
                <p className="font-medium">{candidate.currentCompany}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('recruitment.expectedSalary') || 'Expected Salary'}</p>
                <p className="font-medium text-green-600">{candidate.expectedSalary}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('recruitment.noticePeriod') || 'Notice Period'}</p>
                <p className="font-medium">{candidate.noticePeriod}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('recruitment.appliedDate') || 'Applied Date'}</p>
                <p className="font-medium">{candidate.appliedDate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('common.actions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600">
                {t('recruitment.scheduleInterview') || 'Schedule Interview'}
              </Button>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                {t('recruitment.sendOffer') || 'Send Offer'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                {t('recruitment.downloadResume') || 'Download Resume'}
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                {t('recruitment.reject') || 'Reject'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
