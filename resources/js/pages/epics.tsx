import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { EpicFormDialog } from '@/components/epics/EpicFormDialog';
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
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Epicos', href: '/epics' }];

interface Epic {
    id: number;
    title: string;
    description?: string;
    status: string;
    work_items_count?: number;
    done_work_items_count?: number;
    created_at: string;
    updated_at: string;
}

interface EpicsProps {
    epics: Epic[];
}

export default function Epics({ epics }: EpicsProps) {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteEpic, setDeleteEpic] = useState<Epic | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const statusCounts = epics.reduce<Record<string, number>>((acc, epic) => {
        acc[epic.status] = (acc[epic.status] ?? 0) + 1;
        return acc;
    }, {});

    const handleEdit = (epic: Epic) => {
        setSelectedEpic(epic);
        setEditDialogOpen(true);
    };

    const handleDelete = (epic: Epic) => {
        setDeleteEpic(epic);
        setDeleteDialogOpen(true);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            planning: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
            in_progress: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
            completed:
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
            cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
        };
        return colors[status] || colors.planning;
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            planning: 'Planejamento',
            in_progress: 'Em Progresso',
            completed: 'Concluído',
            cancelled: 'Cancelado',
        };
        return labels[status] || status;
    };

    const filteredEpics = epics.filter((epic) => {
        if (statusFilter !== 'all' && epic.status !== statusFilter)
            return false;
        if (searchQuery.trim().length === 0) return true;
        const query = searchQuery.trim().toLowerCase();
        return (
            epic.title.toLowerCase().includes(query) ||
            (epic.description || '').toLowerCase().includes(query)
        );
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Epicos" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Epicos</h1>
                        <p className="text-sm text-muted-foreground">
                            Gerencie épicos e acompanhe o progresso de
                            iniciativas de longo prazo
                        </p>
                    </div>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Épico
                    </Button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Buscar epicos..."
                        className="w-64"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { value: 'all', label: 'Todos' },
                            { value: 'planning', label: 'Planejamento' },
                            { value: 'in_progress', label: 'Em progresso' },
                            { value: 'completed', label: 'Concluidos' },
                            { value: 'cancelled', label: 'Cancelados' },
                        ].map((filter) => (
                            <Button
                                key={filter.value}
                                size="sm"
                                variant={
                                    statusFilter === filter.value
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => setStatusFilter(filter.value)}
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-xs text-muted-foreground">
                                Total
                            </div>
                            <div className="text-2xl font-semibold">
                                {epics.length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-xs text-muted-foreground">
                                Em planejamento
                            </div>
                            <div className="text-2xl font-semibold text-slate-400">
                                {statusCounts.planning ?? 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-xs text-muted-foreground">
                                Em progresso
                            </div>
                            <div className="text-2xl font-semibold text-blue-400">
                                {statusCounts.in_progress ?? 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-xs text-muted-foreground">
                                Concluidos
                            </div>
                            <div className="text-2xl font-semibold text-emerald-400">
                                {statusCounts.completed ?? 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Epics List */}
                {filteredEpics.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <h2 className="mb-2 text-xl font-semibold">
                                Nenhum epico criado
                            </h2>
                            <p className="mb-4 text-muted-foreground">
                                Comece criando seu primeiro épico para organizar
                                work items de longo prazo
                            </p>
                            <Button onClick={() => setCreateDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Criar primeiro epico
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredEpics.map((epic) => (
                            <Card
                                key={epic.id}
                                className="transition-colors hover:border-primary/30"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="mb-2 text-base">
                                                {epic.title}
                                            </CardTitle>
                                            <Badge
                                                variant="outline"
                                                className={getStatusColor(
                                                    epic.status,
                                                )}
                                            >
                                                {getStatusLabel(epic.status)}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(epic)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(epic)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {epic.description && (
                                        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                                            {epic.description}
                                        </p>
                                    )}
                                    <div className="mb-4">
                                        {(() => {
                                            const total =
                                                epic.work_items_count || 0;
                                            const done =
                                                epic.done_work_items_count || 0;
                                            const pct =
                                                total > 0
                                                    ? Math.round(
                                                          (done / total) * 100,
                                                      )
                                                    : 0;
                                            return (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <span>Progresso</span>
                                                        <span>
                                                            {done}/{total} (
                                                            {pct}%)
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
                                                        <div
                                                            className="h-full bg-emerald-500/60"
                                                            style={{
                                                                width: `${pct}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {epic.work_items_count || 0} itens
                                            de trabalho
                                        </span>
                                        <Link
                                            href={`/work-items?epic_id=${epic.id}`}
                                            className="text-xs text-primary"
                                        >
                                            Ver itens
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <EpicFormDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
            <EpicFormDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                epic={selectedEpic}
            />
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir epico</DialogTitle>
                        <DialogDescription>
                            Esta acao nao pode ser desfeita. O epico sera
                            removido permanentemente.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="text-sm text-muted-foreground">
                        {deleteEpic
                            ? `Epico: ${deleteEpic.title}`
                            : 'Selecione um epico'}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={!deleteEpic}
                            onClick={() => {
                                if (!deleteEpic) return;
                                router.delete(`/epics/${deleteEpic.id}`, {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        setDeleteDialogOpen(false);
                                        setDeleteEpic(null);
                                    },
                                });
                            }}
                        >
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
