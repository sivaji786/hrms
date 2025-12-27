import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Calendar, MapPin, Plane, DollarSign, Loader2 } from 'lucide-react';
import { toast } from '../../utils/toast';
import { travelService } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

interface RequestTravelPageProps {
    onBack: () => void;
    onSuccess: () => void;
}

export default function RequestTravelPage({ onBack, onSuccess }: RequestTravelPageProps) {
    const { t } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        startDate: '',
        endDate: '',
        purpose: '',
        tripType: 'Domestic',
        travelMode: 'Flight',
        estimatedCost: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.from || !formData.to || !formData.startDate || !formData.endDate || !formData.purpose || !formData.estimatedCost) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);

            await travelService.create({
                ...formData,
                estimatedCost: Number(formData.estimatedCost),
                accommodationRequired: false, // Default or add field
                status: 'Pending', // Default status for new requests
            });
            toast.success('Travel request submitted successfully');
            onSuccess();
        } catch (error) {
            console.error('Error submitting travel request:', error);
            toast.error('Failed to submit travel request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('expense.requestTravel')}</h2>
                    <p className="text-gray-600">{t('expense.requestTravelSubtitle') || 'Submit a new travel request for approval.'}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Trip Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="origin">From (Origin)</Label>
                                <Input
                                    id="origin"
                                    name="from"
                                    value={formData.from}
                                    onChange={handleInputChange}
                                    placeholder="City, Country"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="destination">To (Destination)</Label>
                                <Input
                                    id="destination"
                                    name="to"
                                    value={formData.to}
                                    onChange={handleInputChange}
                                    placeholder="City, Country"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    name="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    name="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tripType">{t('expense.travelType')}</Label>
                                <Select
                                    value={formData.tripType}
                                    onValueChange={(value: string) => handleSelectChange('tripType', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Domestic">{t('expense.domestic')}</SelectItem>
                                        <SelectItem value="International">{t('expense.international')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="travelMode">Travel Mode</Label>
                                <Select
                                    value={formData.travelMode}
                                    onValueChange={(value: string) => handleSelectChange('travelMode', value)}
                                >
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

                            <div className="space-y-2">
                                <Label htmlFor="estimatedCost">{t('expense.estimatedCost')} (AED)</Label>
                                <Input
                                    id="estimatedCost"
                                    type="number"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    name="estimatedCost"
                                    value={formData.estimatedCost}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="purpose">Purpose of Visit</Label>
                            <Textarea
                                id="purpose"
                                name="purpose"
                                placeholder="Describe the purpose of the trip..."
                                value={formData.purpose}
                                onChange={handleInputChange}
                                rows={4}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onBack}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Request'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
