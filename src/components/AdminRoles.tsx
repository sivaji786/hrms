import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Users, Shield, Building2, Search, Edit, Eye, Trash2, Clock } from 'lucide-react';
import { Input } from './ui/input';
import { useLanguage } from '../contexts/LanguageContext';
import DataTable, { TableColumn } from './common/DataTable';
import { StatCard } from './common';
import { AvatarCell } from './common/TableCells';
import AddDepartment from './AddDepartment';
import CompanySettings from './admin/CompanySettings';
import { organizationService, authService } from '../services/api';
import toast from '../utils/toast';

interface AdminRolesProps {
  onBack?: () => void;
}

export default function AdminRoles({ onBack }: AdminRolesProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('roles');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);

  // State for API data
  const [roles, setRoles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from APIs
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [rolesData, deptsData] = await Promise.all([
        organizationService.getRoles(),
        organizationService.getDepartments(),
      ]);

      setRoles(rolesData.data || rolesData || []);
      setDepartments(deptsData.data || deptsData || []);

      // Mock users for now (would need a users endpoint)
      setUsers([
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Administrator', department: 'Engineering', status: 'Active', lastLogin: '2 hours ago' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Employee', department: 'Marketing', status: 'Active', lastLogin: '1 day ago' },
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      await organizationService.deleteRole(id);
      toast.success('Role deleted successfully');
      fetchAllData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete role');
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;

    try {
      await organizationService.deleteDepartment(id);
      toast.success('Department deleted successfully');
      fetchAllData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete department');
    }
  };

  const handleEditDepartment = (dept: any) => {
    setEditingDepartment(dept);
    setShowAddDepartment(true);
  };

  if (showAddDepartment) {
    return (
      <AddDepartment
        onBack={() => {
          setShowAddDepartment(false);
          setEditingDepartment(null);
          fetchAllData();
        }}
        initialData={editingDepartment}
      />
    );
  }

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // User columns for DataTable
  const userColumns: TableColumn[] = [
    {
      header: t('admin.user'),
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <AvatarCell
          name={row.name}
          subtitle={row.email}
        />
      ),
    },
    {
      header: t('admin.role'),
      accessor: 'role',
      sortable: true,
      cell: (row) => (
        <Badge variant="outline">{row.role}</Badge>
      ),
    },
    {
      header: t('admin.department'),
      accessor: 'department',
      sortable: true,
    },
    {
      header: t('admin.status'),
      accessor: 'status',
      sortable: true,
      cell: (row) => (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          {row.status}
        </Badge>
      ),
    },
    {
      header: t('admin.lastLogin'),
      accessor: 'lastLogin',
      sortable: true,
      cell: (row) => (
        <p className="text-sm text-gray-500">{row.lastLogin}</p>
      ),
    },
    {
      header: t('admin.actions'),
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('admin.totalUsers')}
          value={users.length.toString()}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          variant="default"
        />
        <StatCard
          title={t('admin.activeRoles')}
          value={roles.length.toString()}
          icon={Shield}
          iconColor="text-blue-600"
          variant="default"
        />
        <StatCard
          title={t('admin.departments')}
          value={departments.length.toString()}
          icon={Building2}
          iconColor="text-green-600"
          variant="default"
        />
        <StatCard
          title={t('admin.activeSessions')}
          value="142"
          icon={Clock}
          iconColor="text-purple-600"
          variant="default"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">
            <Shield className="w-4 h-4 mr-2" />
            {t('admin.rolesTab')}
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            {t('admin.usersTab')}
          </TabsTrigger>
          <TabsTrigger value="departments">
            <Building2 className="w-4 h-4 mr-2" />
            {t('admin.departmentsTab')}
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Building2 className="w-4 h-4 mr-2" />
            Company Settings
          </TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg">{t('admin.roleManagement')}</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('admin.addRole')}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-base mt-2">{role.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">{role.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{t('admin.usersCount')}</span>
                    <Badge variant="secondary">0</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg">{t('admin.userManagement')}</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('admin.addUser')}
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t('admin.searchUsers')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table with DataTable */}
          <Card>
            <CardContent className="p-0">
              <DataTable
                columns={userColumns}
                data={filteredUsers}
                selectable
                exportable
                sortable
                exportFileName="users"
                exportHeaders={['User ID', 'Name', 'Email', 'Role', 'Department', 'Status', 'Last Login']}
                headerStyle="gradient"
                cellPadding="relaxed"
                emptyMessage={t('common.noDataFound')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg">{t('admin.departmentManagement')}</h3>
            <Button onClick={() => { setEditingDepartment(null); setShowAddDepartment(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              {t('admin.addDepartment')}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <Card key={dept.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditDepartment(dept)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteDepartment(dept.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-base mt-2">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t('admin.location')}</span>
                    <span className="font-medium">{dept.location_name || dept.location_id || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t('admin.manager')}</span>
                    <span className="font-medium">{dept.manager_id || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Company Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <CompanySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
