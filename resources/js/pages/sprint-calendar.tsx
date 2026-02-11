import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    addDays,
    format,
    getDay,
    isSameDay,
    parse,
    parseISO,
    startOfWeek,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { BlockedReasonDialog } from '@/components/work-items/BlockedReasonDialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData } from '@/types';
import type { Sprint, User, WorkItem } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Calendario de Sprints', href: '/sprint-calendar' },
];

const locales = {
    'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
    getDay,
    locales,
});

type View = 'month' | 'week' | 'work_week' | 'day' | 'agenda';

type CalendarEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    type: 'sprint' | 'work-item-due' | 'work-item-planned';
    priority?: string;
};

interface SprintCalendarProps {
    sprints: Sprint[];
    workItems: WorkItem[];
    focusWorkItems: WorkItem[];
    currentSprint: Sprint | null;
    users: User[];
    selectedAssigneeId: number;
}

export default function SprintCalendar({
    sprints,
    workItems,
    focusWorkItems,
    currentSprint,
    users,
    selectedAssigneeId,
}: SprintCalendarProps) {
    type InertiaErrorBag = Record<string, string | undefined>;

    const page = usePage<SharedData>();
    const currentUser = page.props.auth?.user as unknown as User | undefined;
    const [showSprints, setShowSprints] = useState(true);
    const [showDueItems, setShowDueItems] = useState(true);
    const [showPlannedItems, setShowPlannedItems] = useState(true);
    const [priorityFilters, setPriorityFilters] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentView, setCurrentView] = useState<View>('day');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [plannerError, setPlannerError] = useState<string | null>(null);
    const [blockedDialogOpen, setBlockedDialogOpen] = useState(false);
    const [pendingBlockId, setPendingBlockId] = useState<number | null>(null);

    const activeSprint =
        sprints.find((sprint) => sprint.status === 'active') ?? null;
    const events = useMemo<CalendarEvent[]>(() => {
        const sprintEvents: CalendarEvent[] = sprints.map((sprint) => ({
            id: `sprint-${sprint.id}`,
            title: sprint.name,
            start: parseISO(sprint.start_date),
            end: addDays(parseISO(sprint.end_date), 1),
            allDay: true,
            type: 'sprint',
        }));

        const dueEvents: CalendarEvent[] = workItems
            .filter((item) => item.due_date)
            .map((item) => ({
                id: `work-item-${item.id}`,
                title: `#${item.id} ${item.title}`,
                start: parseISO(item.due_date as string),
                end: addDays(parseISO(item.due_date as string), 1),
                allDay: true,
                type: 'work-item-due',
                priority: item.priority,
            }));

        const plannedEvents: CalendarEvent[] = workItems
            .filter((item) => item.planned_for)
            .map((item) => ({
                id: `work-item-planned-${item.id}`,
                title: `#${item.id} ${item.title}`,
                start: parseISO(item.planned_for as string),
                end: addDays(parseISO(item.planned_for as string), 1),
                allDay: true,
                type: 'work-item-planned',
                priority: item.priority,
            }));

        return [...sprintEvents, ...dueEvents, ...plannedEvents];
    }, [sprints, workItems]);

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            if (event.type === 'sprint' && !showSprints) return false;
            if (event.type === 'work-item-due' && !showDueItems) return false;
            if (event.type === 'work-item-planned' && !showPlannedItems)
                return false;
            if (
                (event.type === 'work-item-due' ||
                    event.type === 'work-item-planned') &&
                priorityFilters.length > 0
            ) {
                if (
                    !event.priority ||
                    !priorityFilters.includes(event.priority)
                )
                    return false;
            }
            if (searchQuery.trim().length > 0) {
                return event.title
                    .toLowerCase()
                    .includes(searchQuery.trim().toLowerCase());
            }
            return true;
        });
    }, [events, priorityFilters, searchQuery, showSprints, showDueItems, showPlannedItems]);

    const togglePriority = (value: string) => {
        setPriorityFilters((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value],
        );
    };

    const clearFilters = () => {
        setShowSprints(true);
        setShowDueItems(true);
        setShowPlannedItems(true);
        setPriorityFilters([]);
        setSearchQuery('');
    };

    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const plannerDateLabel = format(currentDate, 'dd/MM (EEE)', {
        locale: ptBR,
    });

    const myInProgress = focusWorkItems.filter(
        (item) => item.status === 'in_progress',
    );
    const myReady = focusWorkItems.filter((item) => item.status === 'ready');
    const myBlocked = focusWorkItems.filter(
        (item) => item.status === 'blocked',
    );

    const isDueOnSelectedDay = (item: WorkItem) => {
        if (!item.due_date) return false;
        return isSameDay(parseISO(item.due_date), currentDate);
    };

    const isPlannedForSelectedDay = (item: WorkItem) => {
        const plannedFor = item.planned_for;
        if (!plannedFor) return false;
        return isSameDay(parseISO(plannedFor), currentDate);
    };

    const updateItem = (id: number, payload: Record<string, unknown>) => {
        setPlannerError(null);
        router.put(`/work-items/${id}`, payload, {
            preserveScroll: true,
            onError: (errors: InertiaErrorBag) => {
                const msg =
                    errors.status ||
                    errors.assignee_id ||
                    errors.estimate ||
                    errors.blocked_reason ||
                    errors.due_date ||
                    errors.planned_for ||
                    'Não foi possível atualizar o item.';
                setPlannerError(msg);
            },
            onSuccess: () => router.reload(),
        });
    };

    const currentAssignee =
        users.find((u) => u.id === selectedAssigneeId) ?? currentUser;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendario de Sprints" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">
                        Calendario de Sprints
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Visualize sprints como barras contínuas e acompanhe work
                        items com data de vencimento.
                    </p>
                </div>

                {sprints.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Nenhuma sprint cadastrada
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Crie a primeira sprint para desbloquear o
                                    calendario.
                                </p>
                            </div>
                            <Button asChild>
                                <Link href="/sprint-planning">
                                    Criar sprint
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                    <Card className="h-fit">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Meu dia</CardTitle>
                            <div className="text-sm text-muted-foreground">
                                {plannerDateLabel}
                                {currentSprint
                                    ? ` • ${currentSprint.name}`
                                    : ''}
                            </div>
                            {currentAssignee && (
                                <div className="text-xs text-muted-foreground">
                                    {currentAssignee.name}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {plannerError && (
                                <Alert variant="destructive">
                                    <AlertTitle>
                                        Não foi possível aplicar
                                    </AlertTitle>
                                    <AlertDescription>
                                        {plannerError}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentDate(new Date())}
                                >
                                    Hoje
                                </Button>
                                {currentSprint && (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/sprint-board">
                                            Abrir quadro
                                        </Link>
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/work-items">
                                        Lista de itens
                                    </Link>
                                </Button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <div className="text-xs text-muted-foreground">
                                    Pessoa
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            {currentAssignee?.name ??
                                                'Selecionar'}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="w-64"
                                    >
                                        <DropdownMenuLabel>
                                            Planejar para
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <div className="max-h-72 overflow-auto">
                                            {users.map((u) => (
                                                <DropdownMenuCheckboxItem
                                                    key={u.id}
                                                    checked={
                                                        u.id ===
                                                        selectedAssigneeId
                                                    }
                                                    onCheckedChange={() => {
                                                        router.get(
                                                            '/sprint-calendar',
                                                            {
                                                                assignee_id:
                                                                    u.id,
                                                            },
                                                            {
                                                                preserveScroll: true,
                                                                preserveState: true,
                                                            },
                                                        );
                                                    }}
                                                >
                                                    {u.name}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-3">
                                <div className="text-xs font-semibold text-muted-foreground">
                                    Em progresso ({myInProgress.length})
                                </div>
                                {myInProgress.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">
                                        Nada em andamento.
                                    </div>
                                ) : (
                                    myInProgress.map((item) => (
                                        <div
                                            key={item.id}
                                            className="rounded-lg border border-border/70 bg-card/30 p-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <Link
                                                    href={`/work-items/${item.id}`}
                                                    className="min-w-0"
                                                >
                                                    <div className="truncate text-sm font-medium">
                                                        #{item.id} {item.title}
                                                    </div>
                                                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                        <span>
                                                            {item.priority}
                                                        </span>
                                                        {item.epic_id && (
                                                            <span>
                                                                EP-
                                                                {item.epic_id}
                                                            </span>
                                                        )}
                                                        {item.ticket_id && (
                                                            <span>
                                                                TK-
                                                                {item.ticket_id}
                                                            </span>
                                                        )}
                                                        {item.estimate ? (
                                                            <span>
                                                                {item.estimate}
                                                                {item.tier ===
                                                                'N1'
                                                                    ? 'h'
                                                                    : 'SP'}
                                                            </span>
                                                        ) : null}
                                                        {isDueOnSelectedDay(
                                                            item,
                                                        ) && (
                                                            <Badge
                                                                variant="outline"
                                                                className="px-1.5 py-0 text-[10px]"
                                                            >
                                                                vence hoje
                                                            </Badge>
                                                        )}
                                                        {isPlannedForSelectedDay(
                                                            item,
                                                        ) && (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-primary/40 bg-primary/10 px-1.5 py-0 text-[10px]"
                                                            >
                                                                planejado hoje
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </Link>
                                                <div className="flex flex-col gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            updateItem(
                                                                item.id,
                                                                {
                                                                    status: 'done',
                                                                },
                                                            )
                                                        }
                                                    >
                                                        Concluir
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            updateItem(
                                                                item.id,
                                                                {
                                                                    planned_for:
                                                                        dateKey,
                                                                },
                                                            )
                                                        }
                                                    >
                                                        Planejar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setPendingBlockId(
                                                                item.id,
                                                            );
                                                            setBlockedDialogOpen(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        Bloquear
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="text-xs font-semibold text-muted-foreground">
                                    Pronto para puxar ({myReady.length})
                                </div>
                                {myReady.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">
                                        Nada pronto.
                                    </div>
                                ) : (
                                    myReady.map((item) => (
                                        <div
                                            key={item.id}
                                            className="rounded-lg border border-border/70 bg-card/30 p-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <Link
                                                    href={`/work-items/${item.id}`}
                                                    className="min-w-0"
                                                >
                                                    <div className="truncate text-sm font-medium">
                                                        #{item.id} {item.title}
                                                    </div>
                                                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                        <span>
                                                            {item.priority}
                                                        </span>
                                                        {item.epic_id && (
                                                            <span>
                                                                EP-
                                                                {item.epic_id}
                                                            </span>
                                                        )}
                                                        {item.estimate ? (
                                                            <span>
                                                                {item.estimate}
                                                                {item.tier ===
                                                                'N1'
                                                                    ? 'h'
                                                                    : 'SP'}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </Link>
                                                <div className="flex flex-col gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            updateItem(
                                                                item.id,
                                                                {
                                                                    status: 'in_progress',
                                                                },
                                                            )
                                                        }
                                                    >
                                                        Iniciar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            updateItem(
                                                                item.id,
                                                                {
                                                                    planned_for:
                                                                        dateKey,
                                                                },
                                                            )
                                                        }
                                                    >
                                                        Planejar
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="text-xs font-semibold text-muted-foreground">
                                    Bloqueados ({myBlocked.length})
                                </div>
                                {myBlocked.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">
                                        Sem bloqueios.
                                    </div>
                                ) : (
                                    myBlocked.map((item) => (
                                        <div
                                            key={item.id}
                                            className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <Link
                                                    href={`/work-items/${item.id}`}
                                                    className="min-w-0"
                                                >
                                                    <div className="truncate text-sm font-medium">
                                                        #{item.id} {item.title}
                                                    </div>
                                                    {item.blocked_reason && (
                                                        <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                            {
                                                                item.blocked_reason
                                                            }
                                                        </div>
                                                    )}
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        updateItem(item.id, {
                                                            status: 'in_progress',
                                                        })
                                                    }
                                                >
                                                    Retomar
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="calendar-shell">
                        <CardHeader className="pb-3">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <CardTitle className="text-base">
                                    Calendário
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500/60" />
                                        Sprint
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
                                        Vencimento
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                                        Planejado
                                    </span>
                                </div>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-1 flex-wrap items-center gap-3">
                                    <Input
                                        value={searchQuery}
                                        onChange={(event) =>
                                            setSearchQuery(event.target.value)
                                        }
                                        placeholder="Buscar eventos..."
                                        className="w-64"
                                    />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                Filtros
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="start"
                                            className="w-56"
                                        >
                                            <DropdownMenuLabel>
                                                Tipo
                                            </DropdownMenuLabel>
                                            <DropdownMenuGroup>
                                                <DropdownMenuCheckboxItem
                                                    checked={showSprints}
                                                    onCheckedChange={() =>
                                                        setShowSprints(
                                                            (prev) => !prev,
                                                        )
                                                    }
                                                >
                                                    Sprints
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    checked={showDueItems}
                                                    onCheckedChange={() =>
                                                        setShowDueItems(
                                                            (prev) => !prev,
                                                        )
                                                    }
                                                >
                                                    Vencimentos
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    checked={showPlannedItems}
                                                    onCheckedChange={() =>
                                                        setShowPlannedItems(
                                                            (prev) => !prev,
                                                        )
                                                    }
                                                >
                                                    Planejado
                                                </DropdownMenuCheckboxItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>
                                                Prioridade
                                            </DropdownMenuLabel>
                                            <DropdownMenuGroup>
                                                {['P0', 'P1', 'P2', 'P3'].map(
                                                    (priority) => (
                                                        <DropdownMenuCheckboxItem
                                                            key={priority}
                                                            checked={priorityFilters.includes(
                                                                priority,
                                                            )}
                                                            onCheckedChange={() =>
                                                                togglePriority(
                                                                    priority,
                                                                )
                                                            }
                                                        >
                                                            {priority}
                                                        </DropdownMenuCheckboxItem>
                                                    ),
                                                )}
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full"
                                                onClick={clearFilters}
                                            >
                                                Limpar filtros
                                            </Button>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentDate(new Date())
                                        }
                                    >
                                        Hoje
                                    </Button>
                                    {activeSprint && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentDate(
                                                    parseISO(
                                                        activeSprint.start_date,
                                                    ),
                                                )
                                            }
                                        >
                                            Sprint ativa
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[70vh]">
                                <Calendar
                                    localizer={localizer}
                                    events={filteredEvents}
                                    startAccessor="start"
                                    endAccessor="end"
                                    defaultView="day"
                                    view={currentView}
                                    onView={setCurrentView}
                                    date={currentDate}
                                    onNavigate={setCurrentDate}
                                    onSelectEvent={(event: CalendarEvent) => {
                                        if (event.type === 'work-item-due') {
                                            const id = parseInt(
                                                event.id.replace(
                                                    'work-item-',
                                                    '',
                                                ),
                                            );
                                            if (!Number.isNaN(id))
                                                router.visit(
                                                    `/work-items/${id}`,
                                                );
                                            return;
                                        }

                                        if (
                                            event.type === 'work-item-planned'
                                        ) {
                                            const id = parseInt(
                                                event.id.replace(
                                                    'work-item-planned-',
                                                    '',
                                                ),
                                            );
                                            if (!Number.isNaN(id))
                                                router.visit(
                                                    `/work-items/${id}`,
                                                );
                                            return;
                                        }

                                        if (event.type === 'sprint') {
                                            router.visit('/sprint-planning');
                                        }
                                    }}
                                    toolbar
                                    popup
                                    eventPropGetter={(event: CalendarEvent) => {
                                        const priorityClass = event.priority
                                            ? `calendar-event-priority-${event.priority.toLowerCase()}`
                                            : 'calendar-event-priority-p2';
                                        return {
                                            className: `calendar-event ${
                                                event.type === 'sprint'
                                                    ? 'calendar-event-sprint'
                                                    : event.type ===
                                                        'work-item-planned'
                                                      ? `calendar-event-work-item calendar-event-planned ${priorityClass}`
                                                      : `calendar-event-work-item ${priorityClass}`
                                            }`,
                                        };
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <BlockedReasonDialog
                open={blockedDialogOpen}
                onOpenChange={setBlockedDialogOpen}
                itemCount={pendingBlockId ? 1 : 0}
                onConfirm={(reason) => {
                    if (!pendingBlockId) return;
                    updateItem(pendingBlockId, {
                        status: 'blocked',
                        blocked_reason: reason,
                    });
                    setBlockedDialogOpen(false);
                    setPendingBlockId(null);
                }}
            />
        </AppLayout>
    );
}
