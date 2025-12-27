import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import toast from '../../utils/toast';
import { t } from 'i18next';
import { CurrencyDisplay } from '../common';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle,
  Circle,
  AlertCircle,
  FileText,
  Key,
  Laptop,
  CreditCard,
  Users,
  MessageSquare,
  Download,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { employeeService } from '../../services/api';
import EmployeeInfoCard from './EmployeeInfoCard';
import { useEffect } from 'react';

interface EmployeeOffboardingProps {
  employeeId: string;
  onBack: () => void;
  onViewProfile: (id: string) => void;
  onEdit: (id: string) => void;
  onViewAttendance: (id: string) => void;
  onViewPayroll: (id: string) => void;
  onOffboard: (id: string) => void;
}

interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  description: string;
  completed: boolean;
  assignedTo: string;
  dueDate: string;
}

export default function EmployeeOffboarding({
  employeeId,
  onBack,
  onViewProfile,
  onEdit,
  onViewAttendance,
  onViewPayroll,
  onOffboard,
}: EmployeeOffboardingProps) {
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await employeeService.getById(employeeId);
        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee:', error);
        toast.error('Failed to load employee details');
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId]);
  const [offboardingData, setOffboardingData] = useState({
    lastWorkingDay: '',
    reason: '',
    reasonCategory: 'Resignation',
    noticePeriod: '30',
    eligibleForRehire: 'yes',
    exitInterviewDate: '',
    finalSettlement: '',
    comments: '',
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: '1',
      category: 'Documentation',
      task: 'Collect resignation letter',
      description: 'Obtain signed resignation letter from employee',
      completed: false,
      assignedTo: 'HR Team',
      dueDate: '2025-11-20',
    },
    {
      id: '2',
      category: 'Documentation',
      task: 'Exit interview form',
      description: 'Schedule and complete exit interview',
      completed: false,
      assignedTo: 'HR Manager',
      dueDate: '2025-11-22',
    },
    {
      id: '3',
      category: 'Documentation',
      task: 'Issue relieving letter',
      description: 'Prepare and provide relieving letter',
      completed: false,
      assignedTo: 'HR Team',
      dueDate: '2025-11-30',
    },
    {
      id: '4',
      category: 'Documentation',
      task: 'Experience certificate',
      description: 'Prepare experience certificate',
      completed: false,
      assignedTo: 'HR Team',
      dueDate: '2025-11-30',
    },
    {
      id: '5',
      category: 'IT & Access',
      task: 'Revoke system access',
      description: 'Disable all system logins and accounts',
      completed: false,
      assignedTo: 'IT Team',
      dueDate: '2025-11-30',
    },
    {
      id: '6',
      category: 'IT & Access',
      task: 'Collect laptop & accessories',
      description: 'Return company laptop, mouse, keyboard, etc.',
      completed: false,
      assignedTo: 'IT Team',
      dueDate: '2025-11-30',
    },
    {
      id: '7',
      category: 'IT & Access',
      task: 'Collect ID card & access card',
      description: 'Return company ID and access cards',
      completed: false,
      assignedTo: 'Security',
      dueDate: '2025-11-30',
    },
    {
      id: '8',
      category: 'IT & Access',
      task: 'Return mobile phone',
      description: 'Return company-issued mobile phone if applicable',
      completed: false,
      assignedTo: 'IT Team',
      dueDate: '2025-11-30',
    },
    {
      id: '9',
      category: 'Finance',
      task: 'Final salary settlement',
      description: 'Process final salary and pending dues',
      completed: false,
      assignedTo: 'Finance Team',
      dueDate: '2025-12-05',
    },
    {
      id: '10',
      category: 'Finance',
      task: 'Leave encashment',
      description: 'Calculate and process leave encashment',
      completed: false,
      assignedTo: 'Finance Team',
      dueDate: '2025-12-05',
    },
    {
      id: '11',
      category: 'Finance',
      task: 'PF settlement',
      description: 'Process PF withdrawal and settlement',
      completed: false,
      assignedTo: 'Finance Team',
      dueDate: '2025-12-10',
    },
    {
      id: '12',
      category: 'Finance',
      task: 'Gratuity payment',
      description: 'Calculate and process gratuity if applicable',
      completed: false,
      assignedTo: 'Finance Team',
      dueDate: '2025-12-10',
    },
    {
      id: '13',
      category: 'Knowledge Transfer',
      task: 'Handover documentation',
      description: 'Document current tasks and responsibilities',
      completed: false,
      assignedTo: 'Employee',
      dueDate: '2025-11-28',
    },
    {
      id: '14',
      category: 'Knowledge Transfer',
      task: 'Training replacement',
      description: 'Train replacement or team members',
      completed: false,
      assignedTo: 'Manager',
      dueDate: '2025-11-29',
    },
    {
      id: '15',
      category: 'Knowledge Transfer',
      task: 'Transfer project ownership',
      description: 'Hand over all ongoing projects',
      completed: false,
      assignedTo: 'Manager',
      dueDate: '2025-11-29',
    },
    {
      id: '16',
      category: 'Other',
      task: 'Remove from mailing lists',
      description: 'Remove from all email distribution lists',
      completed: false,
      assignedTo: 'IT Team',
      dueDate: '2025-11-30',
    },
    {
      id: '17',
      category: 'Other',
      task: 'Update organizational chart',
      description: 'Update org chart and team structure',
      completed: false,
      assignedTo: 'HR Team',
      dueDate: '2025-12-01',
    },
    {
      id: '18',
      category: 'Other',
      task: 'Non-disclosure agreement reminder',
      description: 'Remind about NDA and confidentiality obligations',
      completed: false,
      assignedTo: 'HR Team',
      dueDate: '2025-11-30',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'details' | 'checklist' | 'documents'>('details');

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500">Employee not found</p>
        <Button onClick={onBack} className="mt-4">
          Back to List
        </Button>
      </div>
    );
  }

  const handleToggleTask = (taskId: string) => {
    setChecklist(checklist.map(item =>
      item.id === taskId ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleSubmitOffboarding = () => {
    toast.success(t('employees.offboardingInitiated'), {
      employeeId,
      ...offboardingData,
      checklist: checklist.filter(item => item.completed).map(item => item.id),
    });
  };

  const completedTasks = checklist.filter(item => item.completed).length;
  const totalTasks = checklist.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  const categorizedChecklist = checklist.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Documentation':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'IT & Access':
        return <Key className="w-5 h-5 text-purple-600" />;
      case 'Finance':
        return <CreditCard className="w-5 h-5 text-green-600" />;
      case 'Knowledge Transfer':
        return <Users className="w-5 h-5 text-orange-600" />;
      case 'Other':
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryProgress = (category: string) => {
    const items = categorizedChecklist[category];
    const completed = items.filter(item => item.completed).length;
    return (completed / items.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          <div>
            <h1 className="text-3xl font-medium text-gray-900">Employee Offboarding</h1>
            <p className="text-gray-600 mt-1">Manage the complete offboarding process</p>
          </div>
        </div>
        <Badge className="bg-orange-100 text-orange-700 border-orange-200 px-4 py-2">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Offboarding Process
        </Badge>
      </div>

      {/* Employee Info Card */}
      <EmployeeInfoCard
        employee={{
          id: employee.id,
          name: `${employee.first_name} ${employee.last_name}`,
          role: employee.designation || 'N/A',
          status: employee.status || 'Active',
          department: employee.department_name || employee.department_id || 'N/A',
          employeeCode: employee.employee_code,
        }}
        currentView="offboard"
        onViewProfile={onViewProfile}
        onEdit={onEdit}
        onViewAttendance={onViewAttendance}
        onViewPayroll={onViewPayroll}
        onOffboard={onOffboard}
      />

      {/* Progress Overview */}
      <Card className="border-l-4 border-l-orange-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Offboarding Progress</h3>
              <p className="text-sm text-gray-600 mt-1">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-medium text-orange-600">{Math.round(progressPercentage)}%</div>
              <p className="text-sm text-gray-600">Complete</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-6 py-3 font-medium transition-colors ${activeTab === 'details'
            ? 'text-orange-600 border-b-2 border-orange-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Offboarding Details
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-6 py-3 font-medium transition-colors ${activeTab === 'checklist'
            ? 'text-orange-600 border-b-2 border-orange-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          <CheckCircle className="w-4 h-4 inline mr-2" />
          Exit Checklist ({completedTasks}/{totalTasks})
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-6 py-3 font-medium transition-colors ${activeTab === 'documents'
            ? 'text-orange-600 border-b-2 border-orange-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          <Download className="w-4 h-4 inline mr-2" />
          Documents & Reports
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle>Offboarding Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="lastWorkingDay">Last Working Day *</Label>
                <Input
                  id="lastWorkingDay"
                  type="date"
                  value={offboardingData.lastWorkingDay}
                  onChange={(e) => setOffboardingData({ ...offboardingData, lastWorkingDay: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exitInterviewDate">Exit Interview Date</Label>
                <Input
                  id="exitInterviewDate"
                  type="date"
                  value={offboardingData.exitInterviewDate}
                  onChange={(e) => setOffboardingData({ ...offboardingData, exitInterviewDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reasonCategory">Reason Category *</Label>
                <Select
                  value={offboardingData.reasonCategory}
                  onValueChange={(value) => setOffboardingData({ ...offboardingData, reasonCategory: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Resignation">Resignation</SelectItem>
                    <SelectItem value="Retirement">Retirement</SelectItem>
                    <SelectItem value="Termination">Termination</SelectItem>
                    <SelectItem value="End of Contract">End of Contract</SelectItem>
                    <SelectItem value="Layoff">Layoff</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="noticePeriod">Notice Period (Days)</Label>
                <Select
                  value={offboardingData.noticePeriod}
                  onValueChange={(value) => setOffboardingData({ ...offboardingData, noticePeriod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Immediate</SelectItem>
                    <SelectItem value="15">15 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="60">60 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leaving *</Label>
              <Textarea
                id="reason"
                placeholder="Enter detailed reason for leaving..."
                value={offboardingData.reason}
                onChange={(e) => setOffboardingData({ ...offboardingData, reason: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="eligibleForRehire">Eligible for Rehire?</Label>
                <Select
                  value={offboardingData.eligibleForRehire}
                  onValueChange={(value) => setOffboardingData({ ...offboardingData, eligibleForRehire: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="conditional">Conditional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="finalSettlement">Final Settlement Amount</Label>
                <Input
                  id="finalSettlement"
                  type="text"
                  placeholder="0"
                  value={offboardingData.finalSettlement}
                  onChange={(e) => setOffboardingData({ ...offboardingData, finalSettlement: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Additional Comments</Label>
              <Textarea
                id="comments"
                placeholder="Any additional notes or comments..."
                value={offboardingData.comments}
                onChange={(e) => setOffboardingData({ ...offboardingData, comments: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onBack}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitOffboarding}
                className="bg-gradient-to-r from-orange-600 to-red-600"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Initiate Offboarding
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'checklist' && (
        <div className="space-y-6">
          {/* Category Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.keys(categorizedChecklist).map((category) => {
              const items = categorizedChecklist[category];
              const completed = items.filter(item => item.completed).length;
              const progress = getCategoryProgress(category);

              return (
                <Card key={category} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {getCategoryIcon(category)}
                      <h4 className="font-medium text-gray-900">{category}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{completed}/{items.length}</span>
                        <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Checklist Items */}
          {Object.keys(categorizedChecklist).map((category) => (
            <Card key={category}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {getCategoryIcon(category)}
                  <div className="flex-1">
                    <CardTitle>{category}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {categorizedChecklist[category].filter(item => item.completed).length} of{' '}
                      {categorizedChecklist[category].length} tasks completed
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {categorizedChecklist[category].map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-orange-200'
                      }`}
                  >
                    <Checkbox
                      id={item.id}
                      checked={item.completed}
                      onCheckedChange={() => handleToggleTask(item.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={item.id}
                        className={`font-medium cursor-pointer ${item.completed ? 'text-green-700 line-through' : 'text-gray-900'
                          }`}
                      >
                        {item.task}
                      </label>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <User className="w-4 h-4" />
                          {item.assignedTo}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {item.completed && (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Resignation Letter', status: 'Pending', color: 'yellow' },
                { name: 'Exit Interview Form', status: 'Pending', color: 'yellow' },
                { name: 'Asset Return Form', status: 'Not Started', color: 'gray' },
                { name: 'Knowledge Transfer Document', status: 'Not Started', color: 'gray' },
                { name: 'NDA Reminder', status: 'Not Started', color: 'gray' },
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{doc.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        doc.color === 'yellow'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }
                    >
                      {doc.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-green-600" />
                Generated Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Relieving Letter', status: 'Ready', color: 'green' },
                { name: 'Experience Certificate', status: 'Ready', color: 'green' },
                { name: 'Full & Final Settlement', status: 'Processing', color: 'yellow' },
                { name: 'Form 16', status: 'Processing', color: 'yellow' },
                { name: 'PF Settlement Letter', status: 'Not Generated', color: 'gray' },
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{doc.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        doc.color === 'green'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : doc.color === 'yellow'
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                      }
                    >
                      {doc.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={doc.color === 'gray'}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}