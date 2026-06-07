import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileDown, Pencil, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { assetUrl, formatCurrency, formatDate } from '@/lib/utils';
import type { CompanyProfile, Invoice } from '@/types';

const statusLabel: Record<string, string> = {
    paid: 'LUNAS',
    unpaid: 'BELUM DIBAYAR',
    cancelled: 'DIBATALKAN',
};

export default function InvoiceShow({
    invoice,
    company,
}: {
    invoice: Invoice;
    company: CompanyProfile;
}) {
    return (
        <>
            <Head title={`Invoice ${invoice.number}`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Toolbar (hidden on print) */}
                <div className="no-print flex items-center justify-between">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/admin/invoices">
                            <ArrowLeft className="mr-1 h-4 w-4" /> Kembali
                        </Link>
                    </Button>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={`/admin/invoices/${invoice.id}/edit`}>
                                <Pencil className="mr-1 h-4 w-4" /> Edit
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <a href={`/admin/invoices/${invoice.id}/pdf`}>
                                <FileDown className="mr-1 h-4 w-4" /> Download
                                PDF
                            </a>
                        </Button>
                        <Button onClick={() => window.print()}>
                            <Printer className="mr-1 h-4 w-4" /> Cetak / PDF
                        </Button>
                    </div>
                </div>

                {/* Printable invoice */}
                <div className="print-area mx-auto w-full max-w-3xl rounded-xl border border-border bg-white p-8 text-black shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            {company.logo && (
                                <img
                                    src={assetUrl(company.logo)}
                                    alt={company.name}
                                    className="h-14 w-14 rounded object-cover"
                                />
                            )}
                            <div>
                                <h1 className="text-xl font-bold">
                                    {company.name}
                                </h1>
                                {company.tagline && (
                                    <p className="text-xs text-gray-500">
                                        {company.tagline}
                                    </p>
                                )}
                                {company.address && (
                                    <p className="mt-1 max-w-xs text-xs text-gray-500">
                                        {company.address}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500">
                                    {[company.phone, company.email]
                                        .filter(Boolean)
                                        .join(' · ')}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold tracking-tight">
                                INVOICE
                            </h2>
                            <p className="text-sm font-medium">
                                {invoice.number}
                            </p>
                            <span className="mt-2 inline-block rounded border border-gray-300 px-2 py-0.5 text-xs font-semibold">
                                {statusLabel[invoice.status] ?? invoice.status}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-400">
                                Ditagihkan kepada
                            </p>
                            <p className="mt-1 font-semibold">
                                {invoice.customer_name}
                            </p>
                            {invoice.customer_address && (
                                <p className="text-sm text-gray-600">
                                    {invoice.customer_address}
                                </p>
                            )}
                            <p className="text-sm text-gray-600">
                                {[
                                    invoice.customer_phone,
                                    invoice.customer_email,
                                ]
                                    .filter(Boolean)
                                    .join(' · ')}
                            </p>
                        </div>
                        <div className="text-right text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">
                                    Tanggal Terbit
                                </span>
                                <span>{formatDate(invoice.issue_date)}</span>
                            </div>
                            {invoice.due_date && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Jatuh Tempo
                                    </span>
                                    <span>{formatDate(invoice.due_date)}</span>
                                </div>
                            )}
                            {invoice.agent && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Sales
                                    </span>
                                    <span>{invoice.agent.name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <table className="mt-8 w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-300 text-left">
                                <th className="py-2">Deskripsi</th>
                                <th className="py-2 text-right">Qty</th>
                                <th className="py-2 text-right">Harga</th>
                                <th className="py-2 text-right">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items?.map((item, i) => (
                                <tr
                                    key={item.id ?? i}
                                    className="border-b border-gray-200"
                                >
                                    <td className="py-2">{item.description}</td>
                                    <td className="py-2 text-right">
                                        {item.quantity}
                                    </td>
                                    <td className="py-2 text-right">
                                        {formatCurrency(item.unit_price)}
                                    </td>
                                    <td className="py-2 text-right">
                                        {formatCurrency(item.total)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 flex justify-end">
                        <div className="w-64 space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span>{formatCurrency(invoice.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Diskon</span>
                                <span>
                                    - {formatCurrency(invoice.discount)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Pajak ({invoice.tax_percent}%)
                                </span>
                                <span>
                                    {formatCurrency(invoice.tax_amount)}
                                </span>
                            </div>
                            <div className="flex justify-between border-t-2 border-gray-300 pt-2 text-base font-bold">
                                <span>Total</span>
                                <span>{formatCurrency(invoice.total)}</span>
                            </div>
                        </div>
                    </div>

                    {(company.bank_name || invoice.notes) && (
                        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 text-xs text-gray-600">
                            {company.bank_name && (
                                <div>
                                    <p className="font-semibold text-gray-700">
                                        Pembayaran
                                    </p>
                                    <p>{company.bank_name}</p>
                                    <p>
                                        {company.bank_account}
                                        {company.bank_holder
                                            ? ` a.n. ${company.bank_holder}`
                                            : ''}
                                    </p>
                                </div>
                            )}
                            {invoice.notes && (
                                <div>
                                    <p className="font-semibold text-gray-700">
                                        Catatan
                                    </p>
                                    <p className="whitespace-pre-line">
                                        {invoice.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <p className="mt-8 text-center text-xs text-gray-400">
                        Terima kasih atas kepercayaan Anda.
                    </p>
                </div>
            </div>
        </>
    );
}

InvoiceShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Invoice', href: '/admin/invoices' },
    ],
};
