import { Link, usePage } from '@inertiajs/react';
import { Building2, Mail, MapPin, Menu, Phone } from 'lucide-react';
import { useState, type PropsWithChildren } from 'react';
import { ChatWidget } from '@/components/storefront/chat-widget';
import { Button } from '@/components/ui/button';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { assetUrl, cn } from '@/lib/utils';
import type { CompanyProfile } from '@/types';
import type { User } from '@/types/auth';

const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Semua Produk', href: '/catalog' },
    { label: 'Properti', href: '/catalog?type=property' },
    { label: 'Jasa Website', href: '/catalog?type=service' },
    { label: 'Material', href: '/catalog?type=material' },
];

export default function SiteLayout({
    company,
    children,
}: PropsWithChildren<{ company: CompanyProfile }>) {
    useFlashToast();
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2 font-bold">
                        {company.logo ? (
                            <img
                                src={assetUrl(company.logo)}
                                alt={company.name}
                                className="h-9 w-9 rounded-lg object-cover"
                            />
                        ) : (
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Building2 className="h-5 w-5" />
                            </span>
                        )}
                        <span className="text-lg tracking-tight">{company.name}</span>
                    </Link>

                    <nav className="hidden items-center gap-1 lg:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        {auth?.user ? (
                            <Button asChild size="sm">
                                <Link href="/admin/dashboard">Dashboard</Link>
                            </Button>
                        ) : (
                            <Button asChild size="sm" variant="outline">
                                <Link href="/login">Masuk Admin</Link>
                            </Button>
                        )}
                        <Button
                            size="icon"
                            variant="ghost"
                            className="lg:hidden"
                            onClick={() => setOpen((v) => !v)}
                            aria-label="Toggle menu"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div
                    className={cn(
                        'border-t border-border/60 lg:hidden',
                        open ? 'block' : 'hidden',
                    )}
                >
                    <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-border/60 bg-muted/30">
                <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div>
                        <div className="flex items-center gap-2 font-bold">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Building2 className="h-5 w-5" />
                            </span>
                            <span className="text-lg">{company.name}</span>
                        </div>
                        {company.tagline && (
                            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                                {company.tagline}
                            </p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold">Tautan</h3>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold">Kontak</h3>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            {company.address && (
                                <li className="flex items-start gap-2">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{company.address}</span>
                                </li>
                            )}
                            {company.phone && (
                                <li className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    <span>{company.phone}</span>
                                </li>
                            )}
                            {company.email && (
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <span>{company.email}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} {company.name}. Seluruh hak cipta dilindungi.
                </div>
            </footer>

            <ChatWidget company={company} />
        </div>
    );
}
