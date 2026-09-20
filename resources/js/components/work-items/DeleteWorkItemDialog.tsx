import { useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { WorkItem } from '@/types/models';

interface DeleteWorkItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workItem: WorkItem;
}

export function DeleteWorkItemDialog({
    open,
    onOpenChange,
    workItem,
}: DeleteWorkItemDialogProps) {
    const { delete: destroy, processing } = useForm({
        redirect_to: '/work-items',
    });
    const [error, setError] = useState<string | null>(null);
    const cannotDelete = workItem.status === 'done';

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setError(null);
        }
        onOpenChange(nextOpen);
    };

    const handleDelete = () => {
        setError(null);
        destroy(`/work-items/${workItem.id}`, {
            onSuccess: () => {
                onOpenChange(false);
            },
            onError: (errors: Record<string, string | string[]>) => {
                const deleteError = errors.delete;
                const msg = Array.isArray(deleteError)
                    ? deleteError[0]
                    : deleteError || 'Não foi possível excluir o item.';
                setError(msg);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <DialogTitle>Excluir Work Item?</DialogTitle>
                    </div>
                    <DialogDescription className="text-left">
                        Tem certeza que deseja excluir{' '}
                        <strong>"{workItem.title}"</strong>? Esta ação não pode
                        ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                {cannotDelete && (
                    <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-muted-foreground">
                        Este item está <strong>Concluído</strong> e não pode ser
                        excluído.
                    </div>
                )}

                {error && (
                    <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing || cannotDelete}
                    >
                        {processing ? 'Excluindo...' : 'Excluir'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
