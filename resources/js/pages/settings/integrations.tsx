import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
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
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Configurações', href: '/settings/profile' },
    { title: 'Integrações', href: '/settings/integrations' },
];

type Provider = 'jira' | 'trello' | 'todoist';
type Direction = 'pull' | 'push' | 'two_way';
type Frequency = 'manual' | 'interval' | 'webhook';
type ConflictPolicy =
    | 'last_write_wins'
    | 'prefer_local'
    | 'prefer_remote'
    | 'manual_review';

type Integration = {
    id: number;
    provider: Provider;
    enabled: boolean;
    direction: Direction;
    frequency: Frequency;
    conflict_policy: ConflictPolicy;
    status: string;
    last_error?: string | null;
};

type IntegrationLog = {
    id: string | number;
    created_at: string;
    provider: Provider;
    direction: Direction;
    status: string;
    error?: string | null;
};

type PageProps = {
    integrations: Integration[];
    logs: IntegrationLog[];
};

const providerLabel: Record<string, string> = {
    jira: 'Jira',
    trello: 'Trello',
    todoist: 'Todoist',
};

export default function IntegrationsPage({ integrations, logs }: PageProps) {
    usePage<PageProps>();
    const [provider, setProvider] = useState<Provider>('jira');
    const [token, setToken] = useState('');
    const [baseUrl, setBaseUrl] = useState('');
    const [key, setKey] = useState('');
    const [email, setEmail] = useState('');
    const [projectKey, setProjectKey] = useState('');
    const [boardId, setBoardId] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [direction, setDirection] = useState<Direction>('pull');
    const [frequency, setFrequency] = useState<Frequency>('manual');
    const [conflictPolicy, setConflictPolicy] =
        useState<ConflictPolicy>('last_write_wins');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editDirection, setEditDirection] =
        useState<Direction>('pull');
    const [editFrequency, setEditFrequency] =
        useState<Frequency>('manual');
    const [editConflictPolicy, setEditConflictPolicy] =
        useState<ConflictPolicy>('last_write_wins');
    const [editEnabled, setEditEnabled] = useState<boolean>(true);
    const [editToken, setEditToken] = useState('');
    const [editBaseUrl, setEditBaseUrl] = useState('');
    const [editKey, setEditKey] = useState('');
    const [editingProvider, setEditingProvider] =
        useState<Provider | null>(null);

    const submit = () => {
        const config: Record<string, string> = { token };
        if (provider === 'jira') {
            config.base_url = baseUrl;
            config.email = email;
            if (projectKey) config.project_key = projectKey;
        }
        if (provider === 'trello') {
            config.key = key;
            if (boardId) config.board_id = boardId;
        }
        router.post('/settings/integrations', {
            provider,
            enabled,
            direction,
            frequency,
            conflict_policy: conflictPolicy,
            config,
        });
    };

    const [testing, setTesting] = useState<number | null>(null);
    const [testResult, setTestResult] = useState<{
        ok: boolean;
        message: string;
    } | null>(null);

    const test = async (id: number) => {
        setTesting(id);
        setTestResult(null);
        try {
            // Get CSRF token from cookie (Laravel sets XSRF-TOKEN cookie)
            const getCookie = (name: string) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2)
                    return decodeURIComponent(
                        parts.pop()?.split(';').shift() || '',
                    );
                return '';
            };

            const response = await fetch(`/settings/integrations/${id}/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                },
                credentials: 'same-origin',
            });
            const result = await response.json();
            setTestResult(result);
        } catch {
            setTestResult({
                ok: false,
                message: 'Erro de rede ao testar conexão.',
            });
        } finally {
            setTesting(null);
        }
    };

    const syncNow = (id: number) => {
        router.post(`/settings/integrations/${id}/sync-now`);
    };

    const toggle = (id: number, nextEnabled: boolean) => {
        router.post(`/settings/integrations/${id}/toggle`, {
            enabled: nextEnabled,
        });
    };

    const startEdit = (integration: Integration) => {
        setEditingId(integration.id);
        setEditDirection(integration.direction);
        setEditFrequency(integration.frequency);
        setEditConflictPolicy(integration.conflict_policy);
        setEditEnabled(integration.enabled);
        setEditToken('');
        setEditBaseUrl('');
        setEditKey('');
        setEditingProvider(integration.provider);
    };

    const saveEdit = (integration: Integration) => {
        const payload: {
            direction: Direction;
            frequency: Frequency;
            conflict_policy: ConflictPolicy;
            enabled: boolean;
            config?: Record<string, string>;
        } = {
            direction: editDirection,
            frequency: editFrequency,
            conflict_policy: editConflictPolicy,
            enabled: editEnabled,
        };

        // Only send config if user reentered credentials (to avoid invalidating current token).
        const config: Record<string, string> = {};
        if (editToken.trim()) config.token = editToken.trim();
        if (editingProvider === 'jira' && editBaseUrl.trim())
            config.base_url = editBaseUrl.trim();
        if (editingProvider === 'trello' && editKey.trim())
            config.key = editKey.trim();

        if (Object.keys(config).length > 0) {
            payload.config = config;
        }

        router.put(`/settings/integrations/${integration.id}`, payload);
        setEditingId(null);
    };

    const remove = (integration: Integration) => {
        if (!confirm('Remover esta integração? Os vínculos serão apagados.'))
            return;
        router.delete(`/settings/integrations/${integration.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Integrações" />
            <SettingsLayout>
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Configurar integração
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3 md:grid-cols-2">
                                <div>
                                    <Label>Provedor</Label>
                                    <Select
                                        value={provider}
                                        onValueChange={(v) =>
                                            setProvider(v as Provider)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="jira">
                                                Jira
                                            </SelectItem>
                                            <SelectItem value="trello">
                                                Trello
                                            </SelectItem>
                                            <SelectItem value="todoist">
                                                Todoist
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Direção</Label>
                                    <Select
                                        value={direction}
                                        onValueChange={(v) =>
                                            setDirection(v as Direction)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pull">
                                                Pull only
                                            </SelectItem>
                                            <SelectItem value="push">
                                                Push only
                                            </SelectItem>
                                            <SelectItem value="two_way">
                                                Two-way
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Frequência</Label>
                                    <Select
                                        value={frequency}
                                        onValueChange={(v) =>
                                            setFrequency(v as Frequency)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="manual">
                                                Manual
                                            </SelectItem>
                                            <SelectItem value="interval">
                                                Intervalo
                                            </SelectItem>
                                            <SelectItem value="webhook">
                                                Webhook
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Política de conflito</Label>
                                    <Select
                                        value={conflictPolicy}
                                            onValueChange={(v) =>
                                                setConflictPolicy(
                                                    v as ConflictPolicy,
                                                )
                                            }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="last_write_wins">
                                                Última escrita
                                            </SelectItem>
                                            <SelectItem value="prefer_local">
                                                Preferir local
                                            </SelectItem>
                                            <SelectItem value="prefer_remote">
                                                Preferir remoto
                                            </SelectItem>
                                            <SelectItem value="manual_review">
                                                Revisão manual
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {provider === 'jira' && (
                                <div className="space-y-3">
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div>
                                            <Label>Base URL</Label>
                                            <Input
                                                value={baseUrl}
                                                onChange={(e) =>
                                                    setBaseUrl(e.target.value)
                                                }
                                                placeholder="https://suaempresa.atlassian.net"
                                            />
                                        </div>
                                        <div>
                                            <Label>Email</Label>
                                            <Input
                                                type="email"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                placeholder="seu@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div>
                                            <Label>Token (API)</Label>
                                            <Input
                                                type="password"
                                                value={token}
                                                onChange={(e) =>
                                                    setToken(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>
                                                Project Key (opcional)
                                            </Label>
                                            <Input
                                                value={projectKey}
                                                onChange={(e) =>
                                                    setProjectKey(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="PROJ"
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Deixe vazio para importar de
                                                todos os projetos
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {provider === 'trello' && (
                                <div className="space-y-3">
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div>
                                            <Label>API Key</Label>
                                            <Input
                                                value={key}
                                                onChange={(e) =>
                                                    setKey(e.target.value)
                                                }
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                <a
                                                    href="https://trello.com/power-ups/admin"
                                                    target="_blank"
                                                    rel="noopener"
                                                    className="underline"
                                                >
                                                    Obter API Key
                                                </a>
                                            </p>
                                        </div>
                                        <div>
                                            <Label>Token</Label>
                                            <Input
                                                type="password"
                                                value={token}
                                                onChange={(e) =>
                                                    setToken(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div>
                                            <Label>Board ID (opcional)</Label>
                                            <Input
                                                value={boardId}
                                                onChange={(e) =>
                                                    setBoardId(e.target.value)
                                                }
                                                placeholder="ID do board"
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Deixe vazio para usar o primeiro
                                                board
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {provider === 'todoist' && (
                                <div className="grid gap-3 md:grid-cols-1">
                                    <div>
                                        <Label>Token</Label>
                                        <Input
                                            type="password"
                                            value={token}
                                            onChange={(e) =>
                                                setToken(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Button onClick={submit}>Salvar</Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setEnabled((v) => !v)}
                                >
                                    {enabled ? 'Desabilitar' : 'Habilitar'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Integrações configuradas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {testResult && (
                                <div
                                    className={`rounded-lg p-3 text-sm ${testResult.ok ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}
                                >
                                    {testResult.message}
                                </div>
                            )}
                            {integrations.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Nenhuma integração configurada.
                                </p>
                            )}
                            {integrations.map((integration) => (
                                <>
                                    <div
                                        key={integration.id}
                                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {providerLabel[
                                                    integration.provider
                                                ] || integration.provider}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {integration.direction} •{' '}
                                                {integration.frequency} •{' '}
                                                {integration.enabled
                                                    ? 'Ativa'
                                                    : 'Inativa'}
                                            </div>
                                            {integration.last_error && (
                                                <div className="text-xs text-amber-500">
                                                    {integration.last_error}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    test(integration.id)
                                                }
                                                disabled={
                                                    testing === integration.id
                                                }
                                            >
                                                {testing === integration.id
                                                    ? 'Testando...'
                                                    : 'Testar conexão'}
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    syncNow(integration.id)
                                                }
                                            >
                                                Executar sync agora
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={
                                                    integration.enabled
                                                        ? 'destructive'
                                                        : 'default'
                                                }
                                                onClick={() =>
                                                    toggle(
                                                        integration.id,
                                                        !integration.enabled,
                                                    )
                                                }
                                            >
                                                {integration.enabled
                                                    ? 'Desabilitar'
                                                    : 'Habilitar'}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    startEdit(integration)
                                                }
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    remove(integration)
                                                }
                                            >
                                                Excluir
                                            </Button>
                                        </div>
                                    </div>
                                    {editingId === integration.id && (
                                        <div className="mt-2 w-full space-y-3 rounded-lg border border-border/60 bg-card/60 p-3">
                                            <div className="grid gap-3 md:grid-cols-3">
                                                <div>
                                                    <Label>Direção</Label>
                                                    <Select
                                                        value={editDirection}
                                                        onValueChange={(v) =>
                                                            setEditDirection(
                                                                v as Direction,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pull">
                                                                Pull only
                                                            </SelectItem>
                                                            <SelectItem value="push">
                                                                Push only
                                                            </SelectItem>
                                                            <SelectItem value="two_way">
                                                                Two-way
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Frequência</Label>
                                                    <Select
                                                        value={editFrequency}
                                                        onValueChange={(v) =>
                                                            setEditFrequency(
                                                                v as Frequency,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="manual">
                                                                Manual
                                                            </SelectItem>
                                                            <SelectItem value="interval">
                                                                Intervalo
                                                            </SelectItem>
                                                            <SelectItem value="webhook">
                                                                Webhook
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>
                                                        Política de conflito
                                                    </Label>
                                                    <Select
                                                        value={
                                                            editConflictPolicy
                                                        }
                                                        onValueChange={(v) =>
                                                            setEditConflictPolicy(
                                                                v as ConflictPolicy,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="last_write_wins">
                                                                Última escrita
                                                            </SelectItem>
                                                            <SelectItem value="prefer_local">
                                                                Preferir local
                                                            </SelectItem>
                                                            <SelectItem value="prefer_remote">
                                                                Preferir remoto
                                                            </SelectItem>
                                                            <SelectItem value="manual_review">
                                                                Revisão manual
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Label className="text-xs">
                                                    Status
                                                </Label>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setEditEnabled(
                                                            (v) => !v,
                                                        )
                                                    }
                                                >
                                                    {editEnabled
                                                        ? 'Ativa'
                                                        : 'Inativa'}
                                                </Button>
                                                <span className="text-xs text-muted-foreground">
                                                    Credenciais: reenvie apenas
                                                    se quiser trocar.
                                                </span>
                                            </div>

                                            <div className="grid gap-3 md:grid-cols-3">
                                                {editingProvider === 'jira' && (
                                                    <>
                                                        <div>
                                                            <Label>
                                                                Base URL
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    editBaseUrl
                                                                }
                                                                onChange={(e) =>
                                                                    setEditBaseUrl(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="https://suaempresa.atlassian.net"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>
                                                                Token (API)
                                                            </Label>
                                                            <Input
                                                                type="password"
                                                                value={
                                                                    editToken
                                                                }
                                                                onChange={(e) =>
                                                                    setEditToken(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                                {editingProvider ===
                                                    'trello' && (
                                                    <>
                                                        <div>
                                                            <Label>Key</Label>
                                                            <Input
                                                                value={editKey}
                                                                onChange={(e) =>
                                                                    setEditKey(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Token</Label>
                                                            <Input
                                                                type="password"
                                                                value={
                                                                    editToken
                                                                }
                                                                onChange={(e) =>
                                                                    setEditToken(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                                {editingProvider ===
                                                    'todoist' && (
                                                    <div>
                                                        <Label>Token</Label>
                                                        <Input
                                                            type="password"
                                                            value={editToken}
                                                            onChange={(e) =>
                                                                setEditToken(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        saveEdit(integration)
                                                    }
                                                >
                                                    Salvar alterações
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        setEditingId(null)
                                                    }
                                                >
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Histórico recente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            {logs.length === 0 && (
                                <div>Nenhum log registrado.</div>
                            )}
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-center gap-3"
                                >
                                    <span className="text-xs text-slate-400">
                                        {log.created_at}
                                    </span>
                                    <span className="font-medium">
                                        {providerLabel[log.provider] ||
                                            log.provider}
                                    </span>
                                    <span>{log.direction}</span>
                                    <span
                                        className={
                                            log.status === 'success'
                                                ? 'text-emerald-400'
                                                : 'text-amber-400'
                                        }
                                    >
                                        {log.status}
                                    </span>
                                    {log.error && (
                                        <span className="text-amber-500">
                                            {log.error}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
