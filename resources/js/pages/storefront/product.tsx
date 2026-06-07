import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    ImageIcon,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    ShoppingBag,
} from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from '@/components/storefront/product-card';
import SiteLayout from '@/components/storefront/site-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { assetUrl, formatCurrency } from '@/lib/utils';
import type { CompanyProfile, Product } from '@/types';

const typeLabels: Record<string, string> = {
    property: 'Properti',
    service: 'Jasa',
    material: 'Material',
    product: 'Produk',
};

function buildWhatsAppLink(phone: string, message: string): string {
    const normalized = phone.replace(/[^0-9]/g, '').replace(/^0/, '62');
    return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export default function ProductDetail({
    product,
    related,
    company,
}: {
    product: Product;
    related: Product[];
    company: CompanyProfile;
}) {
    const agent = product.agent;
    const gallery = [
        product.image,
        ...(product.images?.map((image) => image.path) ?? []),
    ].filter(Boolean) as string[];
    const [activeImage, setActiveImage] = useState(gallery[0] ?? null);

    return (
        <SiteLayout company={company}>
            <Head title={product.name} />

            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Button asChild variant="ghost" size="sm" className="mb-6">
                    <Link href="/catalog">
                        <ArrowLeft className="mr-1 h-4 w-4" /> Kembali ke katalog
                    </Link>
                </Button>

                <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                    {/* Image + description */}
                    <div>
                        <div className="aspect-4/3 overflow-hidden rounded-2xl border border-border bg-muted">
                            {activeImage ? (
                                <img
                                    src={assetUrl(activeImage)}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                    <ImageIcon className="h-16 w-16" />
                                </div>
                            )}
                        </div>

                        {gallery.length > 1 && (
                            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                                {gallery.map((image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        onClick={() => setActiveImage(image)}
                                        className={`aspect-square overflow-hidden rounded-lg border ${
                                            image === activeImage
                                                ? 'border-primary ring-2 ring-primary/30'
                                                : 'border-border'
                                        }`}
                                    >
                                        <img
                                            src={assetUrl(image)}
                                            alt={`${product.name} ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {product.description && (
                            <div className="mt-8">
                                <h2 className="text-lg font-semibold">
                                    Deskripsi
                                </h2>
                                <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
                                    {product.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Info + agent */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                    {typeLabels[product.type] ?? product.type}
                                </Badge>
                                {product.category && (
                                    <Badge variant="outline">
                                        {product.category.name}
                                    </Badge>
                                )}
                            </div>
                            <h1 className="mt-3 text-2xl font-bold">
                                {product.name}
                            </h1>
                            {product.location && (
                                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />{' '}
                                    {product.location}
                                </p>
                            )}
                            <div className="mt-4 flex items-end gap-1">
                                <span className="text-3xl font-bold text-primary">
                                    {formatCurrency(product.price)}
                                </span>
                                {product.unit && (
                                    <span className="pb-1 text-sm text-muted-foreground">
                                        {product.unit}
                                    </span>
                                )}
                            </div>
                            {product.short_description && (
                                <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    {product.short_description}
                                </p>
                            )}
                            <Button asChild size="lg" className="mt-5 w-full">
                                <Link href={`/checkout/${product.slug}`}>
                                    <ShoppingBag className="mr-1 h-4 w-4" />
                                    Pesan Sekarang
                                </Link>
                            </Button>
                        </div>

                        {/* Agent card */}
                        {agent ? (
                            <div className="rounded-2xl border border-border bg-card p-6">
                                <h2 className="text-sm font-semibold text-muted-foreground">
                                    Agen Sales
                                </h2>
                                <div className="mt-3 flex items-center gap-3">
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
                                    <div>
                                        <p className="font-semibold">
                                            {agent.name}
                                        </p>
                                        {agent.title && (
                                            <p className="text-sm text-muted-foreground">
                                                {agent.title}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-5 space-y-2">
                                    {agent.phone && (
                                        <Button
                                            asChild
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            <a
                                                href={buildWhatsAppLink(
                                                    agent.phone,
                                                    `Halo ${agent.name}, saya tertarik dengan "${product.name}".`,
                                                )}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <MessageCircle className="mr-1 h-4 w-4" />
                                                Chat via WhatsApp
                                            </a>
                                        </Button>
                                    )}
                                    {agent.phone && (
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <a href={`tel:${agent.phone}`}>
                                                <Phone className="mr-1 h-4 w-4" />
                                                {agent.phone}
                                            </a>
                                        </Button>
                                    )}
                                    {agent.email && (
                                        <Button
                                            asChild
                                            variant="ghost"
                                            className="w-full"
                                        >
                                            <a href={`mailto:${agent.email}`}>
                                                <Mail className="mr-1 h-4 w-4" />
                                                {agent.email}
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                                Hubungi {company.name} di {company.phone} untuk
                                informasi produk ini.
                            </div>
                        )}
                    </div>
                </div>

                {related.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-xl font-bold">Produk Terkait</h2>
                        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {related.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </SiteLayout>
    );
}
