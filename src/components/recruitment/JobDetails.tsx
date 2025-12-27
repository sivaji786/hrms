import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Building, MapPin, Users, DollarSign, Calendar, Briefcase } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import { useLanguage } from '../../contexts/LanguageContext';

interface JobDetailsProps {
  job: {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    experience: string;
    salary: string;
    openings: number;
    applicants: number;
    postedDate: string;
    status: string;
  };
  onBack: () => void;
}

export default function JobDetails({ job, onBack }: JobDetailsProps) {
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Active: 'bg-green-100 text-green-700 border-green-200',
      'On Hold': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Closed: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return variants[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const breadcrumbItems = [
    { label: t('nav.dashboard') },
    { label: t('recruitment.title') || 'Recruitment' },
    { label: t('recruitment.jobDetails') || 'Job Details' },
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
          <h1 className="text-2xl font-semibold">{job.title}</h1>
          <p className="text-gray-600 mt-1">{t('recruitment.jobId') || 'Job ID'}: {job.id}</p>
        </div>
        <Badge className={getStatusBadge(job.status)} variant="outline">
          {job.status}
        </Badge>
      </div>

      {/* Job Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recruitment.jobInformation') || 'Job Information'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('common.department')}</p>
                <p className="font-medium">{job.department}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('common.location')}</p>
                <p className="font-medium">{job.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('recruitment.jobType') || 'Job Type'}</p>
                <p className="font-medium">{job.type}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('recruitment.experience') || 'Experience'}</p>
                <p className="font-medium">{job.experience}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('recruitment.salaryRange') || 'Salary Range'}</p>
                <p className="font-medium text-green-600">{job.salary}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('recruitment.postedDate') || 'Posted Date'}</p>
                <p className="font-medium">{job.postedDate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recruitment.statistics') || 'Statistics'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('recruitment.openings') || 'Openings'}</p>
                  <p className="text-3xl font-semibold text-blue-600 mt-1">{job.openings}</p>
                </div>
                <Users className="w-10 h-10 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('recruitment.applicants') || 'Applicants'}</p>
                  <p className="text-3xl font-semibold text-green-600 mt-1">{job.applicants}</p>
                </div>
                <Users className="w-10 h-10 text-green-600 opacity-20" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
              {t('recruitment.viewApplicants') || 'View All Applicants'}
            </Button>
            <Button variant="outline" className="w-full">
              {t('recruitment.editJob') || 'Edit Job Details'}
            </Button>
            <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
              {t('recruitment.closePosition') || 'Close Position'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
