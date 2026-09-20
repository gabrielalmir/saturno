import { Head, Link, router, usePage } from '@inertiajs/react';
import { differenceInDays, format } from 'date-fns';
import { ArrowRight, CalendarDays, Clock3 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, SharedData } from '@/types';
import type { DashboardMetrics, Sprint, WorkItem } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Painel',
        href: dashboard().url,
    },
];

interface DashboardProps {
    currentSprint: Sprint | null;
    metrics: DashboardMetrics | null;
    n1Items: WorkItem[];
    n2Items: WorkItem[];
    velocity: { label: string; value: number }[];
}

type SprintHealth = 'on_track' | 'at_risk' | 'off_track';

type PanelContext = {
    title: string;
    description: string;
    links: Array<{ label: string; href: string }>;
};

type ActionItem = {
    id: string;
    title: string;
    description: string;
    href: string;
    panel: PanelContext;
};

function getInitials(name?: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
}

function SprintHealthBadge({ health }: { health: SprintHealth }) {
    const healthMap: Record<
        SprintHealth,
        { label: string; className: string }
    > = {
        on_track: {
            label: 'On track',
            className:
                'border-[color:var(--success)]/35 bg-[color:var(--success)]/10 text-[color:var(--success)]',
        },
        at_risk: {
            label: 'At risk',
            className:
                'border-[color:var(--warning)]/35 bg-[color:var(--warning)]/10 text-[color:var(--warning)]',
        },
        off_track: {
            label: 'Off track',
            className:
                'border-[color:var(--danger)]/35 bg-[color:var(--danger)]/10 text-[color:var(--danger)]',
        },
    };

    const tone = healthMap[health];

    return (
        <Badge
            variant="outline"
            className={`h-6 rounded-md px-2 text-[11px] font-medium ${tone.className}`}
        >
            Sprint Health: {tone.label}
        </Badge>
    );
}

function MetricCard({
    title,
    value,
    caption,
    cta,
    microTone,
    onOpen,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    buttonRef,
}: {
    title: string;
    value: string;
    caption: string;
    cta: string;
    microTone: 'accent' | 'warning' | 'danger';
    onOpen: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    buttonRef?: (node: HTMLButtonElement | null) => void;
}) {
    const toneClass: Record<string, string> = {
        accent: 'bg-[color:var(--accent)]',
        warning: 'bg-[color:var(--warning)]',
        danger: 'bg-[color:var(--danger)]',
    };

    return (
        <button
            ref={buttonRef}
            type="button"
            className="group w-full rounded-xl border border-border-subtle bg-surface text-left transition-[border-color,background-color] duration-150 ease-out hover:bg-muted/25 focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:outline-none"
            onClick={onOpen}
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    onOpen();
                }
                if (event.key === 'ArrowDown' && onArrowDown) {
                    event.preventDefault();
                    onArrowDown();
                }
                if (event.key === 'ArrowLeft' && onArrowLeft) {
                    event.preventDefault();
                    onArrowLeft();
                }
                if (event.key === 'ArrowRight' && onArrowRight) {
                    event.preventDefault();
                    onArrowRight();
                }
            }}
        >
            <div className={`h-[2px] w-full ${toneClass[microTone]}`} />
            <div className="space-y-2 p-4">
                <div className="text-[11px] font-medium tracking-wide text-[color:var(--text-tertiary)] uppercase">
                    {title}
                </div>
                <div className="text-2xl font-semibold text-[color:var(--text-primary)]">
                    {value}
                </div>
                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-[color:var(--text-secondary)]">
                        {caption}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-[color:var(--text-secondary)] group-hover:text-[color:var(--text-primary)]">
                        {cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                </div>
            </div>
        </button>
    );
}

