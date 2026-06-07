import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Code2,
    Hammer,
    Headset,
    Home as HomeIcon,
    ShieldCheck,
    Sparkles,
    Truck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/storefront/product-card';
import SiteLayout from '@/components/storefront/site-layout';
import { Button } from '@/components/ui/button';
import { assetUrl, cn } from '@/lib/utils';
import type { Banner, Category, CompanyProfile, Product } from '@/types';

const categoryIcons: Record<string, typeof HomeIcon> = {
    home: HomeIcon,
    code: Code2,
    hammer: Hammer,
};

interface HomeProps {
    banners: Banner[];
    categories: Category[];
    featuredProducts: Product[];
    latestProducts: Product[];
    company: CompanyProfile;
}

function HeroCarousel({ banners }: { banners: Banner[] }) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(
            () => setActive((i) => (i + 1) % banners.length),
            5000,
        );
        return () => clearInterval(timer);
    }, [banners.length]);

    if (banners.length === 0) {
        return (
            <div className="relative flex h-[420px] items-center justify-center bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Selamat Datang</h1>
                    <p className="mt-2 opacity-90">
                        Tambahkan banner dari dashboard admin.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className="relative h-[460px] w-full overflow-hidden sm:h-[520px]">
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={cn(
                        'absolute inset-0 transition-opacity duration-700',
                        index === active ? 'opacity-100' : 'opacity-0',
                    )}
                >
                    <img
                        src={assetUrl(banner.image)}
                        alt={banner.title}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex items-center">
                        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="max-w-xl text-white">
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                                    <Sparkles className="h-3.5 w-3.5" /> Penawaran
                                    Terbaik
                                </span>
                                <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
                                    {banner.title}
                                </h1>
                                {banner.subtitle && (
                                    <p className="mt-4 text-base text-white/85 sm:text-lg">
                                        {banner.subtitle}
                                    </p>
                                )}
                                {banner.cta_link && (
                                    <Button
                                        asChild
                                        size="lg"
                                        className="mt-6"
                                    >
                                        <Link href={banner.cta_link}>
                                            {banner.cta_label ?? 'Selengkapnya'}
                                            <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {banners.length > 1 && (
                <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                    {banners.map((banner, index) => (
                        <button
                            key={banner.id}
                            type="button"
                            aria-label={`Banner ${index + 1}`}
                            onClick={() => setActive(index)}
                            className={cn(
                                'h-2 rounded-full transition-all',
                                index === active
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/50 hover:bg-white/80',
                            )}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

const benefits = [
    {
        icon: ShieldCheck,
        title: 'Terpercaya',
        desc: 'Mitra resmi dengan reputasi terjamin.',
    },
    {
        icon: Headset,
        title: 'Agen Profesional',
        desc: 'Setiap produk didampingi agen sales khusus.',
    },
    {
        icon: Truck,
        title: 'Proses Cepat',
        desc: 'Layanan responsif dan pengiriman tepat waktu.',
    },
    {
        icon: Sparkles,
        title: 'Harga Bersaing',
        desc: 'Penawaran terbaik untuk setiap kebutuhan.',
    },
];

export default function StorefrontHome({
    banners,
    categories,
    featuredProducts,
    latestProducts,
    company,
}: HomeProps) {
    return (
        <SiteLayout company={company}>
            <Head title="Beranda" />

            <HeroCarousel banners={banners} />

            {/* Benefits */}
            <section className="border-b border-border/60 bg-card">
                <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
                    {benefits.map((b) => (
                        <div key={b.title} className="flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <b.icon className="h-5 w-5" />
                            </span>
                            <div>
                                <h3 className="text-sm font-semibold">
                                    {b.title}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {b.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                        Jelajahi Kategori
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Properti, jasa pembuatan website, hingga material
                        bangunan.
                    </p>
                </div>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => {
                        const Icon =
                            categoryIcons[category.icon ?? ''] ?? Building2;
                        return (
                            <Link
                                key={category.id}
                                href={`/catalog?category=${category.slug}`}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-muted/40 p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                            >
                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                    <Icon className="h-6 w-6" />
                                </span>
                                <h3 className="mt-4 text-lg font-semibold group-hover:text-primary">
                                    {category.name}
                                </h3>
                                {category.description && (
                                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                        {category.description}
                                    </p>
                                )}
                                <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                                    {category.products_count ?? 0} produk
                                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Featured products */}
            {featuredProducts.length > 0 && (
                <section className="bg-muted/30 py-14">
                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-end justify-between">
                            <div>
                                <h2 className="text-2xl font-bold sm:text-3xl">
                                    Produk Unggulan
                                </h2>
                                <p className="mt-2 text-muted-foreground">
                                    Pilihan terbaik dari kami untuk Anda.
                                </p>
                            </div>
                            <Button asChild variant="outline" className="hidden sm:flex">
                                <Link href="/catalog">
                                    Lihat semua
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Latest products */}
            {latestProducts.length > 0 && (
                <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between">
                        <h2 className="text-2xl font-bold sm:text-3xl">
                            Terbaru
                        </h2>
                        <Button asChild variant="ghost">
                            <Link href="/catalog">
                                Lihat semua
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {latestProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                        Punya kebutuhan khusus?
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
                        Tim agen profesional kami siap membantu menemukan solusi
                        terbaik untuk properti, website, maupun material bangunan
                        Anda.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        variant="secondary"
                        className="mt-6"
                    >
                        <Link href="/catalog">Mulai Jelajahi</Link>
                    </Button>
                </div>
            </section>
        </SiteLayout>
    );
}
