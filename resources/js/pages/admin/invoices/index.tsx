import { Head, Link, router } from '@inertiajs/react';
import { Eye, FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import type { Invoice, Paginated } from '@/types';

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    paid: 'default',
    unpaid: 'secondary',
    cancelled: 'destructive',
};

export default function InvoicesIndex({
    invoices,
    filters,
}: {
    invoices: Paginated<Invoice>;
    filters: { q?: string };
}) {
    const [q, setQ] = useState(filters.q ?? '');

    const search = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/invoices', q ? { q } : {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const destroy = (invoice: Invoice) => {
        if (confirm(`Hapus invoice ${invoice.number}?`)) {
            router.delete(`/admin/invoices/${invoice.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Invoice" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Invoice"
                        description="Buat dan kelola invoice penjualan."
                    />
                    <Button asChild>
                        <Link href="/admin/invoices/create">
                            <Plus className="mr-1 h-4 w-4" /> Buat Invoice
                        </Link>
                    </Button>
                </div>

                <form onSubmit={search} className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Cari nomor / pelanggan..."
                        className="pl-9"
                    />
                </form>

                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Nomor</th>
                                <th className="px-4 py-3 font-medium">
                                    Pelanggan
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Tanggal
                                </th>
                                <th className="px-4 py-3 font-medium">Total</th>
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
                                        <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        Belum ada invoice.
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
                                        {invoice.customer_name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {formatDate(invoice.issue_date)}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {formatCurrency(invoice.total)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                statusVariant[invoice.status]
                                            }
                                        >
                                            {invoice.status}
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
                                                    href={`/admin/invoices/${invoice.id}`}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/invoices/${invoice.id}/edit`}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    destroy(invoice)
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

InvoicesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Invoice', href: '/admin/invoices' },
    ],
};
