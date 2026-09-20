import { Link, router, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Check,
    ChevronsUpDown,
    Columns3,
    Cog,
    FileText,
    ListFilter,
    Layers,
    LayoutGrid,
    Menu,
    Plus,
    Plug,
    Ticket,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const mainNavItems: NavItem[] = [
    { title: 'Painel', href: dashboard(), icon: LayoutGrid },
    { title: 'Visao Macro', href: '/visao-macro', icon: ListFilter },
    { title: 'Quadro', href: '/sprint-board', icon: Columns3 },
    { title: 'Planejamento', href: '/sprint-planning', icon: CalendarDays },
    { title: 'Calendario', href: '/sprint-calendar', icon: CalendarDays },
    { title: 'Itens', href: '/work-items', icon: FileText },
    { title: 'Epicos', href: '/epics', icon: Layers },
    { title: 'Chamados', href: '/tickets', icon: Ticket },
];

const moreNavItems: NavItem[] = [
    { title: 'Integracoes', href: '/settings/integrations', icon: Plug },
    { title: 'Configuracoes', href: '/settings/profile', icon: Cog },
];

const activeItemStyles =
    'bg-accent text-accent-foreground dark:bg-neutral-800 dark:text-neutral-100';

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const organizations = auth.organizations || [];
    const currentOrg = auth.currentOrganization;
    const projects = auth.projects || [];
    const currentProject = auth.currentProject;
    const getInitials = useInitials();
    const { whenCurrentUrl } = useCurrentUrl();

    const handleSwitchOrg = (orgId: number) => {
        if (orgId === currentOrg?.id) return;
        router.post('/organizations/switch', { organization_id: orgId });
    };

    const handleSwitchProject = (projectId: number) => {
        if (projectId === currentProject?.id) return;
        router.post('/projects/switch', { project_id: projectId });
    };

    return (
        <>
            <header className="border-b border-border/70 bg-background/95 backdrop-blur">
                <div className="flex h-14 w-full items-center gap-2 px-3 md:px-4">
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                    <Menu className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-72 flex-col bg-background"
                            >
                                <SheetTitle className="sr-only">
                                    Menu de navegacao
                                </SheetTitle>
                                <SheetHeader className="border-b pb-3 text-left">
                                    <AppLogo />
                                </SheetHeader>
                                <div className="flex flex-1 flex-col gap-1 py-3">
                                    {mainNavItems.map((item) => (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-2 rounded-md px-2 py-2 text-sm',
                                                whenCurrentUrl(
                                                    item.href,
                                                    'bg-accent text-accent-foreground',
                                                ),
                                            )}
                                        >
                                            {item.icon && (
                                                <item.icon className="h-4 w-4" />
                                            )}
                                            <span>{item.title}</span>
                                        </Link>
                                    ))}
                                    <div className="mt-2 border-t pt-2">
                                        {moreNavItems.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                className={cn(
                                                    'flex items-center gap-2 rounded-md px-2 py-2 text-sm',
                                                    whenCurrentUrl(
                                                        item.href,
                                                        'bg-accent text-accent-foreground',
                                                    ),
                                                )}
                                            >
                                                {item.icon && (
                                                    <item.icon className="h-4 w-4" />
                                                )}
                                                <span>{item.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href={dashboard()} prefetch className="flex items-center">
                        <AppLogo />
                    </Link>

                    <div className="ml-2 hidden lg:flex">
                        <NavigationMenu>
                            <NavigationMenuList className="gap-1">
                                {mainNavItems.map((item) => (
                                    <NavigationMenuItem key={item.title}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                whenCurrentUrl(
                                                    item.href,
                                                    activeItemStyles,
                                                ),
                                                'h-8 px-2.5 text-xs',
                                            )}
                                        >
                                            {item.icon && (
                                                <item.icon className="mr-1.5 h-3.5 w-3.5" />
                                            )}
                                            {item.title}
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                                <NavigationMenuItem>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    'h-8 px-2.5 text-xs',
                                                )}
                                            >
                                                Mais
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-56">
                                            {moreNavItems.map((item) => (
                                                <DropdownMenuItem key={item.title} asChild>
                                                    <Link href={item.href} className="flex items-center gap-2">
                                                        {item.icon && (
                                                            <item.icon className="h-4 w-4 opacity-80" />
                                                        )}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center gap-1.5">
                        {currentOrg && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="hidden h-8 gap-2 px-2.5 text-xs md:inline-flex"
                                    >
                                        <span className="max-w-36 truncate">
                                            {currentOrg.name}
                                        </span>
                                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-70" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64">
                                    {organizations.map((org) => (
                                        <DropdownMenuItem
                                            key={org.id}
                                            onClick={() => handleSwitchOrg(org.id)}
                                        >
                                            <span className="flex-1">{org.name}</span>
                                            {org.id === currentOrg.id && (
                                                <Check className="h-4 w-4" />
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings/organization/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Nova Organizacao
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        {currentProject && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="hidden h-8 gap-2 px-2.5 text-xs xl:inline-flex"
                                    >
                                        <span className="max-w-32 truncate">
                                            {currentProject.name}
                                        </span>
                                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-70" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64">
                                    {projects.map((project) => (
                                        <DropdownMenuItem
                                            key={project.id}
                                            onClick={() =>
                                                handleSwitchProject(project.id)
                                            }
                                        >
                                            <span className="flex-1">
                                                {project.name}
                                            </span>
                                            {project.id === currentProject.id && (
                                                <Check className="h-4 w-4" />
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="size-9 rounded-full p-1">
                                    <Avatar className="size-7 overflow-hidden rounded-full">
                                        <AvatarImage
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                        />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent
                                    user={auth.user}
                                    organizations={organizations}
                                    currentOrganizationId={currentOrg?.id}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-border/60">
                    <div className="flex h-10 w-full items-center px-3 text-xs text-muted-foreground md:px-4">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
