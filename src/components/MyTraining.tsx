import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin, CheckCircle, PlayCircle } from 'lucide-react';
import { trainingService } from '../services/api';
import { useToast } from './ui/use-toast';

export default function MyTraining() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchData(userData.id);
  }, []);

  const fetchData = async (userId: string) => {
    try {
      setLoading(true);
      // In a real app, we'd have a specific endpoint for "my enrollments" or filter client-side
      // For now, we'll fetch all programs and all enrollments (admin) or just programs (user)
      // Since the API for enrollments is currently admin-only or all-access, we might need to adjust.
      // Assuming getPrograms returns all available programs.

      const programsData = await trainingService.getPrograms();
      setPrograms(programsData || []);

      // Ideally, we'd fetch user's enrollments here. 
      // Since we don't have a specific "my enrollments" endpoint yet, we'll simulate or skip for now
      // or assume the user can see their status if we had that data.
      // Let's just show available programs for now.

    } catch (error) {
      console.error('Error fetching training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (programId: string) => {
    if (!user || !user.id) return;
    try {
      await trainingService.enroll({
        program_id: programId,
        employee_id: user.id,
        status: 'Enrolled'
      });
      toast({
        title: "Success",
        description: "Enrolled in training program successfully"
      });
      // Refresh data or update local state
    } catch (error) {
      console.error('Error enrolling:', error);
      toast({
        title: "Error",
        description: "Failed to enroll in program",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading training programs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Learning Progress</CardTitle>
            <CardDescription>Track your training completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm text-muted-foreground">0%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-0" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-secondary/50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="bg-secondary/50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-xs text-muted-foreground">In Progress</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>Based on your role and skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {programs.slice(0, 2).map((program) => (
                <div key={program.id} className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <PlayCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{program.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{program.trainer}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleEnroll(program.id)}>Enroll</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Training Programs</CardTitle>
          <CardDescription>Browse and enroll in upcoming sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div key={program.id} className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-md transition-all">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge variant={program.mode === 'Online' ? 'secondary' : 'outline'}>
                      {program.mode}
                    </Badge>
                    <Badge className={
                      program.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                        program.status === 'Ongoing' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                    }>
                      {program.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {program.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{program.start_date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{program.trainer}</span>
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => handleEnroll(program.id)}>
                    Enroll Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}