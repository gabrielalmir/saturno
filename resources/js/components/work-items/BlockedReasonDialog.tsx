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
import { Textarea } from '@/components/ui/textarea';

export function BlockedReasonDialog({
    open,
    onOpenChange,
    onConfirm,
    itemCount,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (reason: string) => void;
    itemCount: number;
}) {
    const [reason, setReason] = useState('');

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setReason('');
        }
        onOpenChange(nextOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Motivo do bloqueio</DialogTitle>
                    <DialogDescription>
                        Informe o impedimento para {itemCount} item(ns). Isso
                        ajuda na daily e na retrospectiva.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Ex: aguardando acesso, dependência de API, revisão de segurança…"
                        className="min-h-[120px]"
                    />
                    <div className="text-xs text-muted-foreground">
                        Dica: inclua “o que falta”, “quem pode destravar” e
                        “quando reavaliar”.
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => onConfirm(reason.trim())}
                        disabled={!reason.trim()}
                    >
                        Bloquear
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
