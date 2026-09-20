import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import type { Team, TeamEvent } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: '/settings/profile' },
    { title: 'Team Events', href: '/settings/team-events' },
];

interface TeamEventsPageProps {
    events: TeamEvent[];
    teams: Team[];
}

export default function TeamEventsPage({ events, teams }: TeamEventsPageProps) {
    const { data, setData, post, put, delete: destroy, errors, reset } = useForm({
        id: null as number | null,
        team_id: '',
        name: '',
        start_date: '',
        end_date: '',
        is_full_day: true,
    });

    const isEditing = !!data.id;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEditing) {
            put(`/settings/team-events/${data.id}`, { onSuccess: () => reset() });
        } else {
            post('/settings/team-events', { onSuccess: () => reset() });
        }
    }

    function handleEdit(event: TeamEvent) {
        setData({
            id: event.id,
            team_id: String(event.team_id),
            name: event.name,
            start_date: format(new Date(event.start_date), 'yyyy-MM-dd'),
            end_date: format(new Date(event.end_date), 'yyyy-MM-dd'),
            is_full_day: event.is_full_day,
        });
    }

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this event?')) {
            destroy(`/settings/team-events/${id}`);
        }
    }

    return (
        <SettingsLayout breadcrumbs={breadcrumbs}>
            <Head title="Team Events" />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Events</CardTitle>
                            <CardDescription>Manage team-specific events like days off, training, etc.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {events.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <p className="font-semibold">{event.name} ({event.team.name})</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(event.start_date), 'MMM dd, yyyy')} - {format(new Date(event.end_date), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4" /></Button>
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
                            <CardTitle>{isEditing ? 'Edit Event' : 'Create Event'}</CardTitle>
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
                                    <Label htmlFor="name">Event Name</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">Start Date</Label>
                                        <Input id="start_date" type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} required />
                                        {errors.start_date && <p className="text-xs text-red-500">{errors.start_date}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">End Date</Label>
                                        <Input id="end_date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} required />
                                        {errors.end_date && <p className="text-xs text-red-500">{errors.end_date}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="is_full_day" checked={data.is_full_day} onCheckedChange={(checked) => setData('is_full_day', !!checked)} />
                                    <Label htmlFor="is_full_day">Full day event</Label>
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
