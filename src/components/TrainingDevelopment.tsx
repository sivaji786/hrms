import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { BookOpen, Users, Calendar, Award, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import StatCard from './common/StatCard';
import { trainingService } from '../services/api';
import { useToast } from './ui/use-toast';
import CreateTrainingProgram from './CreateTrainingProgram';

export default function TrainingDevelopment() {
  const { toast } = useToast();
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total_programs: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    if (view === 'list') {
      fetchData();
    }
  }, [view]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [programsData, statsData] = await Promise.all([
        trainingService.getPrograms(),
        trainingService.getStats()
      ]);
      setPrograms(programsData || []);
      setStats(statsData || { total_programs: 0, upcoming: 0, ongoing: 0, completed: 0 });
    } catch (error) {
      console.error('Error fetching training data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch training data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      try {
        await trainingService.deleteProgram(id);
        toast({
          title: "Success",
          description: "Training program deleted successfully"
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting program:', error);
        toast({
          title: "Error",
          description: "Failed to delete training program",
          variant: "destructive"
        });
      }
    }
  };

  const handleEdit = (id: string) => {
    setSelectedProgramId(id);
    setView('edit');
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.trainer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || program.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statCards = [
    {
      title: "Total Programs",
      value: stats.total_programs.toString(),
      subtitle: "All time",
      icon: BookOpen,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Upcoming",
      value: stats.upcoming.toString(),
      subtitle: "Scheduled",
      icon: Calendar,
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Ongoing",
      value: stats.ongoing.toString(),
      subtitle: "Active now",
      icon: Users,
      trend: { value: 2, isPositive: true }
    },
    {
      title: "Completed",
      value: stats.completed.toString(),
      subtitle: "Finished",
      icon: Award,
      trend: { value: 8, isPositive: true }
    }
  ];

  if (view === 'create' || view === 'edit') {
    return (
      <CreateTrainingProgram
        onBack={() => {
          setView('list');
          setSelectedProgramId(null);
        }}
        programId={selectedProgramId}
      />
    );
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Training & Development</h2>
          <p className="text-muted-foreground">Manage training programs and employee development</p>
        </div>
        <Button onClick={() => setView('create')}>
          <Plus className="mr-2 h-4 w-4" /> Create Program
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} variant="default" />
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Training Programs</CardTitle>
              <CardDescription>View and manage training schedule</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search programs..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program Title</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.title}</TableCell>
                    <TableCell>{program.trainer}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{program.start_date}</div>
                        <div className="text-muted-foreground text-xs">to {program.end_date}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{program.mode}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        program.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                          program.status === 'Ongoing' ? 'bg-green-100 text-green-800' :
                            program.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                      }>
                        {program.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{program.capacity}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(program.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(program.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No training programs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}