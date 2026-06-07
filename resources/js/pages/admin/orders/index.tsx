import { Head, Link, router } from '@inertiajs/react';
import { Eye, ShoppingCart, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import type { Order, OrderStatus, Paginated } from '@/types';

const statusVariant: Record<
    OrderStatus,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    pending: 'secondary',
    processing: 'outline',
    completed: 'default',
    cancelled: 'destructive',
};

const statusLabels: Record<OrderStatus, string> = {
    pending: 'Menunggu',
    processing: 'Diproses',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

export default function OrdersIndex({
    orders,
    stats,
}: {
    orders: Paginated<Order>;
    stats: { pending: number; total: number; revenue: number };
}) {
    const destroy = (order: Order) => {
        if (confirm(`Hapus pesanan ${order.number}?`)) {
            router.delete(`/admin/orders/${order.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Pesanan" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Pesanan Masuk"
                    description="Kelola pesanan yang masuk dari pelanggan."
                />

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-sm text-muted-foreground">
                            Menunggu Konfirmasi
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                            {stats.pending}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-sm text-muted-foreground">
                            Total Pesanan
                        </p>
                        <p className="mt-1 text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-sm text-muted-foreground">
                            Pendapatan (Selesai)
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                            {formatCurrency(stats.revenue)}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Nomor</th>
                                <th className="px-4 py-3 font-medium">
                                    Pelanggan
                                </th>
                                <th className="px-4 py-3 font-medium">Produk</th>
                                <th className="px-4 py-3 font-medium">Tanggal</th>
                                <th className="px-4 py-3 font-medium">Total</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-10 text-center text-muted-foreground"
                                    >
                                        <ShoppingCart className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        Belum ada pesanan.
                                    </td>
                                </tr>
                            )}
                            {orders.data.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-t border-border"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {order.number}
                                    </td>
                                    <td className="px-4 py-3">
                                        {order.customer_name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {order.product_name} &times;{' '}
                                        {order.quantity}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {order.created_at
                                            ? formatDate(order.created_at)
                                            : '-'}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {formatCurrency(order.total)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={statusVariant[order.status]}
                                        >
                                            {statusLabels[order.status]}
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
                                                    href={`/admin/orders/${order.id}`}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => destroy(order)}
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

                {orders.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {orders.links.map((link, i) => (
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

OrdersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Pesanan', href: '/admin/orders' },
    ],
};
