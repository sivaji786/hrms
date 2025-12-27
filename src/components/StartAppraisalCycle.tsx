import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Target, Users, Calendar, ArrowLeft, FileText, CheckCircle } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import { employees } from '../data/employeeData';
import toast from '../utils/toast';
import { useLanguage } from '../contexts/LanguageContext';

interface StartAppraisalCycleProps {
  onBack: () => void;
}

export default function StartAppraisalCycle({ onBack }: StartAppraisalCycleProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [cycleName, setCycleName] = useState('');
  const [cycleType, setCycleType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selfAppraisalDeadline, setSelfAppraisalDeadline] = useState('');
  const [managerAppraisalDeadline, setManagerAppraisalDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // Rating parameters
  const [enableSelfRating, setEnableSelfRating] = useState(true);
  const [enableManagerRating, setEnableManagerRating] = useState(true);
  const [enable360Feedback, setEnable360Feedback] = useState(false);
  const [ratingScale, setRatingScale] = useState('5');

  const handleEmployeeToggle = (empId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(empId)
        ? prev.filter(id => id !== empId)
        : [...prev, empId]
    );
  };

  const validateStep1 = () => {
    if (!cycleName || !cycleType || !startDate || !endDate) {
      toast.error(t('performance.fillAllRequiredFields'));
      return false;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      toast.error(t('performance.endDateMustBeAfterStartDate'));
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (selectedEmployees.length === 0) {
      toast.error(t('performance.selectAtLeastOneEmployee'));
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!selfAppraisalDeadline || !managerAppraisalDeadline) {
      toast.error(t('performance.fillAllDeadlines'));
      return false;
    }
    if (new Date(selfAppraisalDeadline) < new Date(startDate)) {
      toast.error(t('performance.selfAppraisalDeadlineInvalid'));
      return false;
    }
    if (new Date(managerAppraisalDeadline) < new Date(selfAppraisalDeadline)) {
      toast.error(t('performance.managerAppraisalDeadlineInvalid'));
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    if (!validateStep3()) return;

    toast.success(t('performance.appraisalCycleStarted'));

    // Simulate API call
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  const breadcrumbItems = [
    { label: t('nav.dashboard'), href: '#' },
    { label: t('nav.performance'), href: '#' },
    { label: t('performance.startNewAppraisalCycle') },
  ];

  const steps = [
    { number: 1, title: t('performance.cycleDetails'), icon: FileText },
    { number: 2, title: t('performance.selectParticipants'), icon: Users },
    { number: 3, title: t('performance.configureSettings'), icon: Target },
    { number: 4, title: t('performance.reviewAndLaunch'), icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
          <h1 className="text-3xl">{t('performance.startNewAppraisalCycle')}</h1>
          <p className="text-gray-600 mt-1">{t('performance.startNewAppraisalCycleDescription')}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${currentStep >= step.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <p className={`text-sm mt-2 text-center ${currentStep >= step.number ? 'text-blue-600 font-medium' : 'text-gray-500'
                    }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Cycle Details */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('performance.cycleDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cycleName">{t('performance.cycleName')} *</Label>
                <Input
                  id="cycleName"
                  placeholder={t('performance.cycleNamePlaceholder')}
                  value={cycleName}
                  onChange={(e) => setCycleName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cycleType">{t('performance.cycleType')} *</Label>
                <Select value={cycleType} onValueChange={setCycleType}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('performance.selectCycleType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quarterly">{t('performance.quarterly')}</SelectItem>
                    <SelectItem value="halfYearly">{t('performance.halfYearly')}</SelectItem>
                    <SelectItem value="annual">{t('performance.annual')}</SelectItem>
                    <SelectItem value="probation">{t('performance.probation')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">{t('performance.startDate')} *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">{t('performance.endDate')} *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('performance.description')}</Label>
              <Textarea
                id="description"
                placeholder={t('performance.descriptionPlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Participants */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('performance.selectParticipants')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${selectedEmployees.includes(emp.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => handleEmployeeToggle(emp.id)}
                >
                  <Checkbox
                    checked={selectedEmployees.includes(emp.id)}
                    onCheckedChange={() => handleEmployeeToggle(emp.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{emp.name}</p>
                    <p className="text-xs text-gray-500">{emp.id} • {emp.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Configure Settings */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.appraisalDeadlines')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="selfAppraisalDeadline">{t('performance.selfAppraisalDeadline')} *</Label>
                  <Input
                    id="selfAppraisalDeadline"
                    type="date"
                    value={selfAppraisalDeadline}
                    onChange={(e) => setSelfAppraisalDeadline(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="managerAppraisalDeadline">{t('performance.managerAppraisalDeadline')} *</Label>
                  <Input
                    id="managerAppraisalDeadline"
                    type="date"
                    value={managerAppraisalDeadline}
                    onChange={(e) => setManagerAppraisalDeadline(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('performance.ratingConfiguration')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="enableSelfRating">{t('performance.enableSelfRating')}</Label>
                    <p className="text-sm text-gray-600">{t('performance.enableSelfRatingDesc')}</p>
                  </div>
                  <Checkbox
                    id="enableSelfRating"
                    checked={enableSelfRating}
                    onCheckedChange={(c) => setEnableSelfRating(c === true)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="enableManagerRating">{t('performance.enableManagerRating')}</Label>
                    <p className="text-sm text-gray-600">{t('performance.enableManagerRatingDesc')}</p>
                  </div>
                  <Checkbox
                    id="enableManagerRating"
                    checked={enableManagerRating}
                    onCheckedChange={(c) => setEnableManagerRating(c === true)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="enable360Feedback">{t('performance.enable360Feedback')}</Label>
                    <p className="text-sm text-gray-600">{t('performance.enable360FeedbackDesc')}</p>
                  </div>
                  <Checkbox
                    id="enable360Feedback"
                    checked={enable360Feedback}
                    onCheckedChange={(c) => setEnable360Feedback(c === true)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratingScale">{t('performance.ratingScale')}</Label>
                <Select value={ratingScale} onValueChange={setRatingScale}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">{t('performance.threePointScale')}</SelectItem>
                    <SelectItem value="5">{t('performance.fivePointScale')}</SelectItem>
                    <SelectItem value="10">{t('performance.tenPointScale')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 4: Review and Launch */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('performance.reviewAndLaunch')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">{t('performance.cycleName')}</p>
                  <p className="font-medium">{cycleName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('performance.cycleType')}</p>
                  <p className="font-medium">{cycleType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('performance.duration')}</p>
                  <p className="font-medium">{startDate} {t('common.to')} {endDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('performance.participants')}</p>
                  <p className="font-medium">{selectedEmployees.length} {t('common.employees')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">{t('performance.selfAppraisalDeadline')}</p>
                  <p className="font-medium">{selfAppraisalDeadline}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('performance.managerAppraisalDeadline')}</p>
                  <p className="font-medium">{managerAppraisalDeadline}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('performance.ratingScale')}</p>
                  <p className="font-medium">{ratingScale} {t('performance.points')}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">{t('performance.enabledFeatures')}</h4>
              <ul className="space-y-1">
                {enableSelfRating && (
                  <li className="text-sm text-blue-700">✓ {t('performance.selfRatingEnabled')}</li>
                )}
                {enableManagerRating && (
                  <li className="text-sm text-blue-700">✓ {t('performance.managerRatingEnabled')}</li>
                )}
                {enable360Feedback && (
                  <li className="text-sm text-blue-700">✓ {t('performance.feedback360Enabled')}</li>
                )}
              </ul>
            </div>

            {description && (
              <div>
                <p className="text-sm text-gray-600 mb-2">{t('performance.description')}</p>
                <p className="text-sm bg-gray-50 p-3 rounded border">{description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <div>
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              {t('common.previous')}
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            {t('common.cancel')}
          </Button>
          {currentStep < 4 ? (
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
              onClick={handleNext}
            >
              {t('common.next')}
            </Button>
          ) : (
            <Button
              className="bg-gradient-to-r from-green-600 to-emerald-600"
              onClick={handleSubmit}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {t('performance.launchAppraisalCycle')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}