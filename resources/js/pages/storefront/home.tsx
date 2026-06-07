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
        color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    },
    {
        icon: Headset,
        title: 'Agen Profesional',
        desc: 'Setiap produk didampingi agen sales khusus.',
        color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    },
    {
        icon: Truck,
        title: 'Proses Cepat',
        desc: 'Layanan responsif dan pengiriman tepat waktu.',
        color: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
    },
    {
        icon: Sparkles,
        title: 'Harga Bersaing',
        desc: 'Penawaran terbaik untuk setiap kebutuhan.',
        color: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
    },
];

// Rotating accent palette to give category cards a colorful look.
const categoryPalette = [
    {
        icon: 'bg-amber-500 text-white',
        glow: 'from-amber-500/10',
        hover: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
        ring: 'hover:border-amber-400/50',
    },
    {
        icon: 'bg-emerald-500 text-white',
        glow: 'from-emerald-500/10',
        hover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
        ring: 'hover:border-emerald-400/50',
    },
    {
        icon: 'bg-sky-500 text-white',
        glow: 'from-sky-500/10',
        hover: 'group-hover:text-sky-600 dark:group-hover:text-sky-400',
        ring: 'hover:border-sky-400/50',
    },
    {
        icon: 'bg-violet-500 text-white',
        glow: 'from-violet-500/10',
        hover: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
        ring: 'hover:border-violet-400/50',
    },
    {
        icon: 'bg-rose-500 text-white',
        glow: 'from-rose-500/10',
        hover: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
        ring: 'hover:border-rose-400/50',
    },
    {
        icon: 'bg-teal-500 text-white',
        glow: 'from-teal-500/10',
        hover: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
        ring: 'hover:border-teal-400/50',
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
                            <span
                                className={cn(
                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                                    b.color,
                                )}
                            >
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
                    {categories.map((category, index) => {
                        const Icon =
                            categoryIcons[category.icon ?? ''] ?? Building2;
                        const palette =
                            categoryPalette[index % categoryPalette.length];
                        return (
                            <Link
                                key={category.id}
                                href={`/catalog?category=${category.slug}`}
                                className={cn(
                                    'group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg',
                                    palette.ring,
                                )}
                            >
                                <span
                                    className={cn(
                                        'pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br to-transparent opacity-70 blur-2xl transition-opacity group-hover:opacity-100',
                                        palette.glow,
                                    )}
                                />
                                <span
                                    className={cn(
                                        'relative flex h-12 w-12 items-center justify-center rounded-xl shadow-sm',
                                        palette.icon,
                                    )}
                                >
                                    <Icon className="h-6 w-6" />
                                </span>
                                <h3
                                    className={cn(
                                        'relative mt-4 text-lg font-semibold transition-colors',
                                        palette.hover,
                                    )}
                                >
                                    {category.name}
                                </h3>
                                {category.description && (
                                    <p className="relative mt-1 line-clamp-2 text-sm text-muted-foreground">
                                        {category.description}
                                    </p>
                                )}
                                <span
                                    className={cn(
                                        'relative mt-4 inline-flex items-center text-sm font-medium transition-colors',
                                        palette.hover,
                                    )}
                                >
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
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-amber-400 to-amber-500 px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
                    <span className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
                    <span className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />
                    <div className="relative">
                        <h2 className="text-2xl font-bold sm:text-3xl">
                            Punya kebutuhan khusus?
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
                            Tim agen profesional kami siap membantu menemukan
                            solusi terbaik untuk properti, website, maupun
                            material bangunan Anda.
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
                </div>
            </section>
        </SiteLayout>
    );
}
