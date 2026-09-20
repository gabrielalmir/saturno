import { cn } from '@/lib/utils';
import type { User } from '@/types/models';

type Props = {
    user?: User | null;
    className?: string;
};

function getInitials(name?: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
}

export function AssigneeChip({ user, className }: Props) {
    return (
        <div className={cn('flex items-center gap-2 text-xs', className)}>
            <div
                className="flex h-6 w-6 items-center justify-center rounded-full border border-border-subtle bg-surface text-[10px] font-semibold"
                title={user?.name ?? 'Sem responsável'}
            >
                {getInitials(user?.name)}
            </div>
            <span className="text-text-secondary truncate">{user?.name ?? 'Sem responsável'}</span>
        </div>
    );
}
