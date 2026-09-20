import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Organizacao', href: '/settings/organization' },
];

type OrganizationProps = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    logo_path?: string | null;
    planning_unit?: 'hours' | 'story_points' | null;
};

type MemberProps = {
    id: number;
    name: string;
    email: string;
    role: string;
};

interface OrganizationSettingsProps {
    organization: OrganizationProps;
    members: MemberProps[];
    roles: string[];
    currentUserRole: string | null;
}

export default function OrganizationSettings({
    organization,
    members,
    roles,
    currentUserRole,
}: OrganizationSettingsProps) {
    const [inviteRole, setInviteRole] = useState('user');
    const { data, setData, put, processing, errors } = useForm({
        name: organization.name,
        description: organization.description || '',
        logo: null as File | null,
        planning_unit: organization.planning_unit || 'story_points',
    });

    const [inviteEmail, setInviteEmail] = useState('');
    const { auth } = usePage<SharedData>().props;
    const isAdmin = currentUserRole === 'admin';
    const canManagePlanningUnit =
        currentUserRole === 'admin' || currentUserRole === 'maintainer';
    const canManageRoles =
        currentUserRole === 'admin' || currentUserRole === 'maintainer';
    const organizations = auth.organizations || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Organizacao" />
            <SettingsLayout>
                <div className="space-y-8">
                    <Heading
                        variant="small"
                        title="Organizacao"
                        description="Gerencie dados da empresa e membros da equipe."
                    />

                    {organizations.length > 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Organizacoes acessiveis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {organizations.map((org) => (
                                    <div
                                        key={org.id}
                                        className="flex items-center justify-between rounded-md border px-3 py-2"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {org.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {org.slug}
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={
                                                org.id === organization.id
                                            }
                                            onClick={() =>
                                                router.post(
                                                    '/organizations/switch',
                                                    { organization_id: org.id },
                                                )
                                            }
                                        >
                                            {org.id === organization.id
                                                ? 'Atual'
                                                : 'Trocar'}
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Identidade
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                className="space-y-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    put('/settings/organization', {
                                        forceFormData: true,
                                    });
                                }}
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="name">
                                        Nome da empresa
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(event) =>
                                            setData('name', event.target.value)
                                        }
                                        disabled={!isAdmin}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">
                                        Descricao
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(event) =>
                                            setData(
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                        disabled={!isAdmin}
                                        rows={3}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="logo">
                                        Logo (opcional)
                                    </Label>
                                    <Input
                                        id="logo"
                                        name="logo"
                                        type="file"
                                        accept="image/*"
                                        disabled={!isAdmin}
                                        onChange={(event) => {
                                            const file =
                                                event.target.files?.[0] || null;
                                            setData('logo', file);
                                        }}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="planning_unit">
                                        Unidade do gestor
                                    </Label>
                                    <Select
                                        value={data.planning_unit}
                                        onValueChange={(value) =>
                                            setData(
                                                'planning_unit',
                                                value as
                                                    | 'hours'
                                                    | 'story_points',
                                            )
                                        }
                                        disabled={!canManagePlanningUnit}
                                    >
                                        <SelectTrigger id="planning_unit">
                                            <SelectValue placeholder="Selecione a unidade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hours">
                                                Horas
                                            </SelectItem>
                                            <SelectItem value="story_points">
                                                Story points
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        Define a unidade exibida nas métricas de
                                        capacidade e compromisso.
                                    </p>
                                </div>
                                {(isAdmin || canManagePlanningUnit) && (
                                    <Button type="submit" disabled={processing}>
                                        Salvar organizacao
                                    </Button>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Membros</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {isAdmin && (
                                <form
                                    className="grid gap-3 md:grid-cols-[2fr_1fr_auto]"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        router.post(
                                            '/settings/organization/members',
                                            {
                                                email: inviteEmail,
                                                role: inviteRole,
                                            },
                                            {
                                                onSuccess: () =>
                                                    setInviteEmail(''),
                                            },
                                        );
                                    }}
                                >
                                    <Input
                                        placeholder="Email do membro"
                                        value={inviteEmail}
                                        onChange={(event) =>
                                            setInviteEmail(event.target.value)
                                        }
                                    />
                                    <Select
                                        value={inviteRole}
                                        onValueChange={setInviteRole}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Grupo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem
                                                    key={role}
                                                    value={role}
                                                >
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        type="submit"
                                        disabled={!inviteEmail.trim()}
                                    >
                                        Convidar
                                    </Button>
                                </form>
                            )}

                            <div className="space-y-3">
                                {members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {member.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {member.email}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Select
                                                value={member.role}
                                                onValueChange={(value) => {
                                                    if (!canManageRoles) return;
                                                    router.put(
                                                        `/settings/organization/members/${member.id}`,
                                                        { role: value },
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }}
                                                disabled={!canManageRoles}
                                            >
                                                <SelectTrigger className="w-40">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem
                                                            key={role}
                                                            value={role}
                                                        >
                                                            {role}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {isAdmin && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        router.delete(
                                                            `/settings/organization/members/${member.id}`,
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    Remover
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    {isAdmin && (
                        <Card className="border-destructive">
                            <CardHeader>
                                <CardTitle className="text-base text-destructive">
                                    Zona de Perigo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Ao deletar esta organizacao, todos os dados
                                    serao permanentemente removidos, incluindo
                                    sprints, itens de trabalho, épicos e
                                    chamados. Esta acao nao pode ser desfeita.
                                </p>
                                {organizations.length <= 1 ? (
                                    <p className="text-sm text-muted-foreground italic">
                                        Voce precisa ter pelo menos uma outra
                                        organizacao antes de deletar esta.
                                    </p>
                                ) : (
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    `Tem certeza que deseja deletar "${organization.name}"? Esta acao nao pode ser desfeita.`,
                                                )
                                            ) {
                                                router.delete(
                                                    '/settings/organization',
                                                );
                                            }
                                        }}
                                    >
                                        Deletar Organizacao
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
