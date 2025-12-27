import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Search, Plus, Download, Eye, Edit, Trash2, ArrowLeft, Calendar, MapPin, Users, DollarSign, Briefcase, Filter, Clock, CheckCircle, XCircle, Building, FileText, Phone, Mail, UserCheck } from 'lucide-react';
import { DataTable, TableColumn, StatCard } from './common';
import { AvatarCell, NumberCell } from './common/TableCells';
import { Pagination } from './common';
import { useLanguage } from '../contexts/LanguageContext';

import { recruitmentService } from '../services/api';
import toast from '../utils/toast';
import { useEffect } from 'react';
import JobDetails from './recruitment/JobDetails';
import CandidateDetails from './recruitment/CandidateDetails';

type ViewMode = 'list' | 'postJob' | 'jobDetails' | 'candidateProfile' | 'viewApplicants' | 'editJob';
type JobStatus = 'All' | 'Active' | 'On Hold' | 'Closed';
type CandidateStatus = 'All' | 'Application Review' | 'Shortlisted' | 'Interview Scheduled' | 'Offer Extended' | 'Rejected';

const interviewSchedule = [
  { id: 1, candidate: 'Ahmed Al Maktoum', candidateId: 'CAN001', position: 'Senior Software Engineer', date: '2025-11-20', time: '10:00 AM', interviewer: 'Khalid Al Mansoori', type: 'Technical' },
  { id: 2, candidate: 'Sara Abdullah', candidateId: 'CAN002', position: 'UI/UX Designer', date: '2025-11-20', time: '02:00 PM', interviewer: 'Layla Al Hashimi', type: 'Design' },
  { id: 3, candidate: 'Mohammed Hassan', candidateId: 'CAN003', position: 'Marketing Manager', date: '2025-11-21', time: '11:00 AM', interviewer: 'Amira Al Falasi', type: 'HR' },
  { id: 4, candidate: 'Fatima Al Zaabi', candidateId: 'CAN004', position: 'HR Executive', date: '2025-11-22', time: '03:00 PM', interviewer: 'Rashid Al Shamsi', type: 'HR' },
];

interface Applicant {
  id: string;
  name: string;
  email: string;
  appliedDate: string;
  status: string;
  resumeScore: number;
}