function CapacityBarCompact({
    metrics,
    planningUnitLabel,
}: {
    metrics: DashboardMetrics;
    planningUnitLabel: string;
}) {
    const totalUsed = metrics.capacity.total - metrics.capacity.available;
    const usedPercent =
        metrics.capacity.total > 0
            ? Math.round((totalUsed / metrics.capacity.total) * 100)
            : 0;

    return (
        <Card className="border-border-subtle bg-surface">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[color:var(--text-secondary)]">
                    Capacidade
                </CardTitle>
                <p className="text-xs text-[color:var(--text-tertiary)]">
                    Uso total {totalUsed}/{metrics.capacity.total}{' '}
                    {planningUnitLabel} ({usedPercent}%)
                </p>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--bg-elevated)]">
                    <div className="flex h-full">
                        <div
                            className="h-full bg-[color:var(--warning)]/70"
                            style={{ width: `${metrics.capacity.n1ReservedPercent}%` }}
                        />
                        <div
                            className="h-full bg-[color:var(--accent)]/70"
                            style={{ width: `${metrics.capacity.n2PlannedPercent}%` }}
                        />
                        <div
                            className="h-full bg-[color:var(--border-strong)]"
                            style={{ width: `${metrics.capacity.availablePercent}%` }}
                        />
                    </div>
                </div>
                <div className="grid gap-2 text-xs text-[color:var(--text-secondary)] sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[color:var(--warning)]/80" />
                        Reservado: {metrics.capacity.n1Reserved}{planningUnitLabel}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]/80" />
                        Planejado: {metrics.capacity.n2Planned}{planningUnitLabel}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[color:var(--border-strong)]" />
                        Livre: {metrics.capacity.available}{planningUnitLabel}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function NextActionsList({
    items,
    onOpenAction,
    onMoveFocusToCards,
    firstItemRef,
}: {
    items: ActionItem[];
    onOpenAction: (item: ActionItem) => void;
    onMoveFocusToCards?: () => void;
    firstItemRef?: { current: HTMLButtonElement | null };
}) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [anchorIndex, setAnchorIndex] = useState<number | null>(null);
    const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

    const setRangeSelection = (from: number, to: number) => {
        const [start, end] = from < to ? [from, to] : [to, from];
        const range = items.slice(start, end + 1).map((item) => item.id);
        setSelectedIds(range);
    };

    return (
        <Card className="border-border-subtle bg-surface">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[color:var(--text-secondary)]">
                    Próximas ações
                </CardTitle>
                <p className="text-xs text-[color:var(--text-tertiary)]">
                    Setas navegam • Shift + setas seleciona • Enter abre painel
                </p>
            </CardHeader>
            <CardContent className="space-y-2">
                {items.map((item, index) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                        <button
                            key={item.id}
                            ref={(node) => {
                                itemRefs.current[index] = node;
                                if (index === 0 && firstItemRef) {
                                    firstItemRef.current = node;
                                }
                            }}
                            type="button"
                            className={`w-full rounded-lg border px-3 py-2 text-left transition-colors focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:outline-none ${isSelected ? 'border-[color:var(--focus-ring)] bg-[color:var(--focus-background)]' : 'border-border-subtle bg-muted/20 hover:bg-muted/30'}`}
                            onClick={() => {
                                setAnchorIndex(index);
                                setSelectedIds([item.id]);
                                onOpenAction(item);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    onOpenAction(item);
                                    return;
                                }

                                if (event.key === 'ArrowDown') {
                                    event.preventDefault();
                                    const next = Math.min(index + 1, items.length - 1);
                                    itemRefs.current[next]?.focus();

                                    if (event.shiftKey) {
                                        const anchor = anchorIndex ?? index;
                                        setRangeSelection(anchor, next);
                                    } else {
                                        setAnchorIndex(next);
                                        setSelectedIds([items[next].id]);
                                    }
                                    return;
                                }

                                if (event.key === 'ArrowUp') {
                                    event.preventDefault();
                                    if (index === 0) {
                                        onMoveFocusToCards?.();
                                        return;
                                    }
                                    const prev = Math.max(index - 1, 0);
                                    itemRefs.current[prev]?.focus();

                                    if (event.shiftKey) {
                                        const anchor = anchorIndex ?? index;
                                        setRangeSelection(anchor, prev);
                                    } else {
                                        setAnchorIndex(prev);
                                        setSelectedIds([items[prev].id]);
                                    }
                                }
                            }}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-[color:var(--text-primary)]">
                                    {item.title}
                                </span>
                                <ArrowRight className="h-4 w-4 text-[color:var(--text-tertiary)]" />
                            </div>
                            <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
                                {item.description}
                            </p>
                        </button>
                    );
                })}
            </CardContent>
        </Card>
    );
}

