import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Configuracoes', href: '/settings/profile' },
    { title: 'Criar Organizacao', href: '/settings/organization/create' },
];

export default function CreateOrganization() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        logo: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/organization', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Criar Organizacao" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="mx-auto w-full max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Criar Nova Organizacao</CardTitle>
                            <CardDescription>
                                Crie uma organizacao para gerenciar seus
                                projetos e equipe.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">
                                        Nome da Empresa
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Minha Empresa"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="slug">Slug (URL)</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData('slug', e.target.value)
                                        }
                                        placeholder="minha-empresa"
                                    />
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Deixe em branco para gerar
                                        automaticamente.
                                    </p>
                                    {errors.slug && (
                                        <p className="text-sm text-destructive">
                                            {errors.slug}
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
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Descricao curta sobre a organizacao..."
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="logo">Logo</Label>
                                    <Input
                                        id="logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file =
                                                e.target.files?.[0] || null;
                                            setData('logo', file);
                                        }}
                                    />
                                    {errors.logo && (
                                        <p className="text-sm text-destructive">
                                            {errors.logo}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button type="submit" disabled={processing}>
                                        Criar Organizacao
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
