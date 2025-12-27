import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Plane, MapPin, Calendar } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import { useCurrency } from '../contexts/CurrencyContext';
import { CurrencyDisplay } from './common';
import toast from '../utils/toast';

interface RequestTravelProps {
  onBack: () => void;
}

export default function RequestTravel({ onBack }: RequestTravelProps) {
  const { formatCurrency, convertAmount } = useCurrency();
  const [formData, setFormData] = useState({
    tripType: '',
    purpose: '',
    from: '',
    to: '',
    startDate: '',
    endDate: '',
    travelMode: '',
    estimatedCost: '',
    accommodationRequired: false,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.tripType || !formData.purpose || !formData.from || !formData.to ||
      !formData.startDate || !formData.endDate || !formData.travelMode || !formData.estimatedCost) {
      toast.error('Required Fields Missing', {
        description: 'Please fill in all required fields.'
      });
      return;
    }

    // Validate dates
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error('Invalid Dates', {
        description: 'End date must be after start date.'
      });
      return;
    }

    toast.success('Travel Request Submitted!', {
      description: `Your travel request to ${formData.to} has been submitted for approval.`
    });

    // Reset form and go back
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return days;
    }
    return 0;
  };

  const breadcrumbItems = [
    { label: 'Employee Management', href: '#' },
    { label: 'Expense & Travel', href: '#' },
    { label: 'Request Travel' }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl text-gray-900">Request Travel</h2>
          <p className="text-gray-600 mt-1">Submit a new travel request for approval</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tripType">Trip Type <span className="text-red-500">*</span></Label>
                    <Select value={formData.tripType} onValueChange={(value) => setFormData({ ...formData, tripType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trip type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Domestic">Domestic</SelectItem>
                        <SelectItem value="International">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="travelMode">Travel Mode <span className="text-red-500">*</span></Label>
                    <Select value={formData.travelMode} onValueChange={(value) => setFormData({ ...formData, travelMode: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Flight">Flight</SelectItem>
                        <SelectItem value="Train">Train</SelectItem>
                        <SelectItem value="Bus">Bus</SelectItem>
                        <SelectItem value="Car">Car</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose of Travel <span className="text-red-500">*</span></Label>
                  <Input
                    id="purpose"
                    placeholder="e.g., Client meeting, Conference, Training"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="from"
                        placeholder="Starting location"
                        className="pl-10"
                        value={formData.from}
                        onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to">To <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="to"
                        placeholder="Destination"
                        className="pl-10"
                        value={formData.to}
                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date <span className="text-red-500">*</span></Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Estimated Cost <span className="text-red-500">*</span></Label>
                  <Input
                    id="estimatedCost"
                    type="number"
                    placeholder="Enter estimated cost"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accommodation"
                    checked={formData.accommodationRequired}
                    onCheckedChange={(checked) => setFormData({ ...formData, accommodationRequired: checked as boolean })}
                  />
                  <Label htmlFor="accommodation" className="cursor-pointer">
                    Accommodation required
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information about the trip"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Request Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Plane className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <span className="text-sm text-gray-600">Trip Type</span>
                      <p className="font-medium text-gray-900">{formData.tripType || '-'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pb-2 border-b">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <span className="text-sm text-gray-600">Route</span>
                      <p className="font-medium text-gray-900">
                        {formData.from && formData.to ? `${formData.from} → ${formData.to}` : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <span className="text-sm text-gray-600">Duration</span>
                      <p className="font-medium text-gray-900">
                        {calculateDuration() > 0 ? `${calculateDuration()} day(s)` : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-sm text-gray-600">Travel Mode:</span>
                    <span className="text-sm font-medium text-gray-900">{formData.travelMode || '-'}</span>
                  </div>

                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-sm text-gray-600">Accommodation:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formData.accommodationRequired ? 'Required' : 'Not Required'}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2">
                    <span className="font-medium text-gray-900">Estimated Cost:</span>
                    <span className="text-xl font-medium text-blue-600">
                      <CurrencyDisplay amount={formData.estimatedCost ? parseFloat(formData.estimatedCost) : 0} />
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    <Plane className="w-4 h-4 mr-2" />
                    Submit Request
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={onBack}>
                    Cancel
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    <strong>Note:</strong> Your travel request will be reviewed by your manager. Approval is required before booking any travel.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}