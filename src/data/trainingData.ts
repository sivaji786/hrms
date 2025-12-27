export interface TrainingProgram {
  id: string;
  title: string;
  category: string;
  duration: string;
  instructor: string;
  location: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  totalSeats: number;
  enrolledSeats: number;
  department: string;
  description: string;
  cost: number;
}

export interface TrainingEnrollment {
  id: string;
  employeeId: string;
  employeeName: string;
  programId: string;
  programTitle: string;
  enrollmentDate: string;
  status: 'Enrolled' | 'In Progress' | 'Completed' | 'Dropped';
  completionDate?: string;
  score?: number;
  certificateIssued: boolean;
  feedback?: string;
  rating?: number;
}

export const trainingPrograms: TrainingProgram[] = [
  {
    id: 'TRN001',
    title: 'Advanced React & TypeScript',
    category: 'Technical',
    duration: '4 weeks',
    instructor: 'Sarah Johnson',
    location: 'Dubai Office',
    mode: 'Hybrid',
    startDate: '2024-01-15',
    endDate: '2024-02-12',
    status: 'Ongoing',
    totalSeats: 30,
    enrolledSeats: 28,
    department: 'Engineering',
    description: 'Deep dive into React hooks, TypeScript best practices, and modern state management',
    cost: 16500,
  },
  {
    id: 'TRN002',
    title: 'Leadership & Management Skills',
    category: 'Soft Skills',
    duration: '2 weeks',
    instructor: 'Michael Chen',
    location: 'Online',
    mode: 'Online',
    startDate: '2024-02-01',
    endDate: '2024-02-15',
    status: 'Upcoming',
    totalSeats: 25,
    enrolledSeats: 15,
    department: 'All Departments',
    description: 'Essential leadership skills for team leads and managers',
    cost: 12850,
  },
  {
    id: 'TRN003',
    title: 'Data Analytics with Python',
    category: 'Technical',
    duration: '6 weeks',
    instructor: 'Priya Sharma',
    location: 'Abu Dhabi Office',
    mode: 'Offline',
    startDate: '2023-11-01',
    endDate: '2023-12-15',
    status: 'Completed',
    totalSeats: 20,
    enrolledSeats: 20,
    department: 'Data Science',
    description: 'Comprehensive Python training for data analysis and visualization',
    cost: 20200,
  },
  {
    id: 'TRN004',
    title: 'Cloud Architecture (AWS)',
    category: 'Technical',
    duration: '5 weeks',
    instructor: 'Rajesh Kumar',
    location: 'Online',
    mode: 'Online',
    startDate: '2024-01-20',
    endDate: '2024-02-25',
    status: 'Ongoing',
    totalSeats: 35,
    enrolledSeats: 32,
    department: 'Engineering',
    description: 'AWS cloud services, architecture patterns, and best practices',
    cost: 18350,
  },
  {
    id: 'TRN005',
    title: 'Effective Communication',
    category: 'Soft Skills',
    duration: '1 week',
    instructor: 'Emily Davis',
    location: 'Dubai Office',
    mode: 'Offline',
    startDate: '2024-02-20',
    endDate: '2024-02-27',
    status: 'Upcoming',
    totalSeats: 40,
    enrolledSeats: 22,
    department: 'All Departments',
    description: 'Improve workplace communication and presentation skills',
    cost: 9175,
  },
  {
    id: 'TRN006',
    title: 'Cybersecurity Fundamentals',
    category: 'Technical',
    duration: '3 weeks',
    instructor: 'David Wilson',
    location: 'Online',
    mode: 'Online',
    startDate: '2023-12-01',
    endDate: '2023-12-22',
    status: 'Completed',
    totalSeats: 25,
    enrolledSeats: 25,
    department: 'IT',
    description: 'Essential security practices and threat management',
    cost: 14680,
  },
  {
    id: 'TRN007',
    title: 'Agile & Scrum Mastery',
    category: 'Process',
    duration: '2 weeks',
    instructor: 'Lisa Anderson',
    location: 'Hybrid',
    mode: 'Hybrid',
    startDate: '2024-01-10',
    endDate: '2024-01-24',
    status: 'Completed',
    totalSeats: 30,
    enrolledSeats: 28,
    department: 'All Departments',
    description: 'Agile methodologies, Scrum framework, and team collaboration',
    cost: 11010,
  },
  {
    id: 'TRN008',
    title: 'UI/UX Design Principles',
    category: 'Design',
    duration: '4 weeks',
    instructor: 'Amanda Taylor',
    location: 'Dubai Office',
    mode: 'Offline',
    startDate: '2024-02-05',
    endDate: '2024-03-05',
    status: 'Upcoming',
    totalSeats: 20,
    enrolledSeats: 18,
    department: 'Design',
    description: 'User-centered design, prototyping, and usability testing',
    cost: 17616,
  },
];

export const trainingEnrollments: TrainingEnrollment[] = [
  {
    id: 'ENR001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    programId: 'TRN001',
    programTitle: 'Advanced React & TypeScript',
    enrollmentDate: '2024-01-10',
    status: 'In Progress',
    certificateIssued: false,
  },
  {
    id: 'ENR002',
    employeeId: 'EMP002',
    employeeName: 'Jane Smith',
    programId: 'TRN003',
    programTitle: 'Data Analytics with Python',
    enrollmentDate: '2023-10-28',
    status: 'Completed',
    completionDate: '2023-12-15',
    score: 92,
    certificateIssued: true,
    rating: 5,
    feedback: 'Excellent course with practical examples',
  },
  {
    id: 'ENR003',
    employeeId: 'EMP003',
    employeeName: 'Mike Johnson',
    programId: 'TRN004',
    programTitle: 'Cloud Architecture (AWS)',
    enrollmentDate: '2024-01-18',
    status: 'In Progress',
    certificateIssued: false,
  },
  {
    id: 'ENR004',
    employeeId: 'EMP004',
    employeeName: 'Emily Brown',
    programId: 'TRN007',
    programTitle: 'Agile & Scrum Mastery',
    enrollmentDate: '2024-01-08',
    status: 'Completed',
    completionDate: '2024-01-24',
    score: 88,
    certificateIssued: true,
    rating: 4,
    feedback: 'Great instructor and interactive sessions',
  },
  {
    id: 'ENR005',
    employeeId: 'EMP005',
    employeeName: 'Sarah Davis',
    programId: 'TRN002',
    programTitle: 'Leadership & Management Skills',
    enrollmentDate: '2024-01-28',
    status: 'Enrolled',
    certificateIssued: false,
  },
];

export const trainingStats = {
  totalPrograms: 8,
  ongoingPrograms: 2,
  completedPrograms: 3,
  upcomingPrograms: 3,
  totalEnrollments: 168,
  completionRate: 78,
  averageRating: 4.5,
  totalInvestment: 124050,
};

export const categoryData = [
  { name: 'Technical', value: 50, color: '#3b82f6' },
  { name: 'Soft Skills', value: 25, color: '#10b981' },
  { name: 'Process', value: 15, color: '#f59e0b' },
  { name: 'Design', value: 10, color: '#8b5cf6' },
];

export const monthlyEnrollmentData = [
  { month: 'Aug', enrollments: 35 },
  { month: 'Sep', enrollments: 42 },
  { month: 'Oct', enrollments: 38 },
  { month: 'Nov', enrollments: 50 },
  { month: 'Dec', enrollments: 45 },
  { month: 'Jan', enrollments: 55 },
];
