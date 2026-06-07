import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { assetUrl } from '@/lib/utils';
import type { Banner } from '@/types';

export default function BannersIndex({ banners }: { banners: Banner[] }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Banner | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<{
            title: string;
            subtitle: string;
            cta_label: string;
            cta_link: string;
            sort: number;
            active: boolean;
            image: File | null;
        }>({
            title: '',
            subtitle: '',
            cta_label: '',
            cta_link: '',
            sort: 0,
            active: true,
            image: null,
        });

    const openCreate = () => {
        reset();
        clearErrors();
        setEditing(null);
        setOpen(true);
    };

    const openEdit = (banner: Banner) => {
        clearErrors();
        setEditing(banner);
        setData({
            title: banner.title,
            subtitle: banner.subtitle ?? '',
            cta_label: banner.cta_label ?? '',
            cta_link: banner.cta_link ?? '',
            sort: banner.sort,
            active: banner.active,
            image: null,
        });
        setOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editing
            ? `/admin/banners/${editing.id}`
            : '/admin/banners';
        post(url, { forceFormData: true, onSuccess: () => setOpen(false) });
    };

    const destroy = (banner: Banner) => {
        if (confirm(`Hapus banner "${banner.title}"?`)) {
            router.delete(`/admin/banners/${banner.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Banner" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Banner"
                        description="Kelola banner pada halaman depan."
                    />
                    <Button onClick={openCreate}>
                        <Plus className="mr-1 h-4 w-4" /> Tambah
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {banners.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            Belum ada banner.
                        </p>
                    )}
                    {banners.map((banner) => (
                        <div
                            key={banner.id}
                            className="overflow-hidden rounded-xl border border-border bg-card"
                        >
                            <div className="relative aspect-[21/9] bg-muted">
                                <img
                                    src={assetUrl(banner.image)}
                                    alt={banner.title}
                                    className="h-full w-full object-cover"
                                />
                                <Badge
                                    className="absolute right-2 top-2"
                                    variant={
                                        banner.active ? 'default' : 'secondary'
                                    }
                                >
                                    {banner.active ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                            </div>
                            <div className="flex items-start justify-between gap-2 p-4">
                                <div className="min-w-0">
                                    <p className="truncate font-semibold">
                                        {banner.title}
                                    </p>
                                    {banner.subtitle && (
                                        <p className="line-clamp-1 text-xs text-muted-foreground">
                                            {banner.subtitle}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Urutan: {banner.sort}
                                    </p>
                                </div>
                                <div className="flex shrink-0 gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEdit(banner)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => destroy(banner)}
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
                            {editing ? 'Edit Banner' : 'Tambah Banner'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Judul</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.title} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subtitle">Subjudul</Label>
                            <Input
                                id="subtitle"
                                value={data.subtitle}
                                onChange={(e) =>
                                    setData('subtitle', e.target.value)
                                }
                            />
                            <InputError message={errors.subtitle} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="cta_label">Label Tombol</Label>
                                <Input
                                    id="cta_label"
                                    value={data.cta_label}
                                    onChange={(e) =>
                                        setData('cta_label', e.target.value)
                                    }
                                    placeholder="Lihat Produk"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="cta_link">Link Tombol</Label>
                                <Input
                                    id="cta_link"
                                    value={data.cta_link}
                                    onChange={(e) =>
                                        setData('cta_link', e.target.value)
                                    }
                                    placeholder="/catalog?type=property"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sort">Urutan</Label>
                            <Input
                                id="sort"
                                type="number"
                                value={data.sort}
                                onChange={(e) =>
                                    setData(
                                        'sort',
                                        parseInt(e.target.value) || 0,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="image">
                                Gambar {editing && '(kosongkan jika tetap)'}
                            </Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        'image',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                            />
                            <InputError message={errors.image} />
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

BannersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Banner', href: '/admin/banners' },
    ],
};
