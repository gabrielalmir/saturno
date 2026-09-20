import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type CommandItem = {
    id: string;
    title: string;
    subtitle?: string;
    href: string;
    keywords?: string[];
};

const COMMANDS: CommandItem[] = [
    {
        id: 'dashboard',
        title: 'Abrir Painel',
        subtitle: 'Visão geral da sprint e métricas',
        href: '/dashboard',
        keywords: ['home', 'painel', 'dashboard', 'metrica'],
    },
    {
        id: 'sprint-board',
        title: 'Abrir Quadro da Sprint',
        subtitle: 'Execução diária por colunas',
        href: '/sprint-board',
        keywords: ['board', 'kanban', 'quadro', 'execucao'],
    },
    {
        id: 'work-items',
        title: 'Abrir Itens de Trabalho',
        subtitle: 'Lista geral de itens',
        href: '/work-items',
        keywords: ['backlog', 'itens', 'work items'],
    },
    {
        id: 'sprint-planning',
        title: 'Abrir Planejamento da Sprint',
        subtitle: 'Escopo, capacidade e início da sprint',
        href: '/sprint-planning',
        keywords: ['planning', 'planejamento', 'capacidade'],
    },
    {
        id: 'epics',
        title: 'Abrir Épicos',
        subtitle: 'Gestão de escopo em nível macro',
        href: '/epics',
        keywords: ['epicos', 'escopo'],
    },
    {
        id: 'tickets',
        title: 'Abrir Chamados',
        subtitle: 'Tickets vinculados e contexto externo',
        href: '/tickets',
        keywords: ['ticket', 'chamado'],
    },
    {
        id: 'integrations',
        title: 'Abrir Integrações',
        subtitle: 'Conectores Jira, Trello e afins',
        href: '/settings/integrations',
        keywords: ['integracoes', 'jira', 'trello', 'todoist'],
    },
    {
        id: 'capacity',
        title: 'Abrir Configurações de Capacidade',
        subtitle: 'Calendário, disponibilidade e reservas',
        href: '/settings/capacity',
        keywords: ['capacidade', 'feriado', 'disponibilidade'],
    },
];

const isTypingElement = (target: EventTarget | null): boolean => {
    const node = target as HTMLElement | null;
    if (!node) return false;

    return (
        node.tagName === 'INPUT' ||
        node.tagName === 'TEXTAREA' ||
        node.tagName === 'SELECT' ||
        node.isContentEditable
    );
};

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const filtered = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        if (!normalized) return COMMANDS;

        return COMMANDS.filter((command) => {
            const haystack = [
                command.title,
                command.subtitle,
                ...(command.keywords ?? []),
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return haystack.includes(normalized);
        });
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key.toLowerCase() === 'k' &&
                (event.metaKey || event.ctrlKey)
            ) {
                event.preventDefault();
                setOpen((prev) => {
                    const next = !prev;
                    if (next) {
                        setQuery('');
                        setActiveIndex(0);
                    }
                    return next;
                });
                return;
            }

            if (!open || isTypingElement(event.target)) return;

            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open]);

    const execute = (command: CommandItem | null) => {
        if (!command) return;

        setOpen(false);
        setQuery('');
        router.visit(command.href, {
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-xl p-0">
                <DialogHeader className="border-b px-4 py-3">
                    <DialogTitle className="text-sm font-medium">
                        Ir para
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Use ↑ ↓ para navegar e Enter para abrir.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 p-3">
                    <div className="relative">
                        <Search className="text-text-tertiary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            autoFocus
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setActiveIndex(0);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'ArrowDown') {
                                    event.preventDefault();
                                    setActiveIndex((prev) =>
                                        Math.min(prev + 1, filtered.length - 1),
                                    );
                                }

                                if (event.key === 'ArrowUp') {
                                    event.preventDefault();
                                    setActiveIndex((prev) => Math.max(prev - 1, 0));
                                }

                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    execute(filtered[activeIndex] ?? null);
                                }
                            }}
                            placeholder="Buscar tela, área ou ação..."
                            className="pl-9"
                        />
                    </div>

                    <div className="max-h-80 overflow-y-auto rounded-md border border-border-subtle">
                        {filtered.length === 0 ? (
                            <div className="text-text-secondary px-3 py-6 text-center text-sm">
                                Nenhum resultado para "{query}".
                            </div>
                        ) : (
                            filtered.map((command, index) => (
                                <button
                                    type="button"
                                    key={command.id}
                                    className={cn(
                                        'w-full border-b border-border-subtle px-3 py-2.5 text-left transition-colors last:border-b-0',
                                        index === activeIndex
                                            ? 'bg-accent/40 text-text-primary'
                                            : 'hover:bg-muted/40 text-text-secondary',
                                    )}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onClick={() => execute(command)}
                                >
                                    <div className="text-sm font-medium">
                                        {command.title}
                                    </div>
                                    {command.subtitle && (
                                        <div className="text-text-tertiary mt-0.5 text-xs">
                                            {command.subtitle}
                                        </div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
