import type {
    DragEndEvent,
    DragStartEvent,
    DragOverEvent,
} from '@dnd-kit/core';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    useDroppable,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from '@inertiajs/react';
import { Head, router } from '@inertiajs/react';
import { format, differenceInMinutes } from 'date-fns';
import {
    Plus,
    Search,
    Filter,
    X,
    Settings,
    Trash2,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ColumnSettingsDialog } from '@/components/board/ColumnSettingsDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { BlockedReasonDialog } from '@/components/work-items/BlockedReasonDialog';
import { WorkItemDetailPanel } from '@/components/work-items/WorkItemDetailPanel';
import { WorkItemFormDialog } from '@/components/work-items/WorkItemFormDialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type {
    Board,
    BoardColumn,
    Epic,
    FlowMetrics,
    Sprint,
    User,
    WorkItem,
} from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Quadro da Sprint', href: '/sprint-board' },
];

interface SprintBoardProps {
    board: Board;
    sprint?: Sprint;
    flowMetrics?: FlowMetrics | null;
    users?: User[];
    epics?: Epic[];
}

function getInitials(name?: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
}

function formatDuration(
    start?: string | null,
    end?: string | null,
): string | null {
    if (!start) return null;
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()))
        return null;
    if (endDate < startDate) return null;

    const totalMinutes = differenceInMinutes(endDate, startDate);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

function getDurationInfo(item: WorkItem) {
    const start = item.started_at ?? item.created_at;
    const end = item.completed_at ?? null;
    const duration = formatDuration(start, end);
    if (!duration || !start) return null;

    const label = item.completed_at
        ? 'Lead'
        : item.started_at
          ? 'Cycle'
          : 'Age';
    const startLabel = format(new Date(start), 'dd/MM HH:mm');
    const endLabel = item.completed_at
        ? format(new Date(item.completed_at), 'dd/MM HH:mm')
        : null;

    return {
        label,
        duration,
        startLabel,
        endLabel,
    };
}

interface SortableCardProps {
    item: WorkItem;
    isDragging?: boolean;
    isSelected?: boolean;
    isUpdated?: boolean;
    onSelect?: (
        item: WorkItem,
        event: React.MouseEvent | React.KeyboardEvent,
    ) => void;
}

function SortableCard({
    item,
    isSelected,
    isUpdated,
    onSelect,
}: SortableCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `item-${item.id}`,
        data: { item, type: 'item' },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <WorkItemCard
                item={item}
                isSelected={isSelected}
                isUpdated={isUpdated}
                onSelect={onSelect}
            />
        </div>
    );
}

