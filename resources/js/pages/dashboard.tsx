import { Head, Link, usePage } from '@inertiajs/react';
import { format, differenceInDays } from 'date-fns';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, SharedData } from '@/types';
import type { Sprint, WorkItem, DashboardMetrics } from '@/types/models';

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

function getInitials(name?: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
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

    if (!currentSprint || !metrics) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Painel" />
                <div className="flex h-full flex-1 flex-col gap-6 p-6">
                    <Card>
                        <CardContent className="p-12 text-center">
                            <h2 className="mb-2 text-xl font-semibold">
                                Nenhuma sprint ativa
                            </h2>
                            <p className="text-muted-foreground">
                                Crie uma sprint para comecar
                            </p>
                            <Button className="mt-4" asChild>
                                <Link href="/sprint-planning">
                                    Iniciar planejamento
                                </Link>
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
    const totalDays = differenceInDays(
        new Date(currentSprint.end_date),
        new Date(currentSprint.start_date),
    );
    const dayNumber = totalDays - daysRemaining;
    const velocityMax = Math.max(1, ...velocity.map((entry) => entry.value));
    const velocityAverage =
        velocity.length > 0
            ? Math.round(
                  velocity.reduce((sum, entry) => sum + entry.value, 0) /
                      velocity.length,
              )
            : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Painel" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Sprint Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">
                                {currentSprint.name}
                            </h1>
                            <Badge className="badge-status-in-progress">
                                ATIVA
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {format(
                                new Date(currentSprint.start_date),
                                'MMM dd',
                            )}{' '}
                            -{' '}
                            {format(new Date(currentSprint.end_date), 'MMM dd')}{' '}
                            • Termina em {daysRemaining} dias
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                            Linha do tempo
                        </div>
                        <div className="text-lg font-semibold">
                            Dia {dayNumber} de {totalDays}
                        </div>
                    </div>
                </div>

                {/* Capacity Planning Bar */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                {metrics.capacity.n1ReservedPercent > 25 && (
                                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                                )}
                                Planejamento de Capacidade
                                {metrics.capacity.availablePercent < 10 && (
                                    <Badge
                                        variant="outline"
                                        className="badge-status-blocked ml-2"
                                    >
                                        Risco de estouro N1
                                    </Badge>
                                )}
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">
                                Uso total:{' '}
                                {metrics.capacity.total -
                                    metrics.capacity.available}
                                /{metrics.capacity.total} {planningUnitLabel} (
                                {(
                                    ((metrics.capacity.total -
                                        metrics.capacity.available) /
                                        metrics.capacity.total) *
                                    100
                                ).toFixed(0)}
                                %)
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-sm bg-rose-500"></div>
                                    <span>
                                        Reserva N1 (
                                        {metrics.capacity.n1Reserved}
                                        {planningUnitLabel})
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-sm bg-blue-500"></div>
                                    <span>
                                        Planejado N2 (
                                        {metrics.capacity.n2Planned}
                                        {planningUnitLabel})
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-sm bg-slate-600"></div>
                                    <span>
                                        Disponivel ({metrics.capacity.available}
                                        {planningUnitLabel})
                                    </span>
                                </div>
                            </div>
                            <div className="relative h-12 w-full overflow-hidden rounded-lg bg-slate-800">
                                <div className="absolute inset-0 flex">
                                    {metrics.capacity.n1ReservedPercent > 0 && (
                                        <div
                                            className="flex items-center justify-center bg-rose-500 text-sm font-medium text-white"
                                            style={{
                                                width: `${metrics.capacity.n1ReservedPercent}%`,
                                            }}
                                        >
                                            {metrics.capacity.n1ReservedPercent.toFixed(
                                                0,
                                            )}
                                            %
                                        </div>
                                    )}
                                    {metrics.capacity.n2PlannedPercent > 0 && (
                                        <div
                                            className="flex items-center justify-center bg-blue-500 text-sm font-medium text-white"
                                            style={{
                                                width: `${metrics.capacity.n2PlannedPercent}%`,
                                            }}
                                        >
                                            {metrics.capacity.n2PlannedPercent.toFixed(
                                                0,
                                            )}
                                            %
                                        </div>
                                    )}
                                    {metrics.capacity.availablePercent > 0 && (
                                        <div
                                            className="flex items-center justify-center bg-slate-600 text-sm font-medium text-white"
                                            style={{
                                                width: `${metrics.capacity.availablePercent}%`,
                                            }}
                                        >
                                            {metrics.capacity.availablePercent.toFixed(
                                                0,
                                            )}
                                            % Livre
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>0%</span>
                                <span>25%</span>
                                <span>50%</span>
                                <span>75%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Metrics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-rose-500/20">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Impacto N1
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-rose-400">
                                {metrics.capacity.n1Reserved > 0
                                    ? `+${((metrics.capacity.n1Reserved / metrics.capacity.total) * 100).toFixed(0)}%`
                                    : '0%'}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Capacidade reservada •{' '}
                                {metrics.capacity.n1Reserved}{' '}
                                {planningUnitLabel}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-500/20">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Itens bloqueados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-amber-400">
                                {metrics.blockedItems.count}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {metrics.blockedItems.count > 0
                                    ? 'PRECISA DE ATENCAO'
                                    : 'Sem bloqueios'}{' '}
                                • Dependencias pendentes
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-500/20">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Velocidade do time
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-400">
                                {metrics.capacity.n2Planned} {planningUnitLabel}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Compromisso da sprint atual
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Velocity Chart */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Velocidade (ultimas 6 sprints)
                            </CardTitle>
                            <span className="text-xs text-muted-foreground">
                                Media: {velocityAverage} {planningUnitLabel}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {velocity.length === 0 ? (
                            <div className="text-sm text-muted-foreground">
                                Nenhuma sprint concluida ainda.
                            </div>
                        ) : (
                            <div className="grid h-40 grid-cols-6 items-end gap-3">
                                {velocity.map((entry) => {
                                    const height = Math.max(
                                        8,
                                        (entry.value / velocityMax) * 140,
                                    );
                                    return (
                                        <div
                                            key={entry.label}
                                            className="flex flex-col items-center gap-2"
                                        >
                                            <div
                                                className="w-full rounded-md border border-blue-500/40 bg-blue-500/30"
                                                style={{ height }}
                                                title={`${entry.label}: ${entry.value} ${planningUnitLabel}`}
                                            />
                                            <span className="line-clamp-1 text-center text-[11px] text-muted-foreground">
                                                {entry.label}
                                            </span>
                                            <span className="text-[11px] font-medium text-blue-400">
                                                {entry.value}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Work Items Lists */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* N1 - Operational & Incidents */}
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-semibold">
                                <Badge className="badge-tier-n1">N1</Badge>
                                Operacional e Incidentes
                            </h2>
                            <Button
                                asChild
                                variant="link"
                                size="sm"
                                className="text-rose-400"
                            >
                                <Link
                                    href={`/work-items?tier=N1&sprint_id=${currentSprint.id}`}
                                >
                                    VER TODOS{' '}
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {n1Items.length === 0 ? (
                                <Card>
                                    <CardContent className="p-8 text-center text-muted-foreground">
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
                                        <Card className="transition-colors hover:border-rose-500/30">
                                            <CardContent className="p-4">
                                                <div className="mb-2 flex items-start justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            #{item.id}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className="badge-priority-p0"
                                                        >
                                                            {item.priority}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {item.estimate || 0}h
                                                    </span>
                                                </div>
                                                <h3 className="mb-2 text-sm font-medium">
                                                    {item.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[10px]">
                                                        {getInitials(
                                                            item.assignee?.name,
                                                        )}
                                                    </div>
                                                    <span>
                                                        {item.assignee?.name ||
                                                            'Sem responsavel'}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* N2 - Strategic Projects */}
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-semibold">
                                <Badge className="badge-tier-n2">N2</Badge>
                                Projetos estrategicos
                            </h2>
                            <Button
                                asChild
                                variant="link"
                                size="sm"
                                className="text-blue-400"
                            >
                                <Link href="/sprint-board">
                                    VER QUADRO{' '}
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {n2Items.length === 0 ? (
                                <Card>
                                    <CardContent className="p-8 text-center text-muted-foreground">
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
                                        <Card className="transition-colors hover:border-blue-500/30">
                                            <CardContent className="p-4">
                                                <div className="mb-2 flex items-start justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            #{item.id}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className="badge-status-in-progress"
                                                        >
                                                            {item.status}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {item.estimate || 0}{' '}
                                                        {planningUnitLabel}
                                                    </span>
                                                </div>
                                                <h3 className="mb-2 text-sm font-medium">
                                                    {item.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[10px]">
                                                        {getInitials(
                                                            item.assignee?.name,
                                                        )}
                                                    </div>
                                                    <span>
                                                        {item.assignee?.name ||
                                                            'Sem responsavel'}
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
        </AppLayout>
    );
}
