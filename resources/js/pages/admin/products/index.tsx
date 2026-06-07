import { Head, Link, router } from '@inertiajs/react';
import { ImageIcon, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { assetUrl, cn, formatCurrency } from '@/lib/utils';
import type { Paginated, Product } from '@/types';

const typeLabels: Record<string, string> = {
    property: 'Properti',
    service: 'Jasa',
    material: 'Material',
    product: 'Produk',
};

export default function ProductsIndex({
    products,
    filters,
}: {
    products: Paginated<Product>;
    filters: { q?: string };
}) {
    const [q, setQ] = useState(filters.q ?? '');

    const search = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/products',
            q ? { q } : {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const destroy = (product: Product) => {
        if (confirm(`Hapus produk "${product.name}"?`)) {
            router.delete(`/admin/products/${product.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Produk" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Produk"
                        description="Kelola produk, harga, dan agen sales."
                    />
                    <Button asChild>
                        <Link href="/admin/products/create">
                            <Plus className="mr-1 h-4 w-4" /> Tambah
                        </Link>
                    </Button>
                </div>

                <form onSubmit={search} className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Cari produk..."
                        className="pl-9"
                    />
                </form>

                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Produk</th>
                                <th className="px-4 py-3 font-medium">Tipe</th>
                                <th className="px-4 py-3 font-medium">Agen</th>
                                <th className="px-4 py-3 font-medium">Harga</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-10 text-center text-muted-foreground"
                                    >
                                        Belum ada produk.
                                    </td>
                                </tr>
                            )}
                            {products.data.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-t border-border"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                                                {product.image ? (
                                                    <img
                                                        src={assetUrl(
                                                            product.image,
                                                        )}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                        <ImageIcon className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-medium">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {product.category?.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant="outline">
                                            {typeLabels[product.type] ??
                                                product.type}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {product.agent?.name ?? '-'}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {formatCurrency(product.price)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                product.status === 'published'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {product.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    destroy(product)
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

                {products.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {products.links.map((link, i) => (
                            <Button
                                key={i}
                                asChild={!!link.url}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                className={cn(
                                    'min-w-9',
                                    !link.url && 'opacity-50',
                                )}
                            >
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

ProductsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Produk', href: '/admin/products' },
    ],
};
