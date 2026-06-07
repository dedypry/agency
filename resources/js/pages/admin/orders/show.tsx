import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'pending', label: 'Menunggu' },
    { value: 'processing', label: 'Diproses' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' },
];

function whatsappLink(phone: string, message: string): string {
    const normalized = phone.replace(/[^0-9]/g, '').replace(/^0/, '62');
    return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export default function OrderShow({ order }: { order: Order }) {
    const [status, setStatus] = useState<OrderStatus>(order.status);
    const [processing, setProcessing] = useState(false);

    const updateStatus = (value: string) => {
        setStatus(value as OrderStatus);
        router.put(
            `/admin/orders/${order.id}`,
            { status: value },
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <>
            <Head title={`Pesanan ${order.number}`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <Button asChild variant="ghost" size="sm" className="w-fit">
                    <Link href="/admin/orders">
                        <ArrowLeft className="mr-1 h-4 w-4" /> Kembali
                    </Link>
                </Button>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Heading
                        title={`Pesanan ${order.number}`}
                        description={
                            order.created_at
                                ? `Dibuat ${formatDate(order.created_at)}`
                                : ''
                        }
                    />
                    <div className="w-48">
                        <Select value={status} onValueChange={updateStatus}>
                            <SelectTrigger disabled={processing}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
                        <h2 className="font-semibold">Data Pelanggan</h2>
                        <Row label="Nama" value={order.customer_name} />
                        <Row label="Telepon" value={order.customer_phone} />
                        <Row
                            label="Email"
                            value={order.customer_email ?? '-'}
                        />
                        <Row
                            label="Alamat"
                            value={order.customer_address ?? '-'}
                        />
                        {order.customer_phone && (
                            <Button
                                asChild
                                className="mt-2 w-full bg-green-600 hover:bg-green-700"
                            >
                                <a
                                    href={whatsappLink(
                                        order.customer_phone,
                                        `Halo ${order.customer_name}, terima kasih atas pesanan ${order.number}.`,
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <MessageCircle className="mr-1 h-4 w-4" />
                                    Hubungi via WhatsApp
                                </a>
                            </Button>
                        )}
                    </div>

                    <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
                        <h2 className="font-semibold">Detail Pesanan</h2>
                        <Row label="Produk" value={order.product_name} />
                        <Row label="Jumlah" value={String(order.quantity)} />
                        <Row
                            label="Harga Satuan"
                            value={formatCurrency(order.unit_price)}
                        />
                        {order.notes && (
                            <Row label="Catatan" value={order.notes} />
                        )}
                        <div className="flex items-center justify-between border-t border-border pt-3 text-lg font-bold">
                            <span>Total</span>
                            <span className="text-primary">
                                {formatCurrency(order.total)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium">{value}</span>
        </div>
    );
}

OrderShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Pesanan', href: '/admin/orders' },
    ],
};
