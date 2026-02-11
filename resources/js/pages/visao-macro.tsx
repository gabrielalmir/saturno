import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Layers,
    ListFilter,
    ShieldAlert,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, SharedData } from '@/types';
import type { FlowMetrics, Sprint } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Visao Macro',
        href: '/visao-macro',
    },
];

type MacroAlert =
    | {
          kind: 'blocked_aging';
          severity: 'high' | 'medium' | 'low';
          title: string;
          age_hours: number;
          work_item: { id: number; title: string; assignee?: string | null };
          href: string;
      }
    | {
          kind: 'due_soon' | 'due_overdue';
          severity: 'high' | 'medium' | 'low';
          title: string;
          days_to_due: number;
          work_item: {
              id: number;
              title: string;
              assignee?: string | null;
              status?: string | null;
          };
          href: string;
      };

type VelocityPoint = { label: string; value: number };

interface VisaoMacroPageProps {
    currentSprint: Sprint | null;
    capacity: {
        total: number;
        n1Reserved: number;
        n2Planned: number;
        available: number;
        n1ReservedPercent: number;
        n2PlannedPercent: number;
        availablePercent: number;
    } | null;
    wip: { count: number; limit: number } | null;
    flowMetrics: FlowMetrics | null;
    velocity: VelocityPoint[];
    alerts: MacroAlert[];
}

function formatHours(hours: number | null | undefined) {
    if (hours === null || hours === undefined) return 'n/a';
    if (hours < 24) return `${hours}h`;
    const days = Math.round((hours / 24) * 10) / 10;
    return `${days}d`;
}

function severityBadgeVariant(sev: MacroAlert['severity']) {
    if (sev === 'high') return 'destructive' as const;
    if (sev === 'medium') return 'secondary' as const;
    return 'outline' as const;
}

export default function VisaoMacroPage({
    currentSprint,
    capacity,
    wip,
    flowMetrics,
    velocity,
    alerts,
}: VisaoMacroPageProps) {
    const { auth } = usePage<SharedData>().props;
    const planningUnit =
        auth?.currentOrganization?.planning_unit ?? 'story_points';
    const planningUnitLabel = planningUnit === 'hours' ? 'h' : 'SP';

    const velocityMax = Math.max(1, ...velocity.map((v) => v.value));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visao Macro" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Visao Macro</h1>
                        <p className="text-sm text-muted-foreground">
                            Sinal vs ruido para decisao gerencial, sem perder o
                            last-mile da execucao.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={dashboard().url}>
                            Ir para o Painel{' '}
                            <ArrowRight className="ml-2 size-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Layers className="size-4" />
                                Macro
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Comparativos, tendencias e risco executivo.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <ListFilter className="size-4" />
                                Tatico
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Priorizacao, balanceamento de carga e remocao de
                            impedimentos.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <ShieldAlert className="size-4" />
                                Operacional
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Execucao diaria com clareza do proximo passo e
                            bloqueios.
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-3">
                            <span>Snapshot (sprint ativa)</span>
                            {currentSprint ? (
                                <Badge className="badge-status-in-progress">
                                    {currentSprint.name}
                                </Badge>
                            ) : (
                                <Badge variant="outline">
                                    Sem sprint ativa
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!currentSprint || !capacity ? (
                            <div className="text-sm text-muted-foreground">
                                A visao macro fica melhor com uma sprint ativa
                                (capacidade, WIP, aging e alertas por fluxo).
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-4">
                                <Card className="border-primary/20">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Capacidade livre
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {capacity.available}
                                            {planningUnitLabel}
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            Total {capacity.total}
                                            {planningUnitLabel} • Reserva N1{' '}
                                            {capacity.n1Reserved}
                                            {planningUnitLabel} • Planejado N2{' '}
                                            {capacity.n2Planned}
                                            {planningUnitLabel}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-amber-500/20">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            WIP
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {wip?.count ?? 0}
                                            {wip?.limit ? (
                                                <span className="text-sm text-muted-foreground">
                                                    {' '}
                                                    / {wip.limit}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            Em progresso na sprint ativa
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-500/20">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Throughput (sprint)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {flowMetrics?.throughput ?? 0}
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            Concluidos no intervalo da sprint
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-500/20">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Cycle time (medio / p95)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {formatHours(
                                                flowMetrics?.avg_cycle_time_hours ??
                                                    null,
                                            )}
                                            <span className="text-sm text-muted-foreground">
                                                {' '}
                                                /{' '}
                                                {formatHours(
                                                    flowMetrics?.p95_cycle_time_hours ??
                                                        null,
                                                )}
                                            </span>
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            Baseado em `started_at` e
                                            `completed_at`
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="size-4 text-amber-500" />
                            Alertas objetivos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {alerts.length === 0 ? (
                            <div className="text-sm text-muted-foreground">
                                Nenhum alerta encontrado nas regras atuais.
                            </div>
                        ) : (
                            <div className="grid gap-3 md:grid-cols-2">
                                {alerts.map((a, idx) => (
                                    <Card
                                        key={`${a.kind}-${idx}`}
                                        className="border-amber-500/15"
                                    >
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex items-center justify-between gap-3 text-sm">
                                                <span className="truncate">
                                                    {a.title}
                                                </span>
                                                <Badge
                                                    variant={severityBadgeVariant(
                                                        a.severity,
                                                    )}
                                                >
                                                    {a.severity.toUpperCase()}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="text-sm">
                                                <Link
                                                    href={a.href}
                                                    className="font-medium text-primary hover:underline"
                                                >
                                                    WI-{a.work_item.id}{' '}
                                                    {a.work_item.title}
                                                </Link>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {a.work_item.assignee
                                                    ? `Responsavel: ${a.work_item.assignee}`
                                                    : 'Sem responsavel'}
                                            </div>
                                            {a.kind === 'blocked_aging' ? (
                                                <div className="text-xs text-muted-foreground">
                                                    Bloqueado ha {a.age_hours}h
                                                </div>
                                            ) : (
                                                <div className="text-xs text-muted-foreground">
                                                    {a.kind === 'due_overdue'
                                                        ? `Atraso: ${Math.abs(a.days_to_due)}d`
                                                        : `Vence em: ${a.days_to_due}d`}
                                                    {a.work_item.status
                                                        ? ` • Status: ${a.work_item.status}`
                                                        : null}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Velocidade (ultimas sprints concluidas)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {velocity.length === 0 ? (
                            <div className="text-sm text-muted-foreground">
                                Ainda nao ha sprints concluidas para calcular
                                velocidade.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {velocity.map((v) => (
                                    <div
                                        key={v.label}
                                        className="grid grid-cols-[140px_minmax(0,1fr)_72px] items-center gap-3"
                                    >
                                        <div className="truncate text-sm text-muted-foreground">
                                            {v.label}
                                        </div>
                                        <div className="h-2 overflow-hidden rounded bg-muted">
                                            <div
                                                className="h-full rounded bg-primary"
                                                style={{
                                                    width: `${(v.value / velocityMax) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <div className="text-right text-sm font-medium">
                                            {v.value}
                                            {planningUnitLabel}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

