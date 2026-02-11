import * as React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'main'> & {
    variant?: 'header' | 'sidebar';
};

export function AppContent({ variant = 'header', children, ...props }: Props) {
    if (variant === 'sidebar') {
        return <SidebarInset {...props}>{children}</SidebarInset>;
    }

    const { className, ...rest } = props;

    return (
        <main
            className={cn(
                'flex h-full w-full flex-1 flex-col gap-3 px-3 pb-3 md:px-4 md:pb-4',
                className,
            )}
            {...rest}
        >
            {children}
        </main>
    );
}
