import { Head, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem, SharedData } from '@/types';

interface Holiday {
    id: number;
    date: string;
    name: string;
    is_recurring: boolean;
}

interface UserAvailability {
    id: number;
    user_id: number;
    user: { id: number; name: string; email: string };
    start_date: string;
    end_date: string;
    availability_percentage: number;
    reason: string | null;
}

export default function CapacitySettings() {
    const { auth } = usePage<SharedData>().props;
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [availabilities, setAvailabilities] = useState<UserAvailability[]>(
        [],
    );
    const [loading, setLoading] = useState(false);

    // Holiday form state
    const [holidayDate, setHolidayDate] = useState('');
    const [holidayName, setHolidayName] = useState('');
    const [holidayRecurring, setHolidayRecurring] = useState(false);

    // Availability form state
    const [availStartDate, setAvailStartDate] = useState('');
    const [availEndDate, setAvailEndDate] = useState('');
    const [availPercentage, setAvailPercentage] = useState(0);
    const [availReason, setAvailReason] = useState('');

    const loadHolidays = useCallback(async () => {
        const response = await fetch('/api/holidays');
        const data = await response.json();
        setHolidays(data);
    }, []);

    const loadAvailabilities = useCallback(async () => {
        const response = await fetch(
            `/api/availability?user_id=${auth.user.id}`,
        );
        const data = await response.json();
        setAvailabilities(data);
    }, [auth.user.id]);

    const addHoliday = async () => {
        if (!holidayDate || !holidayName) return;

        setLoading(true);
        try {
            const response = await fetch('/api/holidays', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    date: holidayDate,
                    name: holidayName,
                    is_recurring: holidayRecurring,
                }),
            });

            if (response.ok) {
                setHolidayDate('');
                setHolidayName('');
                setHolidayRecurring(false);
                loadHolidays();
            }
        } finally {
            setLoading(false);
        }
    };

    const deleteHoliday = async (id: number) => {
        if (!confirm('Remover este feriado?')) return;

        const response = await fetch(`/api/holidays/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
            },
        });

        if (response.ok) {
            loadHolidays();
        }
    };

    const addAvailability = async () => {
        if (!availStartDate || !availEndDate) return;

        setLoading(true);
        try {
            const response = await fetch('/api/availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    user_id: auth.user.id,
                    start_date: availStartDate,
                    end_date: availEndDate,
                    availability_percentage: availPercentage,
                    reason: availReason || null,
                }),
            });

            if (response.ok) {
                setAvailStartDate('');
                setAvailEndDate('');
                setAvailPercentage(0);
                setAvailReason('');
                loadAvailabilities();
            }
        } finally {
            setLoading(false);
        }
    };

    const deleteAvailability = async (id: number) => {
        if (!confirm('Remover esta ausência?')) return;

        const response = await fetch(`/api/availability/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
            },
        });

        if (response.ok) {
            loadAvailabilities();
        }
    };

    // Load data on mount
    useEffect(() => {
        loadHolidays();
        loadAvailabilities();
    }, [loadAvailabilities, loadHolidays]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Configurações', href: '/settings/profile' },
        { title: 'Capacidade', href: '/settings/capacity' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <Head title="Gestão de Capacidade" />

                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Gestão de Capacidade
                        </h1>
                        <p className="text-muted-foreground">
                            Configure feriados e disponibilidade da equipe
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Holidays */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Feriados Organizacionais</CardTitle>
                                <CardDescription>
                                    Dias não úteis que afetam o planejamento
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Data</Label>
                                    <Input
                                        type="date"
                                        value={holidayDate}
                                        onChange={(e) =>
                                            setHolidayDate(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Nome</Label>
                                    <Input
                                        value={holidayName}
                                        onChange={(e) =>
                                            setHolidayName(e.target.value)
                                        }
                                        placeholder="Ex: Natal"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="recurring"
                                        checked={holidayRecurring}
                                        onChange={(e) =>
                                            setHolidayRecurring(
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    <Label htmlFor="recurring">
                                        Repetir anualmente
                                    </Label>
                                </div>

                                <Button
                                    onClick={addHoliday}
                                    disabled={
                                        loading || !holidayDate || !holidayName
                                    }
                                    className="w-full"
                                >
                                    Adicionar Feriado
                                </Button>

                                <div className="max-h-64 space-y-2 overflow-y-auto">
                                    {holidays.map((holiday) => (
                                        <div
                                            key={holiday.id}
                                            className="flex items-center justify-between rounded border p-2"
                                        >
                                            <div>
                                                <div className="font-medium">
                                                    {holiday.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {format(
                                                        new Date(holiday.date),
                                                        'dd/MM/yyyy',
                                                    )}
                                                    {holiday.is_recurring &&
                                                        ' (anual)'}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    deleteHoliday(holiday.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Availability */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Minha Disponibilidade</CardTitle>
                                <CardDescription>
                                    Ausências e disponibilidade reduzida
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                        <Label>Data Início</Label>
                                        <Input
                                            type="date"
                                            value={availStartDate}
                                            onChange={(e) =>
                                                setAvailStartDate(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Data Fim</Label>
                                        <Input
                                            type="date"
                                            value={availEndDate}
                                            onChange={(e) =>
                                                setAvailEndDate(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Disponibilidade (%)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={availPercentage}
                                        onChange={(e) =>
                                            setAvailPercentage(
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        placeholder="0 = ausência total, 50 = meio período"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Motivo (opcional)</Label>
                                    <Input
                                        value={availReason}
                                        onChange={(e) =>
                                            setAvailReason(e.target.value)
                                        }
                                        placeholder="Ex: Férias"
                                    />
                                </div>

                                <Button
                                    onClick={addAvailability}
                                    disabled={
                                        loading ||
                                        !availStartDate ||
                                        !availEndDate
                                    }
                                    className="w-full"
                                >
                                    Adicionar Ausência
                                </Button>

                                <div className="max-h-64 space-y-2 overflow-y-auto">
                                    {availabilities.map((avail) => (
                                        <div
                                            key={avail.id}
                                            className="flex items-center justify-between rounded border p-2"
                                        >
                                            <div>
                                                <div className="font-medium">
                                                    {format(
                                                        new Date(
                                                            avail.start_date,
                                                        ),
                                                        'dd/MM',
                                                    )}{' '}
                                                    -{' '}
                                                    {format(
                                                        new Date(
                                                            avail.end_date,
                                                        ),
                                                        'dd/MM',
                                                    )}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {
                                                        avail.availability_percentage
                                                    }
                                                    % disponível
                                                    {avail.reason &&
                                                        ` • ${avail.reason}`}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    deleteAvailability(avail.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
