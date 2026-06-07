import { Link } from '@inertiajs/react';
import {
    FileText,
    Globe,
    Images,
    LayoutGrid,
    Package,
    Receipt,
    ShoppingCart,
    Tags,
    Users,
    Wallet,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavGroup, NavItem } from '@/types';

const navGroups: NavGroup[] = [
    {
        title: 'Utama',
        items: [
            {
                title: 'Dashboard',
                href: '/admin/dashboard',
                icon: LayoutGrid,
            },
        ],
    },
    {
        title: 'Katalog',
        items: [
            {
                title: 'Produk',
                href: '/admin/products',
                icon: Package,
            },
            {
                title: 'Kategori',
                href: '/admin/categories',
                icon: Tags,
            },
            {
                title: 'Banner',
                href: '/admin/banners',
                icon: Images,
            },
        ],
    },
    {
        title: 'Transaksi',
        items: [
            {
                title: 'Pesanan',
                href: '/admin/orders',
                icon: ShoppingCart,
            },
            {
                title: 'Invoice',
                href: '/admin/invoices',
                icon: FileText,
            },
        ],
    },
    {
        title: 'Agen & Komisi',
        items: [
            {
                title: 'Agen Sales',
                href: '/admin/agents',
                icon: Users,
            },
            {
                title: 'Komisi Agen',
                href: '/admin/commissions',
                icon: Wallet,
            },
            {
                title: 'Penagihan Pihak Pertama',
                href: '/admin/broker-invoices',
                icon: Receipt,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Lihat Website',
        href: '/',
        icon: Globe,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
