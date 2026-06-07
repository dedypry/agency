import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
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
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Category } from '@/types';

export default function CategoriesIndex({
    categories,
}: {
    categories: Category[];
}) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            icon: '',
            description: '',
            active: true as boolean,
        });

    const openCreate = () => {
        reset();
        clearErrors();
        setEditing(null);
        setOpen(true);
    };

    const openEdit = (category: Category) => {
        clearErrors();
        setEditing(category);
        setData({
            name: category.name,
            icon: category.icon ?? '',
            description: category.description ?? '',
            active: category.active,
        });
        setOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = { onSuccess: () => setOpen(false) };
        if (editing) {
            put(`/admin/categories/${editing.id}`, options);
        } else {
            post('/admin/categories', options);
        }
    };

    const destroy = (category: Category) => {
        if (confirm(`Hapus kategori "${category.name}"?`)) {
            router.delete(`/admin/categories/${category.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Kategori" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Kategori"
                        description="Kelola kategori produk."
                    />
                    <Button onClick={openCreate}>
                        <Plus className="mr-1 h-4 w-4" /> Tambah
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Nama</th>
                                <th className="px-4 py-3 font-medium">Produk</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-10 text-center text-muted-foreground"
                                    >
                                        Belum ada kategori.
                                    </td>
                                </tr>
                            )}
                            {categories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="border-t border-border"
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-medium">
                                            {category.name}
                                        </div>
                                        {category.description && (
                                            <div className="line-clamp-1 text-xs text-muted-foreground">
                                                {category.description}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {category.products_count ?? 0}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                category.active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {category.active
                                                ? 'Aktif'
                                                : 'Nonaktif'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    openEdit(category)
                                                }
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    destroy(category)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? 'Edit Kategori' : 'Tambah Kategori'}
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
                            <Label htmlFor="icon">
                                Ikon (home / code / hammer)
                            </Label>
                            <Input
                                id="icon"
                                value={data.icon}
                                onChange={(e) =>
                                    setData('icon', e.target.value)
                                }
                                placeholder="home"
                            />
                            <InputError message={errors.icon} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                            <InputError message={errors.description} />
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

CategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Kategori', href: '/admin/categories' },
    ],
};