function WorkItemCard({
    item,
    isSelected,
    isUpdated,
    onSelect,
}: {
    item: WorkItem;
    isSelected?: boolean;
    isUpdated?: boolean;
    onSelect?: (
        item: WorkItem,
        event: React.MouseEvent | React.KeyboardEvent,
    ) => void;
}) {
    const tierClass = item.tier === 'N1' ? 'badge-tier-n1' : 'badge-tier-n2';
    const durationInfo = getDurationInfo(item);
    const dueDateLabel = item.due_date
        ? format(new Date(item.due_date), 'dd/MM')
        : null;
    const priorityTone: Record<string, string> = {
        P0: 'bg-rose-500/15 text-rose-300 border-rose-400/40',
        P1: 'bg-amber-500/15 text-amber-300 border-amber-400/40',
        P2: 'bg-sky-500/15 text-sky-300 border-sky-400/40',
        P3: 'bg-slate-500/15 text-slate-300 border-slate-400/40',
    };

    return (
        <Card
            className={`group cursor-grab rounded-xl border border-border/60 bg-card/95 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg active:cursor-grabbing ${isSelected ? 'ring-2 ring-primary/60' : ''} ${isUpdated ? 'border-primary/60 bg-accent/20' : ''}`}
            role="button"
            tabIndex={0}
            onClick={(event) => onSelect?.(item, event)}
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    router.visit(`/work-items/${item.id}`);
                    return;
                }
                if (event.key === ' ') {
                    event.preventDefault();
                    onSelect?.(item, event);
                }
            }}
            onDoubleClick={() => router.visit(`/work-items/${item.id}`)}
        >
            <CardContent className="space-y-2.5 p-3">
                <div className="h-1.5 w-12 rounded-full bg-primary/50 transition-colors group-hover:bg-primary/75" />
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5">
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
                        {item.ticket_id && (
                            <Badge
                                variant="outline"
                                className="px-1.5 py-0 text-[10px]"
                            >
                                TK-{item.ticket_id}
                            </Badge>
                        )}
                    </div>
                    <Badge
                        variant="outline"
                        className={`${tierClass} px-1.5 py-0 text-[10px] font-semibold`}
                    >
                        {item.tier}
                    </Badge>
                </div>
                <h3 className="line-clamp-2 text-sm leading-snug font-medium">
                    {item.title}
                </h3>
                {item.status === 'blocked' && item.blocked_reason && (
                    <p className="line-clamp-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-200">
                        {item.blocked_reason}
                    </p>
                )}
                {(durationInfo || dueDateLabel || item.size) && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                        {durationInfo && (
                            <span
                                className="rounded-full border border-border/70 bg-muted/40 px-2 py-0.5"
                                title={`Duração desde ${durationInfo.startLabel}${durationInfo.endLabel ? ` até ${durationInfo.endLabel}` : ''}`}
                            >
                                {durationInfo.label}: {durationInfo.duration}
                            </span>
                        )}
                        {dueDateLabel && (
                            <span
                                className="rounded-full border border-border/70 bg-muted/30 px-2 py-0.5"
                                title={`Entrega em ${format(new Date(item.due_date!), 'dd/MM/yyyy')}`}
                            >
                                Entrega: {dueDateLabel}
                            </span>
                        )}
                        {item.size && (
                            <span className="rounded-full border border-border/70 bg-muted/40 px-2 py-0.5">
                                Tamanho: {item.size}
                            </span>
                        )}
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <Badge
                            variant="outline"
                            className="px-1.5 py-0 text-[10px] uppercase"
                        >
                            {item.type}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={`px-1.5 py-0 text-[10px] ${priorityTone[item.priority] || ''}`}
                        >
                            {item.priority}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                        {item.estimate && (
                            <span className="text-[10px] text-muted-foreground">
                                {item.estimate}{' '}
                                {item.tier === 'N1' ? 'h' : 'SP'}
                            </span>
                        )}
                        <div
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-border/80 bg-muted text-[9px] font-semibold"
                            title={item.assignee?.name}
                        >
                            {getInitials(item.assignee?.name)}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface DroppableColumnProps {
    column: BoardColumn;
    items: WorkItem[];
    wipLimit?: number;
    selectedItemIds?: number[];
    recentlyUpdatedItemId?: number | null;
    onSelectItem?: (
        item: WorkItem,
        event: React.MouseEvent | React.KeyboardEvent,
    ) => void;
    onUpdateColumn: (columnId: number, data: Partial<BoardColumn>) => void;
    onDeleteColumn: (columnId: number) => void;
    onMoveColumn: (columnId: number, direction: 'left' | 'right') => void;
    onEditColumn: (column: BoardColumn) => void;
    onAddCard: () => void;
    isFirst: boolean;
    isLast: boolean;
}

function DroppableColumn({
    column,
    items,
    wipLimit,
    selectedItemIds = [],
    recentlyUpdatedItemId,
    onSelectItem,
    onUpdateColumn,
    onDeleteColumn,
    onMoveColumn,
    onEditColumn,
    onAddCard,
    isFirst,
    isLast,
}: DroppableColumnProps) {
    const droppableId = `column-${column.id}`;
    const { setNodeRef, isOver } = useDroppable({ id: droppableId });

    const [isEditingName, setIsEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState(column.name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditingName) {
            inputRef.current?.focus();
        }
    }, [isEditingName]);

    const handleSaveName = () => {
        if (nameDraft.trim() !== column.name) {
            onUpdateColumn(column.id, { name: nameDraft.trim() });
        }
        setIsEditingName(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveName();
        } else if (e.key === 'Escape') {
            setNameDraft(column.name);
            setIsEditingName(false);
        }
    };

    const isOverLimit = wipLimit && items.length >= wipLimit;
    const colorClasses: Record<string, string> = {
        backlog: 'border-t-slate-500',
        ready: 'border-t-emerald-500',
        in_progress: 'border-t-blue-500',
        blocked: 'border-t-amber-500',
        done: 'border-t-green-500',
        default: 'border-t-slate-500',
    };
    const colorClass = column.status_mapping
        ? colorClasses[column.status_mapping] || colorClasses.default
        : colorClasses.default;

    const priorityOrder = ['P0', 'P1', 'P2', 'P3'];
    const groupedItems =
        column.kind === 'status' && column.status_mapping === 'backlog'
            ? [...items]
                  .map((item, index) => ({ item, index }))
                  .sort((a, b) => {
                      const typeCompare = a.item.type.localeCompare(
                          b.item.type,
                      );
                      if (typeCompare !== 0) return typeCompare;
                      const priorityA = priorityOrder.indexOf(a.item.priority);
                      const priorityB = priorityOrder.indexOf(b.item.priority);
                      if (priorityA !== priorityB) return priorityA - priorityB;
                      return a.index - b.index;
                  })
                  .map(({ item }) => item)
            : items;

    return (
        <div
            className={`flex h-full w-[300px] min-w-[300px] flex-col rounded-xl border border-border/70 bg-muted/25 shadow-sm ${isOver ? 'ring-2 ring-primary/70' : ''}`}
        >
            <div className={`rounded-t-xl border-t-2 ${colorClass} px-3 py-2`}>
                <div className="flex items-center justify-between">
                    {isEditingName ? (
                        <Input
                            ref={inputRef}
                            value={nameDraft}
                            onChange={(e) => setNameDraft(e.target.value)}
                            onBlur={handleSaveName}
                            onKeyDown={handleKeyDown}
                            className="h-7 bg-background px-2 text-sm"
                        />
                    ) : (
                        <button
                            type="button"
                            className="flex flex-1 cursor-pointer items-center gap-2 py-1 text-left text-sm font-semibold"
                            onClick={() => setIsEditingName(true)}
                        >
                            <span
                                className="max-w-[150px] truncate"
                                title={column.name}
                            >
                                {column.name}
                            </span>
                            <Badge
                                variant="secondary"
                                className="h-4 min-w-[1.25rem] justify-center px-1.5 text-[10px]"
                            >
                                {items.length}
                            </Badge>
                        </button>
                    )}

                    <div className="flex items-center gap-1">
                        {wipLimit && (
                            <Badge
                                variant={
                                    isOverLimit ? 'destructive' : 'outline'
                                }
                                className="h-5 px-1.5 text-[10px] whitespace-nowrap"
                            >
                                {items.length}/{wipLimit}
                            </Badge>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ml-1 h-6 w-6 text-muted-foreground hover:text-foreground"
                                >
                                    <Settings className="h-3.5 w-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>
                                    Ações da Coluna
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => setIsEditingName(true)}
                                >
                                    Renomear
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onEditColumn(column)}
                                >
                                    Configurações
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() =>
                                        onMoveColumn(column.id, 'left')
                                    }
                                    disabled={isFirst}
                                >
                                    <ArrowUp className="mr-2 h-3.5 w-3.5 rotate-[-90deg]" />
                                    Mover para esquerda
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        onMoveColumn(column.id, 'right')
                                    }
                                    disabled={isLast}
                                >
                                    <ArrowDown className="mr-2 h-3.5 w-3.5 rotate-[-90deg]" />
                                    Mover para direita
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => onDeleteColumn(column.id)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                                    Excluir
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <div
                ref={setNodeRef}
                className={`min-h-[280px] flex-1 space-y-2 overflow-y-auto p-2.5 ${isOver ? 'bg-primary/5' : ''}`}
            >
                <SortableContext
                    items={groupedItems.map((i) => `item-${i.id}`)}
                    strategy={verticalListSortingStrategy}
                >
                    {groupedItems.map((item, index) => {
                        const previous =
                            index > 0 ? groupedItems[index - 1] : null;
                        const showGroupHeader =
                            column.kind === 'status' &&
                            column.status_mapping === 'backlog' &&
                            (!previous || previous.type !== item.type);

                        return (
                            <div key={item.id}>
                                {showGroupHeader && (
                                    <div className="sticky top-0 z-10 -mx-1 mb-1 rounded-md bg-card/80 px-2 py-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase backdrop-blur">
                                        {item.type}
                                    </div>
                                )}
                                <SortableCard
                                item={item}
                                isSelected={selectedItemIds?.includes(
                                    item.id,
                                )}
                                isUpdated={recentlyUpdatedItemId === item.id}
                                onSelect={onSelectItem}
                            />
                            </div>
                        );
                    })}
                </SortableContext>
                {groupedItems.length === 0 && (
                    <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed bg-background/40 p-4 text-xs text-muted-foreground">
                        {column.status_mapping === 'done'
                            ? 'Tarefas concluídas'
                            : 'Arraste itens aqui'}
                    </div>
                )}
            </div>
            <div className="border-t border-border/50 p-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onAddCard}
                    className="w-full justify-start text-muted-foreground hover:bg-background/60 hover:text-foreground"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar cartão
                </Button>
            </div>
        </div>
    );
}

function cloneColumnsData(columns: BoardColumn[]): BoardColumn[] {
    return columns.map((column) => ({
        ...column,
        items: column.items.map((item) => ({ ...item })),
    }));
}

function isTransitionAllowed(from: string, to: string): boolean {
    const allowed: Record<string, string[]> = {
        backlog: ['ready', 'in_progress', 'blocked'],
        ready: ['backlog', 'in_progress', 'blocked'],
        in_progress: ['ready', 'blocked', 'done'],
        blocked: ['ready', 'in_progress'],
        done: [],
    };
    return (allowed[from] || []).includes(to);
}

