import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    addDays,
    format,
    isBefore,
    isSameDay,
    parseISO,
    startOfDay,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    AlertTriangle,
    CalendarDays,
    CheckCircle2,
    CircleSlash,
    Clock3,
    Command,
    Flag,
    Link2,
    ListTodo,
    MessageSquare,
    PauseCircle,
    PlayCircle,
    Plus,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/work-items/StatusBadge';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData } from '@/types';
import type { Sprint, User, WorkItem } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Calendario de Sprints', href: '/sprint-calendar' },
];

type InertiaErrorBag = Record<string, string | undefined>;

type CalendarTask = WorkItem & {
    source: 'focus' | 'timeline';
};

type TimeBlock = {
    item: CalendarTask;
    startMin: number;
    durationMin: number;
    lane: number;
    lanes: number;
    hasConflict: boolean;
    dueToday: boolean;
    overdue: boolean;
};

const DAY_START_HOUR = 8;
const DAY_END_HOUR = 21;
const ROW_HEIGHT = 44;

const minutesSinceStart = (date: Date): number =>
    (date.getHours() - DAY_START_HOUR) * 60 + date.getMinutes();

const clamp = (value: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, value));

const asDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

const overlaps = (a: TimeBlock, b: TimeBlock): boolean => {
    const aEnd = a.startMin + a.durationMin;
    const bEnd = b.startMin + b.durationMin;
    return a.startMin < bEnd && b.startMin < aEnd;
};

function estimateDurationMinutes(item: CalendarTask): number {
    const estimate = item.estimate ?? 2;

    if (item.tier === 'N1') {
        return clamp(Math.round(estimate * 60), 45, 240);
    }

    // N2 in story points is converted to a compact daily planning block.
    return clamp(Math.round((estimate / 2) * 60), 45, 210);
}

