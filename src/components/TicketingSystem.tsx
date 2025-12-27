import { Pagination } from './common';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import toast from '../utils/toast';
import {
  Plus,
  Search,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Ticket as TicketIcon,
  ArrowLeft,
  Send,
  Paperclip,
  Tag,
  User,
  Calendar,
  Activity,
  AlertTriangle
} from 'lucide-react';
import ticketService, { Ticket, TicketComment } from '../services/ticketService';
import { employeeService } from '../services/api';

import StatCard from './common/StatCard';
import DataTable, { TableColumn } from './common/DataTable';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

type ViewMode = 'list' | 'create' | 'details';

export default function TicketingSystem() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const itemsPerPage = 10;

  // New State for API Data
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketStats, setTicketStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    overdueTickets: 0,
    avgResponseTime: '0h',
    avgResolutionTime: '0h',
    satisfactionRate: 0
  });
  const [assignees, setAssignees] = useState<any[]>([]);
  const [employeesList, setEmployeesList] = useState<any[]>([]);
  const [ticketCategoryData, setTicketCategoryData] = useState<any[]>([]);
  const [ticketPriorityData, setTicketPriorityData] = useState<any[]>([]);
  const [ticketTrendData, setTicketTrendData] = useState<any[]>([]);
  const [comments, setComments] = useState<TicketComment[]>([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ticketsData, employeesData] = await Promise.all([
        ticketService.getAll(),
        employeeService.getAll()
      ]);

      const ticketsArray = Array.isArray(ticketsData) ? ticketsData : (Array.isArray(ticketsData?.data) ? ticketsData.data : []);

      let employeesArray: any[] = [];
      if (Array.isArray(employeesData)) {
        employeesArray = employeesData;
      } else if (Array.isArray(employeesData?.data)) {
        employeesArray = employeesData.data;
      } else if (Array.isArray(employeesData?.data?.employees)) {
        employeesArray = employeesData.data.employees;
      }

      // Join data needed for UI
      const enrichedTickets = ticketsArray.map((ticket: any) => {
        const submitter = employeesArray.find((e: any) => e.id === ticket.requester_id);
        const assignee = employeesArray.find((e: any) => e.id === ticket.assignee_id);

        // SLA Status Logic
        let slaStatus = 'On Time';
        if (ticket.status !== 'Resolved' && ticket.status !== 'Closed') {
          if (ticket.due_date) {
            const dueDate = new Date(ticket.due_date);
            const now = new Date();
            const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

            if (diffHours < 0) slaStatus = 'Overdue';
            else if (diffHours < 24) slaStatus = 'Due Soon';
          }
        } else {
          slaStatus = 'Resolved';
        }

        return {
          ...ticket,
          ticketNumber: ticket.ticket_number,
          submittedByName: submitter ? `${submitter.first_name} ${submitter.last_name}` : 'Unknown',
          submittedByRole: submitter ? submitter.designation : '',
          assignedToName: assignee ? `${assignee.first_name} ${assignee.last_name}` : null,
          slaStatus: slaStatus,
          createdAt: ticket.created_at,
          updatedAt: ticket.updated_at,
          dueDate: ticket.due_date,
          tags: [ticket.category], // Use category as tag since we don't have separate tags
          attachments: 0,
          department: submitter?.department_name || 'General'
        };
      });

      setTickets(enrichedTickets);
      setEmployeesList(employeesArray);

      // Calculate Stats
      calculateStats(enrichedTickets, employeesArray);

    } catch (error) {
      console.error(error);
      toast.error('Failed to load tickets');
    }
  };

  const calculateStats = (ticketsData: any[], employeesData: any[]) => {
    const total = ticketsData.length;
    const open = ticketsData.filter((t: any) => t.status === 'Open').length;
    const inProgress = ticketsData.filter((t: any) => t.status === 'In Progress').length;
    const resolved = ticketsData.filter((t: any) => t.status === 'Resolved' || t.status === 'Closed').length;

    // Calculate Overdue
    const overdue = ticketsData.filter((t: any) => {
      if (t.status === 'Resolved' || t.status === 'Closed' || !t.due_date) return false;
      return new Date(t.due_date) < new Date();
    }).length;

    // Calculate Avg Resolution Time (for resolved tickets)
    let totalResolutionHours = 0;
    let resolvedCount = 0;
    ticketsData.forEach((t: any) => {
      if ((t.status === 'Resolved' || t.status === 'Closed') && t.created_at && t.updated_at) {
        const created = new Date(t.created_at).getTime();
        const updated = new Date(t.updated_at).getTime();
        totalResolutionHours += (updated - created) / (1000 * 60 * 60);
        resolvedCount++;
      }
    });
    const avgResolutionTime = resolvedCount > 0 ? `${Math.round(totalResolutionHours / resolvedCount)}h` : '0h';

    setTicketStats({
      totalTickets: total,
      openTickets: open,
      inProgressTickets: inProgress,
      resolvedTickets: resolved,
      overdueTickets: overdue,
      avgResponseTime: 'N/A', // Not tracked currently
      avgResolutionTime: avgResolutionTime,
      satisfactionRate: 0 // Not tracked currently
    });

    // Assignees
    const assigneeMap = new Map();
    ticketsData.forEach((t: any) => {
      if (t.assignee_id) {
        assigneeMap.set(t.assignee_id, (assigneeMap.get(t.assignee_id) || 0) + 1);
      }
    });

    const newAssignees = employeesData
      .filter((e: any) => assigneeMap.has(e.id))
      .map((e: any) => ({
        id: e.id,
        name: `${e.first_name} ${e.last_name}`,
        role: e.designation,
        activeTickets: assigneeMap.get(e.id) || 0
      }));
    setAssignees(newAssignees);

    // Category Data
    const catCounts: any = {};
    if (ticketsData.length > 0) {
      ticketsData.forEach((t: any) => {
        const cat = t.category || 'Uncategorized';
        catCounts[cat] = (catCounts[cat] || 0) + 1;
      });
      setTicketCategoryData(Object.keys(catCounts).map(key => ({ name: key, value: catCounts[key], color: '#8884d8' })));
    } else {
      setTicketCategoryData([]);
    }

    // Priority Data
    const priCounts: any = {};
    if (ticketsData.length > 0) {
      ticketsData.forEach((t: any) => {
        const pri = t.priority || 'Unknown';
        priCounts[pri] = (priCounts[pri] || 0) + 1;
      });
      setTicketPriorityData(Object.keys(priCounts).map(key => ({ name: key, value: priCounts[key], color: '#82ca9d' })));
    } else {
      setTicketPriorityData([]);
    }

    // Trend Data
    const trendMap = new Map();
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.toLocaleString('default', { month: 'short' });
      trendMap.set(month, { month, created: 0, resolved: 0 });
    }

    ticketsData.forEach((t: any) => {
      if (t.created_at) {
        const date = new Date(t.created_at);
        const month = date.toLocaleString('default', { month: 'short' });
        if (trendMap.has(month)) {
          const entry = trendMap.get(month);
          entry.created++;
          if (t.status === 'Resolved' || t.status === 'Closed') {
            entry.resolved++;
          }
        }
      }
    });
    setTicketTrendData(Array.from(trendMap.values()));
  };

  const [ticketFormData, setTicketFormData] = useState({
    title: '',
    description: '',
    category: '' as string,
    priority: '' as string,
    submittedBy: '',
    assignedTo: '',
    dueDate: '',
  });

  const handleExport = () => {
    toast.info('Exporting Ticket Data', 'Ticket data will be downloaded as CSV file.');
  };

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.ticketNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.submittedByName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Waiting on Customer': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Reopened': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSLAColor = (sla: string) => {
    switch (sla) {
      case 'On Time': return 'text-green-600';
      case 'Due Soon': return 'text-yellow-600';
      case 'Overdue': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'High': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default: return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
    setViewMode('list');
  };

  // Fetch comments when a ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      loadComments(selectedTicket.id);
    }
  }, [selectedTicket]);

  const loadComments = async (ticketId: string) => {
    try {
      const commentsData = await ticketService.getComments(ticketId);
      const commentsArray = Array.isArray(commentsData) ? commentsData : (Array.isArray(commentsData?.data) ? commentsData.data : []);

      const enrichedComments = commentsArray.map((comment: any) => {
        const user = employeesList.find((e: any) => e.id === comment.user_id);
        return {
          ...comment,
          userName: user ? `${user.first_name} ${user.last_name}` : 'Unknown User',
          userRole: user ? user.designation : ''
        };
      });

      setComments(enrichedComments);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitComment = async () => {
    if (newComment.trim() && selectedTicket) {
      try {
        await ticketService.addComment(selectedTicket.id, { comment: newComment });
        setNewComment('');
        toast.success(t('tickets.commentAdded'));
        loadComments(selectedTicket.id);
      } catch (error) {
        toast.error('Failed to add comment');
      }
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...ticketFormData,
        requester_id: ticketFormData.submittedBy,
        assignee_id: ticketFormData.assignedTo || null,
        status: 'Open'
      };
      await ticketService.create(payload);
      toast.success(t('tickets.ticketCreated'), 'The ticket has been created and assigned.');
      setViewMode('list');
      setTicketFormData({
        title: '',
        description: '',
        category: '',
        priority: '',
        submittedBy: '',
        assignedTo: '',
        dueDate: '',
      });
      fetchData(); // Refresh list
    } catch (error) {
      toast.error('Failed to create ticket');
    }
  };

  // Define table columns for DataTable
  const tableColumns: TableColumn[] = [
    {
      header: t('tickets.ticket'),
      cell: (ticket: Ticket) => (
        <div className="flex items-center gap-2">
          {getPriorityIcon(ticket.priority)}
          <div>
            <p className="font-medium text-gray-900">{ticket.ticketNumber || ticket.ticket_number}</p>
            <p className="text-xs text-gray-600">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      header: t('tickets.subject'),
      cell: (ticket: Ticket) => (
        <p className="text-gray-900 max-w-xs truncate">{ticket.title}</p>
      ),
    },
    {
      header: t('tickets.submittedBy'),
      cell: (ticket: Ticket) => (
        <div>
          <p className="font-medium text-gray-900">{ticket.submittedByName}</p>
          <p className="text-sm text-gray-600">{ticket.submittedByRole}</p>
        </div>
      ),
    },
    {
      header: t('tickets.category'),
      cell: (ticket: Ticket) => (
        <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">{ticket.category}</Badge>
      ),
    },
    {
      header: t('tickets.priority'),
      cell: (ticket: Ticket) => (
        <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
      ),
    },
    {
      header: t('tickets.status'),
      cell: (ticket: Ticket) => (
        <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
      ),
    },
    {
      header: t('tickets.assignedTo'),
      cell: (ticket: Ticket) => (
        <p className="text-gray-900">
          {ticket.assignedToName || <span className="text-gray-400">{t('tickets.unassigned')}</span>}
        </p>
      ),
    },
    {
      header: t('tickets.sla'),
      cell: (ticket: Ticket) => (
        <p className={`font-medium ${getSLAColor(ticket.slaStatus || 'On Time')}`}>{ticket.slaStatus || 'On Time'}</p>
      ),
    },
    {
      header: t('tickets.actions'),
      cell: (ticket: Ticket) => (
        <Button variant="outline" size="sm" onClick={() => handleViewTicket(ticket)}>
          <Eye className="w-4 h-4 mr-1" />
          {t('tickets.view')}
        </Button>
      ),
    },
  ];

  // Create Ticket View
  if (viewMode === 'create') {
    return (
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => setViewMode('list')} className="hover:text-gray-900">
            {t('tickets.ticketing')}
          </button>
          <span>/</span>
          <span className="text-gray-900">{t('tickets.createNewTicket')}</span>
        </div>

        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setViewMode('list')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('tickets.backToTickets')}
          </Button>
          <h2 className="text-2xl font-medium">{t('tickets.createNewTicket')}</h2>
        </div>

        {/* Create Ticket Form */}
        <Card>
          <CardContent className="p-6">
            <form className="space-y-6" onSubmit={handleCreateTicket}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ticket Title */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="title">{t('tickets.ticketTitle')} *</Label>
                  <Input
                    id="title"
                    placeholder={t('tickets.titlePlaceholder')}
                    value={ticketFormData.title}
                    onChange={(e) => setTicketFormData({ ...ticketFormData, title: e.target.value })}
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">{t('tickets.category')} *</Label>
                  <Select
                    value={ticketFormData.category}
                    onValueChange={(value) => setTicketFormData({ ...ticketFormData, category: value })}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder={t('tickets.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">{t('tickets.technical')}</SelectItem>
                      <SelectItem value="HR">{t('tickets.hr')}</SelectItem>
                      <SelectItem value="Payroll">{t('tickets.payroll')}</SelectItem>
                      <SelectItem value="Leave">{t('tickets.leave')}</SelectItem>
                      <SelectItem value="IT Support">{t('tickets.itSupport')}</SelectItem>
                      <SelectItem value="Access Request">{t('tickets.accessRequest')}</SelectItem>
                      <SelectItem value="Training">{t('tickets.training')}</SelectItem>
                      <SelectItem value="Asset">{t('tickets.asset')}</SelectItem>
                      <SelectItem value="Other">{t('tickets.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority">{t('tickets.priority')} *</Label>
                  <Select
                    value={ticketFormData.priority}
                    onValueChange={(value) => setTicketFormData({ ...ticketFormData, priority: value })}
                    required
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder={t('tickets.selectPriority')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">{t('tickets.low')}</SelectItem>
                      <SelectItem value="Medium">{t('tickets.medium')}</SelectItem>
                      <SelectItem value="High">{t('tickets.high')}</SelectItem>
                      <SelectItem value="Critical">{t('tickets.critical')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submitted By */}
                <div className="space-y-2">
                  <Label htmlFor="submittedBy">{t('tickets.submittedByLabel')} *</Label>
                  <Select
                    value={ticketFormData.submittedBy}
                    onValueChange={(value) => setTicketFormData({ ...ticketFormData, submittedBy: value })}
                    required
                  >
                    <SelectTrigger id="submittedBy">
                      <SelectValue placeholder={t('tickets.selectEmployee')} />
                    </SelectTrigger>
                    <SelectContent>
                      {employeesList.slice(0, 10).map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.first_name} {emp.last_name} - {emp.designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assign To */}
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">{t('tickets.assignTo')}</Label>
                  <Select
                    value={ticketFormData.assignedTo}
                    onValueChange={(value) => setTicketFormData({ ...ticketFormData, assignedTo: value })}
                  >
                    <SelectTrigger id="assignedTo">
                      <SelectValue placeholder={t('tickets.selectAssignee')} />
                    </SelectTrigger>
                    <SelectContent>
                      {assignees.map((assignee) => (
                        <SelectItem key={assignee.id} value={assignee.id}>
                          {assignee.name} - {assignee.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label htmlFor="dueDate">{t('tickets.dueDateLabel')}</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={ticketFormData.dueDate}
                    onChange={(e) => setTicketFormData({ ...ticketFormData, dueDate: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">{t('tickets.description')} *</Label>
                  <Textarea
                    id="description"
                    placeholder={t('tickets.descriptionPlaceholder')}
                    value={ticketFormData.description}
                    onChange={(e) => setTicketFormData({ ...ticketFormData, description: e.target.value })}
                    rows={6}
                    required
                  />
                </div>

                {/* Attachments */}
                <div className="md:col-span-2 space-y-2">
                  <Label>{t('tickets.attachments')}</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <Paperclip className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">{t('tickets.clickToUpload')}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('tickets.fileTypes')}</p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setViewMode('list')}
                >
                  {t('tickets.cancel')}
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  {t('tickets.submit')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ticket Details View
  if (viewMode === 'details' && selectedTicket) {
    const relatedComments = comments;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('tickets.backToTickets')}
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl text-gray-900">{selectedTicket.ticketNumber}</h2>
              <Badge className={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority}</Badge>
              <Badge className={getStatusColor(selectedTicket.status)}>{selectedTicket.status}</Badge>
            </div>
            <p className="text-gray-600 mt-1">{selectedTicket.title}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">{t('tickets.assignToMe')}</Button>
            <Select defaultValue={selectedTicket.status}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">{t('tickets.open')}</SelectItem>
                <SelectItem value="In Progress">{t('tickets.inProgress')}</SelectItem>
                <SelectItem value="Waiting on Customer">{t('tickets.waitingOnCustomer')}</SelectItem>
                <SelectItem value="Resolved">{t('tickets.resolved')}</SelectItem>
                <SelectItem value="Closed">{t('tickets.closed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details */}
            <Card>
              <CardHeader>
                <CardTitle>{t('tickets.description')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{selectedTicket.description}</p>
                {(selectedTicket.attachments || 0) > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t">
                    <Paperclip className="w-4 h-4" />
                    <span>{selectedTicket.attachments} {t('tickets.attachments')}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  {(selectedTicket.tags || []).map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-gray-50">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments/Activity */}
            <Card>
              <CardHeader>
                <CardTitle>{t('tickets.commentsActivity')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedComments.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">{t('tickets.noComments')}</p>
                ) : (
                  <div className="space-y-4">
                    {relatedComments.map((comment) => (
                      <div key={comment.id} className={`p-4 rounded-lg ${comment.is_internal ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                        {comment.is_internal && (
                          <Badge className="mb-2 bg-yellow-100 text-yellow-700 border-yellow-200">{t('tickets.internalNote')}</Badge>
                        )}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm">
                              {(comment.userName || 'U').charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{comment.userName}</p>
                              <p className="text-xs text-gray-600">{comment.userRole}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</p>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="pt-4 border-t space-y-3">
                  <Textarea
                    id="new-comment"
                    name="newComment"
                    placeholder={t('tickets.addCommentPlaceholder')}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Paperclip className="w-4 h-4 mr-2" />
                      {t('tickets.attachFile')}
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">{t('tickets.internalNote')}</Button>
                      <Button onClick={handleSubmitComment} className="bg-gradient-to-r from-blue-600 to-indigo-600" size="sm">
                        <Send className="w-4 h-4 mr-2" />
                        {t('tickets.sendReply')}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t('tickets.ticketInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">{t('tickets.submittedBy')}</p>
                  <div className="mt-1">
                    <p className="font-medium text-gray-900">{selectedTicket.submittedByName}</p>
                    <p className="text-sm text-gray-600">{selectedTicket.submittedByRole}</p>
                    <p className="text-sm text-gray-600">{selectedTicket.submittedBy}</p>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">{t('tickets.assignedTo')}</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {selectedTicket.assignedToName || <span className="text-gray-400">{t('tickets.unassigned')}</span>}
                  </p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">{t('tickets.category')}</p>
                  <Badge className="mt-1 bg-indigo-100 text-indigo-700 border-indigo-200">{selectedTicket.category}</Badge>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">{t('tickets.department')}</p>
                  <p className="font-medium text-gray-900 mt-1">{selectedTicket.department}</p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">{t('tickets.created')}</p>
                  <p className="text-gray-900 mt-1">{selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">{t('tickets.lastUpdated')}</p>
                  <p className="text-gray-900 mt-1">{selectedTicket.updatedAt ? new Date(selectedTicket.updatedAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">{t('tickets.dueDate')}</p>
                  <p className="text-gray-900 mt-1">{selectedTicket.dueDate ? new Date(selectedTicket.dueDate).toLocaleString() : 'N/A'}</p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">{t('tickets.slaStatus')}</p>
                  <p className={`font-medium mt-1 ${getSLAColor(selectedTicket.slaStatus || 'On Time')}`}>{selectedTicket.slaStatus || 'On Time'}</p>
                </div>
                {selectedTicket.responseTime && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600">{t('tickets.responseTime')}</p>
                    <p className="text-gray-900 mt-1">{selectedTicket.responseTime}</p>
                  </div>
                )}
                {selectedTicket.resolutionTime && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600">{t('tickets.resolutionTime')}</p>
                    <p className="text-gray-900 mt-1">{selectedTicket.resolutionTime}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('tickets.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  {t('tickets.reassignTicket')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  {t('tickets.changeDueDate')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Tag className="w-4 h-4 mr-2" />
                  {t('tickets.editTags')}
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {t('tickets.escalateTicket')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main Tickets List View
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl text-gray-900">{t('tickets.title')}</h2>
          <p className="text-gray-600 mt-1">{t('tickets.subtitle')}</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => setViewMode('create')}>
          <Plus className="w-4 h-4 mr-2" />
          {t('tickets.createTicket')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('tickets.totalTickets')}
          value={ticketStats.totalTickets}
          subtitle={t('tickets.allTime')}
          icon={TicketIcon}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-500"
          borderColor="border-t-blue-500"
          trendColor="text-green-600"
          variant="default"
        />

        <StatCard
          title={t('tickets.openTickets')}
          value={ticketStats.openTickets}
          subtitle={`${ticketStats.inProgressTickets} ${t('tickets.inProgress')}`}
          icon={Clock}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-500"
          borderColor="border-t-yellow-500"
          trendColor="text-orange-600"
          variant="default"
        />

        <StatCard
          title={t('tickets.resolvedTickets')}
          value={ticketStats.resolvedTickets}
          subtitle={t('tickets.thisMonth')}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-500"
          borderColor="border-t-green-500"
          trendColor="text-green-600"
          variant="default"
        />

        <StatCard
          title={t('tickets.overdueTickets')}
          value={ticketStats.overdueTickets}
          subtitle={t('tickets.needsAttention')}
          icon={AlertCircle}
          iconColor="text-red-600"
          iconBgColor="bg-red-500"
          borderColor="border-t-red-500"
          trendColor="text-red-600"
          variant="default"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="all">{t('tickets.allTickets')}</TabsTrigger>
          <TabsTrigger value="team">{t('tickets.teamPerformance')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('tickets.analytics')}</TabsTrigger>
          <TabsTrigger value="sla">{t('tickets.slaTracking')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={t('tickets.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('tickets.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('tickets.allStatus')}</SelectItem>
                    <SelectItem value="Open">{t('tickets.open')}</SelectItem>
                    <SelectItem value="In Progress">{t('tickets.inProgress')}</SelectItem>
                    <SelectItem value="Waiting on Customer">{t('tickets.waitingOnCustomer')}</SelectItem>
                    <SelectItem value="Resolved">{t('tickets.resolved')}</SelectItem>
                    <SelectItem value="Closed">{t('tickets.closed')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('tickets.priority')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('tickets.allPriorities')}</SelectItem>
                    <SelectItem value="Critical">{t('tickets.critical')}</SelectItem>
                    <SelectItem value="High">{t('tickets.high')}</SelectItem>
                    <SelectItem value="Medium">{t('tickets.medium')}</SelectItem>
                    <SelectItem value="Low">{t('tickets.low')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('tickets.category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('tickets.allCategories')}</SelectItem>
                    <SelectItem value="Technical">{t('tickets.technical')}</SelectItem>
                    <SelectItem value="HR">{t('tickets.hr')}</SelectItem>
                    <SelectItem value="Payroll">{t('tickets.payroll')}</SelectItem>
                    <SelectItem value="Leave">{t('tickets.leave')}</SelectItem>
                    <SelectItem value="IT Support">{t('tickets.itSupport')}</SelectItem>
                    <SelectItem value="Access Request">{t('tickets.accessRequest')}</SelectItem>
                    <SelectItem value="Training">{t('tickets.training')}</SelectItem>
                    <SelectItem value="Asset">{t('tickets.asset')}</SelectItem>
                    <SelectItem value="Other">{t('tickets.other')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2" onClick={handleExport}>
                  <Download className="w-4 h-4" />
                  {t('tickets.export')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tickets Table */}
          <DataTable
            columns={tableColumns}
            data={paginatedTickets}
            emptyMessage={t('tickets.noTicketsFound')}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tickets.teamMembersAssignments')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignees.map((assignee) => (
                  <div key={assignee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white">
                        {assignee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{assignee.name}</p>
                        <p className="text-sm text-gray-600">{assignee.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-medium text-gray-900">{assignee.activeTickets}</p>
                      <p className="text-sm text-gray-600">{t('tickets.activeTickets')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{t('tickets.ticketsByCategory')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ticketCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ticketCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{t('tickets.ticketsByPriority')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ticketPriorityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ticketPriorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{t('tickets.ticketTrend')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ticketTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} name={t('tickets.createdLabel')} />
                  <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name={t('tickets.resolved')} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sla" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{t('tickets.avgResponseTime')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-medium text-blue-600">{ticketStats.avgResponseTime}</p>
                <p className="text-sm text-gray-600 mt-2">{t('tickets.targetResponseTime')}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{t('tickets.avgResolutionTime')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-medium text-green-600">{ticketStats.avgResolutionTime}</p>
                <p className="text-sm text-gray-600 mt-2">{t('tickets.targetResolutionTime')}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{t('tickets.customerSatisfaction')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-medium text-purple-600">{ticketStats.satisfactionRate}%</p>
                <p className="text-sm text-gray-600 mt-2">{t('tickets.basedOnFeedback')}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('tickets.slaComplianceOverview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-700">{t('tickets.onTime')}</p>
                    <p className="text-sm text-gray-600">{t('tickets.meetingSLA')}</p>
                  </div>
                  <p className="text-2xl font-medium text-green-700">195 {t('tickets.ticketsCount')}</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-700">{t('tickets.dueSoon')}</p>
                    <p className="text-sm text-gray-600">{t('tickets.slaExpires')}</p>
                  </div>
                  <p className="text-2xl font-medium text-yellow-700">28 {t('tickets.ticketsCount')}</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-700">{t('tickets.overdue')}</p>
                    <p className="text-sm text-gray-600">{t('tickets.slaBreached')}</p>
                  </div>
                  <p className="text-2xl font-medium text-red-700">8 {t('tickets.ticketsCount')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}