export default function SprintBoard({
    board,
    sprint,
    flowMetrics,
    users,
    epics,
}: SprintBoardProps) {
    type InertiaErrorBag = Record<string, string | undefined>;

    const [searchQuery, setSearchQuery] = useState('');
    const [activeItem, setActiveItem] = useState<WorkItem | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editItem, setEditItem] = useState<WorkItem | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
    const [selectionAnchorId, setSelectionAnchorId] = useState<number | null>(
        null,
    );
    const [detailPanelOpen, setDetailPanelOpen] = useState(false);
    const [detailPanelItem, setDetailPanelItem] = useState<WorkItem | null>(
        null,
    );
    const [recentlyUpdatedItemId, setRecentlyUpdatedItemId] = useState<
        number | null
    >(null);
    const [boardError, setBoardError] = useState<string | null>(null);
    const [preMutationColumns, setPreMutationColumns] = useState<
        BoardColumn[] | null
    >(null);
    const [blockedDialogOpen, setBlockedDialogOpen] = useState(false);
    const [pendingBlockItemIds, setPendingBlockItemIds] = useState<number[]>(
        [],
    );
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const [manageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [pendingColumnDelete, setPendingColumnDelete] = useState<
        number | null
    >(null);
    const [pendingDeleteFallback, setPendingDeleteFallback] =
        useState<string>('');
    const [columnsDraft, setColumnsDraft] = useState<BoardColumn[]>([]);
    const [editingColumn, setEditingColumn] = useState<BoardColumn | null>(
        null,
    );
    const [filters, setFilters] = useState({
        tiers: [] as string[],
        priorities: [] as string[],
        assignees: [] as string[],
    });
    const [viewMode, setViewMode] = useState<'board' | 'timeline'>('board');

    const [columnsData, setColumnsData] = useState<BoardColumn[]>(
        () => board.columns || [],
    );

    // Keep local board state in sync when the server reloads data.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setColumnsData(board.columns || []), [board.columns]);

    const handleManageColumnsOpenChange = (open: boolean) => {
        setManageColumnsOpen(open);
        if (open) {
            setColumnsDraft(cloneColumnsData(columnsData));
        }
    };

    const totalItems = columnsData.reduce(
        (sum, column) => sum + (column.items?.length ?? 0),
        0,
    );
    const blockedCount =
        columnsData.find((column) => column.status_mapping === 'blocked')?.items
            .length ?? 0;
    const inProgressCount =
        columnsData.find((column) => column.status_mapping === 'in_progress')
            ?.items.length ?? 0;
    const doneCount =
        columnsData.find((column) => column.status_mapping === 'done')?.items
            .length ?? 0;
    const sprintRange = sprint
        ? `${format(new Date(sprint.start_date), 'dd/MM')} - ${format(new Date(sprint.end_date), 'dd/MM')}`
        : null;
    const inProgressWipLimit =
        sprint && sprint.wip_limit > 0 ? sprint.wip_limit : undefined;

    const getColumnById = (columnId: number) =>
        columnsData.find((column) => column.id === columnId) || null;
    const getColumnIdByItemId = (itemId: number) => {
        for (const column of columnsData) {
            if (column.items.some((item) => item.id === itemId))
                return column.id;
        }
        return null;
    };
    const parseColumnId = (value: string) =>
        value.startsWith('column-')
            ? parseInt(value.replace('column-', ''), 10)
            : null;

    const getTargetColumnIdFromOverId = (overId: string) => {
        const directColumnId = parseColumnId(overId);
        if (directColumnId) return directColumnId;

        if (overId.startsWith('item-')) {
            const overItemId = parseInt(overId.replace('item-', ''), 10);
            return getColumnIdByItemId(overItemId) ?? null;
        }

        return null;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setBoardError(null);
        const snapshot = cloneColumnsData(columnsData);
        setPreMutationColumns(snapshot);
        const { active } = event;
        const itemId = parseInt(String(active.id).replace('item-', ''));
        const item = columnsData
            .flatMap((column) => column.items)
            .find((i) => i.id === itemId);
        setActiveItem(item || null);
        if (item) {
            setSelectedItemId(item.id);
            setSelectedItemIds([item.id]);
        } else {
            setSelectedItemId(null);
            setSelectedItemIds([]);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = parseInt(String(active.id).replace('item-', ''), 10);
        const overId = String(over.id);

        // Find source column
        const sourceColumnId = getColumnIdByItemId(activeId);
        const sourceColumn = sourceColumnId
            ? getColumnById(sourceColumnId)
            : null;
        const sourceItem = sourceColumn?.items.find(
            (item) => item.id === activeId,
        );
        if (!sourceColumn || !sourceItem) return;

        // Determine target column
        const targetColumnId = getTargetColumnIdFromOverId(overId);

        if (!targetColumnId || targetColumnId === sourceColumn.id) return;
        const targetColumn = getColumnById(targetColumnId);
        if (!targetColumn) return;

        const targetStatus = targetColumn.status_mapping;
        if (
            targetStatus &&
            !isTransitionAllowed(sourceItem.status, targetStatus)
        ) {
            setBoardError(
                `Transição inválida: ${sourceItem.status} → ${targetStatus}`,
            );
            return;
        }

        if (
            targetStatus === 'in_progress' &&
            inProgressWipLimit &&
            sourceItem.status !== 'in_progress'
        ) {
            const current =
                columnsData.find(
                    (column) => column.status_mapping === 'in_progress',
                )?.items.length ?? 0;
            if (current >= inProgressWipLimit) {
                setBoardError(
                    `WIP limit atingido em Em Progresso (${current}/${inProgressWipLimit}).`,
                );
                return;
            }
        }

        setColumnsData((prev) => {
            const next = cloneColumnsData(prev);
            const nextSource = next.find(
                (column) => column.id === sourceColumn.id,
            );
            const nextTarget = next.find(
                (column) => column.id === targetColumn.id,
            );
            if (!nextSource || !nextTarget) return prev;

            nextSource.items = nextSource.items.filter(
                (item) => item.id !== sourceItem.id,
            );
            const updatedItem = targetStatus
                ? { ...sourceItem, status: targetStatus }
                : sourceItem;
            nextTarget.items = [...nextTarget.items, updatedItem];
            return next;
        });
    };

    const findItemById = useCallback(
        (itemId: number) => {
            return (
                columnsData
                    .flatMap((column) => column.items)
                    .find((i) => i.id === itemId) || null
            );
        },
        [columnsData],
    );

    const orderedVisibleItemIds = columnsData
        .flatMap((column) => column.items || [])
        .map((item) => item.id);

    const handleSelectItem = (
        item: WorkItem,
        event: React.MouseEvent | React.KeyboardEvent,
    ) => {
        const isShift = 'shiftKey' in event ? event.shiftKey : false;
        const isMulti =
            'metaKey' in event ? event.metaKey || event.ctrlKey : false;
        setSelectedItemId(item.id);

        if (isShift && selectionAnchorId) {
            const anchorIndex = orderedVisibleItemIds.indexOf(selectionAnchorId);
            const currentIndex = orderedVisibleItemIds.indexOf(item.id);

            if (anchorIndex !== -1 && currentIndex !== -1) {
                const [start, end] =
                    anchorIndex < currentIndex
                        ? [anchorIndex, currentIndex]
                        : [currentIndex, anchorIndex];
                const range = orderedVisibleItemIds.slice(start, end + 1);
                setSelectedItemIds(range);
                return;
            }
        }

        if (!isMulti) {
            setSelectedItemIds([item.id]);
            setSelectionAnchorId(item.id);
            setDetailPanelItem(item);
            setDetailPanelOpen(true);
            return;
        }

        setSelectionAnchorId(item.id);
        setSelectedItemIds((prev) =>
            prev.includes(item.id)
                ? prev.filter((id) => id !== item.id)
                : [...prev, item.id],
        );
    };

    const clearSelection = () => {
        setSelectedItemIds([]);
        setSelectedItemId(null);
        setSelectionAnchorId(null);
    };

    const findItemColumn = (itemId: number) => {
        return getColumnIdByItemId(itemId);
    };

    const moveItemToDone = useCallback(
        (item: WorkItem) => {
            const doneColumn = columnsData.find(
                (column) => column.status_mapping === 'done',
            );
            if (!doneColumn) return;

            let sourceColumnId: number | null = null;
            for (const column of columnsData) {
                if (column.items.some((i) => i.id === item.id)) {
                    sourceColumnId = column.id;
                    break;
                }
            }
            if (!sourceColumnId || sourceColumnId === doneColumn.id) return;

            setColumnsData((prev) => {
                const next = cloneColumnsData(prev);
                const source = next.find(
                    (column) => column.id === sourceColumnId,
                );
                const target = next.find(
                    (column) => column.id === doneColumn.id,
                );
                if (!source || !target) return prev;
                source.items = source.items.filter((i) => i.id !== item.id);
                target.items = [...target.items, { ...item, status: 'done' }];
                return next;
            });

            const fromOrder =
                columnsData
                    .find((c) => c.id === sourceColumnId)
                    ?.items.map((i) => i.id) ?? [];
            const toOrder = (
                columnsData
                    .find((c) => c.id === doneColumn.id)
                    ?.items.map((i) => i.id) ?? []
            ).concat(item.id);

            router.post(
                `/boards/${board.id}/items/move`,
                {
                    work_item_id: item.id,
                    from_column_id: sourceColumnId,
                    to_column_id: doneColumn.id,
                    from_order: fromOrder.filter((id) => id !== item.id),
                    to_order: toOrder,
                    sprint_id: sprint?.id ?? null,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        },
        [board.id, columnsData, sprint?.id],
    );

    const applyStatusToSelected = (status: string) => {
        if (selectedItemIds.length === 0) return;

        setBoardError(null);

        if (status === 'blocked') {
            setPendingBlockItemIds(selectedItemIds);
            setBlockedDialogOpen(true);
            return;
        }

        const targetColumn = columnsData.find(
            (column) => column.status_mapping === status,
        );
        if (!targetColumn) {
            setBoardError(
                'Nao existe uma coluna configurada para esse status.',
            );
            return;
        }

        const invalid = selectedItemIds.find((id) => {
            const item = findItemById(id);
            return !item || !isTransitionAllowed(item.status, status);
        });
        if (invalid) {
            setBoardError(
                'Há itens selecionados com transição inválida para o status escolhido.',
            );
            return;
        }

        if (status === 'in_progress' && inProgressWipLimit) {
            const current =
                columnsData.find(
                    (column) => column.status_mapping === 'in_progress',
                )?.items.length ?? 0;
            const willAdd = selectedItemIds.filter((id) => {
                const item = findItemById(id);
                return item && item.status !== 'in_progress';
            }).length;
            if (current + willAdd > inProgressWipLimit) {
                setBoardError(
                    `WIP limit atingido em Em Progresso (${current}/${inProgressWipLimit}).`,
                );
                return;
            }
        }

        const snapshot = cloneColumnsData(columnsData);
        setPreMutationColumns(snapshot);

        setColumnsData((prev) => {
            const next = cloneColumnsData(prev);
            const target = next.find((column) => column.id === targetColumn.id);
            if (!target) return prev;

            next.forEach((column) => {
                column.items = column.items.filter((item) => {
                    if (selectedItemIds.includes(item.id)) {
                        target.items = [...target.items, { ...item, status }];
                        return false;
                    }
                    return true;
                });
            });

            return next;
        });

        selectedItemIds.forEach((id) => {
            const fromColumnId = findItemColumn(id);
            const fromOrder = fromColumnId
                ? (columnsData
                      .find((c) => c.id === fromColumnId)
                      ?.items.map((i) => i.id) ?? [])
                : [];
            const toOrder = (
                columnsData
                    .find((c) => c.id === targetColumn.id)
                    ?.items.map((i) => i.id) ?? []
            ).concat(id);

            router.post(
                `/boards/${board.id}/items/move`,
                {
                    work_item_id: id,
                    from_column_id: fromColumnId,
                    to_column_id: targetColumn.id,
                    from_order: fromOrder.filter((itemId) => itemId !== id),
                    to_order: toOrder,
                    sprint_id: sprint?.id ?? null,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => setPreMutationColumns(null),
                    onError: (errors: InertiaErrorBag) => {
                        const msg =
                            errors.status ||
                            errors.assignee_id ||
                            errors.estimate ||
                            errors.blocked_reason ||
                            'Não foi possível aplicar o status em massa.';
                        setBoardError(msg);
                        setColumnsData(snapshot);
                    },
                },
            );
        });
    };

    const applyBlockedToItemIds = (itemIds: number[], reason: string) => {
        const trimmed = reason.trim();
        if (!trimmed || itemIds.length === 0) return;

        setBoardError(null);

        const blockedColumn = columnsData.find(
            (column) => column.status_mapping === 'blocked',
        );
        if (!blockedColumn) {
            setBoardError('Nao existe coluna configurada para Bloqueado.');
            return;
        }

        const invalid = itemIds.find((id) => {
            const item = findItemById(id);
            return !item || !isTransitionAllowed(item.status, 'blocked');
        });
        if (invalid) {
            setBoardError('Há itens com transição inválida para Bloqueado.');
            return;
        }

        const snapshot = preMutationColumns ?? cloneColumnsData(columnsData);
        if (!preMutationColumns) setPreMutationColumns(snapshot);

        setColumnsData((prev) => {
            const next = cloneColumnsData(prev);
            const target = next.find(
                (column) => column.id === blockedColumn.id,
            );
            if (!target) return prev;

            next.forEach((column) => {
                column.items = column.items.filter((item) => {
                    if (itemIds.includes(item.id)) {
                        target.items = [
                            ...target.items,
                            {
                                ...item,
                                status: 'blocked',
                                blocked_reason: trimmed,
                            },
                        ];
                        return false;
                    }
                    return true;
                });
            });

            return next;
        });

        itemIds.forEach((id) => {
            const fromColumnId = findItemColumn(id);
            const fromOrder = fromColumnId
                ? (columnsData
                      .find((c) => c.id === fromColumnId)
                      ?.items.map((i) => i.id) ?? [])
                : [];
            const toOrder = (
                columnsData
                    .find((c) => c.id === blockedColumn.id)
                    ?.items.map((i) => i.id) ?? []
            ).concat(id);

            router.post(
                `/boards/${board.id}/items/move`,
                {
                    work_item_id: id,
                    from_column_id: fromColumnId,
                    to_column_id: blockedColumn.id,
                    blocked_reason: trimmed,
                    from_order: fromOrder.filter((itemId) => itemId !== id),
                    to_order: toOrder,
                    sprint_id: sprint?.id ?? null,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => setPreMutationColumns(null),
                    onError: (errors: InertiaErrorBag) => {
                        const msg =
                            errors.blocked_reason ||
                            errors.status ||
                            'Não foi possível bloquear o item.';
                        setBoardError(msg);
                        setColumnsData(snapshot);
                    },
                },
            );
        });
    };

    const handleBlockedDialogChange = (open: boolean) => {
        setBlockedDialogOpen(open);
        if (open) return;

        // If we already moved items via drag preview but user cancelled, revert.
        if (preMutationColumns && pendingBlockItemIds.length > 0) {
            const movedSinceSnapshot = pendingBlockItemIds.some((id) => {
                const before =
                    preMutationColumns.find((column) =>
                        column.items.some((i) => i.id === id),
                    )?.id ?? null;
                const nowCol = findItemColumn(id);
                return before !== null && nowCol !== null && before !== nowCol;
            });
            if (movedSinceSnapshot) setColumnsData(preMutationColumns);
        }

        setPendingBlockItemIds([]);
    };

    const applyAssigneeToSelected = (assigneeId: string) => {
        if (selectedItemIds.length === 0) return;
        const assigneeValue =
            assigneeId === 'unassigned' ? null : parseInt(assigneeId);
        const assigneeUser = (users || []).find(
            (user) => user.id.toString() === assigneeId,
        );

        setColumnsData((prev) => {
            return prev.map((column) => ({
                ...column,
                items: column.items.map((item) => {
                    if (!selectedItemIds.includes(item.id)) return item;
                    return {
                        ...item,
                        assignee_id: assigneeValue ?? undefined,
                        assignee: assigneeUser ?? undefined,
                    };
                }),
            }));
        });

        selectedItemIds.forEach((id) => {
            router.put(
                `/work-items/${id}`,
                { assignee_id: assigneeValue },
                { preserveScroll: true, preserveState: true },
            );
        });
    };

    const handleEditDialogChange = (open: boolean) => {
        setEditDialogOpen(open);
        if (!open) {
            setEditItem(null);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.defaultPrevented) return;
            const target = event.target as HTMLElement | null;
            const isTypingTarget =
                !!target &&
                (target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.tagName === 'SELECT' ||
                    target.isContentEditable);
            if (isTypingTarget || createDialogOpen || editDialogOpen) return;

            const key = event.key.toLowerCase();
            const selectedItem = selectedItemId
                ? findItemById(selectedItemId)
                : null;

            if (key === 'n') {
                event.preventDefault();
                setCreateDialogOpen(true);
            }

            if (key === '/') {
                event.preventDefault();
                searchInputRef.current?.focus();
            }

            if (key === 'e' && selectedItem) {
                event.preventDefault();
                setEditItem(selectedItem);
                setEditDialogOpen(true);
            }

            if (key === 'd' && selectedItem) {
                event.preventDefault();
                moveItemToDone(selectedItem);
            }

            if (key === 'o' && selectedItem) {
                event.preventDefault();
                setDetailPanelItem(selectedItem);
                setDetailPanelOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [
        createDialogOpen,
        editDialogOpen,
        selectedItemId,
        columnsData,
        findItemById,
        moveItemToDone,
    ]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveItem(null);

        if (!over) return;

        const activeId = parseInt(String(active.id).replace('item-', ''), 10);
        const newColumnId = getTargetColumnIdFromOverId(String(over.id));
        const originalColumnId = (() => {
            const snapshot = preMutationColumns;
            if (snapshot) {
                return (
                    snapshot.find((column) =>
                        column.items.some((i) => i.id === activeId),
                    )?.id ?? null
                );
            }
            return findItemColumn(activeId);
        })();

        if (
            !newColumnId ||
            !originalColumnId ||
            newColumnId === originalColumnId
        )
            return;

        const targetColumn = getColumnById(newColumnId);
        if (!targetColumn) return;

        const originalItem =
            preMutationColumns
                ?.flatMap((column) => column.items)
                .find((i) => i.id === activeId) ?? findItemById(activeId);
        const targetStatus = targetColumn.status_mapping;

        if (
            targetStatus &&
            originalItem &&
            !isTransitionAllowed(originalItem.status, targetStatus)
        ) {
            setBoardError(
                `Transição inválida: ${originalItem.status} → ${targetStatus}`,
            );
            if (preMutationColumns) setColumnsData(preMutationColumns);
            return;
        }

        if (
            targetStatus === 'in_progress' &&
            inProgressWipLimit &&
            originalItem?.status !== 'in_progress'
        ) {
            const current =
                columnsData.find(
                    (column) => column.status_mapping === 'in_progress',
                )?.items.length ?? 0;
            if (current > inProgressWipLimit) {
                setBoardError(
                    `WIP limit atingido em Em Progresso (${Math.min(current, inProgressWipLimit)}/${inProgressWipLimit}).`,
                );
                if (preMutationColumns) setColumnsData(preMutationColumns);
                return;
            }
        }

        if (targetStatus === 'blocked') {
            setPendingBlockItemIds([activeId]);
            setBlockedDialogOpen(true);
            return;
        }

        const snapshot = preMutationColumns;
        const fromOrder =
            columnsData
                .find((column) => column.id === originalColumnId)
                ?.items.map((i) => i.id) ?? [];
        const toOrder =
            columnsData
                .find((column) => column.id === newColumnId)
                ?.items.map((i) => i.id) ?? [];

        router.post(
            `/boards/${board.id}/items/move`,
            {
                work_item_id: activeId,
                from_column_id: originalColumnId,
                to_column_id: newColumnId,
                from_order: fromOrder,
                to_order: toOrder,
                sprint_id: sprint?.id ?? null,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setPreMutationColumns(null),
                onError: (errors: InertiaErrorBag) => {
                    const msg =
                        errors.status ||
                        errors.assignee_id ||
                        errors.estimate ||
                        errors.blocked_reason ||
                        'Não foi possível mover o item.';
                    setBoardError(msg);
                    if (snapshot) setColumnsData(snapshot);
                },
            },
        );
    };

    // Filter items by search query
    const filterItems = (items: WorkItem[]) => {
        if (!searchQuery) return items;
        return items.filter(
            (item) =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toString().includes(searchQuery),
        );
    };

    const toggleFilter = (
        key: 'tiers' | 'priorities' | 'assignees',
        value: string,
    ) => {
        setFilters((prev) => {
            const exists = prev[key].includes(value);
            const nextValues = exists
                ? prev[key].filter((v) => v !== value)
                : [...prev[key], value];
            return { ...prev, [key]: nextValues };
        });
    };

    const clearFilters = () => {
        setFilters({ tiers: [], priorities: [], assignees: [] });
    };

    const matchesFilters = (item: WorkItem) => {
        const tierOk =
            filters.tiers.length === 0 || filters.tiers.includes(item.tier);
        const priorityOk =
            filters.priorities.length === 0 ||
            filters.priorities.includes(item.priority);
        const assigneeValue = item.assignee_id
            ? item.assignee_id.toString()
            : 'unassigned';
        const assigneeOk =
            filters.assignees.length === 0 ||
            filters.assignees.includes(assigneeValue);
        return tierOk && priorityOk && assigneeOk;
    };

    const filteredItems = (items: WorkItem[]) =>
        filterItems(items).filter(matchesFilters);

    const activeFilterCount =
        filters.tiers.length +
        filters.priorities.length +
        filters.assignees.length;
    const statusColumns = columnsData.filter((column) => column.status_mapping);
    const timelineItems = (() => {
        const seen = new Set<number>();
        const flat = columnsData.flatMap((column) => column.items || []);
        const unique = flat.filter((item) => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
        });

        return filteredItems(unique);
    })();

    const timelineStart = sprint
        ? new Date(sprint.start_date)
        : timelineItems.length > 0
          ? new Date(
                Math.min(
                    ...timelineItems.map((item) => {
                        const anchor =
                            item.planned_for ||
                            item.started_at ||
                            item.created_at;
                        return new Date(anchor).getTime();
                    }),
                ),
            )
          : new Date();
    const timelineEnd = sprint
        ? new Date(sprint.end_date)
        : timelineItems.length > 0
          ? new Date(
                Math.max(
                    ...timelineItems.map((item) => {
                        const anchor =
                            item.due_date ||
                            item.completed_at ||
                            item.planned_for ||
                            item.created_at;
                        return new Date(anchor).getTime();
                    }),
                ),
            )
          : new Date();
    const timelineSpanDays = Math.max(
        1,
        Math.ceil(
            (timelineEnd.getTime() - timelineStart.getTime()) /
                (1000 * 60 * 60 * 24),
        ) + 1,
    );

    // Create new column
    const [isCreatingColumn, setIsCreatingColumn] = useState(false);
    const [createColumnName, setCreateColumnName] = useState('');
    const createInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isCreatingColumn) {
            createInputRef.current?.focus();
        }
    }, [isCreatingColumn]);

    const handleCreateColumnSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!createColumnName.trim()) return;

        router.post(
            `/boards/${board.id}/columns`,
            {
                name: createColumnName.trim(),
                kind: 'grouping', // Default to basic grouping, user can change later
                status_mapping: null,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setCreateColumnName('');
                    setIsCreatingColumn(false);
                },
            },
        );
    };

    const handleUpdateColumn = (
        columnId: number,
        data: Partial<BoardColumn>,
    ) => {
        router.put(`/boards/${board.id}/columns/${columnId}`, {
            name: data.name,
            kind: data.kind,
            status_mapping: data.kind === 'status' ? data.status_mapping : null,
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleMoveColumn = (
        columnId: number,
        direction: 'left' | 'right',
    ) => {
        const sortedColumns = [...columnsData].sort(
            (a, b) => a.position - b.position,
        );
        const currentIndex = sortedColumns.findIndex((c) => c.id === columnId);
        if (currentIndex === -1) return;

        const targetIndex =
            direction === 'left' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= sortedColumns.length) return;

        // Swap positions in local state for immediate feedback
        const movingColumn = sortedColumns[currentIndex];
        sortedColumns.splice(currentIndex, 1);
        sortedColumns.splice(targetIndex, 0, movingColumn);

        // Optimistic update
        setColumnsData(sortedColumns);

        router.post(
            `/boards/${board.id}/columns/reorder`,
            {
                column_ids: sortedColumns.map((c) => c.id),
            },
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => setColumnsData(board.columns || []), // Revert on error
            },
        );
    };

    const handleDeleteColumn = () => {
        if (!pendingColumnDelete || !pendingDeleteFallback) return;
        router.delete(`/boards/${board.id}/columns/${pendingColumnDelete}`, {
            data: { fallback_column_id: parseInt(pendingDeleteFallback, 10) },
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setPendingColumnDelete(null);
                setPendingDeleteFallback('');
                setManageColumnsOpen(false);
            },
        });
    };

    const confirmDeleteColumn = (columnId: number) => {
        const column = getColumnById(columnId);
        if (!column) return;

        if (column.items.length > 0) {
                setPendingColumnDelete(columnId);
                handleManageColumnsOpenChange(true); // Re-use dialog for simple fallback selection
                return;
            }

        if (
            confirm(`Tem certeza que deseja excluir a coluna "${column.name}"?`)
        ) {
            router.delete(`/boards/${board.id}/columns/${columnId}`, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    const handleQuickPanelUpdate = (
        workItemId: number,
        payload: { assignee_id?: number | null; priority?: string },
    ) => {
        const nextAssignee =
            payload.assignee_id === null
                ? undefined
                : (users || []).find((user) => user.id === payload.assignee_id);

        setColumnsData((prev) =>
            prev.map((column) => ({
                ...column,
                items: column.items.map((item) =>
                    item.id === workItemId
                        ? {
                              ...item,
                              assignee_id:
                                  payload.assignee_id === null
                                      ? undefined
                                      : payload.assignee_id,
                              assignee: payload.assignee_id === null
                                  ? undefined
                                  : nextAssignee ?? item.assignee,
                              priority: payload.priority ?? item.priority,
                          }
                        : item,
                ),
            })),
        );
        setDetailPanelItem((prev) =>
            prev && prev.id === workItemId
                ? {
                      ...prev,
                      assignee_id:
                          payload.assignee_id === null
                              ? undefined
                              : payload.assignee_id,
                      assignee:
                          payload.assignee_id === null
                              ? undefined
                              : nextAssignee ?? prev.assignee,
                      priority: payload.priority ?? prev.priority,
                  }
                : prev,
        );

        setRecentlyUpdatedItemId(workItemId);
        window.setTimeout(() => setRecentlyUpdatedItemId(null), 1400);

        router.put(`/work-items/${workItemId}`, payload, {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                setBoardError('Não foi possível atualizar o item no painel.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={board?.name || 'Board'} />
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex h-full flex-1 flex-col gap-4 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_42%)] p-4 md:p-6">
                    <div className="sticky top-0 z-20 rounded-xl border border-border/50 bg-background/90 p-3 shadow-sm backdrop-blur">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                                        {board?.name || 'Board'}
                                    </h1>
                                    {sprint && (
                                        <Badge
                                            variant="outline"
                                            className="badge-status-in-progress"
                                        >
                                            {sprint.name}
                                        </Badge>
                                    )}
                                    <Badge variant="secondary">Modo board</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Arraste cartões entre listas para atualizar o fluxo
                                    {sprintRange ? ` • ${sprintRange}` : ''}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                            {/* <Button variant="outline" size="sm" onClick={() => setManageColumnsOpen(true)}>
                                <Settings className="w-4 h-4 mr-2" />
                                Colunas
                            </Button> */}
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    ref={searchInputRef}
                                    placeholder="Buscar por título ou ID..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-56 pl-9 md:w-64"
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filtrar
                                        {activeFilterCount > 0 && (
                                            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                >
                                    <DropdownMenuLabel>Tier</DropdownMenuLabel>
                                    <DropdownMenuGroup>
                                        {['N1', 'N2'].map((tier) => (
                                            <DropdownMenuCheckboxItem
                                                key={tier}
                                                checked={filters.tiers.includes(
                                                    tier,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleFilter('tiers', tier)
                                                }
                                            >
                                                {tier}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>
                                        Prioridade
                                    </DropdownMenuLabel>
                                    <DropdownMenuGroup>
                                        {['P0', 'P1', 'P2', 'P3'].map(
                                            (priority) => (
                                                <DropdownMenuCheckboxItem
                                                    key={priority}
                                                    checked={filters.priorities.includes(
                                                        priority,
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleFilter(
                                                            'priorities',
                                                            priority,
                                                        )
                                                    }
                                                >
                                                    {priority}
                                                </DropdownMenuCheckboxItem>
                                            ),
                                        )}
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>
                                        Responsavel
                                    </DropdownMenuLabel>
                                    <DropdownMenuGroup>
                                        <DropdownMenuCheckboxItem
                                            checked={filters.assignees.includes(
                                                'unassigned',
                                            )}
                                            onCheckedChange={() =>
                                                toggleFilter(
                                                    'assignees',
                                                    'unassigned',
                                                )
                                            }
                                        >
                                            Sem responsavel
                                        </DropdownMenuCheckboxItem>
                                        {(users || []).map((user) => (
                                            <DropdownMenuCheckboxItem
                                                key={user.id}
                                                checked={filters.assignees.includes(
                                                    user.id.toString(),
                                                )}
                                                onCheckedChange={() =>
                                                    toggleFilter(
                                                        'assignees',
                                                        user.id.toString(),
                                                    )
                                                }
                                            >
                                                {user.name}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={clearFilters}
                                        disabled={activeFilterCount === 0}
                                    >
                                        <X className="h-4 w-4" />
                                        Limpar filtros
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                size="sm"
                                onClick={() => setCreateDialogOpen(true)}
                                className="bg-primary text-primary-foreground"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Criar cartão
                            </Button>
                            <div className="ml-1 flex items-center gap-1 rounded-md border border-border/70 bg-muted/50 p-1">
                                <Button
                                    size="sm"
                                    variant={
                                        viewMode === 'board'
                                            ? 'secondary'
                                            : 'ghost'
                                    }
                                    className="h-7 px-2 text-xs"
                                    onClick={() => setViewMode('board')}
                                >
                                    Board
                                </Button>
                                <Button
                                    size="sm"
                                    variant={
                                        viewMode === 'timeline'
                                            ? 'secondary'
                                            : 'ghost'
                                    }
                                    className="h-7 px-2 text-xs"
                                    onClick={() => setViewMode('timeline')}
                                >
                                    Timeline
                                </Button>
                            </div>
                            </div>
                        </div>
                    </div>

                    {boardError && (
                        <Alert
                            variant="destructive"
                            className="flex items-start justify-between gap-3"
                        >
                            <div>
                                <AlertTitle>
                                    Não foi possível aplicar a ação
                                </AlertTitle>
                                <AlertDescription>
                                    {boardError}
                                </AlertDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setBoardError(null)}
                            >
                                Fechar
                            </Button>
                        </Alert>
                    )}

                    {!sprint && (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Nenhuma sprint ativa
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Crie uma sprint para liberar o quadro.
                                    </p>
                                </div>
                                <Button asChild>
                                    <Link href="/sprint-planning">
                                        Planejar sprint
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <Badge variant="secondary" className="px-2.5 py-1">
                            Itens: {totalItems}
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-blue-200"
                        >
                            Em andamento: {inProgressCount}
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-200"
                        >
                            Bloqueados: {blockedCount}
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-200"
                        >
                            Concluídos: {doneCount}
                        </Badge>
                        <span className="text-muted-foreground">
                            Atalhos: <kbd className="rounded bg-muted px-1.5 py-0.5">N</kbd>{' '}
                            novo • <kbd className="rounded bg-muted px-1.5 py-0.5">E</kbd>{' '}
                            editar • <kbd className="rounded bg-muted px-1.5 py-0.5">D</kbd>{' '}
                            concluir • <kbd className="rounded bg-muted px-1.5 py-0.5">O</kbd>{' '}
                            painel • <kbd className="rounded bg-muted px-1.5 py-0.5">/</kbd>{' '}
                            buscar • <kbd className="rounded bg-muted px-1.5 py-0.5">Shift</kbd>{' '}
                            seleção em faixa
                        </span>
                    </div>

                    {sprint && flowMetrics && (
                        <div className="grid gap-3 md:grid-cols-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-xs text-muted-foreground">
                                        Throughput (sprint)
                                    </div>
                                    <div className="text-2xl font-semibold">
                                        {flowMetrics.throughput}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-xs text-muted-foreground">
                                        Cycle time médio
                                    </div>
                                    <div className="text-2xl font-semibold">
                                        {flowMetrics.avg_cycle_time_hours ===
                                        null
                                            ? '—'
                                            : `${flowMetrics.avg_cycle_time_hours}h`}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-xs text-muted-foreground">
                                        Aging WIP (max)
                                    </div>
                                    <div className="text-2xl font-semibold text-blue-400">
                                        {flowMetrics.wip_aging.max_hours ===
                                        null
                                            ? '—'
                                            : `${flowMetrics.wip_aging.max_hours}h`}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-xs text-muted-foreground">
                                        Aging blocked (max)
                                    </div>
                                    <div className="text-2xl font-semibold text-amber-400">
                                        {flowMetrics.blocked_aging.max_hours ===
                                        null
                                            ? '—'
                                            : `${flowMetrics.blocked_aging.max_hours}h`}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {selectedItemIds.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs shadow-sm">
                            <span className="font-medium text-primary">
                                {selectedItemIds.length} selecionado(s)
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        Status em massa
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    {statusColumns.map((column) => (
                                        <DropdownMenuItem
                                            key={column.id}
                                            onClick={() =>
                                                applyStatusToSelected(
                                                    column.status_mapping!,
                                                )
                                            }
                                        >
                                            {column.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        Responsável
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem
                                        onClick={() =>
                                            applyAssigneeToSelected(
                                                'unassigned',
                                            )
                                        }
                                    >
                                        Sem responsavel
                                    </DropdownMenuItem>
                                    {(users || []).map((user) => (
                                        <DropdownMenuItem
                                            key={user.id}
                                            onClick={() =>
                                                applyAssigneeToSelected(
                                                    user.id.toString(),
                                                )
                                            }
                                        >
                                            {user.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const item = selectedItemId
                                        ? findItemById(selectedItemId)
                                        : null;
                                    if (!item) return;
                                    setDetailPanelItem(item);
                                    setDetailPanelOpen(true);
                                }}
                                disabled={!selectedItemId}
                            >
                                Painel lateral
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearSelection}
                            >
                                Limpar seleção
                            </Button>
                        </div>
                    )}

                    {/* Board Columns */}
                    {viewMode === 'board' ? (
                        <div className="grid min-h-0 flex-1 auto-cols-[300px] grid-flow-col items-start gap-4 overflow-x-auto pb-4">
                            {[...columnsData]
                                .sort((a, b) => a.position - b.position)
                                .map((column, index, arr) => (
                                    <DroppableColumn
                                        key={column.id}
                                        column={column}
                                        items={filteredItems(column.items || [])}
                                        wipLimit={
                                            column.status_mapping ===
                                            'in_progress'
                                                ? inProgressWipLimit
                                                : undefined
                                        }
                                        selectedItemIds={selectedItemIds}
                                        recentlyUpdatedItemId={
                                            recentlyUpdatedItemId
                                        }
                                        onSelectItem={handleSelectItem}
                                        onUpdateColumn={handleUpdateColumn}
                                        onDeleteColumn={confirmDeleteColumn}
                                        onMoveColumn={handleMoveColumn}
                                        onEditColumn={setEditingColumn}
                                        onAddCard={() =>
                                            setCreateDialogOpen(true)
                                        }
                                        isFirst={index === 0}
                                        isLast={index === arr.length - 1}
                                    />
                                ))}

                            <div className="w-[300px] min-w-[300px]">
                                {isCreatingColumn ? (
                                    <Card className="border-2 border-dashed bg-muted/30">
                                        <CardContent className="space-y-3 p-3">
                                            <Input
                                                ref={createInputRef}
                                                placeholder="Nome da coluna..."
                                                value={createColumnName}
                                                onChange={(e) =>
                                                    setCreateColumnName(
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter')
                                                        handleCreateColumnSubmit();
                                                    if (e.key === 'Escape')
                                                        setIsCreatingColumn(
                                                            false,
                                                        );
                                                }}
                                                className="h-8 text-sm"
                                            />
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={
                                                        handleCreateColumnSubmit
                                                    }
                                                    className="h-7 px-2 text-xs"
                                                >
                                                    Adicionar
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        setIsCreatingColumn(
                                                            false,
                                                        )
                                                    }
                                                    className="h-7 px-2"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full justify-start border-dashed text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        onClick={() => setIsCreatingColumn(true)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Adicionar outra lista
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Card className="min-h-0 flex-1">
                            <CardContent className="space-y-3 p-3">
                                <div className="text-xs text-muted-foreground">
                                    Escala:{' '}
                                    {format(timelineStart, 'dd/MM/yyyy')} -{' '}
                                    {format(timelineEnd, 'dd/MM/yyyy')}
                                </div>
                                <div className="max-h-[calc(100vh-320px)] overflow-auto">
                                    <div className="min-w-[900px] space-y-2">
                                        {timelineItems.map((item) => {
                                            const startDate = new Date(
                                                item.planned_for ||
                                                    item.started_at ||
                                                    item.created_at,
                                            );
                                            const endDate = new Date(
                                                item.due_date ||
                                                    item.completed_at ||
                                                    item.planned_for ||
                                                    item.created_at,
                                            );
                                            const startOffset = Math.max(
                                                0,
                                                Math.floor(
                                                    (startDate.getTime() -
                                                        timelineStart.getTime()) /
                                                        (1000 * 60 * 60 * 24),
                                                ),
                                            );
                                            const durationDays = Math.max(
                                                1,
                                                Math.ceil(
                                                    (endDate.getTime() -
                                                        startDate.getTime()) /
                                                        (1000 * 60 * 60 * 24),
                                                ) + 1,
                                            );
                                            const leftPct =
                                                (startOffset /
                                                    timelineSpanDays) *
                                                100;
                                            const widthPct =
                                                (durationDays /
                                                    timelineSpanDays) *
                                                100;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="grid grid-cols-[280px_minmax(0,1fr)] items-center gap-3"
                                                >
                                                    <button
                                                        type="button"
                                                        className="truncate rounded-md border border-border/70 bg-muted/30 px-2 py-1 text-left text-xs hover:bg-muted/50"
                                                        onClick={() =>
                                                            router.visit(
                                                                `/work-items/${item.id}`,
                                                            )
                                                        }
                                                    >
                                                        <span className="mr-2 text-muted-foreground">
                                                            #{item.id}
                                                        </span>
                                                        {item.title}
                                                    </button>
                                                    <div className="relative h-7 rounded-md bg-muted/20">
                                                        <div
                                                            className="absolute top-1.5 h-4 rounded bg-primary/70"
                                                            style={{
                                                                left: `${leftPct}%`,
                                                                width: `${Math.max(widthPct, 2)}%`,
                                                            }}
                                                            title={`${format(startDate, 'dd/MM')} - ${format(endDate, 'dd/MM')}`}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {timelineItems.length === 0 && (
                                            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                                                Nenhum item para exibir no
                                                timeline com os filtros atuais.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <DragOverlay>
                    {activeItem ? (
                        <div className="w-64 opacity-90">
                            <WorkItemCard item={activeItem} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Create Dialog */}
            <WorkItemFormDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                sprintId={sprint?.id}
                users={users}
                epics={epics}
            />
            <WorkItemFormDialog
                key={editItem?.id ?? 'edit'}
                open={editDialogOpen}
                onOpenChange={handleEditDialogChange}
                workItem={editItem}
                sprintId={sprint?.id}
                users={users}
                epics={epics}
            />
            <WorkItemDetailPanel
                key={detailPanelItem?.id ?? 'board-item-panel'}
                open={detailPanelOpen}
                onOpenChange={setDetailPanelOpen}
                workItem={detailPanelItem}
                users={users}
                allowStatusEdit={false}
                onQuickUpdate={handleQuickPanelUpdate}
            />

            <BlockedReasonDialog
                open={blockedDialogOpen}
                onOpenChange={handleBlockedDialogChange}
                itemCount={pendingBlockItemIds.length}
                onConfirm={(reason) => {
                    applyBlockedToItemIds(pendingBlockItemIds, reason);
                    setBlockedDialogOpen(false);
                    setPendingBlockItemIds([]);
                }}
            />

            <Dialog
                open={manageColumnsOpen}
                onOpenChange={handleManageColumnsOpenChange}
            >
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Gerenciar colunas</DialogTitle>
                        <DialogDescription>
                            Colunas podem representar status reais ou apenas
                            agrupamentos visuais.
                        </DialogDescription>
                    </DialogHeader>
                    {/* Simplified dialog or keeping the old one as fallback mainly for bulk reorder/delete */}
                    <div className="space-y-4">
                        <div className="space-y-3">
                            {/* Only show this if strictly needed, or maybe just for the fallback deletion logic? 
                                 For now, let's keep it but ideally we should decouple deletion fallback.
                                 Since the user wants "Trello-like", the main interaction is on the board.
                                 We'll leave this intact for "Advanced" management if accessed via fallback.
                             */}
                            <p className="text-sm text-muted-foreground">
                                Use as opçoes na propria coluna para renomear ou
                                reordenar.
                            </p>
                        </div>

                        {pendingColumnDelete && (
                            <div className="space-y-2 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                                <div className="text-sm font-medium text-rose-400">
                                    Remover coluna
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Selecione para onde mover os itens dessa
                                    coluna antes de remover.
                                </p>
                                <div className="flex items-center gap-3">
                                    <Select
                                        value={pendingDeleteFallback}
                                        onValueChange={setPendingDeleteFallback}
                                    >
                                        <SelectTrigger className="w-64">
                                            <SelectValue placeholder="Selecione a coluna destino" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {columnsDraft
                                                .filter(
                                                    (column) =>
                                                        column.id !==
                                                        pendingColumnDelete,
                                                )
                                                .map((column) => (
                                                    <SelectItem
                                                        key={column.id}
                                                        value={String(
                                                            column.id,
                                                        )}
                                                    >
                                                        {column.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleDeleteColumn}
                                    >
                                        Confirmar remocao
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setPendingColumnDelete(null);
                                            setPendingDeleteFallback('');
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setManageColumnsOpen(false)}
                        >
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ColumnSettingsDialog
                open={!!editingColumn}
                onOpenChange={(open) => !open && setEditingColumn(null)}
                column={editingColumn}
                onSave={handleUpdateColumn}
            />
        </AppLayout>
    );
}
