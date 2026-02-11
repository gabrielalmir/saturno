import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    useDroppable,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { addDays, format, differenceInDays } from 'date-fns';
import {
    AlertTriangle,
    TrendingUp,
    Plus,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { WorkItemFormDialog } from '@/components/work-items/WorkItemFormDialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData } from '@/types';
import type { Epic, Sprint, User, WorkItem } from '@/types/models';

type MemberN1Reservation = {
    user_id: number;
    user_name: string;
    reserved_n1: number | null;
    can_edit: boolean;
};

type CapacitySummary = {
    total_capacity: number;
    reserved_n1: number;
    effective_n1: number;
    buffer_n1: number;
    available_for_planned: number;
    working_days: number;
    is_overallocated: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Planejamento da Sprint', href: '/sprint-planning' },
];

interface SprintPlanningProps {
    sprints: Sprint[];
    currentSprint: Sprint | null;
    readyItems: WorkItem[];
    backlogItems?: WorkItem[];
    currentScopeItems: WorkItem[];
    users?: User[];
    epics?: Epic[];
}

function getInitials(name?: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
}

interface WorkItemCardProps {
    item: WorkItem;
    isDragging?: boolean;
}

function SortableWorkItemCard({ item }: { item: WorkItem }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <WorkItemCardContent item={item} isDragging={isDragging} />
        </div>
    );
}

