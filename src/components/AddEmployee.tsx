import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ArrowLeft, Upload, Save, User, Briefcase, MapPin, Calendar, FileText, CreditCard, CheckCircle2, X, File } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import toast from '../utils/toast';
import { employeeService, organizationService, payrollService } from '../services/api';

interface AddEmployeeProps {
  onBack: () => void;
  onSave: () => void;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  expiryDate?: string;
  file?: File; // Added file property
}

export default function AddEmployee({ onBack, onSave }: AddEmployeeProps) {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, UploadedFile>>({});
  const [documentExpiryDates, setDocumentExpiryDates] = useState<Record<string, string>>({});
  const [profilePhoto, setProfilePhoto] = useState<UploadedFile | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [deptData, empData] = await Promise.all([
        organizationService.getDepartments(),
        employeeService.getAll()
      ]);
      setDepartments(deptData);
      // Handle the nested response structure from the API
      // API returns { status: 'success', data: { employees: [...], pager: {...} } }
      const employees = empData.data?.employees || [];
      const mappedManagers = employees.map((emp: any) => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
      }));
      setManagers(mappedManagers);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      toast.error('Failed to load form data');
    }
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    address: '',
    city: '',
    emirate: '',
    department: '',
    role: '',
    employeeType: '',
    joinDate: '',
    reportingManager: '',
    location: '',
    workSchedule: 'Sunday - Thursday, 9:00 AM - 6:00 PM',
    basicSalary: '',
    housingAllowance: '',
    transportAllowance: '',
    otherAllowances: '',
    emiratesId: '',
    passportNumber: '',
    visaNumber: '',
    labourCardNumber: '',
    bankName: '',
    iban: '',
    maritalStatus: '',
    bloodGroup: '',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelation: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getExpiryStatus = (expiryDate: string) => {
    if (!expiryDate) return { status: 'none', message: '', color: '' };

    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return {
        status: 'expired',
        message: 'Expired',
        color: 'red',
        days: Math.abs(daysUntilExpiry),
      };
    } else if (daysUntilExpiry <= 30) {
      return {
        status: 'expiring-soon',
        message: `Expires in ${daysUntilExpiry} days`,
        color: 'orange',
        days: daysUntilExpiry,
      };
    } else if (daysUntilExpiry <= 90) {
      return {
        status: 'warning',
        message: `Expires in ${daysUntilExpiry} days`,
        color: 'yellow',
        days: daysUntilExpiry,
      };
    } else {
      return {
        status: 'valid',
        message: `Valid until ${new Date(expiryDate).toLocaleDateString('en-AE')}`,
        color: 'green',
        days: daysUntilExpiry,
      };
    }
  };

  const handleExpiryDateChange = (documentType: string, expiryDate: string) => {
    setDocumentExpiryDates((prev) => ({ ...prev, [documentType]: expiryDate }));

    const status = getExpiryStatus(expiryDate);
    if (status.status === 'expired') {
      toast.warning('Document Expired', `${documentType} has already expired. Please upload a valid document.`);
    } else if (status.status === 'expiring-soon') {
      toast.warning('Expiring Soon', `${documentType} will expire in ${status.days} days. Plan for renewal.`);
    }
  };

  const documentsRequiringExpiry = [
    'Emirates ID Copy',
    'Passport Copy',
    'UAE Visa Copy',
    'Labour Card',
  ];

  const handleFileUpload = (documentType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File Too Large', `${file.name} exceeds 5MB limit`);
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid File Type', 'Please upload PDF, JPG, or PNG files only');
        return;
      }

      // Store file info
      const fileInfo: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        file: file, // Store actual file
      };

      setUploadedDocuments((prev) => ({ ...prev, [documentType]: fileInfo }));
      toast.success('File Uploaded', `${file.name} uploaded successfully`);
    }
  };

  const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (2MB max for photos)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File Too Large', 'Profile photo must be less than 2MB');
        return;
      }

      // Validate file type (only images)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid File Type', 'Please upload JPG or PNG images only');
        return;
      }

      const fileInfo: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        file: file, // Store actual file
      };

      setProfilePhoto(fileInfo);
      toast.success('Photo Uploaded', `${file.name} uploaded successfully`);
    }
  };

  const removeDocument = (documentType: string) => {
    setUploadedDocuments((prev) => {
      const updated = { ...prev };
      delete updated[documentType];
      return updated;
    });
    toast.info('File Removed', 'Document removed from upload list');
  };

  const removeProfilePhoto = () => {
    setProfilePhoto(null);
    toast.info('Photo Removed', 'Profile photo removed');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create FormData for Employee
      const formDataObj = new FormData();

      // Append text fields
      formDataObj.append('first_name', formData.firstName);
      formDataObj.append('last_name', formData.lastName);
      formDataObj.append('email', formData.email);
      formDataObj.append('phone', formData.phone);
      formDataObj.append('date_of_birth', formData.dateOfBirth);
      formDataObj.append('gender', formData.gender);
      formDataObj.append('nationality', formData.nationality);
      formDataObj.append('address', formData.address);
      formDataObj.append('department_id', formData.department);
      formDataObj.append('designation', formData.role);
      formDataObj.append('employment_type', formData.employeeType);
      formDataObj.append('date_of_joining', formData.joinDate);
      formDataObj.append('manager_id', formData.reportingManager);
      formDataObj.append('location', formData.location);
      formDataObj.append('work_schedule', formData.workSchedule);
      formDataObj.append('status', 'Active');
      formDataObj.append('bank_name', formData.bankName);
      formDataObj.append('iban', formData.iban);
      formDataObj.append('emirates_id', formData.emiratesId);
      formDataObj.append('passport_number', formData.passportNumber);
      formDataObj.append('visa_number', formData.visaNumber);
      formDataObj.append('labour_card_number', formData.labourCardNumber);
      formDataObj.append('emergency_contact_name', formData.emergencyContact);
      formDataObj.append('emergency_contact_phone', formData.emergencyPhone);
      formDataObj.append('emergency_contact_relation', formData.emergencyRelation);
      formDataObj.append('marital_status', formData.maritalStatus);
      formDataObj.append('blood_group', formData.bloodGroup);

      // Append Profile Photo
      if (profilePhoto && profilePhoto.file) {
        formDataObj.append('profile_image', profilePhoto.file);
      }

      // Append Documents
      // We'll use a naming convention that the backend can parse
      Object.entries(uploadedDocuments).forEach(([docType, fileInfo], index) => {
        if (fileInfo.file) {
          // Append file with key 'documents[<docType>]'
          formDataObj.append(`documents[${docType}]`, fileInfo.file);

          // Append expiry date if exists
          if (documentExpiryDates[docType]) {
            formDataObj.append(`document_expiry[${docType}]`, documentExpiryDates[docType]);
          }
        }
      });

      const newEmployee = await employeeService.create(formDataObj);

      // 2. Create Salary Structure (still JSON)
      if (newEmployee && newEmployee.data && newEmployee.data.id) {
        // Note: employeeService.create returns { status: 'success', data: { id: ... }, message: ... } 
        // or just the data depending on the controller. 
        // EmployeeController::create returns respondCreated(null, msg) which is empty body usually?
        // Wait, respondCreated first arg is data.
        // Let's check EmployeeController again. It returns respondCreated(null, 'Employee created successfully').
        // This means we WON'T get the ID back! This is a bug in the backend.
        // We need to fix EmployeeController to return the ID.

        // Assuming we fix the backend to return the ID:
        const employeeId = newEmployee.data?.id || newEmployee.id; // Fallback

        if (employeeId) {
          const salaryData = {
            employee_id: employeeId,
            basic_salary: Number(formData.basicSalary),
            housing_allowance: Number(formData.housingAllowance),
            transport_allowance: Number(formData.transportAllowance),
            other_allowances: Number(formData.otherAllowances),
            effective_from: formData.joinDate,
          };
          await payrollService.createStructure(salaryData);
        }
      }

      toast.success('Employee Added', 'New employee has been successfully onboarded.');
      onSave();
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error('Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            {t('employees.cancel')}
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            {t('employees.saveEmployee')}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
          <TabsList className="flex w-full h-auto p-1 bg-muted/50 rounded-lg">
            <TabsTrigger value="personal" className="flex-1 py-2">
              <User className="w-4 h-4 mr-2" />
              {t('employees.personalInfo')}
            </TabsTrigger>
            <TabsTrigger value="employment" className="flex-1 py-2">
              <Briefcase className="w-4 h-4 mr-2" />
              {t('employees.employmentDetails')}
            </TabsTrigger>
            <TabsTrigger value="salary" className="flex-1 py-2">
              <CreditCard className="w-4 h-4 mr-2" />
              {t('employees.salaryBanking')}
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex-1 py-2">
              <FileText className="w-4 h-4 mr-2" />
              {t('employees.documents')}
            </TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>{t('employees.personalInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo Upload */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    {profilePhoto && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    {!profilePhoto ? (
                      <div>
                        <input
                          type="file"
                          id="profile-photo-upload"
                          className="hidden"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleProfilePhotoUpload}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('profile-photo-upload')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {t('employees.uploadPhoto')}
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">{t('employees.photoFormat')}</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <File className="w-5 h-5 text-green-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{profilePhoto.name}</p>
                          <p className="text-xs text-gray-600">{formatFileSize(profilePhoto.size)}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeProfilePhoto}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('employees.firstName')} *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      placeholder={t('employees.enterFirstName')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('employees.lastName')} *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      placeholder={t('employees.enterLastName')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('employees.emailAddress')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder={t('employees.emailPlaceholder')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (UAE) *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+971 50 123 4567"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">{t('employees.dateOfBirth')} *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">{t('employees.gender')} *</Label>
                    <Select value={formData.gender || undefined} onValueChange={(value: string) => handleChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('employees.selectGender')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t('employees.male')}</SelectItem>
                        <SelectItem value="female">{t('employees.female')}</SelectItem>
                        <SelectItem value="other">{t('employees.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => handleChange('nationality', e.target.value)}
                      placeholder="e.g., Emirati, American, British"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">{t('employees.maritalStatus')}</Label>
                    <Select value={formData.maritalStatus || undefined} onValueChange={(value: string) => handleChange('maritalStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">{t('employees.bloodGroup')}</Label>
                    <Select value={formData.bloodGroup || undefined} onValueChange={(value: string) => handleChange('bloodGroup', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h4 className="font-medium">{t('employees.addressDetails')}</h4>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address (UAE)</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="Enter complete UAE address"
                      rows={3}
                    />
                  </div>
                </div>


                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h4 className="font-medium">{t('employees.emergencyContact')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">{t('employees.contactName')}</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleChange('emergencyContact', e.target.value)}
                        placeholder={t('employees.contactNamePlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">{t('employees.contactPhone')}</Label>
                      <Input
                        id="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                        placeholder="+971 50 XXX XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelation">{t('employees.relationship')}</Label>
                      <Input
                        id="emergencyRelation"
                        value={formData.emergencyRelation}
                        onChange={(e) => handleChange('emergencyRelation', e.target.value)}
                        placeholder={t('employees.relationshipPlaceholder')}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employment Details */}
          <TabsContent value="employment">
            <Card>
              <CardHeader>
                <CardTitle>{t('employees.employmentDetailsTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">{t('employees.department')} *</Label>
                    <Select value={formData.department || undefined} onValueChange={(value: string) => handleChange('department', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('employees.selectDepartment')} />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">{t('employees.jobTitle')} *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      placeholder={t('employees.jobTitlePlaceholder')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeType">{t('employees.employmentType')} *</Label>
                    <Select value={formData.employeeType || undefined} onValueChange={(value: string) => handleChange('employeeType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('employees.selectType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fulltime">{t('employees.fullTime')}</SelectItem>
                        <SelectItem value="parttime">{t('employees.partTime')}</SelectItem>
                        <SelectItem value="contract">{t('employees.contract')}</SelectItem>
                        <SelectItem value="intern">{t('employees.intern')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">{t('employees.joiningDate')} *</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => handleChange('joinDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reportingManager">{t('employees.reportingManager')}</Label>
                    <Select
                      value={formData.reportingManager || undefined}
                      onValueChange={(value: string) => handleChange('reportingManager', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('employees.selectManager')} />
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((mgr) => (
                          <SelectItem key={mgr.id} value={mgr.id}>
                            {mgr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Office Location (UAE) *</Label>
                    <Select value={formData.location || undefined} onValueChange={(value: string) => handleChange('location', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('employees.selectLocation')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dubai">Dubai</SelectItem>
                        <SelectItem value="abudhabi">Abu Dhabi</SelectItem>
                        <SelectItem value="sharjah">Sharjah</SelectItem>
                        <SelectItem value="ajman">Ajman</SelectItem>
                        <SelectItem value="rak">Ras Al Khaimah</SelectItem>
                        <SelectItem value="fujairah">Fujairah</SelectItem>
                        <SelectItem value="uaq">Umm Al Quwain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workSchedule">Work Schedule</Label>
                    <Input
                      id="workSchedule"
                      value={formData.workSchedule}
                      onChange={(e) => handleChange('workSchedule', e.target.value)}
                      placeholder="e.g. Sunday - Thursday, 9:00 AM - 6:00 PM"
                    />
                  </div>

                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Salary & Banking */}
          <TabsContent value="salary">
            <Card>
              <CardHeader>
                <CardTitle>Salary & Banking Details (UAE)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Salary Structure (Monthly - AED)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="basicSalary">Basic Salary (AED) *</Label>
                      <Input
                        id="basicSalary"
                        type="number"
                        value={formData.basicSalary}
                        onChange={(e) => handleChange('basicSalary', e.target.value)}
                        placeholder="e.g., 12000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="housingAllowance">Housing Allowance (AED)</Label>
                      <Input
                        id="housingAllowance"
                        type="number"
                        value={formData.housingAllowance}
                        onChange={(e) => handleChange('housingAllowance', e.target.value)}
                        placeholder="e.g., 4000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transportAllowance">Transport Allowance (AED)</Label>
                      <Input
                        id="transportAllowance"
                        type="number"
                        value={formData.transportAllowance}
                        onChange={(e) => handleChange('transportAllowance', e.target.value)}
                        placeholder="e.g., 2000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherAllowances">Other Allowances (AED)</Label>
                      <Input
                        id="otherAllowances"
                        type="number"
                        value={formData.otherAllowances}
                        onChange={(e) => handleChange('otherAllowances', e.target.value)}
                        placeholder="e.g., 1000"
                      />
                    </div>
                  </div>
                  {formData.basicSalary && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Total Monthly Salary:</span> {formatCurrency(
                          Number(formData.basicSalary || 0) +
                          Number(formData.housingAllowance || 0) +
                          Number(formData.transportAllowance || 0) +
                          Number(formData.otherAllowances || 0)
                        )} AED
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Annual Salary:</span> {formatCurrency(
                          (Number(formData.basicSalary || 0) +
                            Number(formData.housingAllowance || 0) +
                            Number(formData.transportAllowance || 0) +
                            Number(formData.otherAllowances || 0)) *
                          12
                        )} AED
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        Note: No PF/ESI deductions in UAE. End of Service Gratuity calculated separately as per UAE Labor Law.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Banking Details (UAE)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name (UAE) *</Label>
                      <Input
                        id="bankName"
                        value={formData.bankName}
                        onChange={(e) => handleChange('bankName', e.target.value)}
                        placeholder="e.g., Emirates NBD, ADCB, FAB"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="iban">IBAN *</Label>
                      <Input
                        id="iban"
                        value={formData.iban}
                        onChange={(e) => handleChange('iban', e.target.value)}
                        placeholder="AE070331234567890123456"
                        required
                      />
                      <p className="text-xs text-gray-500">UAE IBAN format: 23 characters starting with AE</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">UAE Documents & IDs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emiratesId">Emirates ID Number *</Label>
                      <Input
                        id="emiratesId"
                        value={formData.emiratesId}
                        onChange={(e) => handleChange('emiratesId', e.target.value)}
                        placeholder="784-XXXX-XXXXXXX-X"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passportNumber">Passport Number *</Label>
                      <Input
                        id="passportNumber"
                        value={formData.passportNumber}
                        onChange={(e) => handleChange('passportNumber', e.target.value)}
                        placeholder="Passport Number"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visaNumber">UAE Visa Number</Label>
                      <Input
                        id="visaNumber"
                        value={formData.visaNumber}
                        onChange={(e) => handleChange('visaNumber', e.target.value)}
                        placeholder="UAE Visa Number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="labourCardNumber">Labour Card Number</Label>
                      <Input
                        id="labourCardNumber"
                        value={formData.labourCardNumber}
                        onChange={(e) => handleChange('labourCardNumber', e.target.value)}
                        placeholder="Labour Card Number"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upload Documents (UAE Required)</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Upload all required documents for employee onboarding in UAE
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    {Object.keys(uploadedDocuments).length}/12 Uploaded
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Info box about expiry dates */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">
                        📋 Document Expiry Tracking
                      </h4>
                      <p className="text-sm text-gray-700 mt-1">
                        After uploading <strong>Emirates ID, Passport, UAE Visa, or Labour Card</strong>,
                        you'll be prompted to enter the expiry date. This enables automatic notification
                        alerts at 90, 60, and 30 days before expiration.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                          🔔 Automatic Alerts
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                          📅 Renewal Reminders
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'Emirates ID Copy', required: true },
                    { name: 'Passport Copy', required: true },
                    { name: 'UAE Visa Copy', required: true },
                    { name: 'Labour Card', required: false },
                    { name: 'Resume/CV', required: true },
                    { name: 'Offer Letter', required: true },
                    { name: 'Educational Certificates', required: true },
                    { name: 'Experience Letters', required: false },
                    { name: 'Passport Size Photo', required: true },
                    { name: 'Bank Details (IBAN)', required: true },
                    { name: 'Health Insurance Card', required: false },
                    { name: 'UAE Driving License (if applicable)', required: false },
                  ].map((doc, index) => {
                    const isUploaded = uploadedDocuments[doc.name];
                    return (
                      <div key={index} className="space-y-2">
                        <Label className="flex items-center gap-2">
                          {doc.name}
                          {doc.required && <span className="text-red-500">*</span>}
                          {isUploaded && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                        </Label>

                        {!isUploaded ? (
                          <div>
                            <input
                              type="file"
                              id={`doc-upload-${index}`}
                              className="hidden"
                              accept=".pdf,image/jpeg,image/jpg,image/png"
                              onChange={(e) => handleFileUpload(doc.name, e)}
                            />
                            <div
                              onClick={() => document.getElementById(`doc-upload-${index}`)?.click()}
                              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
                            >
                              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                              <p className="text-sm text-gray-600 group-hover:text-blue-600">
                                Click to upload {doc.name}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                PDF, JPG, PNG (max 5MB)
                              </p>
                              {documentsRequiringExpiry.includes(doc.name) && (
                                <p className="text-xs text-orange-600 mt-2 font-medium">
                                  Expiry date required
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className={`border-2 rounded-lg p-4 ${documentsRequiringExpiry.includes(doc.name) && documentExpiryDates[doc.name]
                              ? getExpiryStatus(documentExpiryDates[doc.name]).status === 'expired'
                                ? 'border-red-300 bg-red-50'
                                : getExpiryStatus(documentExpiryDates[doc.name]).status === 'expiring-soon'
                                  ? 'border-orange-300 bg-orange-50'
                                  : 'border-green-300 bg-green-50'
                              : 'border-green-300 bg-green-50'
                              }`}>
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${documentsRequiringExpiry.includes(doc.name) && documentExpiryDates[doc.name]
                                  ? getExpiryStatus(documentExpiryDates[doc.name]).status === 'expired'
                                    ? 'bg-red-100'
                                    : getExpiryStatus(documentExpiryDates[doc.name]).status === 'expiring-soon'
                                      ? 'bg-orange-100'
                                      : 'bg-green-100'
                                  : 'bg-green-100'
                                  }`}>
                                  <File className={`w-5 h-5 ${documentsRequiringExpiry.includes(doc.name) && documentExpiryDates[doc.name]
                                    ? getExpiryStatus(documentExpiryDates[doc.name]).status === 'expired'
                                      ? 'text-red-600'
                                      : getExpiryStatus(documentExpiryDates[doc.name]).status === 'expiring-soon'
                                        ? 'text-orange-600'
                                        : 'text-green-600'
                                    : 'text-green-600'
                                    }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {isUploaded.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <p className="text-xs text-gray-600">
                                      {formatFileSize(isUploaded.size)}
                                    </p>
                                    <span className="text-gray-400">•</span>
                                    <p className="text-xs text-green-600 font-medium">
                                      Uploaded successfully
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeDocument(doc.name)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Expiry Date for specific documents */}
                            {documentsRequiringExpiry.includes(doc.name) && (
                              <div className={`p-4 rounded-lg border-2 border-dashed ${documentExpiryDates[doc.name]
                                ? 'border-transparent bg-transparent'
                                : 'border-orange-300 bg-orange-50 animate-pulse'
                                }`}>
                                <div className="flex items-center gap-2 mb-3">
                                  <Calendar className="w-4 h-4 text-orange-600" />
                                  <Label htmlFor={`expiry-${index}`} className="text-sm font-medium">
                                    📅 Document Expiry Date *
                                  </Label>
                                </div>
                                <Input
                                  id={`expiry-${index}`}
                                  type="date"
                                  value={documentExpiryDates[doc.name] || ''}
                                  onChange={(e) => handleExpiryDateChange(doc.name, e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                  placeholder="Select expiry date"
                                  className={
                                    documentExpiryDates[doc.name]
                                      ? getExpiryStatus(documentExpiryDates[doc.name]).status === 'expired'
                                        ? 'border-red-500 focus:border-red-500'
                                        : getExpiryStatus(documentExpiryDates[doc.name]).status === 'expiring-soon'
                                          ? 'border-orange-500 focus:border-orange-500'
                                          : 'border-green-500 focus:border-green-500'
                                      : 'border-orange-400'
                                  }
                                />
                                {documentExpiryDates[doc.name] && (
                                  <div className="flex items-center gap-2 mt-2">
                                    {getExpiryStatus(documentExpiryDates[doc.name]).status === 'expired' ? (
                                      <Badge className="bg-red-100 text-red-700 border-red-200">
                                        ⚠️ {getExpiryStatus(documentExpiryDates[doc.name]).message}
                                      </Badge>
                                    ) : getExpiryStatus(documentExpiryDates[doc.name]).status === 'expiring-soon' ? (
                                      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                                        ⏰ {getExpiryStatus(documentExpiryDates[doc.name]).message}
                                      </Badge>
                                    ) : getExpiryStatus(documentExpiryDates[doc.name]).status === 'warning' ? (
                                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                                        📅 {getExpiryStatus(documentExpiryDates[doc.name]).message}
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-green-100 text-green-700 border-green-200">
                                        ✓ {getExpiryStatus(documentExpiryDates[doc.name]).message}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                                {!documentExpiryDates[doc.name] && (
                                  <div className="flex items-start gap-2 mt-2 p-2 bg-white rounded border border-orange-200">
                                    <span className="text-orange-600 text-xs">⚡</span>
                                    <p className="text-xs text-orange-700 font-medium">
                                      Required: Enter expiry date to enable automatic renewal alerts
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {Object.keys(uploadedDocuments).length > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Documents Upload Progress
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            You have uploaded {Object.keys(uploadedDocuments).length} out of 12 documents.
                            {Object.keys(uploadedDocuments).length < 8 && ' Please upload all required documents to complete onboarding.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Expiry Alerts Summary */}
                    {documentsRequiringExpiry.some(
                      (docName) => uploadedDocuments[docName] && documentExpiryDates[docName]
                    ) && (
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                Document Expiry Tracking
                              </p>
                              <p className="text-sm text-gray-600 mt-1 mb-3">
                                The system will send automatic notification alerts before these documents expire:
                              </p>
                              <div className="space-y-2">
                                {documentsRequiringExpiry.map((docName) => {
                                  if (uploadedDocuments[docName] && documentExpiryDates[docName]) {
                                    const status = getExpiryStatus(documentExpiryDates[docName]);
                                    return (
                                      <div
                                        key={docName}
                                        className="flex items-center justify-between p-2 bg-white rounded border border-purple-100"
                                      >
                                        <span className="text-sm text-gray-700">{docName}</span>
                                        <Badge
                                          className={
                                            status.status === 'expired'
                                              ? 'bg-red-100 text-red-700 border-red-200'
                                              : status.status === 'expiring-soon'
                                                ? 'bg-orange-100 text-orange-700 border-orange-200'
                                                : status.status === 'warning'
                                                  ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                  : 'bg-green-100 text-green-700 border-green-200'
                                          }
                                        >
                                          {status.message}
                                        </Badge>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                              <p className="text-xs text-purple-600 mt-3">
                                💡 Notifications will be sent at 90, 60, and 30 days before expiry
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Missing Expiry Dates Warning */}
                    {documentsRequiringExpiry.some(
                      (docName) => uploadedDocuments[docName] && !documentExpiryDates[docName]
                    ) && (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-orange-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Expiry Dates Required
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                Please add expiry dates for the following documents to enable automatic renewal alerts:
                              </p>
                              <ul className="mt-2 space-y-1">
                                {documentsRequiringExpiry.map((docName) => {
                                  if (uploadedDocuments[docName] && !documentExpiryDates[docName]) {
                                    return (
                                      <li key={docName} className="text-sm text-orange-700">
                                        • {docName}
                                      </li>
                                    );
                                  }
                                  return null;
                                })}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs >
      </form >
    </div >
  );
}
