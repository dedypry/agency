import { Head, router, useForm } from '@inertiajs/react';
import { Landmark, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ImageDropzone } from '@/components/ui/image-dropzone';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { assetUrl } from '@/lib/utils';
import type { Agent } from '@/types';

export default function AgentsIndex({ agents }: { agents: Agent[] }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Agent | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<{
            name: string;
            title: string;
            email: string;
            phone: string;
            bio: string;
            active: boolean;
            photo: File | null;
            bank_name: string;
            bank_account: string;
            bank_holder: string;
        }>({
            name: '',
            title: '',
            email: '',
            phone: '',
            bio: '',
            active: true,
            photo: null,
            bank_name: '',
            bank_account: '',
            bank_holder: '',
        });

    const openCreate = () => {
        reset();
        clearErrors();
        setEditing(null);
        setOpen(true);
    };

    const openEdit = (agent: Agent) => {
        clearErrors();
        setEditing(agent);
        setData({
            name: agent.name,
            title: agent.title ?? '',
            email: agent.email ?? '',
            phone: agent.phone ?? '',
            bio: agent.bio ?? '',
            active: agent.active,
            photo: null,
            bank_name: agent.bank_name ?? '',
            bank_account: agent.bank_account ?? '',
            bank_holder: agent.bank_holder ?? '',
        });
        setOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editing
            ? `/admin/agents/${editing.id}`
            : '/admin/agents';
        post(url, { forceFormData: true, onSuccess: () => setOpen(false) });
    };

    const destroy = (agent: Agent) => {
        if (confirm(`Hapus agen "${agent.name}"?`)) {
            router.delete(`/admin/agents/${agent.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Agen Sales" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Agen Sales"
                        description="Kelola agen sales yang menangani produk."
                    />
                    <Button onClick={openCreate}>
                        <Plus className="mr-1 h-4 w-4" /> Tambah
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {agents.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            Belum ada agen.
                        </p>
                    )}
                    {agents.map((agent) => (
                        <div
                            key={agent.id}
                            className="flex flex-col rounded-xl border border-border bg-card p-4"
                        >
                            <div className="flex items-center gap-3">
                                {agent.photo ? (
                                    <img
                                        src={assetUrl(agent.photo)}
                                        alt={agent.name}
                                        className="h-14 w-14 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                                        {agent.name.charAt(0)}
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <p className="truncate font-semibold">
                                        {agent.name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {agent.title || '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                                {agent.phone && <p>{agent.phone}</p>}
                                {agent.email && (
                                    <p className="truncate">{agent.email}</p>
                                )}
                                {agent.bank_name && agent.bank_account && (
                                    <p className="flex items-center gap-1 truncate">
                                        <Landmark className="h-3.5 w-3.5 shrink-0" />
                                        {agent.bank_name} {agent.bank_account}
                                    </p>
                                )}
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <Badge
                                    variant={
                                        agent.active ? 'default' : 'secondary'
                                    }
                                >
                                    {agent.products_count ?? 0} produk
                                </Badge>
                                <div className="flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEdit(agent)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => destroy(agent)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? 'Edit Agen' : 'Tambah Agen'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Jabatan</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Senior Property Agent"
                            />
                            <InputError message={errors.title} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Telepon</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                />
                                <InputError message={errors.phone} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                />
                                <InputError message={errors.email} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                            />
                            <InputError message={errors.bio} />
                        </div>

                        <div className="rounded-lg border border-border p-3">
                            <p className="mb-3 text-sm font-medium">
                                Rekening Pembayaran Komisi
                            </p>
                            <div className="grid gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="bank_name">Bank</Label>
                                        <Input
                                            id="bank_name"
                                            value={data.bank_name}
                                            onChange={(e) =>
                                                setData(
                                                    'bank_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="BCA"
                                        />
                                        <InputError
                                            message={errors.bank_name}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="bank_account">
                                            No. Rekening
                                        </Label>
                                        <Input
                                            id="bank_account"
                                            value={data.bank_account}
                                            onChange={(e) =>
                                                setData(
                                                    'bank_account',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="1234567890"
                                        />
                                        <InputError
                                            message={errors.bank_account}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="bank_holder">
                                        Atas Nama
                                    </Label>
                                    <Input
                                        id="bank_holder"
                                        value={data.bank_holder}
                                        onChange={(e) =>
                                            setData(
                                                'bank_holder',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nama pemilik rekening"
                                    />
                                    <InputError message={errors.bank_holder} />
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Foto</Label>
                            <ImageDropzone
                                files={data.photo ? [data.photo] : []}
                                onChange={(files) =>
                                    setData('photo', files[0] ?? null)
                                }
                                label="Tarik & lepas foto agen"
                            />
                            <InputError message={errors.photo} />
                            {editing?.photo && !data.photo && (
                                <div className="mt-1 flex items-center gap-2">
                                    <img
                                        src={assetUrl(editing.photo)}
                                        alt={editing.name}
                                        className="h-14 w-14 rounded-full border border-border object-cover"
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        Foto saat ini
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="active"
                                checked={data.active}
                                onCheckedChange={(v) =>
                                    setData('active', v === true)
                                }
                            />
                            <Label htmlFor="active">Aktif</Label>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

AgentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Agen Sales', href: '/admin/agents' },
    ],
};