function WorkItemCardContent({ item, isDragging }: WorkItemCardProps) {
    return (
        <Card
            className={`cursor-grab transition-colors hover:border-blue-500/30 active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
            role="button"
            tabIndex={0}
            onDoubleClick={() => router.visit(`/work-items/${item.id}`)}
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    router.visit(`/work-items/${item.id}`);
                }
            }}
        >
            <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            #{item.id}
                        </span>
                        {item.epic_id && (
                            <Badge
                                variant="outline"
                                className="px-1.5 py-0 text-[10px]"
                            >
                                EP-{item.epic_id}
                            </Badge>
                        )}
                    </div>
                    <Badge variant="outline" className="badge-tier-n2 text-xs">
                        {item.estimate || 0}
                    </Badge>
                </div>
                <h3 className="mb-2 text-sm font-medium">{item.title}</h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                            {item.size}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={`badge-tier-${item.tier.toLowerCase()} text-xs`}
                        >
                            {item.tier}
                        </Badge>
                    </div>
                    {item.assignee ? (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[10px]">
                                {getInitials(item.assignee?.name)}
                            </div>
                        </div>
                    ) : (
                        <span className="text-xs text-muted-foreground">
                            Sem responsavel
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function SprintPlanning({
    currentSprint,
    readyItems,
    backlogItems,
    currentScopeItems,
    users,
    epics,
}: SprintPlanningProps) {
    type InertiaErrorBag = Record<string, string | undefined>;

    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') ?? '';

    const [availableItems, setAvailableItems] =
        useState<WorkItem[]>(readyItems);
    const [backlogN2Items, setBacklogN2Items] = useState<WorkItem[]>(
        backlogItems || [],
    );
    const [scopeItems, setScopeItems] = useState<WorkItem[]>(currentScopeItems);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [startDialogOpen, setStartDialogOpen] = useState(false);
    const [planError, setPlanError] = useState<string | null>(null);
    const pageProps = usePage<SharedData>().props as SharedData & {
        errors?: Record<string, string>;
        users?: User[];
        epics?: Epic[];
    };
    const orgUsers = users || pageProps.users || [];
    const orgEpics = epics || pageProps.epics || [];
    const startError = pageProps.errors?.start;
    const planningUnit =
        pageProps.auth?.currentOrganization?.planning_unit ?? 'story_points';
    const planningUnitLabel = planningUnit === 'hours' ? 'h' : 'SP';

    const canManageSprint = ['admin', 'maintainer'].includes(
        pageProps.auth?.currentOrganizationRole ?? '',
    );
    const [useMemberN1Reserve, setUseMemberN1Reserve] = useState<boolean>(
        !!currentSprint?.use_member_n1_reserve,
    );
    const [memberN1Reservations, setMemberN1Reservations] = useState<
        MemberN1Reservation[]
    >([]);
    const [memberN1Loading, setMemberN1Loading] = useState(false);
    const [capacitySummary, setCapacitySummary] =
        useState<CapacitySummary | null>(null);

    const [sprintGoal, setSprintGoal] = useState(currentSprint?.goal || '');
    const [pokerOpen, setPokerOpen] = useState(false);
    const [pokerItemId, setPokerItemId] = useState<number | null>(null);
    const [pokerEstimate, setPokerEstimate] = useState<number | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [createInScopeDialogOpen, setCreateInScopeDialogOpen] =
        useState(false);
    const [epicFilter, setEpicFilter] = useState<string>('all');
    const [wizardOpen, setWizardOpen] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [wizardData, setWizardData] = useState({
        retrospective: '',
        name: '',
        goal: '',
        start_date: '',
        end_date: '',
        capacity_total: 40,
        capacity_reserved_n1: 10,
        wip_limit: 5,
    });
    const [wizardSelectedItems, setWizardSelectedItems] = useState<number[]>(
        [],
    );
    const availableDropzone = useDroppable({ id: 'available' });
    const scopeDropzone = useDroppable({ id: 'scope' });

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8, // 8px of movement before drag starts
        },
    });
    const sensors = useSensors(pointerSensor);

    const wizardCommitment = readyItems
        .filter((item) => wizardSelectedItems.includes(item.id))
        .reduce((sum, item) => sum + (item.estimate || 0), 0);
    const wizardCapacityAvailable =
        wizardData.capacity_total - wizardData.capacity_reserved_n1;
    const wizardCapacityOk = wizardCommitment <= wizardCapacityAvailable;

    // Keep local board state in sync when we reload after creating/promoting items.
    useEffect(() => setAvailableItems(readyItems), [readyItems]);
    useEffect(() => setBacklogN2Items(backlogItems || []), [backlogItems]);
    useEffect(() => setScopeItems(currentScopeItems), [currentScopeItems]);

    useEffect(() => {
        if (currentSprint) {
            fetch(`/api/sprints/${currentSprint.id}/capacity`, {
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            })
                .then((res) => res.json())
                .then((data) => setCapacitySummary(data as CapacitySummary));
        }
    }, [currentSprint]);

    const loadMemberN1Reservations = useCallback(async () => {
        if (!currentSprint) return;

        setMemberN1Loading(true);
        try {
            const response = await fetch(
                `/api/sprints/${currentSprint.id}/n1-reservations`,
                {
                    credentials: 'same-origin',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                },
            );
            if (!response.ok) return;
            const data = (await response.json()) as {
                reservations?: MemberN1Reservation[];
            };
            setMemberN1Reservations(data.reservations ?? []);
        } finally {
            setMemberN1Loading(false);
        }
    }, [currentSprint]);

    const saveMemberN1Reservation = useCallback(
        async (userId: number, reservedN1: number | null) => {
            if (!currentSprint) return;

            const response = await fetch(
                `/api/sprints/${currentSprint.id}/n1-reservations/${userId}`,
                {
                    method: 'PUT',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                    },
                    body: JSON.stringify({
                        reserved_n1: reservedN1,
                    }),
                },
            );

            if (!response.ok) return;

            setMemberN1Reservations((prev) =>
                prev.map((r) =>
                    r.user_id === userId ? { ...r, reserved_n1: reservedN1 } : r,
                ),
            );
        },
        [csrfToken, currentSprint],
    );

    // If sprint changes, sync toggle.
    useEffect(() => {
        setUseMemberN1Reserve(!!currentSprint?.use_member_n1_reserve);
    }, [currentSprint?.id, currentSprint?.use_member_n1_reserve]);

    // Load member reserves only when the mode is enabled.
    useEffect(() => {
        if (!currentSprint) return;
        if (!useMemberN1Reserve) return;
        loadMemberN1Reservations();
    }, [currentSprint, loadMemberN1Reservations, useMemberN1Reserve]);

    const toggleWizardItem = (itemId: number) => {
        setWizardSelectedItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId],
        );
    };

    if (!currentSprint) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Planejamento da Sprint" />
                <div className="flex h-full flex-1 flex-col gap-6 p-6">
                    <Card>
                        <CardContent className="p-12 text-center">
                            <h2 className="mb-2 text-xl font-semibold">
                                Nenhuma sprint em planejamento
                            </h2>
                            <p className="text-muted-foreground">
                                Crie uma sprint para iniciar o planejamento
                            </p>
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                                <Button onClick={() => setWizardOpen(true)}>
                                    Assistente de Sprint
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const today = new Date();
                                        router.post('/sprints', {
                                            name: 'Sprint Inicial',
                                            goal: 'Primeira entrega estruturada do time',
                                            start_date: format(
                                                today,
                                                'yyyy-MM-dd',
                                            ),
                                            end_date: format(
                                                addDays(today, 13),
                                                'yyyy-MM-dd',
                                            ),
                                            capacity_total: 40,
                                            capacity_reserved_n1: 10,
                                            wip_limit: 5,
                                        });
                                    }}
                                >
                                    Criar sprint rápida
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Primeiros passos recomendados
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500"></div>
                                <div>
                                    Registre itens N2 e deixe o status em Ready
                                    para triagem.
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500"></div>
                                <div>
                                    Defina capacidade total e reserva N1 para
                                    evitar sobrecarga.
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 h-2 w-2 rounded-full bg-amber-500"></div>
                                <div>
                                    Selecione os itens que entram no escopo e
                                    inicie a sprint.
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="mt-2"
                                onClick={() => setWizardOpen(true)}
                            >
                                Iniciar planejamento guiado
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Assistente de Sprint</DialogTitle>
                            <DialogDescription>
                                Guie o fluxo completo de criacao de sprint.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            {wizardStep === 1 && (
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Etapa 1: Retrospectiva
                                    </div>
                                    <Textarea
                                        value={wizardData.retrospective}
                                        onChange={(e) =>
                                            setWizardData({
                                                ...wizardData,
                                                retrospective: e.target.value,
                                            })
                                        }
                                        rows={4}
                                        placeholder="O que foi aprendido na sprint anterior?"
                                    />
                                </div>
                            )}
                            {wizardStep === 2 && (
                                <div className="space-y-3">
                                    <div className="text-sm font-medium">
                                        Etapa 2: Configuracao
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <Input
                                            placeholder="Nome da sprint"
                                            value={wizardData.name}
                                            onChange={(e) =>
                                                setWizardData({
                                                    ...wizardData,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                        <Input
                                            placeholder="Objetivo da sprint"
                                            value={wizardData.goal}
                                            onChange={(e) =>
                                                setWizardData({
                                                    ...wizardData,
                                                    goal: e.target.value,
                                                })
                                            }
                                        />
                                        <Input
                                            type="date"
                                            value={wizardData.start_date}
                                            onChange={(e) =>
                                                setWizardData({
                                                    ...wizardData,
                                                    start_date: e.target.value,
                                                })
                                            }
                                        />
                                        <Input
                                            type="date"
                                            value={wizardData.end_date}
                                            onChange={(e) =>
                                                setWizardData({
                                                    ...wizardData,
                                                    end_date: e.target.value,
                                                })
                                            }
                                        />
                                        <Input
                                            type="number"
                                            value={wizardData.capacity_total}
                                            onChange={(e) =>
                                                setWizardData({
                                                    ...wizardData,
                                                    capacity_total:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                })
                                            }
                                            placeholder="Capacidade total"
                                        />
                                        <Input
                                            type="number"
                                            value={
                                                wizardData.capacity_reserved_n1
                                            }
                                            onChange={(e) =>
                                                setWizardData({
                                                    ...wizardData,
                                                    capacity_reserved_n1:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                })
                                            }
                                            placeholder="Reserva N1"
                                        />
                                    </div>
                                </div>
                            )}
                            {wizardStep === 3 && (
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Etapa 3: Triagem
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {readyItems.length} itens N2 prontos
                                        para seleção.
                                    </p>
                                </div>
                            )}
                            {wizardStep === 4 && (
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Etapa 4: Selecao
                                    </div>
                                    <div className="max-h-52 space-y-2 overflow-y-auto">
                                        {readyItems.map((item) => (
                                            <label
                                                key={item.id}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <Checkbox
                                                    checked={wizardSelectedItems.includes(
                                                        item.id,
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleWizardItem(
                                                            item.id,
                                                        )
                                                    }
                                                />
                                                #{item.id} {item.title}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {wizardStep === 5 && (
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Etapa 5: Validacao
                                    </div>
                                    <p
                                        className={`text-sm ${wizardCapacityOk ? 'text-emerald-500' : 'text-rose-500'}`}
                                    >
                                        Capacidade N2: {wizardCommitment}/
                                        {wizardCapacityAvailable}{' '}
                                        {planningUnitLabel}
                                    </p>
                                </div>
                            )}
                            {wizardStep === 6 && (
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Etapa 6: Atribuicao
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Atribua responsáveis após a criação da
                                        sprint.
                                    </p>
                                </div>
                            )}
                            {wizardStep === 7 && (
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Etapa 7: Confirmacao
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Finalize a criação da sprint com os
                                        dados informados.
                                    </p>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setWizardStep(Math.max(1, wizardStep - 1))
                                }
                                disabled={wizardStep === 1}
                            >
                                Voltar
                            </Button>
                            {wizardStep < 7 ? (
                                <Button
                                    onClick={() =>
                                        setWizardStep(wizardStep + 1)
                                    }
                                >
                                    Próximo
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => {
                                        router.post(
                                            '/sprints',
                                            {
                                                name: wizardData.name,
                                                goal: wizardData.goal,
                                                start_date:
                                                    wizardData.start_date,
                                                end_date: wizardData.end_date,
                                                capacity_total:
                                                    wizardData.capacity_total,
                                                capacity_reserved_n1:
                                                    wizardData.capacity_reserved_n1,
                                                wip_limit: wizardData.wip_limit,
                                                item_ids: wizardSelectedItems,
                                            },
                                            { preserveScroll: true },
                                        );
                                        setWizardOpen(false);
                                        setWizardStep(1);
                                        setWizardSelectedItems([]);
                                    }}
                                >
                                    Criar Sprint
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </AppLayout>
        );
    }

    const daysRemaining = differenceInDays(
        new Date(currentSprint.end_date),
        new Date(),
    );
    
    const totalCapacity = capacitySummary?.total_capacity ?? currentSprint.capacity_total;
    const n1Reserved = capacitySummary?.reserved_n1 ?? 0;
    const availableN2 = capacitySummary?.available_for_planned ?? 0;

    const committed = scopeItems.reduce(
        (sum, item) => sum + (item.tier === 'N2' ? item.estimate || 0 : 0),
        0,
    );
    const available = totalCapacity - n1Reserved - committed;
    
    const hasItems = scopeItems.length > 0;
    const hasNonReadyN2 = scopeItems.some(
        (item) => item.tier === 'N2' && item.status !== 'ready',
    );
    const capacityOk = committed <= availableN2;
    const commitmentPercent =
        availableN2 > 0 ? Math.round((committed / availableN2) * 100) : 0;
    const hasAlerts = !capacityOk;
    const filteredAvailableItems = availableItems.filter((item) =>
        epicFilter === 'all' ? true : item.epic_id?.toString() === epicFilter,
    );
    const filteredBacklogItems = backlogN2Items.filter((item) =>
        epicFilter === 'all' ? true : item.epic_id?.toString() === epicFilter,
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as number);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeItem = [...availableItems, ...scopeItems].find(
            (item) => item.id === active.id,
        );
        if (!activeItem) return;

        const getContainer = (overId: DragEndEvent['over']) => {
            const sortableContainer = overId?.data?.current?.sortable
                ?.containerId as string | undefined;
            if (sortableContainer) return sortableContainer;
            if (typeof overId?.id === 'string') return overId.id;
            return null;
        };

        const targetZone = getContainer(over);
        if (targetZone !== 'available' && targetZone !== 'scope') return;

        const activeInAvailable = availableItems.some(
            (item) => item.id === activeItem.id,
        );
        const activeInScope = scopeItems.some(
            (item) => item.id === activeItem.id,
        );

        setPlanError(null);
        const prevAvailable = availableItems;
        const prevScope = scopeItems;

        // Moving from available to scope
        if (targetZone === 'scope' && activeInAvailable) {
            setAvailableItems((prev) =>
                prev.filter((item) => item.id !== active.id),
            );
            setScopeItems((prev) => [...prev, activeItem]);

            // Update backend
            router.put(
                `/work-items/${activeItem.id}`,
                {
                    sprint_id: currentSprint.id,
                },
                {
                    preserveScroll: true,
                    onError: (errors: InertiaErrorBag) => {
                        const msg =
                            errors.sprint_id ||
                            errors.update ||
                            'Não foi possível adicionar o item ao escopo.';
                        setPlanError(msg);
                        setAvailableItems(prevAvailable);
                        setScopeItems(prevScope);
                    },
                },
            );
        }
        // Moving from scope to available
        else if (targetZone === 'available' && activeInScope) {
            setScopeItems((prev) =>
                prev.filter((item) => item.id !== active.id),
            );
            setAvailableItems((prev) => [...prev, activeItem]);

            // Update backend
            router.put(
                `/work-items/${activeItem.id}`,
                {
                    sprint_id: null,
                },
                {
                    preserveScroll: true,
                    onError: (errors: InertiaErrorBag) => {
                        const msg =
                            errors.sprint_id ||
                            errors.update ||
                            'Não foi possível remover o item do escopo.';
                        setPlanError(msg);
                        setAvailableItems(prevAvailable);
                        setScopeItems(prevScope);
                    },
                },
            );
        }
    };

    const activeItem = activeId
        ? [...availableItems, ...scopeItems].find(
              (item) => item.id === activeId,
          )
        : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Planejamento da Sprint" />
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex h-full flex-1 flex-col gap-6 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold">
                                    Planejamento de {currentSprint.name}
                                </h1>
                                <Badge className="badge-status-ready">
                                    FASE DE PLANEJAMENTO
                                </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {format(
                                    new Date(currentSprint.start_date),
                                    'MMM dd',
                                )}{' '}
                                -{' '}
                                {format(
                                    new Date(currentSprint.end_date),
                                    'MMM dd',
                                )}{' '}
                                • {daysRemaining} dias para iniciar
                            </p>
                            <div className="mt-3 max-w-xl">
                                <div className="mb-1 text-xs text-muted-foreground">
                                    Objetivo da sprint
                                </div>
                                <Textarea
                                    value={sprintGoal}
                                    onChange={(event) =>
                                        setSprintGoal(event.target.value)
                                    }
                                    onBlur={() => {
                                        router.put(
                                            `/sprints/${currentSprint.id}`,
                                            { goal: sprintGoal },
                                            { preserveScroll: true },
                                        );
                                    }}
                                    placeholder="Defina o objetivo principal da sprint..."
                                    rows={2}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setPokerOpen(true)}
                            >
                                Poker de Planejamento
                            </Button>
                            <Button onClick={() => setStartDialogOpen(true)}>
                                Iniciar Sprint
                            </Button>
                        </div>
                    </div>

                    {/* Metrics Row */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="mb-1 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-blue-400" />
                                    <span className="text-xs text-muted-foreground">
                                        Velocidade da sprint
                                    </span>
                                </div>
                                <div className="text-2xl font-bold">
                                    {committed} {planningUnitLabel}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Compromisso atual
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="mb-1 flex items-center gap-2">
                                    <div className="h-4 w-4 rounded bg-rose-500/20"></div>
                                    <span className="text-xs text-muted-foreground">
                                        Reserva N1
                                    </span>
                                </div>
                                <div className="text-2xl font-bold">
                                    {n1Reserved} {planningUnitLabel}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {(
                                        (n1Reserved / totalCapacity) *
                                        100
                                    ).toFixed(0)}
                                    % da capacidade
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="mb-1 text-xs text-muted-foreground">
                                    Capacidade restante
                                </div>
                                <div className="text-2xl font-bold text-blue-400">
                                    {available} / {totalCapacity}{' '}
                                    {planningUnitLabel}
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                                        <div
                                            className="h-full bg-blue-500"
                                            style={{
                                                width: `${(committed / totalCapacity) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className={
                                !capacityOk
                                    ? 'border-rose-500/30'
                                    : available < 5
                                      ? 'border-amber-500/20'
                                      : ''
                            }
                        >
                            <CardContent className="p-4">
                                <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                                    {!capacityOk && (
                                        <AlertTriangle className="h-3 w-3 text-rose-500" />
                                    )}
                                    {capacityOk
                                        ? 'Compromisso vs Capacidade'
                                        : 'Acima da capacidade'}
                                </div>
                                <div
                                    className={`text-2xl font-bold ${capacityOk ? 'text-emerald-400' : 'text-rose-400'}`}
                                >
                                    {commitmentPercent}%
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {committed} / {availableN2}{' '}
                                    {planningUnitLabel} (N2)
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                                Reserva N1 por membro
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="text-sm text-muted-foreground">
                                    Ative para que a reserva N1 seja calculada
                                    pela soma das reservas individuais (unidade:{' '}
                                    {planningUnitLabel}).
                                </div>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={useMemberN1Reserve}
                                        disabled={!canManageSprint}
                                        onChange={(e) => {
                                            const next = e.target.checked;
                                            setUseMemberN1Reserve(next);
                                            router.put(
                                                `/sprints/${currentSprint.id}`,
                                                {
                                                    use_member_n1_reserve: next,
                                                },
                                                { preserveScroll: true },
                                            );
                                        }}
                                    />
                                    Usar reserva por membro
                                    {!canManageSprint && (
                                        <Badge variant="outline">
                                            Somente admin/maintainer
                                        </Badge>
                                    )}
                                </label>
                            </div>

                            {useMemberN1Reserve ? (
                                <div className="space-y-2">
                                    {memberN1Reservations.length === 0 ? (
                                        <div className="text-sm text-muted-foreground">
                                            {memberN1Loading
                                                ? 'Carregando...'
                                                : 'Sem membros encontrados.'}
                                        </div>
                                    ) : (
                                        memberN1Reservations.map((r) => (
                                            <div
                                                key={r.user_id}
                                                className="flex items-center justify-between gap-3 rounded-md border p-3"
                                            >
                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-medium">
                                                        {r.user_name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {r.can_edit
                                                            ? 'Editavel'
                                                            : 'Somente o proprio usuario ou admin/maintainer'}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        className="h-8 w-28"
                                                        min={0}
                                                        disabled={!r.can_edit}
                                                        value={
                                                            r.reserved_n1 ===
                                                            null
                                                                ? ''
                                                                : r.reserved_n1
                                                        }
                                                        placeholder="0"
                                                        onChange={(e) => {
                                                            const v =
                                                                e.target.value;
                                                            setMemberN1Reservations(
                                                                (prev) =>
                                                                    prev.map(
                                                                        (
                                                                            item,
                                                                        ) =>
                                                                            item.user_id ===
                                                                            r.user_id
                                                                                ? {
                                                                                      ...item,
                                                                                      reserved_n1:
                                                                                          v ===
                                                                                          ''
                                                                                              ? null
                                                                                              : parseInt(
                                                                                                    v,
                                                                                                ) ||
                                                                                                0,
                                                                                  }
                                                                                : item,
                                                                    ),
                                                            );
                                                        }}
                                                        onBlur={() =>
                                                            saveMemberN1Reservation(
                                                                r.user_id,
                                                                r.reserved_n1,
                                                            )
                                                        }
                                                    />
                                                    <div className="text-xs text-muted-foreground">
                                                        {planningUnitLabel}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    <div className="text-xs text-muted-foreground">
                                        Total configurado: {memberN1Reservations.reduce((sum, r) => sum + (r.reserved_n1 ?? 0), 0)}
                                        {planningUnitLabel}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    Reserva N1 atual (sprint):{' '}
                                    {capacitySummary?.reserved_n1 ?? currentSprint.capacity_reserved_n1}
                                    {planningUnitLabel}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Alerts */}
                    <Card
                        className={
                            hasAlerts
                                ? 'border-amber-500/30 bg-amber-500/5'
                                : ''
                        }
                    >
                        <CardContent className="space-y-3 p-4">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <AlertTriangle
                                    className={`h-4 w-4 ${hasAlerts ? 'text-amber-500' : 'text-emerald-500'}`}
                                />
                                {hasAlerts ? 'Alertas' : 'Sem alertas'}
                            </div>

                            {!hasAlerts && (
                                <p className="text-sm text-muted-foreground">
                                    Nenhum alerta crítico para esta sprint.
                                </p>
                            )}

                            {hasAlerts && (
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {!capacityOk && (
                                        <div className="flex items-start gap-2">
                                            <span className="font-medium text-rose-400">
                                                Capacidade:
                                            </span>
                                            <span>
                                                Comprometido excede capacidade
                                                N2 disponível.
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {planError && (
                        <Card className="border-rose-500/30 bg-rose-500/5">
                            <CardContent className="flex items-start gap-2 p-4 text-sm text-rose-400">
                                <AlertCircle className="mt-0.5 h-4 w-4" />
                                <span>{planError}</span>
                            </CardContent>
                        </Card>
                    )}

                    {/* Main Content: Available Items + Current Scope */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Available N2 Items (Ready) */}
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    ITENS N2 DISPONIVEIS (PRONTOS)
                                    <span className="ml-2 text-sm text-muted-foreground">
                                        {availableItems.length} itens
                                    </span>
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={epicFilter}
                                        onValueChange={setEpicFilter}
                                    >
                                        <SelectTrigger className="w-56">
                                            <SelectValue placeholder="Filtrar por épico" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Todos os épicos
                                            </SelectItem>
                                            {orgEpics.map((epic) => (
                                                <SelectItem
                                                    key={epic.id}
                                                    value={epic.id.toString()}
                                                >
                                                    EP-{epic.id} {epic.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            setCreateDialogOpen(true)
                                        }
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Novo item N2
                                    </Button>
                                </div>
                            </div>
                            <SortableContext
                                id="available"
                                items={filteredAvailableItems.map((i) => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div
                                    id="available-dropzone"
                                    ref={availableDropzone.setNodeRef}
                                    className={`min-h-[400px] space-y-3 rounded-lg ${availableDropzone.isOver ? 'bg-primary/5 ring-2 ring-primary/30' : ''}`}
                                >
                                    {filteredAvailableItems.map((item) => (
                                        <SortableWorkItemCard
                                            key={item.id}
                                            item={item}
                                        />
                                    ))}
                                    {filteredAvailableItems.length === 0 && (
                                        <Card className="border-dashed">
                                            <CardContent className="p-8 text-center text-muted-foreground">
                                                Nenhum item pronto encontrado
                                                para este filtro.
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </SortableContext>

                            <Card className="mt-4 border-dashed">
                                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Dica: itens entram aqui quando estão em{' '}
                                        <span className="font-medium text-emerald-400">
                                            Pronto
                                        </span>
                                        . Você pode criar um item N2 já pronto
                                        ou promover do backlog abaixo.
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCreateDialogOpen(true)
                                        }
                                    >
                                        Criar item pronto
                                    </Button>
                                </CardContent>
                            </Card>

                            <div className="mt-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="text-sm font-semibold text-muted-foreground">
                                        BACKLOG N2 (NÃO PRONTOS)
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            {filteredBacklogItems.length} itens
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEpicFilter('all')}
                                    >
                                        Limpar filtro
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {filteredBacklogItems.length === 0 ? (
                                        <Card className="border-dashed">
                                            <CardContent className="p-6 text-center text-muted-foreground">
                                                Nenhum item N2 no backlog (ou
                                                filtrado).
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        filteredBacklogItems.map((item) => (
                                            <Card
                                                key={item.id}
                                                className="border-border/70"
                                            >
                                                <CardContent className="flex items-center justify-between gap-3 p-4">
                                                    <div className="min-w-0">
                                                        <div className="truncate text-sm font-medium">
                                                            #{item.id}{' '}
                                                            {item.title}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {item.epic_id
                                                                ? `EP-${item.epic_id}`
                                                                : 'Sem épico'}{' '}
                                                            • {item.priority}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                setPlanError(
                                                                    null,
                                                                );
                                                                const prevBacklog =
                                                                    backlogN2Items;
                                                                const prevScope =
                                                                    scopeItems;

                                                                setBacklogN2Items(
                                                                    (prev) =>
                                                                        prev.filter(
                                                                            (
                                                                                x,
                                                                            ) =>
                                                                                x.id !==
                                                                                item.id,
                                                                        ),
                                                                );
                                                                setScopeItems(
                                                                    (prev) => [
                                                                        {
                                                                            ...item,
                                                                            status: 'ready',
                                                                            sprint_id:
                                                                                currentSprint.id,
                                                                        },
                                                                        ...prev,
                                                                    ],
                                                                );

                                                                router.put(
                                                                    `/work-items/${item.id}`,
                                                                    {
                                                                        status: 'ready',
                                                                        sprint_id:
                                                                            currentSprint.id,
                                                                    },
                                                                    {
                                                                        preserveScroll: true,
                                                                        onError:
                                                                            (
                                                                                errors,
                                                                            ) => {
                                                                                const msg =
                                                                                    (
                                                                                        errors as InertiaErrorBag
                                                                                    ).status ||
                                                                                    (
                                                                                        errors as InertiaErrorBag
                                                                                    ).sprint_id ||
                                                                                    (
                                                                                        errors as InertiaErrorBag
                                                                                    ).update ||
                                                                                    'Não foi possível adicionar o item ao escopo.';
                                                                                setPlanError(
                                                                                    msg,
                                                                                );
                                                                                setBacklogN2Items(
                                                                                    prevBacklog,
                                                                                );
                                                                                setScopeItems(
                                                                                    prevScope,
                                                                                );
                                                                            },
                                                                    },
                                                                );
                                                            }}
                                                        >
                                                            Adicionar ao escopo
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setPlanError(
                                                                    null,
                                                                );
                                                                const prevBacklog =
                                                                    backlogN2Items;
                                                                const prevAvailable =
                                                                    availableItems;

                                                                setBacklogN2Items(
                                                                    (prev) =>
                                                                        prev.filter(
                                                                            (
                                                                                x,
                                                                            ) =>
                                                                                x.id !==
                                                                                item.id,
                                                                        ),
                                                                );
                                                                setAvailableItems(
                                                                    (prev) => [
                                                                        {
                                                                            ...item,
                                                                            status: 'ready',
                                                                        },
                                                                        ...prev,
                                                                    ],
                                                                );

                                                                router.put(
                                                                    `/work-items/${item.id}`,
                                                                    {
                                                                        status: 'ready',
                                                                    },
                                                                    {
                                                                        preserveScroll: true,
                                                                        onError:
                                                                            (
                                                                                errors,
                                                                            ) => {
                                                                                const msg =
                                                                                    (
                                                                                        errors as InertiaErrorBag
                                                                                    ).status ||
                                                                                    (
                                                                                        errors as InertiaErrorBag
                                                                                    ).update ||
                                                                                    'Não foi possível marcar o item como pronto.';
                                                                                setPlanError(
                                                                                    msg,
                                                                                );
                                                                                setBacklogN2Items(
                                                                                    prevBacklog,
                                                                                );
                                                                                setAvailableItems(
                                                                                    prevAvailable,
                                                                                );
                                                                            },
                                                                    },
                                                                );
                                                            }}
                                                        >
                                                            Marcar como pronto
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Current Sprint Scope */}
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    ESCOPO ATUAL DA SPRINT
                                    <span className="ml-2 text-sm text-muted-foreground">
                                        Total: {committed} pontos
                                    </span>
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            setCreateInScopeDialogOpen(true)
                                        }
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Novo no escopo
                                    </Button>
                                    <Button size="sm" variant="ghost" asChild>
                                        <Link href="/sprint-board">
                                            Ver no quadro
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <SortableContext
                                id="scope"
                                items={scopeItems.map((i) => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div
                                    id="scope-dropzone"
                                    ref={scopeDropzone.setNodeRef}
                                    className={`min-h-[400px] space-y-3 rounded-lg ${scopeDropzone.isOver ? 'bg-primary/5 ring-2 ring-primary/30' : ''}`}
                                >
                                    {scopeItems.map((item) => (
                                        <SortableWorkItemCard
                                            key={item.id}
                                            item={item}
                                        />
                                    ))}
                                    {scopeItems.length === 0 && (
                                        <div className="rounded-lg border-2 border-dashed border-slate-700 p-12 text-center text-sm text-muted-foreground">
                                            Arraste itens aqui para adicionar ao
                                            escopo
                                        </div>
                                    )}
                                </div>
                            </SortableContext>
                        </div>
                    </div>
                </div>

                <DragOverlay>
                    {activeItem ? (
                        <WorkItemCardContent item={activeItem} isDragging />
                    ) : null}
                </DragOverlay>
            </DndContext>

            <Dialog open={startDialogOpen} onOpenChange={setStartDialogOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Iniciar Sprint</DialogTitle>
                        <DialogDescription>
                            Valide o checklist abaixo antes de iniciar a sprint.
                            Itens bloqueados impedem o start.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid gap-3 text-sm">
                            <div className="flex items-center justify-between rounded-md border p-3">
                                <div className="flex items-center gap-2">
                                    {hasItems ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-rose-500" />
                                    )}
                                    <span>
                                        Escopo definido (itens na sprint)
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {scopeItems.length} itens
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-md border p-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <span>
                                        Itens longos e épicos permitidos no
                                        escopo
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-md border p-3">
                                <div className="flex items-center gap-2">
                                    {!hasNonReadyN2 ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-rose-500" />
                                    )}
                                    <span>N2 em status READY</span>
                                </div>
                                {hasNonReadyN2 && (
                                    <span className="text-xs text-rose-400">
                                        Ajustar status
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between rounded-md border p-3">
                                <div className="flex items-center gap-2">
                                    {capacityOk ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-rose-500" />
                                    )}
                                    <span>Capacidade N2 dentro do limite</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {committed}/{availableN2}{' '}
                                    {planningUnitLabel}
                                </span>
                            </div>
                        </div>

                        {startError && (
                            <div className="flex items-start gap-2 rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-500">
                                <AlertCircle className="mt-0.5 h-4 w-4" />
                                <span>{startError}</span>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setStartDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => {
                                if (!currentSprint) return;
                                router.post(
                                    `/sprints/${currentSprint.id}/start`,
                                    {},
                                    { preserveScroll: true },
                                );
                            }}
                            disabled={!hasItems || hasNonReadyN2 || !capacityOk}
                        >
                            Iniciar Sprint
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={pokerOpen} onOpenChange={setPokerOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Poker de Planejamento</DialogTitle>
                        <DialogDescription>
                            Selecione um item e atribua uma estimativa rapida.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">
                                Item de trabalho
                            </div>
                            <Select
                                value={pokerItemId?.toString() || ''}
                                onValueChange={(value) => {
                                    const id = parseInt(value);
                                    setPokerItemId(id);
                                    const item = scopeItems.find(
                                        (scopeItem) => scopeItem.id === id,
                                    );
                                    setPokerEstimate(item?.estimate ?? null);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o item" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* Items in Scope */}
                                    {scopeItems.length > 0 && (
                                        <>
                                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                                Escopo da Sprint
                                            </div>
                                            {scopeItems.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={item.id.toString()}
                                                >
                                                    #{item.id} {item.title}
                                                </SelectItem>
                                            ))}
                                        </>
                                    )}

                                    {/* Available Items */}
                                    {availableItems.length > 0 && (
                                        <>
                                            <div className="mt-2 px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                                Disponíveis (Ready)
                                            </div>
                                            {availableItems.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={item.id.toString()}
                                                >
                                                    #{item.id} {item.title}
                                                </SelectItem>
                                            ))}
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">
                                Estimativa
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {[1, 2, 3, 5, 8, 13, 21].map((value) => (
                                    <Button
                                        key={value}
                                        variant={
                                            pokerEstimate === value
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        onClick={() => setPokerEstimate(value)}
                                    >
                                        {value}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setPokerOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => {
                                if (!pokerItemId || pokerEstimate === null)
                                    return;
                                router.put(
                                    `/work-items/${pokerItemId}`,
                                    { estimate: pokerEstimate },
                                    { preserveScroll: true },
                                );
                                setScopeItems((prev) =>
                                    prev.map((item) =>
                                        item.id === pokerItemId
                                            ? {
                                                  ...item,
                                                  estimate: pokerEstimate,
                                              }
                                            : item,
                                    ),
                                );
                                setPokerOpen(false);
                            }}
                            disabled={!pokerItemId || pokerEstimate === null}
                        >
                            Aplicar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <WorkItemFormDialog
                key="create-n2-ready"
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                users={orgUsers}
                epics={orgEpics}
                defaults={{ tier: 'N2', status: 'ready' }}
                onSuccess={() => router.reload()}
            />

            {currentSprint && (
                <WorkItemFormDialog
                    key="create-n2-in-scope"
                    open={createInScopeDialogOpen}
                    onOpenChange={setCreateInScopeDialogOpen}
                    sprintId={currentSprint.id}
                    users={orgUsers}
                    epics={orgEpics}
                    defaults={{ tier: 'N2', status: 'ready' }}
                    onSuccess={() => router.reload()}
                />
            )}
        </AppLayout>
    );
}
