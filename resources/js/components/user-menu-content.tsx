import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { OrganizationSummary, User } from '@/types';

type Props = {
    user: User;
    organizations: OrganizationSummary[];
    currentOrganizationId?: number | null;
};

export function UserMenuContent({
    user,
    organizations,
    currentOrganizationId,
}: Props) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {organizations.length > 0 && (
                <>
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Organizacoes</DropdownMenuLabel>
                        {organizations.map((organization) => (
                            <DropdownMenuItem
                                key={organization.id}
                                onClick={() => {
                                    if (
                                        organization.id ===
                                        currentOrganizationId
                                    )
                                        return;
                                    cleanup();
                                    router.post('/organizations/switch', {
                                        organization_id: organization.id,
                                    });
                                }}
                            >
                                <span className="flex-1 truncate">
                                    {organization.name}
                                </span>
                                {organization.id === currentOrganizationId && (
                                    <span className="text-xs text-muted-foreground">
                                        Atual
                                    </span>
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                </>
            )}
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2" />
                        Configurações
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    Sair
                </Link>
            </DropdownMenuItem>
        </>
    );
}
