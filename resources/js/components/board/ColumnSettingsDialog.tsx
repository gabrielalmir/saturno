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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { BoardColumn } from '@/types/models';

interface ColumnSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    column: BoardColumn | null;
    onSave: (columnId: number, data: Partial<BoardColumn>) => void;
}

export function ColumnSettingsDialog({
    open,
    onOpenChange,
    column,
    onSave,
}: ColumnSettingsDialogProps) {
    const [name, setName] = useState('');
    const [kind, setKind] = useState<BoardColumn['kind']>('grouping');
    const [statusMapping, setStatusMapping] = useState<string>('backlog');

    const handleOpenChange = (nextOpen: boolean) => {
        // Initialize the draft when the dialog opens, instead of syncing via an effect.
        if (nextOpen && column) {
            setName(column.name);
            setKind(column.kind);
            setStatusMapping(column.status_mapping || 'backlog');
        }
        onOpenChange(nextOpen);
    };

    const handleSave = () => {
        if (!column) return;

        onSave(column.id, {
            name,
            kind,
            status_mapping: kind === 'status' ? statusMapping : null,
        });
        onOpenChange(false);
    };

    if (!column) return null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Coluna</DialogTitle>
                    <DialogDescription>
                        Configure as propriedades da coluna "{column.name}".
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="kind">Tipo</Label>
                        <Select
                            value={kind}
                            onValueChange={(value) =>
                                setKind(value as BoardColumn['kind'])
                            }
                        >
                            <SelectTrigger id="kind">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="status">Status</SelectItem>
                                <SelectItem value="grouping">
                                    Agrupamento
                                </SelectItem>
                                <SelectItem value="category">
                                    Categoria
                                </SelectItem>
                                <SelectItem value="priority">
                                    Prioridade
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {kind === 'status' && (
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status Real</Label>
                            <Select
                                value={statusMapping}
                                onValueChange={setStatusMapping}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="backlog">
                                        Backlog
                                    </SelectItem>
                                    <SelectItem value="ready">
                                        Pronto
                                    </SelectItem>
                                    <SelectItem value="in_progress">
                                        Em progresso
                                    </SelectItem>
                                    <SelectItem value="blocked">
                                        Bloqueado
                                    </SelectItem>
                                    <SelectItem value="done">
                                        Concluido
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}>Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
