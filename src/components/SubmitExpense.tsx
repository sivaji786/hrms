import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Upload, Receipt, Plus, X } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import toast from '../utils/toast';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { CurrencyDisplay } from './common';

interface SubmitExpenseProps {
  onBack: () => void;
}

export default function SubmitExpense({ onBack }: SubmitExpenseProps) {
  const { formatCurrency, convertAmount } = useCurrency();
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: '',
    description: '',
    projectCode: '',
    notes: '',
  });
  const [receipts, setReceipts] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.category || !formData.amount || !formData.date || !formData.description) {
      toast.error('Required Fields Missing', {
        description: 'Please fill in all required fields.'
      });
      return;
    }

    toast.success('Expense Submitted Successfully!', {
      description: `Your expense claim for ${formatCurrency(convertAmount(parseFloat(formData.amount)))} has been submitted for approval.`
    });

    // Reset form and go back
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  const handleAddReceipt = () => {
    setReceipts([...receipts, `Receipt_${Date.now()}.pdf`]);
    toast.success('Receipt Added', {
      description: 'Receipt file has been attached to your claim.'
    });
  };

  const handleRemoveReceipt = (index: number) => {
    setReceipts(receipts.filter((_, i) => i !== index));
  };

  const breadcrumbItems = [
    { label: 'Employee Management', href: '#' },
    { label: 'Expense & Travel', href: '#' },
    { label: 'Submit Expense' }
  ];

  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl text-gray-900">Submit Expense Claim</h2>
          <p className="text-gray-600 mt-1">Fill in the details below to submit your expense claim</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Accommodation">Accommodation</SelectItem>
                        <SelectItem value="Food">Food & Meals</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                        <SelectItem value="Training">Training & Development</SelectItem>
                        <SelectItem value="Client Entertainment">Client Entertainment</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount <span className="text-red-500">*</span></Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Expense Date <span className="text-red-500">*</span></Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectCode">Project Code</Label>
                    <Input
                      id="projectCode"
                      placeholder="e.g., PROJ-001"
                      value={formData.projectCode}
                      onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed description of the expense"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information or context"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Receipt Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Upload Receipts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PDF, PNG, JPG up to 10MB</p>
                  <Button
                    type="button"
                    className="mt-4"
                    onClick={handleAddReceipt}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Receipt
                  </Button>
                </div>

                {receipts.length > 0 && (
                  <div className="space-y-2">
                    <Label>Attached Receipts ({receipts.length})</Label>
                    {receipts.map((receipt, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{receipt}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveReceipt(index)}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Claim Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-sm text-gray-600">Category:</span>
                    <span className="text-sm font-medium text-gray-900">{formData.category || '-'}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formData.date ? new Date(formData.date).toLocaleDateString() : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-sm text-gray-600">Project:</span>
                    <span className="text-sm font-medium text-gray-900">{formData.projectCode || '-'}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-sm text-gray-600">Receipts:</span>
                    <span className="text-sm font-medium text-gray-900">{receipts.length} file(s)</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="font-medium text-gray-900">Total Amount:</span>
                    <span className="text-xl font-medium text-green-600">
                      <CurrencyDisplay amount={formData.amount ? parseFloat(formData.amount) : 0} />
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                    Submit Claim
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={onBack}>
                    Cancel
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    <strong>Note:</strong> Your claim will be sent to your manager for approval. You'll receive a notification once it's reviewed.
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