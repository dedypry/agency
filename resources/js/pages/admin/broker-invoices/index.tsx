import { Head, Link, router } from '@inertiajs/react';
import { Eye, FileDown, Receipt, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import type { BrokerInvoice, BrokerInvoiceStatus, Paginated } from '@/types';

const statusVariant: Record<
    BrokerInvoiceStatus,
    'default' | 'secondary' | 'destructive'
> = {
    paid: 'default',
    unpaid: 'secondary',
    cancelled: 'destructive',
};

const statusLabels: Record<BrokerInvoiceStatus, string> = {
    paid: 'Lunas',
    unpaid: 'Belum Dibayar',
    cancelled: 'Dibatalkan',
};

export default function BrokerInvoicesIndex({
    invoices,
    stats,
}: {
    invoices: Paginated<BrokerInvoice>;
    stats: { unpaid: number; paid: number; count: number };
}) {
    const destroy = (invoice: BrokerInvoice) => {
        if (confirm(`Hapus penagihan ${invoice.number}?`)) {
            router.delete(`/admin/broker-invoices/${invoice.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Penagihan Pihak Pertama" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Penagihan Pihak Pertama"
                    description="Invoice komisi broker yang ditagihkan ke pihak pertama (pemilik). Dibuat otomatis saat pesanan selesai."
                />

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-sm text-muted-foreground">
                            Belum Dibayar
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                            {formatCurrency(stats.unpaid)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-sm text-muted-foreground">
                            Sudah Diterima
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                            {formatCurrency(stats.paid)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-sm text-muted-foreground">
                            Jumlah Tagihan
                        </p>
                        <p className="mt-1 text-2xl font-bold">{stats.count}</p>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Nomor</th>
                                <th className="px-4 py-3 font-medium">
                                    Pihak Pertama
                                </th>
                                <th className="px-4 py-3 font-medium">Tanggal</th>
                                <th className="px-4 py-3 font-medium">Komisi</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-10 text-center text-muted-foreground"
                                    >
                                        <Receipt className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        Belum ada penagihan. Selesaikan pesanan
                                        untuk membuat tagihan otomatis.
                                    </td>
                                </tr>
                            )}
                            {invoices.data.map((invoice) => (
                                <tr
                                    key={invoice.id}
                                    className="border-t border-border"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {invoice.number}
                                    </td>
                                    <td className="px-4 py-3">
                                        {invoice.first_party_name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {formatDate(invoice.issue_date)}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {formatCurrency(invoice.amount)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                statusVariant[invoice.status]
                                            }
                                        >
                                            {statusLabels[invoice.status]}
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
                                                    href={`/admin/broker-invoices/${invoice.id}`}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                asChild
                                            >
                                                <a
                                                    href={`/admin/broker-invoices/${invoice.id}/pdf`}
                                                >
                                                    <FileDown className="h-4 w-4" />
                                                </a>
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => destroy(invoice)}
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

                {invoices.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {invoices.links.map((link, i) => (
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

BrokerInvoicesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Penagihan Pihak Pertama', href: '/admin/broker-invoices' },
    ],
};
