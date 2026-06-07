import { Head, Link } from '@inertiajs/react';
import {
    DollarSign,
    FileText,
    Package,
    Tags,
    TrendingUp,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Invoice, Product } from '@/types';

interface DashboardProps {
    stats: {
        products: number;
        categories: number;
        agents: number;
        invoices: number;
        revenue: number;
        unpaid: number;
    };
    recentInvoices: Invoice[];
    recentProducts: Product[];
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    paid: 'default',
    unpaid: 'secondary',
    cancelled: 'destructive',
};

export default function AdminDashboard({
    stats,
    recentInvoices,
    recentProducts,
}: DashboardProps) {
    const cards = [
        { label: 'Total Produk', value: stats.products, icon: Package },
        { label: 'Kategori', value: stats.categories, icon: Tags },
        { label: 'Agen Sales', value: stats.agents, icon: Users },
        { label: 'Invoice', value: stats.invoices, icon: FileText },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <Card key={card.label}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {card.label}
                                </CardTitle>
                                <card.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {card.value}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Pendapatan (Lunas)
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(stats.revenue)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Belum Dibayar
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-500">
                                {formatCurrency(stats.unpaid)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentInvoices.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada invoice.
                                </p>
                            )}
                            {recentInvoices.map((invoice) => (
                                <Link
                                    key={invoice.id}
                                    href={`/admin/invoices/${invoice.id}`}
                                    className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {invoice.number}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {invoice.customer_name} &middot;{' '}
                                            {formatDate(invoice.issue_date)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">
                                            {formatCurrency(invoice.total)}
                                        </p>
                                        <Badge
                                            variant={
                                                statusVariant[invoice.status]
                                            }
                                        >
                                            {invoice.status}
                                        </Badge>
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Produk Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentProducts.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada produk.
                                </p>
                            )}
                            {recentProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/admin/products/${product.id}/edit`}
                                    className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {product.category?.name}
                                            {product.agent
                                                ? ` · ${product.agent.name}`
                                                : ''}
                                        </p>
                                    </div>
                                    <p className="font-semibold">
                                        {formatCurrency(product.price)}
                                    </p>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/admin/dashboard' }],
};
