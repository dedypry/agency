import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Home, Package } from 'lucide-react';
import SiteLayout from '@/components/storefront/site-layout';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { CompanyProfile, Order } from '@/types';

const statusLabels: Record<string, string> = {
    pending: 'Menunggu konfirmasi',
    processing: 'Diproses',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

export default function CheckoutSuccess({
    order,
    company,
}: {
    order: Order;
    company: CompanyProfile;
}) {
    return (
        <SiteLayout company={company}>
            <Head title="Pesanan Berhasil" />

            <div className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-16 text-center sm:px-6">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 className="h-9 w-9" />
                </span>
                <h1 className="mt-6 text-2xl font-bold">
                    Pesanan Berhasil Dikirim!
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Terima kasih, {order.customer_name}. Tim {company.name} akan
                    segera menghubungi Anda untuk konfirmasi.
                </p>

                <div className="mt-8 w-full rounded-2xl border border-border bg-card p-6 text-left">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Nomor Pesanan
                        </span>
                        <span className="font-semibold">{order.number}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Produk
                        </span>
                        <span className="font-medium">
                            {order.product_name}
                        </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Jumlah
                        </span>
                        <span>{order.quantity}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Status
                        </span>
                        <span>{statusLabels[order.status] ?? order.status}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">
                            {formatCurrency(order.total)}
                        </span>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <Button asChild variant="outline">
                        <Link href="/">
                            <Home className="mr-1 h-4 w-4" /> Beranda
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/catalog">
                            <Package className="mr-1 h-4 w-4" /> Lihat Produk
                            Lain
                        </Link>
                    </Button>
                </div>
            </div>
        </SiteLayout>
    );
}
