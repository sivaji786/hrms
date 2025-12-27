import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Save, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import toast from '../utils/toast';
import Breadcrumbs from './Breadcrumbs';

interface AddNewShiftProps {
  onBack: () => void;
  onSave: (shiftData: any) => void;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AddNewShift({ onBack, onSave }: AddNewShiftProps) {
  const { t } = useLanguage();

  const [shiftData, setShiftData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    totalHours: 0,
    breakMinutes: 0,
    workDays: [] as string[],
    status: 'Active',
  });

  const handleDayToggle = (day: string) => {
    setShiftData(prev => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter(d => d !== day)
        : [...prev.workDays, day]
    }));
  };

  const calculateTotalHours = (start: string, end: string, breakMins: number) => {
    if (!start || !end) return 0;
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin) - breakMins;
    return Math.round((totalMinutes / 60) * 10) / 10;
  };

  const handleSubmit = () => {
    if (!shiftData.name || !shiftData.startTime || !shiftData.endTime) {
      toast.error(t('shifts.fillAllRequiredFields'));
      return;
    }
    if (shiftData.workDays.length === 0) {
      toast.error(t('shifts.selectAtLeastOneWorkingDay'));
      return;
    }

    const totalHours = calculateTotalHours(shiftData.startTime, shiftData.endTime, shiftData.breakMinutes);
    const newShift = {
      ...shiftData,
      totalHours,
      id: `SH${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      employeeCount: 0,
    };

    onSave(newShift);
    toast.success(t('shifts.shiftCreatedSuccessfully'));
    onBack();
  };

  const breadcrumbItems = [
    { label: t('nav.dashboard'), href: '#' },
    { label: t('nav.shifts'), href: '#' },
    { label: t('shifts.createNewShift') },
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
          <h1 className="text-3xl">{t('shifts.createNewShift')}</h1>
          <p className="text-gray-600 mt-1">{t('shifts.createNewShiftDescription')}</p>
        </div>
      </div>

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t('shifts.shiftDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="shiftName">{t('shifts.shiftName')} *</Label>
              <Input
                id="shiftName"
                placeholder={t('shifts.shiftNamePlaceholder')}
                value={shiftData.name}
                onChange={(e) => setShiftData({ ...shiftData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t('shifts.status')}</Label>
              <Select
                value={shiftData.status}
                onValueChange={(value) => setShiftData({ ...shiftData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">{t('shifts.active')}</SelectItem>
                  <SelectItem value="Inactive">{t('shifts.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">{t('shifts.startTime')} *</Label>
              <Input
                id="startTime"
                type="time"
                value={shiftData.startTime}
                onChange={(e) => {
                  const newStartTime = e.target.value;
                  setShiftData(prev => ({
                    ...prev,
                    startTime: newStartTime,
                    totalHours: calculateTotalHours(newStartTime, prev.endTime, prev.breakMinutes)
                  }));
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">{t('shifts.endTime')} *</Label>
              <Input
                id="endTime"
                type="time"
                value={shiftData.endTime}
                onChange={(e) => {
                  const newEndTime = e.target.value;
                  setShiftData(prev => ({
                    ...prev,
                    endTime: newEndTime,
                    totalHours: calculateTotalHours(prev.startTime, newEndTime, prev.breakMinutes)
                  }));
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="breakMinutes">{t('shifts.breakTime')} ({t('shifts.minutes')})</Label>
              <Input
                id="breakMinutes"
                type="number"
                min="0"
                placeholder="0"
                value={shiftData.breakMinutes || ''}
                onChange={(e) => {
                  const breakMins = parseInt(e.target.value) || 0;
                  setShiftData(prev => ({
                    ...prev,
                    breakMinutes: breakMins,
                    totalHours: calculateTotalHours(prev.startTime, prev.endTime, breakMins)
                  }));
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalHours">{t('shifts.totalHours')}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="totalHours"
                  type="number"
                  step="0.1"
                  value={shiftData.totalHours || calculateTotalHours(shiftData.startTime, shiftData.endTime, shiftData.breakMinutes)}
                  disabled
                  className="bg-gray-50"
                />
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>{t('shifts.workingDays')} *</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${shiftData.workDays.includes(day)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300'
                    }`}
                >
                  {day}
                </button>
              ))}
            </div>
            {shiftData.workDays.length > 0 && (
              <p className="text-sm text-gray-600">
                {t('shifts.selectedDays')}: {shiftData.workDays.join(', ')}
              </p>
            )}
          </div>

          {shiftData.startTime && shiftData.endTime && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">{t('shifts.shiftSummary')}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">{t('shifts.shiftTiming')}</p>
                  <p className="font-medium text-blue-900">{shiftData.startTime} - {shiftData.endTime}</p>
                </div>
                <div>
                  <p className="text-blue-700">{t('shifts.totalWorkingHours')}</p>
                  <p className="font-medium text-blue-900">
                    {calculateTotalHours(shiftData.startTime, shiftData.endTime, shiftData.breakMinutes)} {t('shifts.hours')}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700">{t('shifts.breakTime')}</p>
                  <p className="font-medium text-blue-900">{shiftData.breakMinutes} {t('shifts.minutes')}</p>
                </div>
                <div>
                  <p className="text-blue-700">{t('shifts.workingDaysCount')}</p>
                  <p className="font-medium text-blue-900">{shiftData.workDays.length} {t('shifts.days')}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          {t('common.cancel')}
        </Button>
        <Button
          className="bg-gradient-to-r from-green-600 to-emerald-600"
          onClick={handleSubmit}
        >
          <Save className="w-4 h-4 mr-2" />
          {t('shifts.saveShift')}
        </Button>
      </div>
    </div>
  );
}
