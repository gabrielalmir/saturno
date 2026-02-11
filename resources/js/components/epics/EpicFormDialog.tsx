import { useForm } from '@inertiajs/react';
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
import { Textarea } from '@/components/ui/textarea';

interface Epic {
    id: number;
    title: string;
    description?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface EpicFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    epic?: Epic | null;
}

export function EpicFormDialog({
    open,
    onOpenChange,
    epic,
}: EpicFormDialogProps) {
    const isEditing = !!epic;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: epic?.title || '',
        description: epic?.description || '',
        status: epic?.status || 'planning',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/epics/${epic.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post('/epics', {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar Épico' : 'Novo Épico'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Atualize as informações do épico.'
                            : 'Preencha os dados para criar um novo épico.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="epic-title">Título *</Label>
                            <Input
                                id="epic-title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Ex: Migração para Microserviços"
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
                            <Label htmlFor="epic-description">Descrição</Label>
                            <Textarea
                                id="epic-description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Descreva o objetivo e escopo do épico..."
                                rows={6}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
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
