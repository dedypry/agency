import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageDropzone } from '@/components/ui/image-dropzone';
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
import { assetUrl } from '@/lib/utils';
import type { Agent, Category, Product } from '@/types';

const NONE = 'none';

function readCookie(name: string): string | null {
    const match = document.cookie.match(
        new RegExp('(^|;\\s*)' + name + '=([^;]*)'),
    );
    return match ? decodeURIComponent(match[2]) : null;
}

export default function ProductForm({
    product,
    categories,
    agents,
}: {
    product: Product | null;
    categories: Category[];
    agents: Agent[];
}) {
    const { data, setData, post, processing, errors } = useForm<{
        category_id: string;
        agent_id: string;
        name: string;
        type: string;
        short_description: string;
        description: string;
        price: string;
        broker_commission_percent: string;
        agent_commission_percent: string;
        first_party_name: string;
        first_party_phone: string;
        first_party_address: string;
        unit: string;
        location: string;
        featured: boolean;
        status: string;
        image: File | null;
        gallery: File[];
        remove_gallery_ids: number[];
    }>({
        category_id: product?.category_id ? String(product.category_id) : '',
        agent_id: product?.agent_id ? String(product.agent_id) : NONE,
        name: product?.name ?? '',
        type: product?.type ?? 'product',
        short_description: product?.short_description ?? '',
        description: product?.description ?? '',
        price: product ? String(product.price) : '',
        broker_commission_percent: product?.broker_commission_percent
            ? String(product.broker_commission_percent)
            : '',
        agent_commission_percent: product?.agent_commission_percent
            ? String(product.agent_commission_percent)
            : '',
        first_party_name: product?.first_party_name ?? '',
        first_party_phone: product?.first_party_phone ?? '',
        first_party_address: product?.first_party_address ?? '',
        unit: product?.unit ?? '',
        location: product?.location ?? '',
        featured: product?.featured ?? false,
        status: product?.status ?? 'published',
        image: null,
        gallery: [],
        remove_gallery_ids: [],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = product
            ? `/admin/products/${product.id}`
            : '/admin/products';
        post(url, {
            forceFormData: true,
            // Normalize the optional agent select before sending.
            transform: (payload) => ({
                ...payload,
                agent_id: payload.agent_id === NONE ? '' : payload.agent_id,
            }),
        });
    };

    const toggleRemoveGalleryImage = (imageId: number) => {
        setData(
            'remove_gallery_ids',
            data.remove_gallery_ids.includes(imageId)
                ? data.remove_gallery_ids.filter((id) => id !== imageId)
                : [...data.remove_gallery_ids, imageId],
        );
    };

    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    const generateWithAi = async () => {
        if (!data.name.trim()) {
            setAiError('Isi nama produk dulu sebelum generate.');
            return;
        }
        setAiLoading(true);
        setAiError(null);
        try {
            const res = await fetch('/admin/ai/product-description', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': readCookie('XSRF-TOKEN') ?? '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ name: data.name, type: data.type }),
            });
            const payload = await res.json();
            if (!res.ok) {
                throw new Error(payload.message ?? 'Gagal membuat deskripsi.');
            }
            setData((prev) => ({
                ...prev,
                short_description:
                    payload.short_description ?? prev.short_description,
                description: payload.description ?? prev.description,
            }));
        } catch (err) {
            setAiError(
                err instanceof Error ? err.message : 'Gagal membuat deskripsi.',
            );
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <>
            <Head title={product ? 'Edit Produk' : 'Tambah Produk'} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <Button asChild variant="ghost" size="sm" className="w-fit">
                    <Link href="/admin/products">
                        <ArrowLeft className="mr-1 h-4 w-4" /> Kembali
                    </Link>
                </Button>
                <Heading
                    title={product ? 'Edit Produk' : 'Tambah Produk'}
                    description="Lengkapi detail produk dan tetapkan agen sales."
                />

                <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Produk</Label>
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

                            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
                                <div className="text-sm">
                                    <p className="font-medium">
                                        Auto-generate dengan AI
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Isi deskripsi singkat & lengkap dari nama
                                        produk.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={generateWithAi}
                                    disabled={aiLoading}
                                >
                                    {aiLoading ? (
                                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-1 h-4 w-4" />
                                    )}
                                    {aiLoading
                                        ? 'Membuat...'
                                        : 'Generate dengan AI'}
                                </Button>
                            </div>
                            {aiError && (
                                <p className="text-sm text-destructive">
                                    {aiError}
                                </p>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="short_description">
                                    Deskripsi Singkat
                                </Label>
                                <Input
                                    id="short_description"
                                    value={data.short_description}
                                    onChange={(e) =>
                                        setData(
                                            'short_description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ringkasan singkat produk"
                                />
                                <InputError
                                    message={errors.short_description}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    className="min-h-32"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label>
                                    Gambar Utama{' '}
                                    {product && '(kosongkan jika tetap)'}
                                </Label>
                                <ImageDropzone
                                    files={data.image ? [data.image] : []}
                                    onChange={(files) =>
                                        setData('image', files[0] ?? null)
                                    }
                                    label="Tarik & lepas gambar utama"
                                />
                                <InputError message={errors.image} />
                                {product?.image && !data.image && (
                                    <div className="mt-1">
                                        <p className="mb-1 text-xs text-muted-foreground">
                                            Gambar saat ini:
                                        </p>
                                        <img
                                            src={assetUrl(product.image)}
                                            alt={product.name}
                                            className="h-32 w-auto rounded-md border border-border object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label>Galeri Produk (bisa pilih banyak)</Label>
                                <ImageDropzone
                                    multiple
                                    files={data.gallery}
                                    onChange={(files) =>
                                        setData('gallery', files)
                                    }
                                    label="Tarik & lepas beberapa gambar galeri"
                                />
                                <InputError message={errors.gallery} />
                            </div>

                            {product?.images && product.images.length > 0 && (
                                <div className="grid gap-2">
                                    <Label>Galeri Saat Ini</Label>
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        {product.images.map((image) => {
                                            const marked =
                                                data.remove_gallery_ids.includes(
                                                    image.id,
                                                );

                                            return (
                                                <label
                                                    key={image.id}
                                                    className="group cursor-pointer overflow-hidden rounded-lg border border-border"
                                                >
                                                    <img
                                                        src={assetUrl(
                                                            image.path,
                                                        )}
                                                        alt={
                                                            image.alt ??
                                                            product.name
                                                        }
                                                        className="h-28 w-full object-cover"
                                                    />
                                                    <div className="flex items-center gap-2 p-2 text-xs">
                                                        <Checkbox
                                                            checked={marked}
                                                            onCheckedChange={() =>
                                                                toggleRemoveGalleryImage(
                                                                    image.id,
                                                                )
                                                            }
                                                        />
                                                        <span
                                                            className={
                                                                marked
                                                                    ? 'text-destructive'
                                                                    : 'text-muted-foreground'
                                                            }
                                                        >
                                                            {marked
                                                                ? 'Akan dihapus'
                                                                : 'Hapus gambar'}
                                                        </span>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid gap-2">
                                <Label>Kategori</Label>
                                <Select
                                    value={data.category_id}
                                    onValueChange={(v) =>
                                        setData('category_id', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={String(c.id)}
                                            >
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.category_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Agen Sales</Label>
                                <Select
                                    value={data.agent_id}
                                    onValueChange={(v) =>
                                        setData('agent_id', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih agen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={NONE}>
                                            Tanpa agen
                                        </SelectItem>
                                        {agents.map((a) => (
                                            <SelectItem
                                                key={a.id}
                                                value={String(a.id)}
                                            >
                                                {a.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.agent_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Tipe</Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(v) => setData('type', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="property">
                                            Properti
                                        </SelectItem>
                                        <SelectItem value="service">
                                            Jasa
                                        </SelectItem>
                                        <SelectItem value="material">
                                            Material
                                        </SelectItem>
                                        <SelectItem value="product">
                                            Produk
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Harga</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.price} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="unit">Satuan</Label>
                                    <Input
                                        id="unit"
                                        value={data.unit}
                                        onChange={(e) =>
                                            setData('unit', e.target.value)
                                        }
                                        placeholder="/unit"
                                    />
                                </div>
                            </div>

                            <div className="rounded-lg border border-border p-3">
                                <p className="mb-1 text-sm font-medium">
                                    Pengaturan Komisi
                                </p>
                                <p className="mb-3 text-xs text-muted-foreground">
                                    Komisi otomatis dihitung saat pesanan
                                    selesai.
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="broker_commission_percent">
                                            Komisi 90Home (%)
                                        </Label>
                                        <Input
                                            id="broker_commission_percent"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            value={
                                                data.broker_commission_percent
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'broker_commission_percent',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="dari pihak pertama"
                                        />
                                        <InputError
                                            message={
                                                errors.broker_commission_percent
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="agent_commission_percent">
                                            Komisi Agen (%)
                                        </Label>
                                        <Input
                                            id="agent_commission_percent"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            value={
                                                data.agent_commission_percent
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'agent_commission_percent',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="dari 90Home"
                                        />
                                        <InputError
                                            message={
                                                errors.agent_commission_percent
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border border-border p-3">
                                <p className="mb-3 text-sm font-medium">
                                    Pihak Pertama (Pemilik)
                                </p>
                                <div className="grid gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_party_name">
                                            Nama
                                        </Label>
                                        <Input
                                            id="first_party_name"
                                            value={data.first_party_name}
                                            onChange={(e) =>
                                                setData(
                                                    'first_party_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Nama pemilik/principal"
                                        />
                                        <InputError
                                            message={errors.first_party_name}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_party_phone">
                                            Telepon
                                        </Label>
                                        <Input
                                            id="first_party_phone"
                                            value={data.first_party_phone}
                                            onChange={(e) =>
                                                setData(
                                                    'first_party_phone',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_party_address">
                                            Alamat
                                        </Label>
                                        <Textarea
                                            id="first_party_address"
                                            value={data.first_party_address}
                                            onChange={(e) =>
                                                setData(
                                                    'first_party_address',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="location">Lokasi</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) =>
                                        setData('location', e.target.value)
                                    }
                                    placeholder="Opsional"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(v) => setData('status', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="published">
                                            Published
                                        </SelectItem>
                                        <SelectItem value="draft">
                                            Draft
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="featured"
                                    checked={data.featured}
                                    onCheckedChange={(v) =>
                                        setData('featured', v === true)
                                    }
                                />
                                <Label htmlFor="featured">
                                    Tampilkan sebagai unggulan
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                Simpan Produk
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}

ProductForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Produk', href: '/admin/products' },
    ],
};