function SidePanel({
    open,
    onOpenChange,
    context,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    context: PanelContext | null;
}) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md">
                {!context ? (
                    <div className="space-y-3 p-4">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : (
                    <div className="space-y-4 px-4 pb-4">
                        <SheetHeader>
                            <SheetTitle className="text-base text-[color:var(--text-primary)]">
                                {context.title}
                            </SheetTitle>
                            <SheetDescription className="text-[color:var(--text-secondary)]">
                                {context.description}
                            </SheetDescription>
                        </SheetHeader>
                        <div className="space-y-2">
                            {context.links.map((entry) => (
                                <Button
                                    key={entry.href + entry.label}
                                    variant="outline"
                                    className="w-full justify-between border-border-subtle text-[color:var(--text-secondary)] hover:bg-muted/30 hover:text-[color:var(--text-primary)]"
                                    onClick={() =>
                                        router.visit(entry.href, {
                                            preserveScroll: true,
                                        })
                                    }
                                >
                                    {entry.label}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}

function computeSprintHealth({
    blockedCount,
    overdueCount,
    availablePercent,
}: {
    blockedCount: number;
    overdueCount: number;
    availablePercent: number;
}): SprintHealth {
    if (blockedCount >= 3 || overdueCount >= 2 || availablePercent <= 5) {
        return 'off_track';
    }

    if (blockedCount > 0 || overdueCount > 0 || availablePercent <= 15) {
        return 'at_risk';
    }

    return 'on_track';
}

export default function Dashboard({
    currentSprint,
    metrics,
    n1Items,
    n2Items,
    velocity,
}: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const planningUnit =
        auth?.currentOrganization?.planning_unit ?? 'story_points';
    const planningUnitLabel = planningUnit === 'hours' ? 'h' : 'SP';

    const [sidePanelOpen, setSidePanelOpen] = useState(false);
    const [sidePanelContext, setSidePanelContext] = useState<PanelContext | null>(
        null,
    );
    const timelineRef = useRef<HTMLButtonElement | null>(null);
    const metricRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const firstActionRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.defaultPrevented) return;

            const target = event.target as HTMLElement | null;
            const isTypingTarget =
                !!target &&
                (target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.tagName === 'SELECT' ||
                    target.isContentEditable);

            if (isTypingTarget) return;

            if (event.key.toLowerCase() === 't') {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                timelineRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!currentSprint || !metrics) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Painel" />
                <div className="flex h-full flex-1 flex-col gap-6 p-6">
                    <Card className="border-border-subtle bg-surface">
                        <CardContent className="p-12 text-center">
                            <h2 className="mb-2 text-xl font-semibold text-[color:var(--text-primary)]">
                                Nenhuma sprint ativa
                            </h2>
                            <p className="text-[color:var(--text-secondary)]">
                                Crie uma sprint para começar
                            </p>
                            <Button className="mt-4" asChild>
                                <Link href="/sprint-planning">Iniciar planejamento</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    const daysRemaining = differenceInDays(
        new Date(currentSprint.end_date),
        new Date(),
    );
    const totalDays = Math.max(
        1,
        differenceInDays(
            new Date(currentSprint.end_date),
            new Date(currentSprint.start_date),
        ) + 1,
    );
    const dayNumber = Math.max(1, totalDays - daysRemaining);

    const sprintItems = [...n1Items, ...n2Items];
    const now = new Date();
    const dueSoonThreshold = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const overdueCount = sprintItems.filter((item) => {
        if (!item.due_date || item.status === 'done') return false;
        const due = new Date(item.due_date);
        return !Number.isNaN(due.getTime()) && due < now;
    }).length;

    const dueSoonCount = sprintItems.filter((item) => {
        if (!item.due_date || item.status === 'done') return false;
        const due = new Date(item.due_date);
        return !Number.isNaN(due.getTime()) && due >= now && due <= dueSoonThreshold;
    }).length;

    const sprintHealth = computeSprintHealth({
        blockedCount: metrics.blockedItems.count,
        overdueCount,
        availablePercent: metrics.capacity.availablePercent,
    });

    const velocityMax = Math.max(1, ...velocity.map((entry) => entry.value));
    const velocityAverage =
        velocity.length > 0
            ? Math.round(
                  velocity.reduce((sum, entry) => sum + entry.value, 0) /
                      velocity.length,
              )
            : 0;

    const openPanel = (context: PanelContext) => {
        setSidePanelContext(context);
        setSidePanelOpen(true);
    };

    const reviewPanel: PanelContext = {
        title: 'Revisar sprint',
        description:
            'Acesse rapidamente os pontos críticos da sprint e execute ajustes sem sair do fluxo.',
        links: [
            { label: 'Abrir quadro da sprint', href: '/sprint-board' },
            { label: 'Revisar itens bloqueados', href: '/work-items?status=blocked' },
            {
                label: 'Ajustar capacidade',
                href: '/settings/capacity',
            },
        ],
    };

    const nextActions: ActionItem[] = [
            {
                id: 'blocked',
                title: `Resolver ${Math.max(metrics.blockedItems.count, 1)} bloqueio(s)`,
                description: 'Dependências e impedimentos ativos impactando o fluxo.',
                href: '/work-items?status=blocked',
                panel: {
                    title: 'Bloqueios em aberto',
                    description:
                        'Priorize itens bloqueados para reduzir fila e restaurar throughput.',
                    links: [
                        { label: 'Ver itens bloqueados', href: '/work-items?status=blocked' },
                        { label: 'Abrir quadro', href: '/sprint-board' },
                    ],
                },
            },
            {
                id: 'rebalance',
                title: 'Rebalancear capacidade N1/N2',
                description: `Livre: ${metrics.capacity.available}${planningUnitLabel}. Ajuste antes de estourar WIP.`,
                href: '/settings/capacity',
                panel: {
                    title: 'Rebalancear capacidade',
                    description:
                        'Ajuste reserva operacional e compromisso planejado para manter previsibilidade.',
                    links: [
                        { label: 'Abrir capacidade', href: '/settings/capacity' },
                        { label: 'Abrir planejamento', href: '/sprint-planning' },
                    ],
                },
            },
            {
                id: 'no-estimate',
                title: 'Revisar itens sem estimativa',
                description: 'Itens sem estimativa reduzem previsibilidade de entrega.',
                href: '/work-items',
                panel: {
                    title: 'Itens sem estimativa',
                    description:
                        'Revise escopo sem sizing para melhorar leitura de risco da sprint.',
                    links: [
                        { label: 'Abrir lista de itens', href: '/work-items' },
                        { label: 'Abrir board', href: '/sprint-board' },
                    ],
                },
            },
            {
                id: 'due',
                title: `Atuar em ${overdueCount + dueSoonCount} prazo(s) críticos`,
                description: 'Inclui atrasos e itens próximos de vencer nas próximas 48h.',
                href: '/work-items',
                panel: {
                    title: 'Prazos críticos',
                    description:
                        'Trate atrasos e vencimentos próximos para evitar efeito cascata na sprint.',
                    links: [
                        { label: 'Abrir itens de trabalho', href: '/work-items' },
                        { label: 'Abrir calendário da sprint', href: '/sprint-calendar' },
                    ],
                },
            },
        ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Painel" />
            <div className="flex h-full flex-1 flex-col gap-5 bg-background p-6">
                <header className="rounded-xl border border-border-subtle bg-surface px-4 py-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--text-primary)]">
                                    Sprint Ativa
                                </h1>
                                <SprintHealthBadge health={sprintHealth} />
                            </div>
                            <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
                                {format(new Date(currentSprint.start_date), 'MMM dd')} -{' '}
                                {format(new Date(currentSprint.end_date), 'MMM dd')} • termina em{' '}
                                {daysRemaining} dias
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                ref={timelineRef}
                                type="button"
                                className="inline-flex items-center gap-1 rounded-md border border-border-subtle bg-muted/20 px-2 py-1 text-xs text-[color:var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:outline-none"
                            >
                                <CalendarDays className="h-3.5 w-3.5" />
                                Dia {dayNumber} de {totalDays}
                            </button>
                            <Button
                                size="sm"
                                className="bg-[color:var(--accent)] text-[color:var(--text-primary)] hover:bg-[color:var(--accent-hover)]"
                                onClick={() => openPanel(reviewPanel)}
                            >
                                Revisar sprint
                            </Button>
                        </div>
                    </div>
                </header>

                <section className="space-y-3">
                    <div className="text-xs font-medium tracking-wide text-[color:var(--text-tertiary)] uppercase">
                        Status agora
                    </div>
                    <div className="grid gap-3 xl:grid-cols-3">
                        <MetricCard
                            title="Bloqueios"
                            value={`${metrics.blockedItems.count}`}
                            caption="Impedimentos ativos no fluxo"
                            cta="Ver itens"
                            microTone={metrics.blockedItems.count > 0 ? 'warning' : 'accent'}
                            onOpen={() =>
                                openPanel({
                                    title: 'Itens bloqueados',
                                    description: 'Liste e trate impedimentos que travam a execução diária.',
                                    links: [
                                        {
                                            label: 'Abrir bloqueados',
                                            href: '/work-items?status=blocked',
                                        },
                                        { label: 'Abrir quadro', href: '/sprint-board' },
                                    ],
                                })
                            }
                            buttonRef={(node) => {
                                metricRefs.current[0] = node;
                            }}
                            onArrowRight={() => metricRefs.current[1]?.focus()}
                            onArrowDown={() => firstActionRef.current?.focus()}
                        />
                        <MetricCard
                            title="Prazos críticos"
                            value={`${overdueCount + dueSoonCount}`}
                            caption={`${overdueCount} atrasado(s) • ${dueSoonCount} próximo(s) do vencimento`}
                            cta="Ver itens"
                            microTone={overdueCount > 0 ? 'danger' : 'warning'}
                            onOpen={() =>
                                openPanel({
                                    title: 'Atrasos e vencimentos próximos',
                                    description: 'Ataque os itens críticos de prazo para manter a sprint previsível.',
                                    links: [
                                        { label: 'Abrir itens', href: '/work-items' },
                                        { label: 'Abrir calendário', href: '/sprint-calendar' },
                                    ],
                                })
                            }
                            buttonRef={(node) => {
                                metricRefs.current[1] = node;
                            }}
                            onArrowLeft={() => metricRefs.current[0]?.focus()}
                            onArrowRight={() => metricRefs.current[2]?.focus()}
                            onArrowDown={() => firstActionRef.current?.focus()}
                        />
                        <MetricCard
                            title="Capacidade restante"
                            value={`${metrics.capacity.available}${planningUnitLabel}`}
                            caption="Espaço livre para absorver trabalho adicional"
                            cta="Ajustar"
                            microTone={metrics.capacity.availablePercent < 15 ? 'warning' : 'accent'}
                            onOpen={() =>
                                openPanel({
                                    title: 'Ajuste de capacidade',
                                    description: 'Revise reserva N1 e carga planejada para evitar sobrecarga.',
                                    links: [
                                        {
                                            label: 'Abrir capacidade',
                                            href: '/settings/capacity',
                                        },
                                        {
                                            label: 'Abrir planejamento',
                                            href: '/sprint-planning',
                                        },
                                    ],
                                })
                            }
                            buttonRef={(node) => {
                                metricRefs.current[2] = node;
                            }}
                            onArrowLeft={() => metricRefs.current[1]?.focus()}
                            onArrowDown={() => firstActionRef.current?.focus()}
                        />
                    </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                    <CapacityBarCompact
                        metrics={metrics}
                        planningUnitLabel={planningUnitLabel}
                    />
                    <NextActionsList
                        items={nextActions}
                        onOpenAction={(item) => openPanel(item.panel)}
                        onMoveFocusToCards={() => metricRefs.current[0]?.focus()}
                        firstItemRef={firstActionRef}
                    />
                </section>

                <section>
                    <Card className="border-border-subtle bg-surface">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-[color:var(--text-secondary)]">
                                    Tendência de velocidade
                                </CardTitle>
                                <span className="inline-flex items-center gap-1 text-xs text-[color:var(--text-tertiary)]">
                                    <Clock3 className="h-3.5 w-3.5" />
                                    Média: {velocityAverage} {planningUnitLabel}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {velocity.length === 0 ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-24 w-full rounded-lg" />
                                    <p className="text-xs text-[color:var(--text-tertiary)]">
                                        Carregando histórico…
                                    </p>
                                </div>
                            ) : (
                                <div className="grid h-32 grid-cols-6 items-end gap-2">
                                    {velocity.map((entry) => {
                                        const height = Math.max(
                                            8,
                                            (entry.value / velocityMax) * 96,
                                        );
                                        return (
                                            <div
                                                key={entry.label}
                                                className="flex flex-col items-center gap-1"
                                            >
                                                <div
                                                    className="w-full rounded-sm border border-border-subtle bg-[color:var(--accent)]/35"
                                                    style={{ height }}
                                                    title={`${entry.label}: ${entry.value} ${planningUnitLabel}`}
                                                />
                                                <span className="line-clamp-1 text-center text-[10px] text-[color:var(--text-tertiary)]">
                                                    {entry.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-base font-semibold text-[color:var(--text-primary)]">
                                <Badge className="border border-border-subtle bg-muted/35 text-[color:var(--text-secondary)]">
                                    N1
                                </Badge>
                                Operacional e incidentes
                            </h2>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                            >
                                <Link
                                    href={`/work-items?tier=N1&sprint_id=${currentSprint.id}`}
                                >
                                    Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {n1Items.length === 0 ? (
                                <Card className="border-border-subtle bg-surface">
                                    <CardContent className="p-6 text-center text-sm text-[color:var(--text-tertiary)]">
                                        Nenhum item N1 nesta sprint
                                    </CardContent>
                                </Card>
                            ) : (
                                n1Items.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/work-items/${item.id}`}
                                        className="block"
                                    >
                                        <Card className="border-border-subtle bg-surface transition-colors hover:bg-muted/25">
                                            <CardContent className="space-y-2 p-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-[color:var(--text-tertiary)]">
                                                            #{item.id}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className="border-border-subtle text-[10px] text-[color:var(--text-secondary)]"
                                                        >
                                                            {item.priority}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-xs text-[color:var(--text-tertiary)]">
                                                        {item.estimate || 0}h
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-medium text-[color:var(--text-primary)]">
                                                    {item.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-[color:var(--text-secondary)]">
                                                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-border-subtle bg-muted/35 text-[10px]">
                                                        {getInitials(item.assignee?.name)}
                                                    </div>
                                                    <span>
                                                        {item.assignee?.name ||
                                                            'Sem responsável'}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-base font-semibold text-[color:var(--text-primary)]">
                                <Badge className="border border-border-subtle bg-muted/35 text-[color:var(--text-secondary)]">
                                    N2
                                </Badge>
                                Projetos estratégicos
                            </h2>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                            >
                                <Link href="/sprint-board">
                                    Ver quadro <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {n2Items.length === 0 ? (
                                <Card className="border-border-subtle bg-surface">
                                    <CardContent className="p-6 text-center text-sm text-[color:var(--text-tertiary)]">
                                        Nenhum item N2 nesta sprint
                                    </CardContent>
                                </Card>
                            ) : (
                                n2Items.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/work-items/${item.id}`}
                                        className="block"
                                    >
                                        <Card className="border-border-subtle bg-surface transition-colors hover:bg-muted/25">
                                            <CardContent className="space-y-2 p-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-[color:var(--text-tertiary)]">
                                                            #{item.id}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className="border-border-subtle text-[10px] text-[color:var(--text-secondary)]"
                                                        >
                                                            {item.status}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-xs text-[color:var(--text-tertiary)]">
                                                        {item.estimate || 0}{' '}
                                                        {planningUnitLabel}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-medium text-[color:var(--text-primary)]">
                                                    {item.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-[color:var(--text-secondary)]">
                                                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-border-subtle bg-muted/35 text-[10px]">
                                                        {getInitials(item.assignee?.name)}
                                                    </div>
                                                    <span>
                                                        {item.assignee?.name ||
                                                            'Sem responsável'}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <SidePanel
                open={sidePanelOpen}
                onOpenChange={setSidePanelOpen}
                context={sidePanelContext}
            />
        </AppLayout>
    );
}
