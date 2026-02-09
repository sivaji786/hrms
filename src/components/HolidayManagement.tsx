import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, CalendarDays, Search, Filter, Plus, Edit, Trash2, MapPin, X, Save, Download, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Pagination } from './common';
import { holidayService, Holiday } from '../services/holidayService';
import { StatCard, ConfirmDialog } from './common';
import { useLanguage } from '../contexts/LanguageContext';
import toast from '../utils/toast';
import { useEffect } from 'react';

const HOLIDAY_TYPES = ['National Holiday', 'Regional Holiday', 'Optional Holiday'];
const LOCATIONS = ['All Locations', 'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah'];

export default function HolidayManagement() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('list');
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  // const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchHolidays = async () => {
    try {
      // setLoading(true);
      const data = await holidayService.getHolidays();
      // Map API data to frontend model (is_optional -> isOptional)
      const mappedData: Holiday[] = data.map((item: any) => ({
        ...item,
        isOptional: Boolean(item.is_optional), // Backend might send 0/1 or bool
        // Ensure other fields are present
        id: item.id,
        name: item.name,
        date: item.date,
        day: item.day || new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' }),
        type: item.type,
        location: item.location,
        description: item.description,
      }));
      setHolidays(mappedData);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      toast.error('Error', 'Failed to fetch holidays');
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // Compute stats for charts and cards dynamically from holidays state
  const holidayStats = {
    total: holidays.length,
    national: holidays.filter(h => h.type === 'National Holiday').length,
    regional: holidays.filter(h => h.type === 'Regional Holiday').length,
    optional: holidays.filter(h => h.type === 'Optional Holiday').length,
  };

  const getTranslatedType = (type: string) => {
    switch (type) {
      case 'National Holiday': return t('leave.nationalHoliday');
      case 'Regional Holiday': return t('leave.regionalHoliday');
      case 'Optional Holiday': return t('leave.optionalHoliday');
      default: return type;
    }
  };

  const getTranslatedLocation = (location: string) => {
    switch (location) {
      case 'All Locations': return t('leave.allLocations');
      case 'Dubai': return t('leave.dubai');
      case 'Abu Dhabi': return t('leave.abuDhabi');
      case 'Sharjah': return t('leave.sharjah');
      case 'Ajman': return t('leave.ajman');
      case 'Ras Al Khaimah': return t('leave.rasAlKhaimah');
      case 'Fujairah': return t('leave.fujairah');
      default: return location;
    }
  };

  const holidayTypeData = [
    { name: t('leave.nationalHoliday'), value: holidayStats.national, color: '#3b82f6' },
    { name: t('leave.regionalHoliday'), value: holidayStats.regional, color: '#8b5cf6' },
    { name: t('leave.optionalHoliday'), value: holidayStats.optional, color: '#f97316' },
  ];

  const monthlyHolidayCount = Array.from({ length: 12 }, (_, i) => {
    const monthName = new Date(0, i).toLocaleString('en-US', { month: 'short' });
    const count = holidays.filter(h => new Date(h.date).getMonth() === i).length;
    return { month: monthName, count };
  });

  // Edit/Add state
  const [editingHolidayId, setEditingHolidayId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: '',
    location: '',
    description: '',
    isOptional: false,
  });

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    holidayId: string | null;
    holidayName: string;
  }>({
    isOpen: false,
    holidayId: null,
    holidayName: '',
  });

  const filteredHolidays = holidays.filter((holiday) => {
    const matchesSearch =
      holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || holiday.type === filterType;
    const matchesLocation = filterLocation === 'all' || holiday.location.includes(filterLocation);
    return matchesSearch && matchesType && matchesLocation;
  });

  const totalPages = Math.ceil(filteredHolidays.length / itemsPerPage);
  const paginatedHolidays = filteredHolidays.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'National Holiday':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Regional Holiday':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Optional Holiday':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleEditClick = (holiday: any) => {
    setEditingHolidayId(holiday.id);
    setFormData({
      name: holiday.name,
      date: holiday.date,
      type: holiday.type,
      location: holiday.location,
      description: holiday.description,
      isOptional: holiday.isOptional,
    });
  };

  const handleCancelEdit = () => {
    setEditingHolidayId(null);
    setFormData({
      name: '',
      date: '',
      type: '',
      location: '',
      description: '',
      isOptional: false,
    });
  };

  const handleSaveEdit = async (holidayId: string) => {
    try {
      // const date = new Date(formData.date);
      // const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

      await holidayService.updateHoliday(holidayId, {
        name: formData.name,
        date: formData.date,
        type: formData.type,
        location: formData.location,
        description: formData.description,
        is_optional: formData.isOptional, // Map to backend field
      });

      // Refresh data to ensure consistency and correct mapping
      fetchHolidays();

      toast.success('Holiday Updated', 'Holiday updated successfully');
      setEditingHolidayId(null);
      setFormData({
        name: '',
        date: '',
        type: '',
        location: '',
        description: '',
        isOptional: false,
      });
    } catch (error) {
      console.error('Error updating holiday:', error);
      toast.error('Error', 'Failed to update holiday');
    }
  };

  const handleAddHoliday = async () => {
    if (!formData.name || !formData.date || !formData.type || !formData.location) {
      toast.warning('Required Fields Missing', 'Please fill all required fields');
      return;
    }

    try {
      await holidayService.createHoliday({
        name: formData.name,
        date: formData.date,
        type: formData.type,
        location: formData.location,
        description: formData.description,
        is_optional: formData.isOptional, // Map to backend field
      });

      // Refresh data to ensure consistency and correct mapping
      fetchHolidays();

      toast.success('Holiday Added', `${formData.name} has been added successfully!`);
      setShowAddForm(false);
      setFormData({
        name: '',
        date: '',
        type: '',
        location: '',
        description: '',
        isOptional: false,
      });
    } catch (error) {
      console.error('Error adding holiday:', error);
      toast.error('Error', 'Failed to add holiday');
    }
  };

  const handleDeleteHoliday = (holidayId: string) => {
    setConfirmDialog({
      isOpen: true,
      holidayId: holidayId,
      holidayName: holidays.find((h) => h.id === holidayId)?.name || '',
    });
  };

  const confirmDelete = async () => {
    if (confirmDialog.holidayId) {
      try {
        await holidayService.deleteHoliday(confirmDialog.holidayId);
        setHolidays((prevHolidays) => prevHolidays.filter((holiday) => holiday.id !== confirmDialog.holidayId));
        toast.success('Holiday Deleted', 'Holiday has been deleted successfully!');
      } catch (error) {
        console.error('Error deleting holiday:', error);
        toast.error('Error', 'Failed to delete holiday');
      }
    }
    setConfirmDialog({
      isOpen: false,
      holidayId: null,
      holidayName: '',
    });
  };

  const cancelDelete = () => {
    setConfirmDialog({
      isOpen: false,
      holidayId: null,
      holidayName: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-medium text-gray-900">{t('leave.holidayManagement')}</h1>
        <p className="text-gray-600 mt-1">{t('leave.holidayManagementSubtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('leave.totalHolidays')}
          value={holidayStats.total.toString()}
          subtitle={t('leave.forYear2025')}
          icon={Calendar}
          iconColor="text-blue-600"
          variant="default"
        />

        <StatCard
          title={t('leave.nationalHolidays')}
          value={holidayStats.national.toString()}
          subtitle={t('leave.mandatoryOffDays')}
          icon={CalendarDays}
          iconColor="text-green-600"
          variant="default"
        />

        <StatCard
          title={t('leave.regionalHolidays')}
          value={holidayStats.regional.toString()}
          subtitle={t('leave.locationSpecific')}
          icon={MapPin}
          iconColor="text-purple-600"
          variant="default"
        />

        <StatCard
          title={t('leave.optionalHolidays')}
          value={holidayStats.optional.toString()}
          subtitle={t('leave.employeeChoice')}
          icon={TrendingUp}
          iconColor="text-orange-600"
          variant="default"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Holiday Type Distribution */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{t('leave.holidayDistributionByType')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={holidayTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {holidayTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Distribution */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{t('leave.holidayDistributionByMonth')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyHolidayCount.map(item => ({
                ...item,
                month: t(`leave.${item.month.toLowerCase()}`)
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name={t('leave.holidays')} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="list">{t('leave.holidayList')}</TabsTrigger>
          <TabsTrigger value="calendar">{t('leave.calendarView')}</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <h3 className="font-medium text-gray-900">{t('leave.filters')}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search-holidays"
                    name="search"
                    placeholder={t('leave.searchHolidays')}
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={filterType}
                  onValueChange={(value) => {
                    setFilterType(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('leave.holidayType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('leave.allTypes')}</SelectItem>
                    {HOLIDAY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filterLocation}
                  onValueChange={(value) => {
                    setFilterLocation(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('leave.allLocations')}</SelectItem>
                    {LOCATIONS.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {getTranslatedLocation(loc)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {t('leave.showingHolidays', { current: filteredHolidays.length, total: holidays.length })}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('leave.addHoliday')}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    {t('leave.export')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Holiday Form */}
          {showAddForm && (
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-900 flex items-center gap-2">
                    <Plus className="w-6 h-6" />
                    {t('leave.addNewHoliday')}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAddForm(false);
                      setFormData({
                        name: '',
                        date: '',
                        type: '',
                        location: '',
                        description: '',
                        isOptional: false,
                      });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('leave.holidayName')} *</Label>
                    <Input
                      id="add-holiday-name"
                      name="name"
                      placeholder="e.g., Diwali"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('leave.date')} *</Label>
                    <Input
                      id="add-holiday-date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('leave.holidayType')} *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {HOLIDAY_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('leave.location')} *</Label>
                    <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {getTranslatedLocation(loc)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>{t('leave.description')}</Label>
                    <Textarea
                      id="add-holiday-description"
                      name="description"
                      placeholder="Enter holiday description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      name: '',
                      date: '',
                      type: '',
                      location: '',
                      description: '',
                      isOptional: false,
                    });
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddHoliday} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    {t('leave.addHoliday')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Holiday List */}
          <div className="grid gap-4">
            {paginatedHolidays.map((holiday) => (
              <Card key={holiday.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {editingHolidayId === holiday.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-medium text-gray-900">{t('leave.editHoliday')}</h3>
                        <div className="flex gap-2">
                          <Button onClick={() => handleSaveEdit(holiday.id)} size="sm" className="bg-green-600 hover:bg-green-700">
                            <Save className="w-4 h-4 mr-2" />
                            {t('common.save')}
                          </Button>
                          <Button onClick={handleCancelEdit} variant="outline" size="sm">
                            <X className="w-4 h-4 mr-2" />
                            {t('common.cancel')}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t('leave.holidayName')}</Label>
                          <Input
                            id={`edit-holiday-name-${holiday.id}`}
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('leave.date')}</Label>
                          <Input
                            id={`edit-holiday-date-${holiday.id}`}
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('leave.holidayType')}</Label>
                          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {HOLIDAY_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('leave.location')}</Label>
                          <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {LOCATIONS.map((loc) => (
                                <SelectItem key={loc} value={loc}>
                                  {getTranslatedLocation(loc)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>{t('leave.description')}</Label>
                          <Textarea
                            id={`edit-holiday-desc-${holiday.id}`}
                            name="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="flex flex-col items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl text-white shadow-lg">
                          <span className="text-2xl font-medium">{new Date(holiday.date).getDate()}</span>
                          <span className="text-xs uppercase">{t(`leave.${new Date(holiday.date).toLocaleString('en-US', { month: 'short' }).toLowerCase()}`)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-medium text-gray-900">{holiday.name}</h4>
                            <Badge className={getTypeBadge(holiday.type)}>
                              {getTranslatedType(holiday.type)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">{t('leave.day')}</p>
                              <p className="font-medium text-gray-900">{t(`leave.${holiday.day.toLowerCase()}`)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">{t('leave.location')}</p>
                              <p className="font-medium text-gray-900 flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-purple-600" />
                                {getTranslatedLocation(holiday.location)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">{t('leave.description')}</p>
                              <p className="font-medium text-gray-900">{holiday.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(holiday)}>
                          <Edit className="w-4 h-4 mr-2" />
                          {t('common.edit')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteHoliday(holiday.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredHolidays.length > itemsPerPage && (
            <Card>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredHolidays.length}
              />
            </Card>
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>{t('leave.holidayCalendarYear', { year: '2025' })}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Array.from({ length: 12 }, (_, monthIndex) => {
                  const monthHolidays = holidays.filter(
                    (h) => new Date(h.date).getMonth() === monthIndex
                  );
                  if (monthHolidays.length === 0) return null;

                  const monthName = t(`leave.${new Date(2025, monthIndex, 1).toLocaleString('en-US', { month: 'short' }).toLowerCase()}`);

                  return (
                    <div key={monthIndex} className="border rounded-lg p-4">
                      <h3 className="text-xl font-medium text-gray-900 mb-4">{monthName} 2025</h3>
                      <div className="grid gap-3">
                        {monthHolidays.map((holiday) => (
                          <div
                            key={holiday.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg text-white">
                                <span className="text-xl font-medium">{new Date(holiday.date).getDate()}</span>
                                <span className="text-xs">{t(`leave.${holiday.day.slice(0, 3).toLowerCase()}`)}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{holiday.name}</p>
                                <p className="text-sm text-gray-600">{holiday.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getTypeBadge(holiday.type)}>
                                {getTranslatedType(holiday.type)}
                              </Badge>
                              <span className="text-sm text-gray-600 flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {getTranslatedLocation(holiday.location)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Holiday"
        message={`Are you sure you want to delete the holiday "${confirmDialog.holidayName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onClose={cancelDelete}
      />
    </div>
  );
}