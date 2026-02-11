import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { WorkItemFormDialog } from '@/components/work-items/WorkItemFormDialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData } from '@/types';
import type { Epic, WorkItem, User } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Itens de trabalho', href: '/work-items' },
];

interface WorkItemsPageProps {
    // Controller returns a Laravel paginator; keep a small local type to avoid
    // calling array methods on the object.
    workItems:
        | WorkItem[]
        | {
              data: WorkItem[];
              links?: unknown;
              meta?: unknown;
          };
    users: User[];
    epics?: Epic[];
    filters?: {
        q?: string | null;
        tier?: 'N1' | 'N2' | null;
        status?: string | null;
        sprint_id?: string | null;
        assignee_id?: string | null;
        epic_id?: string | null;
        ticket_id?: string | null;
    };
}

export default function WorkItemsPage({
    workItems,
    users,
}: WorkItemsPageProps) {
    type WorkItemsSharedProps = SharedData & {
        filters?: WorkItemsPageProps['filters'];
        epics?: Epic[];
    };

    type TierFilter = 'all' | 'N1' | 'N2';
    type StatusFilter =
        | 'all'
        | 'backlog'
        | 'ready'
        | 'in_progress'
        | 'blocked'
        | 'done';

    const asTierFilter = (value: string | null | undefined): TierFilter =>
        value === 'N1' || value === 'N2' ? value : 'all';

    const asStatusFilter = (
        value: string | null | undefined,
    ): StatusFilter => {
        if (
            value === 'backlog' ||
            value === 'ready' ||
            value === 'in_progress' ||
            value === 'blocked' ||
            value === 'done'
        ) {
            return value;
        }
        return 'all';
    };

    const page = usePage<WorkItemsSharedProps>();
    const serverFilters = page.props.filters;
    const epics = page.props.epics;

    const [searchQuery, setSearchQuery] = useState(serverFilters?.q || '');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [disciplineFilter, setDisciplineFilter] = useState('all');
    const [tierFilter, setTierFilter] = useState<TierFilter>(
        asTierFilter(serverFilters?.tier),
    );
    const [statusFilter, setStatusFilter] = useState<StatusFilter>(
        asStatusFilter(serverFilters?.status),
    );

    const workItemsData: WorkItem[] = Array.isArray(workItems)
        ? workItems
        : (workItems?.data ?? []);

    const filteredItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return workItemsData
            .filter((item) => {
                if (!query) return true;
                return (
                    item.title.toLowerCase().includes(query) ||
                    (item.description || '').toLowerCase().includes(query)
                );
            })
            .filter((item) => {
                if (tierFilter === 'all') return true;
                return item.tier === tierFilter;
            })
            .filter((item) => {
                if (statusFilter === 'all') return true;
                return item.status === statusFilter;
            })
            .filter((item) => {
                if (disciplineFilter === 'all') return true;
                return item.assignee?.analyst_role === disciplineFilter;
            });
    }, [
        disciplineFilter,
        searchQuery,
        statusFilter,
        tierFilter,
        workItemsData,
    ]);

    const disciplineOptions = ['developer', 'qa', 'infra', 'security'];

    const contextLabels = [
        serverFilters?.sprint_id ? `Sprint: ${serverFilters.sprint_id}` : null,
        serverFilters?.epic_id ? `Épico: EP-${serverFilters.epic_id}` : null,
        serverFilters?.ticket_id
            ? `Ticket: TK-${serverFilters.ticket_id}`
            : null,
        serverFilters?.assignee_id
            ? `Responsável: ${serverFilters.assignee_id}`
            : null,
    ].filter(Boolean) as string[];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Itens de trabalho" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Itens de trabalho
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Lista geral de itens com acesso rapido aos detalhes.
                        </p>
                    </div>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo item
                    </Button>
                </div>

                {contextLabels.length > 0 && (
                    <Card className="border-primary/20">
                        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                            <div className="text-sm text-muted-foreground">
                                Contexto: {contextLabels.join(' • ')}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    router.visit('/work-items', {
                                        preserveScroll: true,
                                    })
                                }
                            >
                                Remover contexto
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Buscar itens..."
                        className="max-w-sm"
                    />
                    <Select
                        value={tierFilter}
                        onValueChange={(value) => setTierFilter(asTierFilter(value))}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Tier" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os tiers</SelectItem>
                            <SelectItem value="N1">N1</SelectItem>
                            <SelectItem value="N2">N2</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={statusFilter}
                        onValueChange={(value) =>
                            setStatusFilter(asStatusFilter(value))
                        }
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os status</SelectItem>
                            <SelectItem value="backlog">Backlog</SelectItem>
                            <SelectItem value="ready">Pronto</SelectItem>
                            <SelectItem value="in_progress">
                                Em progresso
                            </SelectItem>
                            <SelectItem value="blocked">Bloqueado</SelectItem>
                            <SelectItem value="done">Concluído</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={disciplineFilter}
                        onValueChange={setDisciplineFilter}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Papel (analista)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Todos os papeis
                            </SelectItem>
                            {disciplineOptions.map((role) => (
                                <SelectItem key={role} value={role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setSearchQuery('');
                            setTierFilter('all');
                            setStatusFilter('all');
                            setDisciplineFilter('all');
                            router.visit('/work-items', {
                                preserveScroll: true,
                            });
                        }}
                    >
                        Limpar
                    </Button>
                </div>

                {filteredItems.length === 0 ? (
                    <Card>
                        <CardContent className="p-10 text-center text-muted-foreground">
                            Nenhum item encontrado.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredItems.map((item) => (
                            <Card
                                key={item.id}
                                className="transition-colors hover:border-primary/30"
                            >
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center justify-between text-base">
                                        <span>
                                            WI-{item.id} {item.title}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={`badge-tier-${item.tier.toLowerCase()}`}
                                        >
                                            {item.tier}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                        {item.description || 'Sem descricao'}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Status: {item.status}</span>
                                        <span className="flex items-center gap-2">
                                            {item.assignee?.name ||
                                                'Sem responsavel'}
                                            {item.assignee?.analyst_role && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px]"
                                                >
                                                    {item.assignee.analyst_role}
                                                </Badge>
                                            )}
                                        </span>
                                    </div>
                                    {(item.ticket_id || item.epic_id) && (
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            {item.ticket_id && (
                                                <Link
                                                    href={`/tickets/${item.ticket_id}`}
                                                    className="text-primary"
                                                >
                                                    TK-{item.ticket_id}
                                                </Link>
                                            )}
                                            {item.epic_id && (
                                                <Link
                                                    href={`/work-items?epic_id=${item.epic_id}`}
                                                    className="text-primary"
                                                >
                                                    EP-{item.epic_id}
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                    <Link
                                        href={`/work-items/${item.id}`}
                                        className="text-xs text-primary"
                                    >
                                        Ver detalhes
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <WorkItemFormDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                users={users}
                epics={epics}
            />
        </AppLayout>
    );
}
