import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { differenceInHours, format } from 'date-fns';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Clock,
    User,
    Calendar,
    CheckCircle2,
    XCircle,
    Link as LinkIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DeleteWorkItemDialog } from '@/components/work-items/DeleteWorkItemDialog';
import { WorkItemFormDialog } from '@/components/work-items/WorkItemFormDialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { User as AppUser, WorkItem, WorkItemEvent, IntegrationLink } from '@/types/models';

interface WorkItemDetailProps {
    workItem: WorkItem & { integration_links: IntegrationLink[] };
}

const statusColors: Record<string, string> = {
    backlog: 'badge-status-backlog',
    ready: 'badge-status-ready',
    in_progress: 'badge-status-in-progress',
    blocked: 'badge-status-blocked',
    done: 'badge-status-done',
};

const priorityColors: Record<string, string> = {
    P0: 'badge-priority-p0',
    P1: 'badge-priority-p1',
    P2: 'badge-priority-p2',
    P3: 'badge-priority-p3',
};

export default function WorkItemDetail({ workItem }: WorkItemDetailProps) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { data, setData, post, errors } = useForm({
        jira_key: '',
        remote_url: '',
    });

    const pageProps = usePage().props as { users?: AppUser[] };
    const orgUsers = pageProps.users || [];

    const findUserName = (id: number | null | undefined) => {
        if (!id) return 'Não atribuído';
        return orgUsers.find((u) => u.id === id)?.name || `User#${id}`;
    };

    const renderEventLabel = (event: WorkItemEvent) => {
        if (event.type === 'created') return 'Item criado';
        if (event.type === 'status_changed') {
            const payload = (event.payload ?? {}) as Record<string, unknown>;
            const from = payload.from as string | undefined;
            const to = payload.to as string | undefined;
            return `Status: ${from} → ${to}`;
        }
        if (event.type === 'assignee_changed') {
            const payload = (event.payload ?? {}) as Record<string, unknown>;
            const from = payload.from as number | null | undefined;
            const to = payload.to as number | null | undefined;
            return `Responsável: ${findUserName(from)} → ${findUserName(to)}`;
        }
        return event.type;
    };

    function handleJiraLink(e: React.FormEvent) {
        e.preventDefault();
        post(`/api/jira/import?work_item_id=${workItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setData('jira_key', '');
                setData('remote_url', '');
            },
        });
    }

    if (!workItem) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Item de Trabalho', href: '#' }]}>
                <Head title="Item de trabalho nao encontrado" />
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-6">
                    <XCircle className="h-16 w-16 text-muted-foreground" />
                    <h1 className="text-2xl font-bold">
                        Item de trabalho nao encontrado
                    </h1>
                    <p className="text-muted-foreground">
                        O item solicitado não existe ou foi removido.
                    </p>
                    <Link href="/sprint-planning">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para Planejamento da Sprint
                        </Button>
                    </Link>
                </div>
            </AppLayout>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Planejamento da Sprint', href: '/sprint-planning' },
        { title: workItem.title, href: `/work-items/${workItem.id}` },
    ];

    const tierClass =
        workItem.tier === 'N1' ? 'badge-tier-n1' : 'badge-tier-n2';
    const statusClass = statusColors[workItem.status] || 'badge-status-backlog';
    const priorityClass =
        priorityColors[workItem.priority] || 'badge-priority-p2';
    const cannotDelete = workItem.status === 'done';
    const statusLabel =
        {
            backlog: 'Backlog',
            ready: 'Pronto',
            in_progress: 'Em progresso',
            blocked: 'Bloqueado',
            done: 'Concluido',
        }[workItem.status] || workItem.status;

    const startRequirements = [
        {
            id: 'assignee',
            label: 'Responsável definido',
            ok: !!workItem.assignee_id,
        },
        {
            id: 'estimate',
            label: 'Estimativa definida (N2)',
            ok: workItem.tier === 'N1' ? true : (workItem.estimate || 0) > 0,
        },
        {
            id: 'description',
            label: 'Descrição registrada (recomendado)',
            ok: !!(
                workItem.description && workItem.description.trim().length > 0
            ),
        },
    ];

    const cycleHours =
        workItem.started_at && workItem.completed_at
            ? differenceInHours(
                  new Date(workItem.completed_at),
                  new Date(workItem.started_at),
              )
            : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${workItem.title} - Item de trabalho`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                            <Link href="/sprint-planning">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Badge variant="outline" className="text-xs">
                                WI-{workItem.id}
                            </Badge>
                            <Badge variant="outline" className={tierClass}>
                                {workItem.tier}
                            </Badge>
                            <Badge variant="outline" className={statusClass}>
                                {statusLabel}
                            </Badge>
                        </div>
                        <h1 className="mb-2 text-2xl font-bold">
                            {workItem.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Criado em{' '}
                                {format(
                                    new Date(workItem.created_at),
                                    'dd/MM/yyyy',
                                )}
                            </span>
                            {workItem.assignee && (
                                <span className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {workItem.assignee.name}
                                </span>
                            )}
                            {workItem.estimate && (
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {workItem.estimate}{' '}
                                    {workItem.tier === 'N1' ? 'horas' : 'SP'}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditDialogOpen(true)}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={cannotDelete}
                            title={
                                cannotDelete
                                    ? 'Itens concluídos não podem ser excluídos.'
                                    : 'Excluir'
                            }
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Descrição
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {workItem.description ? (
                                    <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                                        {workItem.description}
                                    </p>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        Nenhuma descrição adicionada.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Classification */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Classificação
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <div>
                                        <div className="mb-1 text-xs text-muted-foreground">
                                            Tier
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={tierClass}
                                        >
                                            {workItem.tier}
                                        </Badge>
                                    </div>
                                    <div>
                                        <div className="mb-1 text-xs text-muted-foreground">
                                            Tipo
                                        </div>
                                        <Badge variant="outline">
                                            {workItem.type}
                                        </Badge>
                                    </div>
                                    <div>
                                        <div className="mb-1 text-xs text-muted-foreground">
                                            Tamanho
                                        </div>
                                        <Badge variant="outline">
                                            {workItem.size}
                                        </Badge>
                                    </div>
                                    <div>
                                        <div className="mb-1 text-xs text-muted-foreground">
                                            Prioridade
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={priorityClass}
                                        >
                                            {workItem.priority}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Children (for epics) */}
                        {workItem.children && workItem.children.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Subtarefas ({workItem.children.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {workItem.children.map((child) => (
                                            <Link
                                                key={child.id}
                                                href={`/work-items/${child.id}`}
                                                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        WI-{child.id}
                                                    </Badge>
                                                    <span className="text-sm">
                                                        {child.title}
                                                    </span>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        statusColors[
                                                            child.status
                                                        ] || ''
                                                    }
                                                >
                                                    {child.status}
                                                </Badge>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Links de Integração</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {workItem.integration_links && workItem.integration_links.length > 0 ? (
                                    <div className="space-y-2">
                                        {workItem.integration_links.map(link => (
                                            <a href={link.remote_url} target="_blank" rel="noopener noreferrer" key={link.id} className="flex items-center gap-2 text-sm text-primary hover:underline">
                                                <LinkIcon className="h-4 w-4" />
                                                <span>{link.provider}: {link.remote_item_id}</span>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Nenhum link de integração.</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Vincular Jira</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleJiraLink} className="space-y-4">
                                    <div>
                                        <Label htmlFor="jira_key">Jira Key</Label>
                                        <Input id="jira_key" value={data.jira_key} onChange={e => setData('jira_key', e.target.value)} />
                                        {errors.jira_key && <p className="text-xs text-red-500 mt-1">{errors.jira_key}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="remote_url">Jira URL</Label>
                                        <Input id="remote_url" value={data.remote_url} onChange={e => setData('remote_url', e.target.value)} />
                                        {errors.remote_url && <p className="text-xs text-red-500 mt-1">{errors.remote_url}</p>}
                                    </div>
                                    <Button type="submit">Vincular</Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Sprint Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Sprint
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {workItem.sprint ? (
                                    <div>
                                        <div className="font-medium">
                                            {workItem.sprint.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {format(
                                                new Date(
                                                    workItem.sprint.start_date,
                                                ),
                                                'dd/MM',
                                            )}{' '}
                                            -{' '}
                                            {format(
                                                new Date(
                                                    workItem.sprint.end_date,
                                                ),
                                                'dd/MM/yyyy',
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Não atribuído a nenhuma sprint
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {workItem.epic && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Epico
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground">
                                        EP-{workItem.epic.id}
                                    </div>
                                    <div className="font-medium">
                                        {workItem.epic.title}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {workItem.ticket && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Chamado
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Link
                                        href={`/tickets/${workItem.ticket.id}`}
                                        className="flex items-center gap-2 text-sm transition-colors hover:text-primary"
                                    >
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            TK-{workItem.ticket.id}
                                        </Badge>
                                        <span>{workItem.ticket.title}</span>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}

                        {/* Flow Governance (connected to board rules) */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Fluxo e governança
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="text-xs text-muted-foreground">
                                        Requisitos para iniciar (Em progresso)
                                    </div>
                                    <div className="space-y-2">
                                        {startRequirements.map((req) => (
                                            <div
                                                key={req.id}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <CheckCircle2
                                                    className={`h-4 w-4 ${req.ok ? 'text-emerald-500' : 'text-muted-foreground/40'}`}
                                                />
                                                <span
                                                    className={`${req.ok ? '' : 'text-muted-foreground'}`}
                                                >
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <div className="text-xs text-muted-foreground">
                                            Iniciado em
                                        </div>
                                        <div className="text-sm">
                                            {workItem.started_at
                                                ? format(
                                                      new Date(
                                                          workItem.started_at,
                                                      ),
                                                      'dd/MM HH:mm',
                                                  )
                                                : '—'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">
                                            Concluído em
                                        </div>
                                        <div className="text-sm">
                                            {workItem.completed_at
                                                ? format(
                                                      new Date(
                                                          workItem.completed_at,
                                                      ),
                                                      'dd/MM HH:mm',
                                                  )
                                                : '—'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">
                                            Bloqueado em
                                        </div>
                                        <div className="text-sm">
                                            {workItem.blocked_at
                                                ? format(
                                                      new Date(
                                                          workItem.blocked_at,
                                                      ),
                                                      'dd/MM HH:mm',
                                                  )
                                                : '—'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">
                                            Cycle time
                                        </div>
                                        <div className="text-sm">
                                            {cycleHours === null
                                                ? '—'
                                                : `${cycleHours}h`}
                                        </div>
                                    </div>
                                </div>

                                {workItem.status === 'blocked' &&
                                    workItem.blocked_reason && (
                                        <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3">
                                            <div className="mb-1 text-xs text-muted-foreground">
                                                Motivo do bloqueio
                                            </div>
                                            <div className="text-sm">
                                                {workItem.blocked_reason}
                                            </div>
                                        </div>
                                    )}
                            </CardContent>
                        </Card>

                        {/* Parent Link */}
                        {workItem.parent && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Item Pai
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Link
                                        href={`/work-items/${workItem.parent.id}`}
                                        className="flex items-center gap-2 text-sm transition-colors hover:text-primary"
                                    >
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            WI-{workItem.parent.id}
                                        </Badge>
                                        <span>{workItem.parent.title}</span>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}

                        {/* History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Historico
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Item criado</span>
                                    <span className="text-xs text-muted-foreground">
                                        {format(
                                            new Date(workItem.created_at),
                                            'dd/MM HH:mm',
                                        )}
                                    </span>
                                </div>
                                {workItem.updated_at !==
                                    workItem.created_at && (
                                    <div className="flex justify-between text-sm">
                                        <span>Última atualização</span>
                                        <span className="text-xs text-muted-foreground">
                                            {format(
                                                new Date(workItem.updated_at),
                                                'dd/MM HH:mm',
                                            )}
                                        </span>
                                    </div>
                                )}

                                {workItem.events &&
                                    workItem.events.length > 0 && (
                                        <div className="space-y-2 border-t pt-3">
                                            {workItem.events
                                                .slice(0, 20)
                                                .map((event) => (
                                                    <div
                                                        key={event.id}
                                                        className="flex justify-between gap-3 text-sm"
                                                    >
                                                        <span className="min-w-0 truncate">
                                                            {renderEventLabel(
                                                                event,
                                                            )}
                                                        </span>
                                                        <span className="shrink-0 text-xs text-muted-foreground">
                                                            {format(
                                                                new Date(
                                                                    event.created_at,
                                                                ),
                                                                'dd/MM HH:mm',
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <WorkItemFormDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                workItem={workItem}
            />
            <DeleteWorkItemDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                workItem={workItem}
            />
        </AppLayout>
    );
}
