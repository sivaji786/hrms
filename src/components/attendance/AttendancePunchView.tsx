import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Clock, Plus, Trash2, Save, X } from 'lucide-react';
import { AttendancePunch } from '../../utils/attendanceCalculations';
import toast from '../../utils/toast';

interface AttendancePunchViewProps {
  punches: AttendancePunch[];
  onPunchesChange: (punches: AttendancePunch[]) => void;
  readonly?: boolean;
}

export default function AttendancePunchView({
  punches,
  onPunchesChange,
  readonly = false
}: AttendancePunchViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPunches, setEditedPunches] = useState<AttendancePunch[]>([]);

  const handleStartEdit = () => {
    setEditedPunches([...punches]);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedPunches([]);
    setIsEditing(false);
  };

  const parseTime = (timeStr: string): number | null => {
    // Try to parse time string to minutes from midnight
    try {
      const date = new Date(`2000-01-01 ${timeStr}`);
      if (isNaN(date.getTime())) return null;
      return date.getHours() * 60 + date.getMinutes();
    } catch (e) {
      return null;
    }
  };

  const formatTimeForInput = (timeStr: string): string => {
    if (!timeStr) return '';
    try {
      // If it's already in HH:MM format (24h), return it
      if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;

      // If it's HH:MM:SS, return HH:MM
      if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) return timeStr.substring(0, 5);

      // Try to parse other formats (like AM/PM)
      const date = new Date(`2000-01-01 ${timeStr}`);
      if (isNaN(date.getTime())) return '';

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (e) {
      return '';
    }
  };

  const handleSaveEdit = () => {
    // 1. Check for empty fields
    for (const punch of editedPunches) {
      if (!punch.time || punch.time.trim() === '' || punch.time === '-') {
        toast.error('Invalid time entry', {
          description: 'Please enter valid time for all punches',
        });
        return;
      }
    }

    // 2. Check for valid time format and chronological order
    let previousTime = -1;
    for (let i = 0; i < editedPunches.length; i++) {
      const punch = editedPunches[i];
      const timeValue = parseTime(punch.time);

      if (timeValue === null) {
        toast.error(`Invalid time format at row ${i + 1}`, {
          description: 'Use HH:MM AM/PM or HH:MM:SS format',
        });
        return;
      }

      if (timeValue <= previousTime) {
        toast.error(`Chronological error at row ${i + 1}`, {
          description: 'Punch time must be later than the previous punch',
        });
        return;
      }
      previousTime = timeValue;
    }

    // 3. Check for logical order (In -> Out -> In -> Out)
    for (let i = 0; i < editedPunches.length; i++) {
      const expectedType = i % 2 === 0 ? 'in' : 'out';
      if (editedPunches[i].type !== expectedType) {
        toast.error(`Invalid punch sequence at row ${i + 1}`, {
          description: `Expected ${expectedType.toUpperCase()} but found ${editedPunches[i].type.toUpperCase()}. Punches must alternate IN -> OUT.`,
        });
        return;
      }
    }

    onPunchesChange(editedPunches);
    setIsEditing(false);
    toast.success('Attendance punches updated successfully');
  };

  const handleAddPunch = () => {
    const newPunch: AttendancePunch = {
      time: '',
      type: editedPunches.length % 2 === 0 ? 'in' : 'out',
    };
    setEditedPunches([...editedPunches, newPunch]);
  };

  const handleRemovePunch = (index: number) => {
    setEditedPunches(editedPunches.filter((_, i) => i !== index));
  };

  const handlePunchChange = (index: number, field: keyof AttendancePunch, value: string) => {
    const updated = [...editedPunches];
    if (field === 'type') {
      updated[index] = { ...updated[index], [field]: value as 'in' | 'out' };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setEditedPunches(updated);
  };

  const displayPunches = isEditing ? editedPunches : punches;

  if (displayPunches.length === 0 && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-gray-500">
        <Clock className="h-8 w-8 mb-2 text-gray-400" />
        <p className="text-sm">No attendance punches recorded</p>
        {!readonly && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleStartEdit}
            className="mt-2"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Punch
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Attendance Punches</h4>
        {!readonly && !isEditing && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleStartEdit}
            className="h-7 text-xs"
          >
            Edit Punches
          </Button>
        )}
        {isEditing && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleSaveEdit}
              className="h-7 text-xs bg-green-600 hover:bg-green-700"
            >
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelEdit}
              className="h-7 text-xs"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {displayPunches.map((punch, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex-shrink-0">
              <Badge
                className={
                  punch.type === 'in'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-blue-100 text-blue-700 border-blue-200'
                }
              >
                {punch.type === 'in' ? 'IN' : 'OUT'}
              </Badge>
            </div>

            {isEditing ? (
              <>
                <Input
                  type="time"
                  value={formatTimeForInput(punch.time)}
                  onChange={(e) => handlePunchChange(index, 'time', e.target.value)}
                  className="h-8 text-sm flex-1"
                />
                <select
                  value={punch.type}
                  onChange={(e) => handlePunchChange(index, 'type', e.target.value)}
                  className="h-8 px-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="in">Check In</option>
                  <option value="out">Check Out</option>
                </select>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemovePunch(index)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">{formatTimeForInput(punch.time)}</span>
              </div>
            )}
          </div>
        ))}

        {isEditing && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddPunch}
            className="w-full h-8 text-xs border-dashed"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Punch Entry
          </Button>
        )}
      </div>
    </div>
  );
}
