import { useForm, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Epic, WorkItem, User } from '@/types/models';

interface WorkItemFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workItem?: WorkItem | null;
    sprintId?: number;
    users?: User[];
    epics?: Epic[];
    defaults?: Partial<{
        tier: 'N1' | 'N2';
        status: 'backlog' | 'ready';
        priority: string;
        size: string;
        type: string;
        epic_id: number | null;
    }>;
    onSuccess?: () => void;
}

export function WorkItemFormDialog({
    open,
    onOpenChange,
    workItem,
    sprintId,
    users = [],
    epics = [],
    defaults,
    onSuccess,
}: WorkItemFormDialogProps) {
    const isEditing = !!workItem;
    const [advancedOpen, setAdvancedOpen] = useState(false);

    // Try to get users from page props if not passed directly
    const pageProps = usePage().props as { users?: User[]; epics?: Epic[] };
    const availableUsers = users.length > 0 ? users : pageProps.users || [];
    const availableEpics = epics.length > 0 ? epics : pageProps.epics || [];

    const { data, setData, post, put, processing, errors, reset, transform } =
        useForm({
            title: workItem?.title || '',
            description: workItem?.description || '',
            tier: workItem?.tier || defaults?.tier || 'N2',
            type: workItem?.type || defaults?.type || 'servico',
            size: workItem?.size || defaults?.size || 'padrao',
            priority: workItem?.priority || defaults?.priority || 'P2',
            status: workItem?.status || defaults?.status || 'backlog',
            estimate: workItem?.estimate || 0,
            due_date: workItem?.due_date || '',
            planned_for: workItem?.planned_for || '',
            assignee_id: workItem?.assignee_id?.toString() || 'unassigned',
            epic_id:
                workItem?.epic_id?.toString() ||
                (defaults?.epic_id ? defaults.epic_id.toString() : 'none'),
            sprint_id: workItem?.sprint_id || sprintId || null,
            parent_id: workItem?.parent_id || null,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            assignee_id:
                data.assignee_id && data.assignee_id !== 'unassigned'
                    ? parseInt(data.assignee_id)
                    : null,
            due_date: data.due_date ? data.due_date : null,
            planned_for: data.planned_for ? data.planned_for : null,
            epic_id:
                data.epic_id && data.epic_id !== 'none'
                    ? parseInt(data.epic_id)
                    : null,
        }));

        if (isEditing) {
            put(`/work-items/${workItem.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    onSuccess?.();
                },
            });
        } else {
            post('/work-items', {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    onSuccess?.();
                },
            });
        }
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            reset();
            setAdvancedOpen(false);
        }
        onOpenChange(nextOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar Work Item' : 'Novo Work Item'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Atualize as informações do work item.'
                            : 'Preencha os dados para criar um novo work item.'}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    onKeyDown={(event) => {
                        if (
                            (event.metaKey || event.ctrlKey) &&
                            event.key === 'Enter'
                        ) {
                            handleSubmit(event);
                        }
                    }}
                    className="space-y-6"
                >
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-sm font-semibold">Resumo</h3>
                            <p className="text-xs text-muted-foreground">
                                Preencha os campos essenciais para criar o item.
                            </p>
                        </div>
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Ex: Implementar cache Redis"
                                required
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Descreva o objetivo e contexto do item..."
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Grid: Tier, Size, Priority, Assignee */}
                        <div className="grid items-start gap-4 sm:grid-cols-2">
                            {/* Tier */}
                            <div className="space-y-2">
                                <Label htmlFor="tier">Tier *</Label>
                                <Select
                                    value={data.tier}
                                    onValueChange={(value) =>
                                        setData('tier', value as 'N1' | 'N2')
                                    }
                                >
                                    <SelectTrigger
                                        id="tier"
                                        className="[&>span]:line-clamp-none [&>span]:whitespace-normal"
                                    >
                                        <SelectValue placeholder="Selecione o tier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="N1">
                                            N1 - Reativo
                                        </SelectItem>
                                        <SelectItem value="N2">
                                            N2 - Planejado
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.tier && (
                                    <p className="text-sm text-destructive">
                                        {errors.tier}
                                    </p>
                                )}
                            </div>

                            {/* Size */}
                            <div className="space-y-2">
                                <Label htmlFor="size">Tamanho *</Label>
                                <Select
                                    value={data.size}
                                    onValueChange={(value) =>
                                        setData('size', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="size"
                                        className="[&>span]:line-clamp-none [&>span]:whitespace-normal"
                                    >
                                        <SelectValue placeholder="Selecione o tamanho" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="rapido">
                                            Rápido (1-2 dias)
                                        </SelectItem>
                                        <SelectItem value="padrao">
                                            Padrão (sprint)
                                        </SelectItem>
                                        <SelectItem value="longo">
                                            Longo (multi-sprint)
                                        </SelectItem>
                                        <SelectItem value="epico">
                                            Épico
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.size && (
                                    <p className="text-sm text-destructive">
                                        {errors.size}
                                    </p>
                                )}
                            </div>

                            {/* Priority */}
                            <div className="space-y-2">
                                <Label htmlFor="priority">Prioridade *</Label>
                                <Select
                                    value={data.priority}
                                    onValueChange={(value) =>
                                        setData('priority', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="priority"
                                        className="[&>span]:line-clamp-none [&>span]:whitespace-normal"
                                    >
                                        <SelectValue placeholder="Selecione a prioridade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="P0">
                                            P0 - Crítica
                                        </SelectItem>
                                        <SelectItem value="P1">
                                            P1 - Alta
                                        </SelectItem>
                                        <SelectItem value="P2">
                                            P2 - Média
                                        </SelectItem>
                                        <SelectItem value="P3">
                                            P3 - Baixa
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.priority && (
                                    <p className="text-sm text-destructive">
                                        {errors.priority}
                                    </p>
                                )}
                            </div>

                            {/* Assignee - Now a Select */}
                            <div className="space-y-2">
                                <Label htmlFor="assignee_id">Responsável</Label>
                                <Select
                                    value={data.assignee_id}
                                    onValueChange={(value) =>
                                        setData('assignee_id', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="assignee_id"
                                        className="[&>span]:line-clamp-none [&>span]:whitespace-normal"
                                    >
                                        <SelectValue placeholder="Selecione o responsável" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">
                                            Não atribuído
                                        </SelectItem>
                                        {availableUsers.map((user) => (
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
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="epic_id">Épico</Label>
                            <Select
                                value={data.epic_id}
                                onValueChange={(value) =>
                                    setData('epic_id', value)
                                }
                            >
                                <SelectTrigger
                                    id="epic_id"
                                    className="[&>span]:line-clamp-none [&>span]:whitespace-normal"
                                >
                                    <SelectValue placeholder="Vincular a um épico (opcional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        Sem épico
                                    </SelectItem>
                                    {availableEpics.map((epic) => (
                                        <SelectItem
                                            key={epic.id}
                                            value={epic.id.toString()}
                                        >
                                            EP-{epic.id} {epic.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.epic_id && (
                                <p className="text-sm text-destructive">
                                    {errors.epic_id}
                                </p>
                            )}
                        </div>

                        <Collapsible
                            open={advancedOpen}
                            onOpenChange={setAdvancedOpen}
                        >
                            <CollapsibleTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="px-0"
                                >
                                    {advancedOpen ? (
                                        <ChevronUp className="mr-2 h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="mr-2 h-4 w-4" />
                                    )}
                                    Configurações avançadas
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4 space-y-4">
                                <div className="grid items-start gap-4 sm:grid-cols-2">
                                    {/* Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Tipo *</Label>
                                        <Select
                                            value={data.type}
                                            onValueChange={(value) =>
                                                setData('type', value)
                                            }
                                        >
                                            <SelectTrigger
                                                id="type"
                                                className="[&>span]:line-clamp-none [&>span]:whitespace-normal"
                                            >
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="incidente">
                                                    Incidente
                                                </SelectItem>
                                                <SelectItem value="servico">
                                                    Serviço
                                                </SelectItem>
                                                <SelectItem value="problema">
                                                    Problema
                                                </SelectItem>
                                                <SelectItem value="mudanca">
                                                    Mudança
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && (
                                            <p className="text-sm text-destructive">
                                                {errors.type}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) =>
                                                setData('status', value)
                                            }
                                        >
                                            <SelectTrigger
                                                id="status"
                                                className="[&>span]:line-clamp-none [&>span]:whitespace-normal"
                                            >
                                                <SelectValue placeholder="Selecione o status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="backlog">
                                                    Backlog
                                                </SelectItem>
                                                <SelectItem value="ready">
                                                    Pronto
                                                </SelectItem>
                                                {isEditing && (
                                                    <>
                                                        <SelectItem value="in_progress">
                                                            Em progresso
                                                        </SelectItem>
                                                        <SelectItem value="blocked">
                                                            Bloqueado
                                                        </SelectItem>
                                                        <SelectItem value="done">
                                                            Concluído
                                                        </SelectItem>
                                                    </>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Estimate */}
                                    <div className="space-y-2">
                                        <Label htmlFor="estimate">
                                            Estimativa (
                                            {data.tier === 'N1'
                                                ? 'horas'
                                                : 'SP'}
                                            )
                                        </Label>
                                        <Input
                                            id="estimate"
                                            type="number"
                                            min="0"
                                            value={data.estimate}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setData(
                                                    'estimate',
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                            placeholder="0"
                                        />
                                    </div>

                                    {/* Due Date */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="due_date"
                                            className="whitespace-nowrap"
                                        >
                                            Data de vencimento
                                        </Label>
                                        <Input
                                            id="due_date"
                                            type="date"
                                            value={data.due_date}
                                            onChange={(e) =>
                                                setData(
                                                    'due_date',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    {/* Planned For */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="planned_for"
                                            className="whitespace-nowrap"
                                        >
                                            Planejado para
                                        </Label>
                                        <Input
                                            id="planned_for"
                                            type="date"
                                            value={data.planned_for || ''}
                                            onChange={(e) =>
                                                setData(
                                                    'planned_for',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Salvando...'
                                : isEditing
                                  ? 'Atualizar'
                                  : 'Criar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
