export interface Notification {
  id: string;
  type: 'System' | 'Leave' | 'Payroll' | 'Attendance' | 'Performance' | 'Recruitment' | 'Training' | 'Asset' | 'Expense' | 'Document' | 'Ticket' | 'Announcement';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  actionUrl?: string;
  sender?: string;
  icon?: string;
}

export interface NotificationStats {
  totalNotifications: number;
  unreadNotifications: number;
  todayNotifications: number;
  thisWeekNotifications: number;
}

export const notificationStats: NotificationStats = {
  totalNotifications: 248,
  unreadNotifications: 23,
  todayNotifications: 12,
  thisWeekNotifications: 45,
};

export const notifications: Notification[] = [
  {
    id: '1',
    type: 'Leave',
    priority: 'High',
    title: 'Leave Request Approved',
    message: 'Your leave request for Dec 20-22, 2024 has been approved by Sarah Johnson.',
    timestamp: '2025-11-17T10:30:00',
    isRead: false,
    isArchived: false,
    sender: 'Sarah Johnson',
    actionUrl: '/leave',
  },
  {
    id: '2',
    type: 'Payroll',
    priority: 'High',
    title: 'Payslip Generated',
    message: 'Your payslip for November 2025 is now available. Click to view details.',
    timestamp: '2025-11-17T09:15:00',
    isRead: false,
    isArchived: false,
    sender: 'Payroll System',
    actionUrl: '/payroll',
  },
  {
    id: '3',
    type: 'Attendance',
    priority: 'Medium',
    title: 'Late Check-in Alert',
    message: 'You checked in 15 minutes late today at 09:15 AM.',
    timestamp: '2025-11-17T09:15:00',
    isRead: false,
    isArchived: false,
    sender: 'Attendance System',
  },
  {
    id: '4',
    type: 'Performance',
    priority: 'Medium',
    title: 'Performance Review Due',
    message: 'Your quarterly performance review is due in 3 days. Please complete your self-assessment.',
    timestamp: '2025-11-17T08:00:00',
    isRead: false,
    isArchived: false,
    sender: 'HR Department',
    actionUrl: '/performance',
  },
  {
    id: '5',
    type: 'Announcement',
    priority: 'Low',
    title: 'Company Holiday Announcement',
    message: 'The office will be closed on December 25-26, 2024 for the holidays.',
    timestamp: '2025-11-16T16:00:00',
    isRead: true,
    isArchived: false,
    sender: 'Management',
  },
  {
    id: '6',
    type: 'Training',
    priority: 'Medium',
    title: 'New Training Course Available',
    message: 'A new course on "Advanced Project Management" is now available. Enroll before Dec 20.',
    timestamp: '2025-11-16T14:30:00',
    isRead: true,
    isArchived: false,
    sender: 'Training Department',
    actionUrl: '/training',
  },
  {
    id: '7',
    type: 'Asset',
    priority: 'High',
    title: 'Asset Return Reminder',
    message: 'Please return the laptop (Asset #LT-1234) by November 30, 2025.',
    timestamp: '2025-11-16T11:00:00',
    isRead: false,
    isArchived: false,
    sender: 'Asset Management',
    actionUrl: '/assets',
  },
  {
    id: '8',
    type: 'Expense',
    priority: 'Medium',
    title: 'Expense Report Approved',
    message: 'Your expense report for $450 has been approved and will be reimbursed in the next payroll.',
    timestamp: '2025-11-16T10:00:00',
    isRead: true,
    isArchived: false,
    sender: 'Finance Department',
    actionUrl: '/expenses',
  },
  {
    id: '9',
    type: 'System',
    priority: 'Urgent',
    title: 'Password Expiring Soon',
    message: 'Your password will expire in 5 days. Please update your password to maintain access.',
    timestamp: '2025-11-16T09:00:00',
    isRead: false,
    isArchived: false,
    sender: 'IT Security',
  },
  {
    id: '10',
    type: 'Document',
    priority: 'Low',
    title: 'New Policy Document',
    message: 'A new "Remote Work Policy" document has been uploaded. Please review and acknowledge.',
    timestamp: '2025-11-15T15:00:00',
    isRead: true,
    isArchived: false,
    sender: 'HR Department',
    actionUrl: '/documents',
  },
  {
    id: '11',
    type: 'Ticket',
    priority: 'High',
    title: 'Support Ticket Resolved',
    message: 'Your support ticket #TKT-2024 regarding "Email access issue" has been resolved.',
    timestamp: '2025-11-15T14:00:00',
    isRead: false,
    isArchived: false,
    sender: 'IT Support',
    actionUrl: '/tickets',
  },
  {
    id: '12',
    type: 'Recruitment',
    priority: 'Low',
    title: 'Interview Scheduled',
    message: 'An interview for the Senior Developer position has been scheduled for Nov 20, 10:00 AM.',
    timestamp: '2025-11-15T11:00:00',
    isRead: true,
    isArchived: false,
    sender: 'Recruitment Team',
    actionUrl: '/recruitment',
  },
  {
    id: '13',
    type: 'Leave',
    priority: 'Medium',
    title: 'Leave Balance Update',
    message: 'Your leave balance has been updated. You have 12 days remaining for 2025.',
    timestamp: '2025-11-15T09:00:00',
    isRead: true,
    isArchived: false,
    sender: 'HR System',
    actionUrl: '/leave',
  },
  {
    id: '14',
    type: 'Payroll',
    priority: 'High',
    title: 'Bonus Credited',
    message: 'A performance bonus of $2,000 has been credited to your account.',
    timestamp: '2025-11-14T16:00:00',
    isRead: false,
    isArchived: false,
    sender: 'Payroll Department',
    actionUrl: '/payroll',
  },
  {
    id: '15',
    type: 'System',
    priority: 'Medium',
    title: 'System Maintenance',
    message: 'Scheduled system maintenance on Nov 18, 11:00 PM - 2:00 AM. System will be unavailable.',
    timestamp: '2025-11-14T14:00:00',
    isRead: true,
    isArchived: false,
    sender: 'IT Department',
  },
  {
    id: '16',
    type: 'Attendance',
    priority: 'Low',
    title: 'Overtime Approved',
    message: 'Your overtime request for 4 hours on Nov 12 has been approved.',
    timestamp: '2025-11-14T10:00:00',
    isRead: true,
    isArchived: false,
    sender: 'Department Manager',
    actionUrl: '/attendance',
  },
  {
    id: '17',
    type: 'Performance',
    priority: 'High',
    title: 'Goal Achievement',
    message: 'Congratulations! You have achieved 95% of your Q4 goals.',
    timestamp: '2025-11-13T15:00:00',
    isRead: false,
    isArchived: false,
    sender: 'Performance System',
    actionUrl: '/performance',
  },
  {
    id: '18',
    type: 'Announcement',
    priority: 'Medium',
    title: 'Team Building Event',
    message: 'Join us for the annual team building event on Dec 15, 2024 at Green Valley Resort.',
    timestamp: '2025-11-13T12:00:00',
    isRead: true,
    isArchived: false,
    sender: 'HR Department',
  },
  {
    id: '19',
    type: 'Training',
    priority: 'Low',
    title: 'Training Completion Certificate',
    message: 'Your certificate for "Leadership Skills" training has been generated and is ready for download.',
    timestamp: '2025-11-13T10:00:00',
    isRead: true,
    isArchived: false,
    sender: 'Training System',
    actionUrl: '/training',
  },
  {
    id: '20',
    type: 'Document',
    priority: 'Medium',
    title: 'Document Approval Required',
    message: 'Please review and approve the "Q4 Budget Report" document.',
    timestamp: '2025-11-12T16:00:00',
    isRead: false,
    isArchived: false,
    sender: 'Finance Team',
    actionUrl: '/documents',
  },
];

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
  emailFrequency: 'instant' | 'daily' | 'weekly' | 'never';
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  
  // Notification type preferences
  leaveNotifications: {
    approval: boolean;
    rejection: boolean;
    newRequest: boolean;
  };
  payrollNotifications: {
    payslipGenerated: boolean;
    salaryProcessed: boolean;
    bonus: boolean;
  };
  attendanceNotifications: {
    lateCheckIn: boolean;
    missedCheckOut: boolean;
    overtime: boolean;
  };
  performanceNotifications: {
    reviewDue: boolean;
    reviewCompleted: boolean;
    goals: boolean;
  };
  systemNotifications: {
    systemUpdates: boolean;
    maintenance: boolean;
    security: boolean;
  };
  announcementNotifications: {
    companyNews: boolean;
    policyUpdates: boolean;
    general: boolean;
  };
}

export const defaultNotificationPreferences: NotificationPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  inAppNotifications: true,
  emailFrequency: 'instant',
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  
  leaveNotifications: {
    approval: true,
    rejection: true,
    newRequest: true,
  },
  payrollNotifications: {
    payslipGenerated: true,
    salaryProcessed: true,
    bonus: true,
  },
  attendanceNotifications: {
    lateCheckIn: true,
    missedCheckOut: true,
    overtime: true,
  },
  performanceNotifications: {
    reviewDue: true,
    reviewCompleted: true,
    goals: true,
  },
  systemNotifications: {
    systemUpdates: true,
    maintenance: true,
    security: true,
  },
  announcementNotifications: {
    companyNews: true,
    policyUpdates: true,
    general: true,
  },
};
