import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, FileDown, Info } from 'lucide-react';
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
import type { BrokerInvoice, BrokerInvoiceStatus, CompanyProfile } from '@/types';

const statusOptions: { value: BrokerInvoiceStatus; label: string }[] = [
    { value: 'unpaid', label: 'Belum Dibayar' },
    { value: 'paid', label: 'Lunas (Dana Diterima)' },
    { value: 'cancelled', label: 'Dibatalkan' },
];

export default function BrokerInvoiceShow({
    invoice,
    company,
}: {
    invoice: BrokerInvoice;
    company: CompanyProfile;
}) {
    const [status, setStatus] = useState<BrokerInvoiceStatus>(invoice.status);
    const [processing, setProcessing] = useState(false);

    const updateStatus = (value: string) => {
        setStatus(value as BrokerInvoiceStatus);
        router.put(
            `/admin/broker-invoices/${invoice.id}`,
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
            <Head title={`Penagihan ${invoice.number}`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <Button asChild variant="ghost" size="sm" className="w-fit">
                    <Link href="/admin/broker-invoices">
                        <ArrowLeft className="mr-1 h-4 w-4" /> Kembali
                    </Link>
                </Button>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Heading
                        title={`Penagihan ${invoice.number}`}
                        description={`Diterbitkan ${formatDate(invoice.issue_date)}`}
                    />
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <a href={`/admin/broker-invoices/${invoice.id}/pdf`}>
                                <FileDown className="mr-1 h-4 w-4" /> PDF
                            </a>
                        </Button>
                        <div className="w-56">
                            <Select
                                value={status}
                                onValueChange={updateStatus}
                            >
                                <SelectTrigger disabled={processing}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((s) => (
                                        <SelectItem
                                            key={s.value}
                                            value={s.value}
                                        >
                                            {s.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-muted-foreground">
                        Saat status diubah menjadi <strong>Lunas</strong>, komisi
                        agen untuk pesanan terkait otomatis dirilis (ditandai
                        dibayar) sesuai alur: {company.name} menerima dana dari
                        pihak pertama lalu membayar agen.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
                        <h2 className="font-semibold">
                            Pihak Pertama (Pemilik)
                        </h2>
                        <Row label="Nama" value={invoice.first_party_name} />
                        <Row
                            label="Telepon"
                            value={invoice.first_party_phone ?? '-'}
                        />
                        <Row
                            label="Alamat"
                            value={invoice.first_party_address ?? '-'}
                        />
                        {invoice.agent && (
                            <Row label="Agen Terkait" value={invoice.agent.name} />
                        )}
                    </div>

                    <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
                        <h2 className="font-semibold">Rincian Komisi</h2>
                        <Row label="Deskripsi" value={invoice.description} />
                        <Row
                            label="Nilai Penjualan"
                            value={formatCurrency(invoice.base_amount)}
                        />
                        <Row
                            label="Persentase"
                            value={`${invoice.percent}%`}
                        />
                        {invoice.due_date && (
                            <Row
                                label="Jatuh Tempo"
                                value={formatDate(invoice.due_date)}
                            />
                        )}
                        <div className="flex items-center justify-between border-t border-border pt-3 text-lg font-bold">
                            <span>Total Tagihan</span>
                            <span className="text-primary">
                                {formatCurrency(invoice.amount)}
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

BrokerInvoiceShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Penagihan Pihak Pertama', href: '/admin/broker-invoices' },
    ],
};