function priorityWeight(priority?: string): number {
    if (priority === 'P0') return 0;
    if (priority === 'P1') return 1;
    if (priority === 'P2') return 2;
    return 3;
}

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
    const page = usePage<SharedData>();
    const currentUser = page.props.auth?.user as unknown as User | undefined;
    const currentProject =
        (page.props.auth as { currentProject?: { name?: string } } | undefined)
            ?.currentProject ?? null;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [plannerError, setPlannerError] = useState<string | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [sprintFilter, setSprintFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [blockReason, setBlockReason] = useState('');

    const dateKey = asDateKey(selectedDate);

    const currentAssignee =
        users.find((u) => u.id === selectedAssigneeId) ?? currentUser;

    const timelineTasks = useMemo<CalendarTask[]>(() => {
        return workItems.map((item) => ({ ...item, source: 'timeline' }));
    }, [workItems]);

    const focusTasks = useMemo<CalendarTask[]>(() => {
        return focusWorkItems.map((item) => ({ ...item, source: 'focus' }));
    }, [focusWorkItems]);

    const mergedById = useMemo(() => {
        const map = new Map<number, CalendarTask>();

        timelineTasks.forEach((item) => map.set(item.id, item));
        focusTasks.forEach((item) =>
            map.set(item.id, {
                ...map.get(item.id),
                ...item,
                source: 'focus',
            }),
        );

        return Array.from(map.values());
    }, [focusTasks, timelineTasks]);

    const filteredTasks = useMemo(() => {
        return mergedById
            .filter((item) => {
                if (sprintFilter === 'all') return true;
                if (sprintFilter === 'none') return !item.sprint_id;
                return item.sprint_id?.toString() === sprintFilter;
            })
            .filter((item) => {
                if (statusFilter === 'all') return true;
                return item.status === statusFilter;
            })
            .filter((item) => {
                const q = searchQuery.trim().toLowerCase();
                if (!q) return true;
                return (
                    item.title.toLowerCase().includes(q) ||
                    String(item.id).includes(q) ||
                    (item.blocked_reason || '').toLowerCase().includes(q)
                );
            });
    }, [mergedById, searchQuery, sprintFilter, statusFilter]);

    const selectedDayTasks = useMemo(() => {
        const selectedDayStart = startOfDay(selectedDate);

        return filteredTasks.filter((item) => {
            const plannedFor = item.planned_for ? parseISO(item.planned_for) : null;
            const dueDate = item.due_date ? parseISO(item.due_date) : null;

            return (
                (plannedFor && isSameDay(plannedFor, selectedDayStart)) ||
                (dueDate && isSameDay(dueDate, selectedDayStart)) ||
                item.status === 'in_progress'
            );
        });
    }, [filteredTasks, selectedDate]);

    const timeBlocks = useMemo<TimeBlock[]>(() => {
        const sorted = [...selectedDayTasks].sort((a, b) => {
            const dueA = a.due_date ? parseISO(a.due_date).getTime() : Number.MAX_SAFE_INTEGER;
            const dueB = b.due_date ? parseISO(b.due_date).getTime() : Number.MAX_SAFE_INTEGER;
            if (dueA !== dueB) return dueA - dueB;
            if (priorityWeight(a.priority) !== priorityWeight(b.priority)) {
                return priorityWeight(a.priority) - priorityWeight(b.priority);
            }
            return a.id - b.id;
        });

        const reduced = sorted.reduce(
            (acc, item) => {
                const durationMin = estimateDurationMinutes(item);
                const dueToday =
                    !!item.due_date && isSameDay(parseISO(item.due_date), selectedDate);
                const overdue =
                    !!item.due_date &&
                    isBefore(parseISO(item.due_date), startOfDay(new Date())) &&
                    item.status !== 'done';

                const preferredStart =
                    item.status === 'in_progress'
                        ? clamp(
                              minutesSinceStart(new Date()) + DAY_START_HOUR * 60,
                              9 * 60,
                              18 * 60,
                          )
                        : acc.cursor;

                const startMin = clamp(
                    preferredStart,
                    DAY_START_HOUR * 60,
                    DAY_END_HOUR * 60 - 30,
                );

                acc.blocks.push({
                    item,
                    startMin,
                    durationMin,
                    lane: 0,
                    lanes: 1,
                    hasConflict: false,
                    dueToday,
                    overdue,
                });
                acc.cursor = startMin + durationMin + 15;

                return acc;
            },
            { cursor: 9 * 60, blocks: [] as TimeBlock[] },
        );

        const provisional = reduced.blocks;

        for (let i = 0; i < provisional.length; i += 1) {
            const activeLanes: number[] = [];
            for (let j = 0; j < i; j += 1) {
                if (overlaps(provisional[i], provisional[j])) {
                    activeLanes.push(provisional[j].lane);
                }
            }

            let lane = 0;
            while (activeLanes.includes(lane)) lane += 1;
            provisional[i].lane = lane;
        }

        for (let i = 0; i < provisional.length; i += 1) {
            const overlapGroup = provisional.filter((candidate) =>
                overlaps(candidate, provisional[i]),
            );
            const lanes = Math.max(
                1,
                ...overlapGroup.map((candidate) => candidate.lane + 1),
            );
            provisional[i].lanes = lanes;
            provisional[i].hasConflict = lanes > 1;
        }

        return provisional;
    }, [selectedDate, selectedDayTasks]);

    const visibleTaskIds = timeBlocks.map((block) => block.item.id);

    const effectiveSelectedTaskId =
        selectedTaskId && visibleTaskIds.includes(selectedTaskId)
            ? selectedTaskId
            : (visibleTaskIds[0] ?? null);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const isTyping =
                !!target &&
                (target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.tagName === 'SELECT' ||
                    target.isContentEditable);

            if (isTyping || visibleTaskIds.length === 0) return;

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setSelectedTaskId((prev) => {
                    const currentIndex = prev ? visibleTaskIds.indexOf(prev) : -1;
                    const nextIndex = clamp(
                        currentIndex + 1,
                        0,
                        visibleTaskIds.length - 1,
                    );
                    return visibleTaskIds[nextIndex];
                });
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                setSelectedTaskId((prev) => {
                    const currentIndex = prev ? visibleTaskIds.indexOf(prev) : 0;
                    const nextIndex = clamp(
                        currentIndex - 1,
                        0,
                        visibleTaskIds.length - 1,
                    );
                    return visibleTaskIds[nextIndex];
                });
            }

            if (event.key === 'Enter' && effectiveSelectedTaskId) {
                event.preventDefault();
                router.visit(`/work-items/${effectiveSelectedTaskId}`);
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [effectiveSelectedTaskId, visibleTaskIds]);

    const selectedTask =
        filteredTasks.find((item) => item.id === effectiveSelectedTaskId) ?? null;

    const myInProgress = focusTasks.filter((item) => item.status === 'in_progress');
    const myPullable = focusTasks.filter((item) => item.status === 'ready');
    const myBlocked = focusTasks.filter((item) => item.status === 'blocked');
    const requiresAttention =
        myBlocked.length +
        focusTasks.filter(
            (item) =>
                !!item.due_date &&
                isBefore(parseISO(item.due_date), addDays(startOfDay(new Date()), 1)) &&
                item.status !== 'done',
        ).length;

    const sprintIndicator = currentSprint
        ? {
              label: currentSprint.name,
              used: currentSprint.capacity_reserved_n1,
              total: currentSprint.capacity_total,
              remaining: Math.max(
                  0,
                  currentSprint.capacity_total - currentSprint.capacity_reserved_n1,
              ),
          }
        : null;

    const updateItem = (id: number, payload: Record<string, unknown>) => {
        setPlannerError(null);
        router.put(`/work-items/${id}`, payload, {
            preserveScroll: true,
            preserveState: true,
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
            onSuccess: () => router.reload({ only: ['focusWorkItems', 'workItems'] }),
        });
    };

    const plannerDateLabel = format(selectedDate, "EEEE, dd 'de' MMMM", {
        locale: ptBR,
    });

    const sprintWindowLabel = currentSprint
        ? `${format(parseISO(currentSprint.start_date), 'dd/MM')} - ${format(parseISO(currentSprint.end_date), 'dd/MM')}`
        : 'Sem sprint ativa';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orquestração diária" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-5">
                {plannerError && (
                    <Alert variant="destructive">
                        <AlertTitle>Falha ao atualizar item</AlertTitle>
                        <AlertDescription>{plannerError}</AlertDescription>
                    </Alert>
                )}

                <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
                    <aside className="rounded-xl border border-border-subtle bg-[var(--bg-elevated)] p-4 xl:sticky xl:top-4 xl:h-[calc(100vh-120px)] xl:overflow-auto">
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm font-semibold text-text-primary">
                                    Resumo de hoje
                                </div>
                                <div className="mt-1 text-xs text-text-tertiary">
                                    {format(selectedDate, 'dd/MM/yyyy')} •{' '}
                                    {currentAssignee?.name ?? 'Sem responsável'}
                                </div>
                            </div>

                            <div className="rounded-lg border border-border-subtle bg-surface px-3 py-2">
                                <div className="flex items-center justify-between text-xs text-text-secondary">
                                    <span>Requer atenção</span>
                                    <span className="text-text-primary font-medium">
                                        {requiresAttention}
                                    </span>
                                </div>
                                <div className="mt-2 text-xs text-text-tertiary">
                                    {requiresAttention > 0
                                        ? 'Há itens atrasados, bloqueados ou com risco para hoje.'
                                        : 'Fluxo estável no momento.'}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                                    <span>Meu trabalho</span>
                                    <span>{myInProgress.length}</span>
                                </div>
                                {myInProgress.slice(0, 4).map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className="w-full rounded-md border border-border-subtle bg-surface px-2.5 py-2 text-left hover:bg-[var(--bg-hover)]"
                                        onClick={() => setSelectedTaskId(item.id)}
                                    >
                                        <div className="truncate text-xs text-text-primary">
                                            #{item.id} {item.title}
                                        </div>
                                        <div className="mt-1 text-[11px] text-text-tertiary">
                                            {item.priority} • em progresso
                                        </div>
                                    </button>
                                ))}
                                {myInProgress.length === 0 && (
                                    <div className="text-xs text-text-tertiary">
                                        Nada em andamento.
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                                    <span>Puxáveis</span>
                                    <span>{myPullable.length}</span>
                                </div>
                                {myPullable.slice(0, 4).map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className="w-full rounded-md border border-border-subtle bg-surface px-2.5 py-2 text-left hover:bg-[var(--bg-hover)]"
                                        onClick={() => setSelectedTaskId(item.id)}
                                    >
                                        <div className="truncate text-xs text-text-primary">
                                            #{item.id} {item.title}
                                        </div>
                                        <div className="mt-1 text-[11px] text-text-tertiary">
                                            {item.priority} • pronto
                                        </div>
                                    </button>
                                ))}
                                {myPullable.length === 0 && (
                                    <div className="text-xs text-text-tertiary">
                                        Nada pronto para iniciar.
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                                    <span>Bloqueados</span>
                                    <span>{myBlocked.length}</span>
                                </div>
                                {myBlocked.slice(0, 4).map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className="w-full rounded-md border border-danger/30 bg-danger/10 px-2.5 py-2 text-left"
                                        onClick={() => setSelectedTaskId(item.id)}
                                    >
                                        <div className="truncate text-xs text-text-primary">
                                            #{item.id} {item.title}
                                        </div>
                                        <div className="mt-1 line-clamp-2 text-[11px] text-text-tertiary">
                                            {item.blocked_reason ||
                                                'Sem motivo registrado.'}
                                        </div>
                                    </button>
                                ))}
                                {myBlocked.length === 0 && (
                                    <div className="text-xs text-text-tertiary">
                                        Sem bloqueios.
                                    </div>
                                )}
                            </div>

                            <div className="rounded-lg border border-border-subtle bg-surface px-3 py-2">
                                <div className="text-xs font-semibold text-text-secondary">
                                    Sprint
                                </div>
                                <div className="mt-1 text-xs text-text-primary">
                                    {sprintIndicator?.label ?? 'Sem sprint ativa'}
                                </div>
                                <div className="mt-1 text-[11px] text-text-tertiary">
                                    Janela: {sprintWindowLabel}
                                </div>
                                {sprintIndicator && (
                                    <>
                                        <div className="mt-2 h-1.5 rounded-full bg-muted">
                                            <div
                                                className="h-1.5 rounded-full bg-accent"
                                                style={{
                                                    width: `${Math.min(100, (sprintIndicator.used / Math.max(1, sprintIndicator.total)) * 100)}%`,
                                                }}
                                            />
                                        </div>
                                        <div className="mt-1 text-[11px] text-text-tertiary">
                                            Capacidade restante: {sprintIndicator.remaining}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </aside>

                    <main className="min-h-0 rounded-xl border border-border-subtle bg-surface p-3 md:p-4">
                        <div className="sticky top-0 z-10 mb-3 rounded-lg border border-border-subtle bg-[var(--bg-elevated)] p-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative min-w-[220px] flex-1">
                                    <input
                                        value={searchQuery}
                                        onChange={(event) =>
                                            setSearchQuery(event.target.value)
                                        }
                                        placeholder="Buscar por ID, título ou impedimento..."
                                        className="h-9 w-full rounded-md border border-border-subtle bg-surface px-3 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedDate(new Date())}
                                >
                                    <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                                    Hoje
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.visit('/work-items')}
                                >
                                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                                    Quick add
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Command className="mr-1.5 h-3.5 w-3.5" />
                                    Cmd/Ctrl + K
                                </Button>
                            </div>

                            <div className="mt-2 grid gap-2 md:grid-cols-4">
                                <Select
                                    value={selectedAssigneeId.toString()}
                                    onValueChange={(value) => {
                                        router.get(
                                            '/sprint-calendar',
                                            { assignee_id: parseInt(value, 10) },
                                            {
                                                preserveScroll: true,
                                                preserveState: true,
                                            },
                                        );
                                    }}
                                >
                                    <SelectTrigger className="h-8 border-border-subtle bg-surface text-xs">
                                        <SelectValue placeholder="Assignee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((u) => (
                                            <SelectItem
                                                key={u.id}
                                                value={u.id.toString()}
                                            >
                                                {u.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={sprintFilter}
                                    onValueChange={setSprintFilter}
                                >
                                    <SelectTrigger className="h-8 border-border-subtle bg-surface text-xs">
                                        <SelectValue placeholder="Sprint" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas sprints</SelectItem>
                                        <SelectItem value="none">Sem sprint</SelectItem>
                                        {sprints.map((sprint) => (
                                            <SelectItem
                                                key={sprint.id}
                                                value={sprint.id.toString()}
                                            >
                                                {sprint.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="h-8 border-border-subtle bg-surface text-xs">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos status</SelectItem>
                                        <SelectItem value="ready">Pronto</SelectItem>
                                        <SelectItem value="in_progress">
                                            Em progresso
                                        </SelectItem>
                                        <SelectItem value="blocked">Bloqueado</SelectItem>
                                        <SelectItem value="done">Concluído</SelectItem>
                                    </SelectContent>
                                </Select>

                                <input
                                    type="date"
                                    value={dateKey}
                                    onChange={(event) =>
                                        setSelectedDate(
                                            parseISO(`${event.target.value}T00:00:00`),
                                        )
                                    }
                                    className="h-8 rounded-md border border-border-subtle bg-surface px-2 text-xs text-text-primary outline-none focus:border-accent"
                                />
                            </div>
                        </div>

                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <div className="text-sm font-semibold text-text-primary">
                                    {plannerDateLabel}
                                </div>
                                <div className="text-xs text-text-tertiary">
                                    {timeBlocks.length} blocos planejados • use ↑↓ para navegar
                                </div>
                                {currentProject?.name && (
                                    <div className="mt-1 text-[11px] text-text-tertiary">
                                        Projeto: {currentProject.name}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-text-tertiary">
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-accent" />
                                    Planejado
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-warning" />
                                    Vence hoje
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-danger" />
                                    Atrasado
                                </span>
                            </div>
                        </div>

                        <div className="grid min-h-0 grid-cols-[64px_minmax(0,1fr)] overflow-hidden rounded-lg border border-border-subtle">
                            <div className="border-r border-border-subtle bg-[var(--bg-elevated)]">
                                {Array.from(
                                    { length: DAY_END_HOUR - DAY_START_HOUR + 1 },
                                    (_, i) => DAY_START_HOUR + i,
                                ).map((hour) => (
                                    <div
                                        key={hour}
                                        className="border-b border-border-subtle/70 px-2 text-right text-xs leading-[44px] text-text-tertiary"
                                        style={{ height: ROW_HEIGHT }}
                                    >
                                        {String(hour).padStart(2, '0')}:00
                                    </div>
                                ))}
                            </div>

                            <div className="relative bg-background">
                                {Array.from(
                                    { length: DAY_END_HOUR - DAY_START_HOUR + 1 },
                                    (_, i) => DAY_START_HOUR + i,
                                ).map((hour) => (
                                    <div
                                        key={`row-${hour}`}
                                        className="border-b border-border-subtle/70"
                                        style={{ height: ROW_HEIGHT }}
                                    />
                                ))}

                                {timeBlocks.map((block) => {
                                    const top =
                                        ((block.startMin - DAY_START_HOUR * 60) / 60) *
                                        ROW_HEIGHT;
                                    const height =
                                        (block.durationMin / 60) * ROW_HEIGHT;
                                    const width = `${100 / block.lanes}%`;
                                    const left = `${(block.lane / block.lanes) * 100}%`;
                                    const isSelected =
                                        effectiveSelectedTaskId === block.item.id;

                                    return (
                                        <button
                                            key={block.item.id}
                                            type="button"
                                            onClick={() => setSelectedTaskId(block.item.id)}
                                            className={`absolute rounded-md border px-2 py-1 text-left shadow-sm transition ${isSelected ? 'border-accent bg-[var(--bg-active)] ring-1 ring-accent-soft' : 'border-border-default bg-surface hover:bg-[var(--bg-hover)]'} ${block.overdue ? 'border-danger/60' : ''}`}
                                            style={{
                                                top,
                                                left,
                                                width,
                                                height: Math.max(36, height),
                                            }}
                                        >
                                            <div className="truncate text-xs font-medium text-text-primary">
                                                #{block.item.id} {block.item.title}
                                            </div>
                                            <div className="mt-1 flex flex-wrap items-center gap-1 text-[10px] text-text-tertiary">
                                                <StatusBadge
                                                    status={block.item.status}
                                                    className="h-4 px-1.5 py-0 text-[10px]"
                                                />
                                                <span>{block.item.priority ?? 'P2'}</span>
                                                {block.hasConflict && (
                                                    <Badge
                                                        variant="outline"
                                                        className="h-4 border-warning/40 bg-warning/10 px-1.5 py-0 text-[10px] text-warning"
                                                    >
                                                        conflito
                                                    </Badge>
                                                )}
                                                {block.dueToday && (
                                                    <Badge
                                                        variant="outline"
                                                        className="h-4 border-warning/40 bg-warning/10 px-1.5 py-0 text-[10px] text-warning"
                                                    >
                                                        vence hoje
                                                    </Badge>
                                                )}
                                                {block.overdue && (
                                                    <Badge
                                                        variant="outline"
                                                        className="h-4 border-danger/40 bg-danger/10 px-1.5 py-0 text-[10px] text-danger"
                                                    >
                                                        atrasado
                                                    </Badge>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}

                                {timeBlocks.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center text-sm text-text-tertiary">
                                        Sem trabalho mapeado para este dia com os filtros atuais.
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>

                    <aside className="rounded-xl border border-border-subtle bg-[var(--bg-elevated)] p-4 xl:sticky xl:top-4 xl:h-[calc(100vh-120px)] xl:overflow-auto">
                        {!selectedTask ? (
                            <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
                                Selecione um bloco para abrir contexto operacional.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm font-semibold text-text-primary">
                                        #{selectedTask.id} {selectedTask.title}
                                    </div>
                                    <div className="mt-1 flex items-center gap-2">
                                        <StatusBadge status={selectedTask.status} />
                                        <Badge variant="outline" className="text-xs">
                                            {selectedTask.priority ?? 'P2'}
                                        </Badge>
                                        {selectedTask.sprint?.name && (
                                            <Badge variant="outline" className="text-xs">
                                                {selectedTask.sprint.name}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <div className="mb-1 text-xs font-semibold text-text-secondary">
                                        Details
                                    </div>
                                    <div className="space-y-1 text-xs text-text-tertiary">
                                        <div>
                                            Tipo: {selectedTask.type ?? 'work_item'} • Tamanho:{' '}
                                            {selectedTask.size ?? 'padrao'}
                                        </div>
                                        <div>
                                            Planejado:{' '}
                                            {selectedTask.planned_for
                                                ? format(
                                                      parseISO(
                                                          selectedTask.planned_for,
                                                      ),
                                                      'dd/MM',
                                                  )
                                                : 'não definido'}
                                        </div>
                                        <div>
                                            Vencimento:{' '}
                                            {selectedTask.due_date
                                                ? format(
                                                      parseISO(selectedTask.due_date),
                                                      'dd/MM',
                                                  )
                                                : 'não definido'}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-1 text-xs font-semibold text-text-secondary">
                                        Comments
                                    </div>
                                    <Textarea
                                        value={blockReason}
                                        onChange={(event) =>
                                            setBlockReason(event.target.value)
                                        }
                                        placeholder="Anote contexto rápido para daily ou handoff..."
                                        className="min-h-20 border-border-subtle bg-surface text-xs"
                                    />
                                </div>

                                <div>
                                    <div className="mb-1 text-xs font-semibold text-text-secondary">
                                        Subtasks
                                    </div>
                                    <div className="rounded-md border border-border-subtle bg-surface px-2.5 py-2 text-xs text-text-tertiary">
                                        <ListTodo className="mr-1 inline h-3.5 w-3.5" />
                                        Abra o item para gerenciar subtarefas em detalhe.
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-1 text-xs font-semibold text-text-secondary">
                                        Dependencies
                                    </div>
                                    <div className="rounded-md border border-border-subtle bg-surface px-2.5 py-2 text-xs text-text-tertiary">
                                        <Link2 className="mr-1 inline h-3.5 w-3.5" />
                                        Mapeie dependências no detalhe do work item.
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 text-xs font-semibold text-text-secondary">
                                        Change status
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                updateItem(selectedTask.id, {
                                                    status: 'ready',
                                                })
                                            }
                                        >
                                            <Clock3 className="mr-1.5 h-3.5 w-3.5" />
                                            Ready
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                updateItem(selectedTask.id, {
                                                    status: 'in_progress',
                                                })
                                            }
                                        >
                                            <PlayCircle className="mr-1.5 h-3.5 w-3.5" />
                                            Iniciar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                updateItem(selectedTask.id, {
                                                    status: 'done',
                                                })
                                            }
                                        >
                                            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                                            Done
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                if (!blockReason.trim()) {
                                                    setPlannerError(
                                                        'Informe um motivo para bloquear o item.',
                                                    );
                                                    return;
                                                }

                                                updateItem(selectedTask.id, {
                                                    status: 'blocked',
                                                    blocked_reason: blockReason,
                                                });
                                            }}
                                        >
                                            <PauseCircle className="mr-1.5 h-3.5 w-3.5" />
                                            Bloquear
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            updateItem(selectedTask.id, {
                                                planned_for: dateKey,
                                            })
                                        }
                                    >
                                        <Flag className="mr-1.5 h-3.5 w-3.5" />
                                        Planejar hoje
                                    </Button>
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={`/work-items/${selectedTask.id}`}>
                                            <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                                            Abrir detalhe
                                        </Link>
                                    </Button>
                                </div>

                                {selectedTask.status === 'blocked' && (
                                    <div className="rounded-md border border-danger/30 bg-danger/10 px-2.5 py-2 text-xs text-text-tertiary">
                                        <AlertTriangle className="mr-1 inline h-3.5 w-3.5 text-danger" />
                                        {selectedTask.blocked_reason ||
                                            'Bloqueio sem motivo registrado.'}
                                    </div>
                                )}

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedTaskId(null);
                                        setBlockReason('');
                                    }}
                                >
                                    <CircleSlash className="mr-1.5 h-3.5 w-3.5" />
                                    Fechar contexto
                                </Button>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
