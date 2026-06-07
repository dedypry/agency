import { Head, router, useForm } from '@inertiajs/react';
import { Banknote, Check, Plus, Trash2, Wallet } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import type { Agent, CommissionPayment, Paginated } from '@/types';

const ALL = 'all';

export default function CommissionsIndex({
    payments,
    agents,
    filters,
    stats,
}: {
    payments: Paginated<CommissionPayment>;
    agents: Agent[];
    filters: { agent_id: number | null };
    stats: { total_paid: number; total_pending: number; count: number };
}) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            agent_id: '',
            amount: '',
            period: '',
            method: 'transfer',
            reference: '',
            status: 'paid',
            paid_at: new Date().toISOString().slice(0, 10),
            notes: '',
        });

    const selectedAgent = agents.find((a) => String(a.id) === data.agent_id);

    const openCreate = () => {
        reset();
        clearErrors();
        setOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/commissions', {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    const filterByAgent = (value: string) => {
        router.get(
            '/admin/commissions',
            value === ALL ? {} : { agent_id: value },
            { preserveState: true, preserveScroll: true },
        );
    };

    const toggleStatus = (payment: CommissionPayment) => {
        router.put(
            `/admin/commissions/${payment.id}`,
            { status: payment.status === 'paid' ? 'pending' : 'paid' },
            { preserveScroll: true },
        );
    };

    const destroy = (payment: CommissionPayment) => {
        if (confirm('Hapus catatan pembayaran komisi ini?')) {
            router.delete(`/admin/commissions/${payment.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Komisi Agen" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Heading
                        title="Komisi Agen"
                        description="Catat dan pantau riwayat pembayaran komisi ke agen sales."
                    />
                    <Button onClick={openCreate}>
                        <Plus className="mr-1 h-4 w-4" /> Catat Pembayaran
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Total Dibayar"
                        value={formatCurrency(stats.total_paid)}
                        icon={<Banknote className="h-5 w-5" />}
                    />
                    <StatCard
                        label="Pending"
                        value={formatCurrency(stats.total_pending)}
                        icon={<Wallet className="h-5 w-5" />}
                    />
                    <StatCard
                        label="Jumlah Transaksi"
                        value={String(stats.count)}
                        icon={<Banknote className="h-5 w-5" />}
                    />
                </div>

                <div className="max-w-xs">
                    <Select
                        value={
                            filters.agent_id ? String(filters.agent_id) : ALL
                        }
                        onValueChange={filterByAgent}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter agen" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>Semua Agen</SelectItem>
                            {agents.map((a) => (
                                <SelectItem key={a.id} value={String(a.id)}>
                                    {a.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Agen</th>
                                <th className="px-4 py-3 font-medium">Periode</th>
                                <th className="px-4 py-3 font-medium">Metode</th>
                                <th className="px-4 py-3 font-medium">Tanggal</th>
                                <th className="px-4 py-3 font-medium">Jumlah</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-10 text-center text-muted-foreground"
                                    >
                                        <Banknote className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        Belum ada pembayaran komisi.
                                    </td>
                                </tr>
                            )}
                            {payments.data.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-t border-border"
                                >
                                    <td className="px-4 py-3">
                                        <p className="flex items-center gap-2 font-medium">
                                            {p.agent?.name ?? '-'}
                                            {p.auto && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px]"
                                                >
                                                    Otomatis
                                                </Badge>
                                            )}
                                        </p>
                                        {p.percent != null &&
                                            Number(p.percent) > 0 && (
                                                <p className="text-xs text-muted-foreground">
                                                    {p.percent}% komisi
                                                </p>
                                            )}
                                        {p.reference && (
                                            <p className="text-xs text-muted-foreground">
                                                Ref: {p.reference}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {p.period || '-'}
                                    </td>
                                    <td className="px-4 py-3 capitalize text-muted-foreground">
                                        {p.method || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {p.paid_at
                                            ? formatDate(p.paid_at)
                                            : '-'}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {formatCurrency(p.amount)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                p.status === 'paid'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {p.status === 'paid'
                                                ? 'Dibayar'
                                                : 'Pending'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                title={
                                                    p.status === 'paid'
                                                        ? 'Tandai pending'
                                                        : 'Tandai dibayar'
                                                }
                                                onClick={() => toggleStatus(p)}
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => destroy(p)}
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

                {payments.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {payments.links.map((link, i) => (
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
                                    <a
                                        href={link.url}
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

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Catat Pembayaran Komisi</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Agen</Label>
                            <Select
                                value={data.agent_id}
                                onValueChange={(v) => setData('agent_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih agen" />
                                </SelectTrigger>
                                <SelectContent>
                                    {agents.map((a) => (
                                        <SelectItem
                                            key={a.id}
                                            value={String(a.id)}
                                        >
                                            {a.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.agent_id} />
                            {selectedAgent &&
                                (selectedAgent.bank_account ? (
                                    <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                                        {selectedAgent.bank_name}{' '}
                                        {selectedAgent.bank_account}
                                        {selectedAgent.bank_holder &&
                                            ` (a.n. ${selectedAgent.bank_holder})`}
                                    </p>
                                ) : (
                                    <p className="text-xs text-amber-600">
                                        Agen belum punya rekening. Lengkapi di
                                        menu Agen Sales.
                                    </p>
                                ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Jumlah (Rp)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData('amount', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.amount} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="paid_at">Tanggal</Label>
                                <Input
                                    id="paid_at"
                                    type="date"
                                    value={data.paid_at}
                                    onChange={(e) =>
                                        setData('paid_at', e.target.value)
                                    }
                                />
                                <InputError message={errors.paid_at} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="period">Periode</Label>
                                <Input
                                    id="period"
                                    value={data.period}
                                    onChange={(e) =>
                                        setData('period', e.target.value)
                                    }
                                    placeholder="Juni 2026"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Metode</Label>
                                <Select
                                    value={data.method}
                                    onValueChange={(v) => setData('method', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="transfer">
                                            Transfer Bank
                                        </SelectItem>
                                        <SelectItem value="cash">
                                            Tunai
                                        </SelectItem>
                                        <SelectItem value="ewallet">
                                            E-Wallet
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="reference">
                                    No. Referensi
                                </Label>
                                <Input
                                    id="reference"
                                    value={data.reference}
                                    onChange={(e) =>
                                        setData('reference', e.target.value)
                                    }
                                    placeholder="Opsional"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(v) => setData('status', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="paid">
                                            Dibayar
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            Pending
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Catatan</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
            </span>
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-xl font-bold">{value}</p>
            </div>
        </div>
    );
}

CommissionsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Komisi Agen', href: '/admin/commissions' },
    ],
};