export default function Recruitment() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState<JobStatus>('All');
  const [candidateStatusFilter, setCandidateStatusFilter] = useState<CandidateStatus>('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  const [isCandidateDetailsOpen, setIsCandidateDetailsOpen] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsData, candidatesData, interviewsData] = await Promise.all([
        recruitmentService.getJobs().catch(() => ({ data: [] })),
        recruitmentService.getCandidates().catch(() => ({ data: [] })),
        recruitmentService.getInterviews().catch(() => ({ data: [] }))
      ]);
      setJobs(Array.isArray(jobsData?.data) ? jobsData.data : []);
      setCandidates(Array.isArray(candidatesData?.data) ? candidatesData.data : []);
      setInterviews(Array.isArray(interviewsData?.data) ? interviewsData.data : []);
    } catch (error) {
      console.error('Error fetching recruitment data:', error);
      toast.error('Failed to load recruitment data');
      // Set empty arrays as fallback
      setJobs([]);
      setCandidates([]);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Active: 'bg-green-100 text-green-700 border-green-200',
      'On Hold': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Closed: 'bg-gray-100 text-gray-700 border-gray-200',
      Shortlisted: 'bg-blue-100 text-blue-700 border-blue-200',
      'Interview Scheduled': 'bg-purple-100 text-purple-700 border-purple-200',
      'Offer Extended': 'bg-green-100 text-green-700 border-green-200',
      Rejected: 'bg-red-100 text-red-700 border-red-200',
      'Application Review': 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return variants[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    if (!job || !job.title) return false;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.department && job.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = jobStatusFilter === 'All' || job.status === jobStatusFilter;
    const matchesDepartment = departmentFilter === 'All' || job.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Filter candidates
  const filteredCandidates = candidates.filter(candidate => {
    if (!candidate || !candidate.name) return false;
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (candidate.position && candidate.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (candidate.email && candidate.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = candidateStatusFilter === 'All' || candidate.status === candidateStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil((activeTab === 'jobs' ? filteredJobs : filteredCandidates).length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedCandidates = filteredCandidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const departments = ['All', ...Array.from(new Set(jobs.filter(j => j?.department).map(j => j.department)))];

  const handleViewJobDetails = (job: any) => {
    setSelectedJob(job);
    setIsJobDetailsOpen(true);
  };

  const handleViewCandidateProfile = (candidate: any) => {
    setSelectedCandidate(candidate);
    setIsCandidateDetailsOpen(true);
  };

  // Handle checkbox selections for candidates
  const handleSelectAllCandidates = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(paginatedCandidates.map(c => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleSelectCandidate = (candId: string | number, checked: boolean) => {
    if (checked) {
      setSelectedCandidates([...selectedCandidates, candId as string]);
    } else {
      setSelectedCandidates(selectedCandidates.filter(id => id !== candId));
    }
  };

  const selectedCandidateObjects = candidates.filter(c =>
    selectedCandidates.includes(c.id)
  );

  // If showing job details page, render it
  if (isJobDetailsOpen && selectedJob) {
    return (
      <JobDetails
        job={selectedJob}
        onBack={() => setIsJobDetailsOpen(false)}
      />
    );
  }

  // If showing candidate details page, render it
  if (isCandidateDetailsOpen && selectedCandidate) {
    return (
      <CandidateDetails
        candidate={selectedCandidate}
        onBack={() => setIsCandidateDetailsOpen(false)}
      />
    );
  }

  // Candidate columns for DataTable
  const candidateColumns: TableColumn[] = [
    {
      header: t('recruitment.candidate'),
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <AvatarCell
          name={row.name}
          subtitle={row.email}
        />
      ),
    },
    {
      header: t('recruitment.position'),
      accessor: 'position',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-medium">{row.position}</p>
          <p className="text-sm text-gray-500">{row.currentCompany}</p>
        </div>
      ),
    },
    {
      header: t('recruitment.experience'),
      accessor: 'experience',
      sortable: true,
    },
    {
      header: t('recruitment.expectedSalary'),
      accessor: 'expectedSalary',
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-green-600">{row.expectedSalary}</span>
      ),
    },
    {
      header: t('recruitment.stage'),
      accessor: 'stage',
      sortable: true,
      cell: (row) => (
        <Badge variant="outline">{row.stage}</Badge>
      ),
    },
    {
      header: t('recruitment.status'),
      accessor: 'status',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'Offer Extended' && <CheckCircle className="w-4 h-4 text-green-500" />}
          {row.status === 'Rejected' && <XCircle className="w-4 h-4 text-red-500" />}
          {row.status === 'Interview Scheduled' && <Clock className="w-4 h-4 text-purple-500" />}
          <Badge className={getStatusBadge(row.status)} variant="outline">
            {row.status}
          </Badge>
        </div>
      ),
    },
    {
      header: t('recruitment.actions'),
      cell: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleViewCandidateProfile(row)}
        >
          {t('recruitment.viewProfile')}
        </Button>
      ),
    },
  ];

  if (viewMode === 'postJob') {
    return (
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => setViewMode('list')} className="hover:text-gray-900">
            Recruitment
          </button>
          <span>/</span>
          <span className="text-gray-900">Post New Job</span>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setViewMode('list')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('recruitment.backToJobs')}
          </Button>
          <h2 className="text-2xl font-medium">{t('recruitment.postNewJobOpening')}</h2>
        </div>

        <Card>
          <CardContent className="p-6">
            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              try {
                // In a real app, we would gather form data here
                // await recruitmentService.createJob(formData);
                toast.success('Job Posted Successfully', 'The job opening has been created and is now active.');
                fetchData(); // Refresh list
                setViewMode('list');
              } catch (error) {
                toast.error('Failed to post job');
              }
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('recruitment.jobTitle')} *</label>
                  <Input placeholder={t('recruitment.jobTitlePlaceholder')} required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('recruitment.department')} *</label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder={t('recruitment.selectDepartment')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">{t('recruitment.engineering')}</SelectItem>
                      <SelectItem value="Marketing">{t('recruitment.marketing')}</SelectItem>
                      <SelectItem value="Design">{t('recruitment.design')}</SelectItem>
                      <SelectItem value="Sales">{t('recruitment.sales')}</SelectItem>
                      <SelectItem value="HR">{t('recruitment.hr')}</SelectItem>
                      <SelectItem value="Finance">{t('recruitment.finance')}</SelectItem>
                      <SelectItem value="Operations">{t('recruitment.operations')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('recruitment.location')} *</label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder={t('recruitment.selectLocation')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Abu Dhabi">{t('recruitment.abuDhabi')}</SelectItem>
                      <SelectItem value="Dubai">{t('recruitment.dubai')}</SelectItem>
                      <SelectItem value="Sharjah">{t('recruitment.sharjah')}</SelectItem>
                      <SelectItem value="Ajman">{t('recruitment.ajman')}</SelectItem>
                      <SelectItem value="Ras Al Khaimah">{t('recruitment.rasAlKhaimah')}</SelectItem>
                      <SelectItem value="Fujairah">{t('recruitment.fujairah')}</SelectItem>
                      <SelectItem value="Umm Al Quwain">{t('recruitment.ummAlQuwain')}</SelectItem>
                      <SelectItem value="Remote">{t('recruitment.remote')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('recruitment.jobType')} *</label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder={t('recruitment.selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">{t('recruitment.fullTime')}</SelectItem>
                      <SelectItem value="Part-time">{t('recruitment.partTime')}</SelectItem>
                      <SelectItem value="Contract">{t('recruitment.contract')}</SelectItem>
                      <SelectItem value="Internship">{t('recruitment.internship')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('recruitment.experienceRequired')} *</label>
                  <Input placeholder={t('recruitment.experiencePlaceholder')} required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('recruitment.numberOfOpenings')} *</label>
                  <Input type="number" min="1" placeholder={t('recruitment.positionsPlaceholder')} required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('recruitment.salaryRange')} *</label>
                  <Input placeholder={t('recruitment.salaryPlaceholder')} required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('recruitment.status')} *</label>
                  <Select defaultValue="Active" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">{t('recruitment.active')}</SelectItem>
                      <SelectItem value="On Hold">{t('recruitment.onHold')}</SelectItem>
                      <SelectItem value="Closed">{t('recruitment.closed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('recruitment.jobDescription')} *</label>
                <textarea
                  className="w-full min-h-[150px] p-3 border rounded-md"
                  placeholder={t('recruitment.jobDescriptionPlaceholder')}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('recruitment.requiredSkills')}</label>
                <Input placeholder={t('recruitment.skillsPlaceholder')} />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  {t('recruitment.postJobOpening')}
                </Button>
                <Button type="button" variant="outline" onClick={() => setViewMode('list')}>
                  {t('recruitment.cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div >
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="text-gray-900">Recruitment & ATS</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('recruitment.openPositions')}
          value={(jobs || []).filter(j => j?.status === 'Active').length.toString()}
          subtitle={t('recruitment.activeJobPostings')}
          icon={Briefcase}
          trend={{ value: 12, isPositive: true }}
          variant="default"
        />
        <StatCard
          title={t('recruitment.totalApplications')}
          value={(candidates || []).length.toString()}
          subtitle={t('recruitment.allTime')}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          variant="default"
        />
        <StatCard
          title={t('recruitment.interviewsScheduled')}
          value={(interviews || []).filter(i => i?.status === 'Scheduled').length.toString()}
          subtitle={t('recruitment.upcomingInterviews')}
          icon={Calendar}
          trend={{ value: 15, isPositive: true }}
          variant="default"
        />
        <StatCard
          title={t('recruitment.offersExtended')}
          value={(candidates || []).filter(c => c?.status === 'Offer Extended').length.toString()}
          icon={UserCheck}
          iconColor="text-orange-600"
          trend={{ value: 5, isPositive: true }}
          variant="default"
        />
      </div>

      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        setCurrentPage(1);
        setSearchTerm('');
      }} className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="jobs">{t('recruitment.jobOpenings')}</TabsTrigger>
            <TabsTrigger value="candidates">{t('recruitment.candidates')}</TabsTrigger>
            <TabsTrigger value="interviews">{t('recruitment.interviewSchedule')}</TabsTrigger>
          </TabsList>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
            onClick={() => setViewMode('postJob')}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('recruitment.postNewJob')}
          </Button>
        </div>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={t('recruitment.searchJobs')}
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Select value={jobStatusFilter} onValueChange={(value) => {
                  setJobStatusFilter(value as JobStatus);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('recruitment.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">{t('recruitment.allStatus')}</SelectItem>
                    <SelectItem value="Active">{t('recruitment.active')}</SelectItem>
                    <SelectItem value="On Hold">{t('recruitment.onHold')}</SelectItem>
                    <SelectItem value="Closed">{t('recruitment.closed')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={departmentFilter} onValueChange={(value) => {
                  setDepartmentFilter(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('recruitment.department')} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept === 'All' ? t('recruitment.allDepartments') : dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-600 flex items-center">
                  {t('recruitment.showingJobs', { current: paginatedJobs.length, total: filteredJobs.length })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Jobs List */}
          <div className="grid gap-4">
            {paginatedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-medium text-lg">{job.title}</h4>
                            <Badge className={getStatusBadge(job.status)} variant="outline">
                              {job.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            {job.department}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {job.experience}
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">{t('recruitment.openings')}</p>
                        <p className="text-2xl font-medium">{job.openings}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('recruitment.applicants')}</p>
                        <p className="text-2xl font-medium text-blue-600">{job.applicants}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewJobDetails(job)}>
                      <Eye className="w-4 h-4 mr-1" />
                      {t('recruitment.viewDetails')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedJob(job);
                        toast.info('View Applicants', `Viewing ${job.applicants} applicants for ${job.title}. This would show a detailed list of all candidates with their application status, resume scores, and interview stages.`);
                      }}
                    >
                      {t('recruitment.viewApplicants')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedJob(job);
                        toast.info('Edit Job', `Opening edit form for ${job.title} to update job details, requirements, and status.`);
                      }}
                    >
                      {t('recruitment.edit')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                {t('common.previous')}
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                {t('common.next')}
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Candidates Tab */}
        <TabsContent value="candidates" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={t('recruitment.searchCandidates')}
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Select value={candidateStatusFilter} onValueChange={(value) => {
                  setCandidateStatusFilter(value as CandidateStatus);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('recruitment.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">{t('recruitment.allStatus')}</SelectItem>
                    <SelectItem value="Application Review">{t('recruitment.applicationReview')}</SelectItem>
                    <SelectItem value="Shortlisted">{t('recruitment.shortlisted')}</SelectItem>
                    <SelectItem value="Interview Scheduled">{t('recruitment.interviewScheduled')}</SelectItem>
                    <SelectItem value="Offer Extended">{t('recruitment.offerExtended')}</SelectItem>
                    <SelectItem value="Rejected">{t('recruitment.rejected')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Candidates Table */}
          <Card>
            <CardContent className="p-0">
              <DataTable
                columns={candidateColumns}
                data={paginatedCandidates}
                selectable
                selectedRows={selectedCandidateObjects}
                onSelectRow={handleSelectCandidate}
                onSelectAll={handleSelectAllCandidates}
                exportable
                sortable
                exportFileName="candidates"
                exportHeaders={['Name', 'Email', 'Position', 'Company', 'Experience', 'Expected Salary', 'Stage', 'Status']}
                headerStyle="gradient"
                cellPadding="relaxed"
                emptyMessage={t('recruitment.noCandidates')}
              />
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                {t('common.previous')}
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                {t('common.next')}
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Interviews Tab */}
        <TabsContent value="interviews">
          <div className="grid gap-4">
            {interviews.map((interview) => (
              <Card key={interview.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{interview.candidate}</h4>
                        <p className="text-sm text-gray-600">{interview.position}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {interview.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {interview.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {interview.interviewer}
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200" variant="outline">
                            {interview.type} Round
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        Start Interview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}