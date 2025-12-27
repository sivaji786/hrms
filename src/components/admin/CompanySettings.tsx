import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { companySettingsService } from '../../services/api';
import toast from '../../utils/toast';
import { Save, Building2, Upload } from 'lucide-react';

export default function CompanySettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        company_name: '',
        address: '',
        email: '',
        phone: '',
        website: '',
        tax_id: '',
        currency: 'AED',
        logo_url: ''
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await companySettingsService.getSettings();
            console.log('API Response:', response); // Debug log

            // Handle nested response structure: response.data.data
            const settings = response.data?.data || response.data || {};

            setFormData({
                company_name: settings.company_name || '',
                address: settings.address || '',
                email: settings.email || '',
                phone: settings.phone || '',
                website: settings.website || '',
                tax_id: settings.tax_id || '',
                currency: settings.currency || 'AED',
                logo_url: settings.logo_url || ''
            });

            if (settings.logo_url) {
                // Assuming API returns relative path, prepend base URL if needed or handle in API
                // For now assuming API returns relative path like 'uploads/company/xyz.png'
                setLogoPreview(`http://localhost:8080/${settings.logo_url}`);
            }
        } catch (error) {
            console.error('Error fetching company settings:', error);
            toast.error('Failed to load company settings');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);

            // Use FormData for file upload
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'logo_url') { // Don't send logo_url text, backend generates it
                    data.append(key, value);
                }
            });

            if (logoFile) {
                data.append('logo', logoFile);
                console.log('Logo file added to FormData:', logoFile);
            }

            // Debug: Log FormData contents
            console.log('FormData being sent:', data);
            console.log('Is FormData?', data instanceof FormData);
            for (let pair of data.entries()) {
                console.log(pair[0], pair[1]);
            }

            // Use axios directly to ensure FormData is sent correctly
            // Bypass the service layer which might be converting to JSON
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8080/api/v1/company-settings', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Don't set Content-Type - let axios set it automatically for FormData
                }
            });

            console.log('Upload response:', response);
            toast.success('Company settings updated successfully');
            // Refresh to get new logo URL from backend
            fetchSettings();
        } catch (error) {
            console.error('Error updating company settings:', error);
            toast.error('Failed to update company settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle>Company Settings</CardTitle>
                            <p className="text-sm text-gray-500 mt-1">Manage your company details and preferences</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Logo Upload Section */}
                        <div className="space-y-2">
                            <Label>Company Logo</Label>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Company Logo" className="w-full h-full object-contain" />
                                    ) : (
                                        <Building2 className="w-8 h-8 text-gray-300" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Input
                                        id="logo"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        onChange={handleFileChange}
                                        className="cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Recommended: PNG or JPG, max 2MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="company_name">Company Name</Label>
                                <Input
                                    id="company_name"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    placeholder="Enter company name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tax_id">Tax ID / TRN</Label>
                                <Input
                                    id="tax_id"
                                    name="tax_id"
                                    value={formData.tax_id}
                                    onChange={handleChange}
                                    placeholder="Enter Tax ID"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="hr@company.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+971 ..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currency">Default Currency</Label>
                                <Input
                                    id="currency"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    placeholder="AED"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter full address"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={saving}>
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
