import { Head, Link, router } from '@inertiajs/react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from '@/components/storefront/product-card';
import SiteLayout from '@/components/storefront/site-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Category, CompanyProfile, Paginated, Product } from '@/types';

interface CatalogProps {
    products: Paginated<Product>;
    categories: Category[];
    filters: { category?: string; type?: string; q?: string };
    company: CompanyProfile;
}

const types = [
    { value: 'all', label: 'Semua Tipe' },
    { value: 'property', label: 'Properti' },
    { value: 'service', label: 'Jasa' },
    { value: 'material', label: 'Material' },
    { value: 'product', label: 'Produk' },
];

export default function Catalog({
    products,
    categories,
    filters,
    company,
}: CatalogProps) {
    const [q, setQ] = useState(filters.q ?? '');

    const applyFilters = (overrides: Record<string, string | undefined>) => {
        const next = {
            q,
            category: filters.category,
            type: filters.type,
            ...overrides,
        };
        const clean = Object.fromEntries(
            Object.entries(next).filter(
                ([, v]) => v && v !== 'all' && v !== '',
            ),
        );
        router.get('/catalog', clean, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <SiteLayout company={company}>
            <Head title="Katalog Produk" />

            <div className="border-b border-border/60 bg-muted/30">
                <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold">Katalog Produk</h1>
                    <p className="mt-2 text-muted-foreground">
                        Temukan properti, jasa, dan material yang Anda butuhkan.
                    </p>
                </div>
            </div>

            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Filters */}
                <div className="mb-8 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[1fr_auto_auto]">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            applyFilters({});
                        }}
                        className="relative"
                    >
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Cari produk..."
                            className="pl-9"
                        />
                    </form>

                    <Select
                        value={filters.category ?? 'all'}
                        onValueChange={(v) =>
                            applyFilters({
                                category: v === 'all' ? undefined : v,
                            })
                        }
                    >
                        <SelectTrigger className="sm:w-48">
                            <SelectValue placeholder="Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            {categories.map((c) => (
                                <SelectItem key={c.id} value={c.slug}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.type ?? 'all'}
                        onValueChange={(v) =>
                            applyFilters({ type: v === 'all' ? undefined : v })
                        }
                    >
                        <SelectTrigger className="sm:w-40">
                            <SlidersHorizontal className="mr-1 h-4 w-4" />
                            <SelectValue placeholder="Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            {types.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                    {t.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {products.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
                        Tidak ada produk yang cocok dengan pencarian Anda.
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {products.last_page > 1 && (
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-1">
                        {products.links.map((link, i) => (
                            <Button
                                key={i}
                                asChild={!!link.url}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                className={cn('min-w-9', !link.url && 'opacity-50')}
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
        </SiteLayout>
    );
}
