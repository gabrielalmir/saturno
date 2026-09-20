import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Props = {
    status: string;
    className?: string;
};

const statusLabel: Record<string, string> = {
    backlog: 'Backlog',
    triage: 'Triage',
    ready: 'Pronto',
    in_progress: 'Em progresso',
    blocked: 'Bloqueado',
    done: 'Concluído',
};

const statusClass: Record<string, string> = {
    backlog: 'badge-status-backlog',
    triage: 'badge-status-triage',
    ready: 'badge-status-ready',
    in_progress: 'badge-status-in-progress',
    blocked: 'badge-status-blocked',
    done: 'badge-status-done',
};

export function StatusBadge({ status, className }: Props) {
    return (
        <Badge
            variant="outline"
            className={cn(statusClass[status] ?? 'badge-status-backlog', className)}
        >
            {statusLabel[status] ?? status}
        </Badge>
    );
}
