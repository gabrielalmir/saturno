import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Ticket, User } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Chamados', href: '/tickets' }];

interface TicketsPageProps {
    tickets: Ticket[];
    users: User[];
}

export default function TicketsPage({ tickets, users }: TicketsPageProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [disciplineFilter, setDisciplineFilter] = useState('all');
    const { data, setData, post, processing, reset, transform } = useForm({
        title: '',
        description: '',
        status: 'open',
        priority: 'P2',
        assignee_id: 'unassigned',
        due_date: '',
    });

    const handleClose = () => {
        setDialogOpen(false);
        reset();
    };

    const getStatusLabel = (status: string) =>
        ({
            open: 'Aberto',
            triage: 'Triagem',
            in_progress: 'Em progresso',
            done: 'Concluido',
        })[status] || status;

    const filteredTickets = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return tickets
            .filter((ticket) => {
                if (!query) return true;
                return (
                    ticket.title.toLowerCase().includes(query) ||
                    (ticket.description || '').toLowerCase().includes(query)
                );
            })
            .filter((ticket) => {
                if (disciplineFilter === 'all') return true;
                return ticket.assignee?.analyst_role === disciplineFilter;
            });
    }, [disciplineFilter, searchQuery, tickets]);

    const disciplineOptions = ['developer', 'qa', 'infra', 'security'];
    const statusCounts = useMemo(
        () =>
            tickets.reduce(
                (acc, ticket) => {
                    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
                    return acc;
                },
                {} as Record<string, number>,
            ),
        [tickets],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chamados" />
            <div className="flex h-full flex-1 flex-col gap-3 p-3 md:p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-xl font-semibold">Chamados</h1>
                        <p className="text-xs text-muted-foreground">
                            {filteredTickets.length} de {tickets.length} chamados
                        </p>
                    </div>
                    <Button size="sm" onClick={() => setDialogOpen(true)}>
                        Novo chamado
                    </Button>
                </div>

                <Card>
                    <CardContent className="space-y-3 p-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <Badge variant="secondary">
                                Abertos: {statusCounts.open || 0}
                            </Badge>
                            <Badge variant="secondary">
                                Triagem: {statusCounts.triage || 0}
                            </Badge>
                            <Badge variant="secondary">
                                Em progresso: {statusCounts.in_progress || 0}
                            </Badge>
                            <Badge variant="secondary">
                                Concluidos: {statusCounts.done || 0}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Input
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                                placeholder="Buscar por titulo ou descricao..."
                                className="h-8 max-w-md"
                            />
                            <Select
                                value={disciplineFilter}
                                onValueChange={setDisciplineFilter}
                            >
                                <SelectTrigger className="h-8 w-44">
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
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-h-0 flex-1">
                    <CardContent className="min-h-0 p-0">
                        <div className="overflow-x-auto">
                            <div className="min-w-[760px]">
                                <div className="grid grid-cols-[88px_minmax(0,1fr)_104px_130px_120px] border-b px-3 py-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                                    <span>Ticket</span>
                                    <span>Titulo</span>
                                    <span>Prioridade</span>
                                    <span>Status</span>
                                    <span>Responsavel</span>
                                </div>
                                <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
                            {filteredTickets.length === 0 ? (
                                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                                    Nenhum chamado encontrado.
                                </div>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <Link
                                        key={ticket.id}
                                        href={`/tickets/${ticket.id}`}
                                        className="grid grid-cols-[88px_minmax(0,1fr)_104px_130px_120px] items-center gap-2 border-b px-3 py-2 text-sm transition-colors hover:bg-muted/35"
                                    >
                                        <span className="font-medium text-muted-foreground">
                                            #{ticket.id}
                                        </span>
                                        <div className="min-w-0">
                                            <div className="truncate font-medium">
                                                {ticket.title}
                                            </div>
                                            <div className="truncate text-xs text-muted-foreground">
                                                {ticket.description ||
                                                    'Sem descricao'}
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="w-fit text-[10px]"
                                        >
                                            {ticket.priority}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {getStatusLabel(ticket.status)}
                                        </span>
                                        <div className="truncate text-xs text-muted-foreground">
                                            {ticket.assignee?.name ||
                                                'Sem responsavel'}
                                        </div>
                                    </Link>
                                ))
                            )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={dialogOpen} onOpenChange={handleClose}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Novo chamado</DialogTitle>
                        <DialogDescription>
                            Registre um novo chamado para triagem.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        className="space-y-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            transform((formData) => ({
                                ...formData,
                                assignee_id:
                                    formData.assignee_id === 'unassigned'
                                        ? null
                                        : parseInt(formData.assignee_id),
                            }));
                            post('/tickets', {
                                onSuccess: () => handleClose(),
                            });
                        }}
                    >
                        <div className="space-y-2">
                            <label className="text-sm">Título</label>
                            <Input
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm">Descrição</label>
                            <Textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={3}
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm">Status</label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) =>
                                        setData('status', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">
                                            Aberto
                                        </SelectItem>
                                        <SelectItem value="triage">
                                            Triagem
                                        </SelectItem>
                                        <SelectItem value="in_progress">
                                            Em progresso
                                        </SelectItem>
                                        <SelectItem value="done">
                                            Concluido
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm">Prioridade</label>
                                <Select
                                    value={data.priority}
                                    onValueChange={(value) =>
                                        setData('priority', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="P0">P0</SelectItem>
                                        <SelectItem value="P1">P1</SelectItem>
                                        <SelectItem value="P2">P2</SelectItem>
                                        <SelectItem value="P3">P3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm">Vencimento</label>
                                <Input
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) =>
                                        setData('due_date', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm">Responsavel</label>
                            <Select
                                value={data.assignee_id}
                                onValueChange={(value) =>
                                    setData('assignee_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">
                                        Sem responsavel
                                    </SelectItem>
                                    {users.map((user) => (
                                        <SelectItem
                                            key={user.id}
                                            value={user.id.toString()}
                                        >
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={processing}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Criar Ticket
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
