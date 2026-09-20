import { Head, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';
import type { Team, WorkCadence } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: '/settings/profile' },
    { title: 'Work Cadences', href: '/settings/cadences' },
];

interface WorkCadencesPageProps {
    cadences: WorkCadence[];
    teams: Team[];
}

export default function WorkCadencesPage({ cadences, teams }: WorkCadencesPageProps) {
    const { data, setData, post, put, delete: destroy, errors, reset } = useForm({
        id: null as number | null,
        team_id: '',
        name: '',
        sprint_duration_weeks: 2,
        sprint_start_day: 'Monday',
        n1_n2_split_percentage: 20,
    });

    const isEditing = !!data.id;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEditing) {
            put(`/settings/cadences/${data.id}`, { onSuccess: () => reset() });
        } else {
            post('/settings/cadences', { onSuccess: () => reset() });
        }
    }

    function handleEdit(cadence: WorkCadence) {
        setData({
            id: cadence.id,
            team_id: String(cadence.team_id),
            name: cadence.name,
            sprint_duration_weeks: cadence.sprint_duration_weeks,
            sprint_start_day: cadence.sprint_start_day,
            n1_n2_split_percentage: cadence.n1_n2_split_percentage,
        });
    }

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this cadence?')) {
            destroy(`/settings/cadences/${id}`);
        }
    }

    return (
        <SettingsLayout breadcrumbs={breadcrumbs}>
            <Head title="Work Cadences" />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Work Cadences</CardTitle>
                            <CardDescription>Manage the work cadences for your teams.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {cadences.map((cadence) => (
                                    <div key={cadence.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <p className="font-semibold">{cadence.name} ({cadence.team.name})</p>
                                            <p className="text-sm text-muted-foreground">
                                                {cadence.sprint_duration_weeks} weeks sprints, starting on {cadence.sprint_start_day}. N1 budget: {cadence.n1_n2_split_percentage}%.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(cadence)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(cadence.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>{isEditing ? 'Edit Cadence' : 'Create Cadence'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="team_id">Team</Label>
                                    <Select name="team_id" value={data.team_id} onValueChange={(value) => setData('team_id', value)} required>
                                        <SelectTrigger><SelectValue placeholder="Select a team" /></SelectTrigger>
                                        <SelectContent>
                                            {teams.map((team) => <SelectItem key={team.id} value={String(team.id)}>{team.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.team_id && <p className="text-xs text-red-500">{errors.team_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Cadence Name</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sprint_duration_weeks">Sprint Duration (weeks)</Label>
                                    <Input id="sprint_duration_weeks" type="number" min="1" max="4" value={data.sprint_duration_weeks} onChange={(e) => setData('sprint_duration_weeks', parseInt(e.target.value))} required />
                                    {errors.sprint_duration_weeks && <p className="text-xs text-red-500">{errors.sprint_duration_weeks}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sprint_start_day">Sprint Start Day</Label>
                                    <Select name="sprint_start_day" value={data.sprint_start_day} onValueChange={(value) => setData('sprint_start_day', value)} required>
                                        <SelectTrigger><SelectValue placeholder="Select a day" /></SelectTrigger>
                                        <SelectContent>
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.sprint_start_day && <p className="text-xs text-red-500">{errors.sprint_start_day}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="n1_n2_split_percentage">N1 Budget (%)</Label>
                                    <Input id="n1_n2_split_percentage" type="number" min="0" max="100" value={data.n1_n2_split_percentage} onChange={(e) => setData('n1_n2_split_percentage', parseInt(e.target.value))} required />
                                    {errors.n1_n2_split_percentage && <p className="text-xs text-red-500">{errors.n1_n2_split_percentage}</p>}
                                </div>
                                <div className="flex justify-end gap-2">
                                    {isEditing && <Button variant="ghost" type="button" onClick={() => reset()}>Cancel</Button>}
                                    <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SettingsLayout>
    );
}
