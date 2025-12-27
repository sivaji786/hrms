import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Upload, Loader2, Calendar } from 'lucide-react';
import { toast } from '../../utils/toast';
import { expenseService } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

interface SubmitExpensePageProps {
    onBack: () => void;
    onSuccess: () => void;
}

export default function SubmitExpensePage({ onBack, onSuccess }: SubmitExpensePageProps) {
    const { t } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        receipt: null as File | null,
    });

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({ ...prev, category: value }));
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, amount: e.target.value }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, date: e.target.value }));
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, description: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, receipt: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category || !formData.amount || !formData.date || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);

            // In a real app, we would upload the file first or send it as FormData
            // For now, we'll just send the text data
            const payload = {
                category: formData.category,
                amount: parseFloat(formData.amount),
                date: formData.date,
                description: formData.description,
                currency: 'AED', // Default currency
                status: 'Pending',
                // receipt_url: ... (handle file upload if backend supports it)
            };

            await expenseService.create(payload);
            toast.success('Expense submitted successfully');
            onSuccess();
        } catch (error) {
            console.error('Error submitting expense:', error);
            toast.error('Failed to submit expense');
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
                    <h2 className="text-2xl font-bold text-gray-900">{t('expense.submitExpense')}</h2>
                    <p className="text-gray-600">{t('expense.submitExpenseSubtitle') || 'Fill in the details below to submit a new expense claim.'}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Expense Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="category">{t('expense.category')}</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={handleCategoryChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Travel">{t('expense.travel')}</SelectItem>
                                        <SelectItem value="Food">{t('expense.food')}</SelectItem>
                                        <SelectItem value="Accommodation">{t('expense.accommodation')}</SelectItem>
                                        <SelectItem value="Office Supplies">{t('expense.officeSupplies')}</SelectItem>
                                        <SelectItem value="Training">{t('expense.training')}</SelectItem>
                                        <SelectItem value="Other">{t('expense.other')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">{t('expense.amount')} (AED)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={handleAmountChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">{t('expense.date')}</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleDateChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="receipt">{t('expense.receipt')}</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="receipt"
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="cursor-pointer"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">{t('expense.description')}</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                placeholder="Enter expense details"
                                rows={4}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onBack}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Expense'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
