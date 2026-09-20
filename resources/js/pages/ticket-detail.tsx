import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import type { Ticket, User, WorkItem } from '@/types/models';

interface TicketDetailProps {
    ticket: Ticket;
    users: User[];
    availableWorkItems: WorkItem[];
}

export default function TicketDetail({
    ticket,
    availableWorkItems,
}: TicketDetailProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Chamados', href: '/tickets' },
        { title: `Chamado #${ticket.id}`, href: `/tickets/${ticket.id}` },
    ];

    const [linkItemId, setLinkItemId] = useState<string>('');
    const [wizardOpen, setWizardOpen] = useState(false);
    const [wizardItems, setWizardItems] = useState('');

    const linkedItems = ticket.work_items || [];
    const statusLabel =
        {
            open: 'Aberto',
            triage: 'Triagem',
            in_progress: 'Em progresso',
            done: 'Concluido',
        }[ticket.status] || ticket.status;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Chamado #${ticket.id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            #{ticket.id} {ticket.title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {ticket.description || 'Sem descrição'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setWizardOpen(true)}
                        >
                            Desdobrar chamado
                        </Button>
                        <Link
                            href="/tickets"
                            className="text-sm text-muted-foreground"
                        >
                            Voltar
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge variant="outline">{statusLabel}</Badge>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">
                                Prioridade
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge variant="outline">{ticket.priority}</Badge>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">
                                Responsável
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                {ticket.assignee?.name || 'Sem responsavel'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Itens de trabalho vinculados
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {linkedItems.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Nenhum work item vinculado.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {linkedItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/work-items/${item.id}`}
                                        className="block text-sm text-primary"
                                    >
                                        #{item.id} {item.title}
                                    </Link>
                                ))}
                            </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                            <Select
                                value={linkItemId}
                                onValueChange={setLinkItemId}
                            >
                                <SelectTrigger className="w-64">
                                    <SelectValue placeholder="Adicionar item de trabalho" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableWorkItems.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={item.id.toString()}
                                        >
                                            #{item.id} {item.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={() => {
                                    if (!linkItemId) return;
                                    router.put(
                                        `/work-items/${linkItemId}`,
                                        { ticket_id: ticket.id },
                                        { preserveScroll: true },
                                    );
                                    setLinkItemId('');
                                }}
                                disabled={!linkItemId}
                            >
                                Vincular
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Assistente de desdobramento</DialogTitle>
                        <DialogDescription>
                            Liste os work items a criar, um por linha. Eles
                            serao vinculados ao chamado automaticamente.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <Textarea
                            value={wizardItems}
                            onChange={(e) => setWizardItems(e.target.value)}
                            rows={6}
                            placeholder="Ex: Implementar endpoint /status\nCriar dashboard de metricas"
                        />
                        <div className="text-xs text-muted-foreground">
                            {
                                wizardItems
                                    .split('\n')
                                    .filter((line) => line.trim()).length
                            }{' '}
                            itens detectados
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setWizardOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => {
                                const items = wizardItems
                                    .split('\n')
                                    .map((line) => line.trim())
                                    .filter(Boolean);
                                items.forEach((title) => {
                                    router.post(
                                        '/work-items',
                                        {
                                            title,
                                            description: `Originado do ticket #${ticket.id}`,
                                            tier: 'N2',
                                            type: 'servico',
                                            size: 'padrao',
                                            priority: ticket.priority,
                                            status: 'backlog',
                                            ticket_id: ticket.id,
                                        },
                                        { preserveScroll: true },
                                    );
                                });
                                setWizardItems('');
                                setWizardOpen(false);
                            }}
                            disabled={wizardItems.trim().length === 0}
                        >
                            Criar itens de trabalho
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
