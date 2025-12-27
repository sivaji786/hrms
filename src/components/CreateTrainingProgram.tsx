import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { trainingService } from '../services/api';
import { useToast } from './ui/use-toast';

interface CreateTrainingProgramProps {
    onBack: () => void;
    programId?: string | null;
}

export default function CreateTrainingProgram({ onBack, programId }: CreateTrainingProgramProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        trainer: '',
        start_date: '',
        end_date: '',
        mode: 'Online',
        status: 'Upcoming',
        capacity: 20,
        cost: 0
    });

    useEffect(() => {
        if (programId) {
            fetchProgramDetails();
        }
    }, [programId]);

    const fetchProgramDetails = async () => {
        try {
            setLoading(true);
            const program = await trainingService.getProgram(programId!);
            if (program) {
                setFormData({
                    title: program.title,
                    description: program.description || '',
                    trainer: program.trainer,
                    start_date: program.start_date,
                    end_date: program.end_date,
                    mode: program.mode,
                    status: program.status,
                    capacity: program.capacity,
                    cost: program.cost
                });
            }
        } catch (error) {
            console.error('Error fetching program details:', error);
            toast({
                title: "Error",
                description: "Failed to fetch program details",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (programId) {
                await trainingService.updateProgram(programId, formData);
                toast({
                    title: "Success",
                    description: "Training program updated successfully"
                });
            } else {
                await trainingService.createProgram(formData);
                toast({
                    title: "Success",
                    description: "Training program created successfully"
                });
            }
            onBack();
        } catch (error) {
            console.error('Error saving program:', error);
            toast({
                title: "Error",
                description: `Failed to ${programId ? 'update' : 'create'} training program`,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading && programId) {
        return <div className="flex justify-center items-center h-96">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {programId ? 'Edit Training Program' : 'Create Training Program'}
                    </h2>
                    <p className="text-muted-foreground">
                        {programId ? 'Update existing program details' : 'Add a new training program to the catalog'}
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Program Details</CardTitle>
                    <CardDescription>Fill in the information below</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Program Title</Label>
                                <Input
                                    id="title"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Leadership Workshop"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="trainer">Trainer/Provider</Label>
                                <Input
                                    id="trainer"
                                    required
                                    value={formData.trainer}
                                    onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Program details..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    required
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    required
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="mode">Mode</Label>
                                <Select
                                    value={formData.mode}
                                    onValueChange={(value) => setFormData({ ...formData, mode: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Online">Online</SelectItem>
                                        <SelectItem value="Offline">Offline</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cost">Cost</Label>
                                <Input
                                    id="cost"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={onBack}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                <Save className="mr-2 h-4 w-4" />
                                {programId ? 'Update Program' : 'Create Program'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
