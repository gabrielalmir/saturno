import { Moon } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary',
                className,
            )}
            {...props}
        >
            <Moon className="h-4 w-4 text-accent" />
            <span>Aparência fixa: Dark Mode</span>
        </div>
    );
}
