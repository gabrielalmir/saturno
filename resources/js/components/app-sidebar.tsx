import { Link, router, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Cog,
    Columns3,
    LayoutGrid,
    Layers,
    FileText,
    Ticket,
    ChevronsUpDown,
    Check,
    Plus,
    KeyRound,
    Plug,
    Shield,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem, NavSection, SharedData } from '@/types';

const navSections: NavSection[] = [
    {
        title: 'Visibilidade',
        items: [
            {
                title: 'Painel',
                href: dashboard(),
                icon: LayoutGrid,
            },
            {
                title: 'Visao Macro',
                href: '/visao-macro',
                icon: LayoutGrid,
            },
        ],
    },
    {
        title: 'Planejamento',
        items: [
            {
                title: 'Planejamento da Sprint',
                href: '/sprint-planning',
                icon: CalendarDays,
            },
            {
                title: 'Calendario de Sprints',
                href: '/sprint-calendar',
                icon: CalendarDays,
            },
            {
                title: 'Épicos',
                href: '/epics',
                icon: Layers,
            },
        ],
    },
    {
        title: 'Execucao',
        items: [
            {
                title: 'Quadro da Sprint',
                href: '/sprint-board',
                icon: Columns3,
            },
            {
                title: 'Item de Trabalho',
                href: '/work-items',
                icon: FileText,
            },
            {
                title: 'Chamados',
                href: '/tickets',
                icon: Ticket,
            },
        ],
    },
    {
        title: 'Configuracoes',
        items: [
            {
                title: 'Organizacao',
                href: '/settings/organization',
                icon: Cog,
            },
            {
                title: 'Senha',
                href: '/settings/password',
                icon: KeyRound,
            },
            {
                title: '2FA',
                href: '/settings/two-factor',
                icon: Shield,
            },
            {
                title: 'Capacidade',
                href: '/settings/capacity',
                icon: Layers,
            },
            {
                title: 'Integracoes',
                href: '/settings/integrations',
                icon: Plug,
            },
            {
                title: 'Perfil',
                href: '/settings/profile',
                icon: Shield,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const organizations = auth.organizations || [];
    const currentOrg = auth.currentOrganization;

    const handleSwitchOrg = (orgId: number) => {
        if (orgId === currentOrg?.id) return;
        router.post('/organizations/switch', { organization_id: orgId });
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        {currentOrg?.name
                                            ?.charAt(0)
                                            .toUpperCase() || 'S'}
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            {currentOrg?.name || 'Saturno'}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {currentOrg?.slug || 'Selecione'}
                                        </span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                align="start"
                                side="bottom"
                                sideOffset={4}
                            >
                                {organizations.map((org) => (
                                    <DropdownMenuItem
                                        key={org.id}
                                        onClick={() => handleSwitchOrg(org.id)}
                                        className="gap-2 p-2"
                                    >
                                        <div className="flex size-6 items-center justify-center rounded-sm border">
                                            {org.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="flex-1">
                                            {org.name}
                                        </span>
                                        {org.id === currentOrg?.id && (
                                            <Check className="size-4" />
                                        )}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/settings/organization/create"
                                        className="gap-2 p-2"
                                    >
                                        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                            <Plus className="size-4" />
                                        </div>
                                        <span className="font-medium text-muted-foreground">
                                            Nova Organizacao
                                        </span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain sections={navSections} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
