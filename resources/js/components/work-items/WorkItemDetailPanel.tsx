import { Link } from '@inertiajs/react';
import { ExternalLink, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { AssigneeChip } from '@/components/work-items/AssigneeChip';
import { StatusBadge } from '@/components/work-items/StatusBadge';
import type { User, WorkItem } from '@/types/models';

type QuickUpdatePayload = {
    assignee_id?: number | null;
    priority?: string;
    status?: string;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workItem: WorkItem | null;
    users?: User[];
    allowStatusEdit?: boolean;
    onQuickUpdate?: (workItemId: number, payload: QuickUpdatePayload) => void;
};

export function WorkItemDetailPanel({
    open,
    onOpenChange,
    workItem,
    users = [],
    allowStatusEdit = true,
    onQuickUpdate,
}: Props) {
    const [assigneeId, setAssigneeId] = useState(
        workItem?.assignee_id ? workItem.assignee_id.toString() : 'unassigned',
    );
    const [priority, setPriority] = useState(workItem?.priority || 'P2');
    const [status, setStatus] = useState(workItem?.status || 'backlog');

    const handleSave = () => {
        if (!workItem || !onQuickUpdate) return;

        const payload: QuickUpdatePayload = {
            assignee_id: assigneeId === 'unassigned' ? null : parseInt(assigneeId, 10),
            priority,
        };

        if (allowStatusEdit) {
            payload.status = status;
        }

        onQuickUpdate(workItem.id, payload);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md">
                {!workItem ? (
                    <div className="space-y-3 p-4">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-9 w-full" />
                    </div>
                ) : (
                    <>
                        <SheetHeader>
                            <SheetTitle className="text-base">
                                WI-{workItem.id} {workItem.title}
                            </SheetTitle>
                            <SheetDescription>
                                Ajuste informações operacionais sem sair do contexto.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="space-y-5 px-4 pb-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={workItem.status} />
                                    <span className="text-text-tertiary text-xs">
                                        {workItem.tier} • {workItem.type}
                                    </span>
                                </div>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    {workItem.description || 'Sem descrição.'}
                                </p>
                            </div>

                            <div className="rounded-md border border-border-subtle bg-surface px-3 py-2">
                                <div className="text-text-tertiary mb-1 text-xs">
                                    Responsável atual
                                </div>
                                <AssigneeChip user={workItem.assignee} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="panel_assignee">Responsável</Label>
                                <Select value={assigneeId} onValueChange={setAssigneeId}>
                                    <SelectTrigger id="panel_assignee">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">
                                            Sem responsável
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

                            <div className="space-y-1.5">
                                <Label htmlFor="panel_priority">Prioridade</Label>
                                <Select value={priority} onValueChange={setPriority}>
                                    <SelectTrigger id="panel_priority">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="P0">P0 - Crítica</SelectItem>
                                        <SelectItem value="P1">P1 - Alta</SelectItem>
                                        <SelectItem value="P2">P2 - Média</SelectItem>
                                        <SelectItem value="P3">P3 - Baixa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {allowStatusEdit && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="panel_status">Status</Label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger id="panel_status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="backlog">Backlog</SelectItem>
                                            <SelectItem value="ready">Pronto</SelectItem>
                                            <SelectItem value="in_progress">
                                                Em progresso
                                            </SelectItem>
                                            <SelectItem value="blocked">Bloqueado</SelectItem>
                                            <SelectItem value="done">Concluído</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <Button className="flex-1" onClick={handleSave}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Salvar
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={`/work-items/${workItem.id}`}>
                                        Abrir
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            <p className="text-text-tertiary text-xs">
                                Atalho: Cmd/Ctrl+K abre o comando rápido global.
                            </p>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
