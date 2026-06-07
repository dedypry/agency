import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { formatCurrency } from '@/lib/utils';
import type { Agent, Invoice, InvoiceItem, Product } from '@/types';

const NONE = 'none';

type ItemRow = {
    product_id: string;
    description: string;
    quantity: string;
    unit_price: string;
};

const emptyItem: ItemRow = {
    product_id: NONE,
    description: '',
    quantity: '1',
    unit_price: '0',
};

function toRow(item: InvoiceItem): ItemRow {
    return {
        product_id: item.product_id ? String(item.product_id) : NONE,
        description: item.description,
        quantity: String(item.quantity),
        unit_price: String(item.unit_price),
    };
}

export default function InvoiceForm({
    invoice,
    number,
    agents,
    products,
}: {
    invoice: Invoice | null;
    number: string;
    agents: Agent[];
    products: Pick<Product, 'id' | 'name' | 'price' | 'unit'>[];
}) {
    const { data, setData, transform, post, put, processing, errors } = useForm<{
        number: string;
        agent_id: string;
        customer_name: string;
        customer_email: string;
        customer_phone: string;
        customer_address: string;
        issue_date: string;
        due_date: string;
        status: string;
        discount: string;
        tax_percent: string;
        notes: string;
        items: ItemRow[];
    }>({
        number,
        agent_id: invoice?.agent_id ? String(invoice.agent_id) : NONE,
        customer_name: invoice?.customer_name ?? '',
        customer_email: invoice?.customer_email ?? '',
        customer_phone: invoice?.customer_phone ?? '',
        customer_address: invoice?.customer_address ?? '',
        issue_date:
            invoice?.issue_date?.slice(0, 10) ??
            new Date().toISOString().slice(0, 10),
        due_date: invoice?.due_date?.slice(0, 10) ?? '',
        status: invoice?.status ?? 'unpaid',
        discount: invoice ? String(invoice.discount) : '0',
        tax_percent: invoice ? String(invoice.tax_percent) : '0',
        notes: invoice?.notes ?? '',
        items: invoice?.items?.length
            ? invoice.items.map(toRow)
            : [{ ...emptyItem }],
    });

    const updateItem = (index: number, patch: Partial<ItemRow>) => {
        setData(
            'items',
            data.items.map((item, i) =>
                i === index ? { ...item, ...patch } : item,
            ),
        );
    };

    const onSelectProduct = (index: number, value: string) => {
        if (value === NONE) {
            updateItem(index, { product_id: NONE });
            return;
        }
        const product = products.find((p) => String(p.id) === value);
        updateItem(index, {
            product_id: value,
            description: product?.name ?? '',
            unit_price: product ? String(product.price) : '0',
        });
    };

    const addItem = () => setData('items', [...data.items, { ...emptyItem }]);

    const removeItem = (index: number) =>
        setData(
            'items',
            data.items.filter((_, i) => i !== index),
        );

    const subtotal = data.items.reduce(
        (sum, item) =>
            sum +
            (parseFloat(item.quantity) || 0) *
                (parseFloat(item.unit_price) || 0),
        0,
    );
    const discount = parseFloat(data.discount) || 0;
    const taxPercent = parseFloat(data.tax_percent) || 0;
    const taxable = Math.max(subtotal - discount, 0);
    const taxAmount = (taxable * taxPercent) / 100;
    const total = taxable + taxAmount;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((payload) => ({
                ...payload,
                agent_id: payload.agent_id === NONE ? '' : payload.agent_id,
                items: payload.items.map((item) => ({
                    ...item,
                    product_id:
                        item.product_id === NONE ? '' : item.product_id,
                })),
            }),
        );

        if (invoice) {
            put(`/admin/invoices/${invoice.id}`);
        } else {
            post('/admin/invoices');
        }
    };

    return (
        <>
            <Head title={invoice ? 'Edit Invoice' : 'Buat Invoice'} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <Button asChild variant="ghost" size="sm" className="w-fit">
                    <Link href="/admin/invoices">
                        <ArrowLeft className="mr-1 h-4 w-4" /> Kembali
                    </Link>
                </Button>
                <Heading
                    title={invoice ? `Edit ${invoice.number}` : 'Buat Invoice'}
                    description="Isi data pelanggan dan rincian item."
                />

                <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pelanggan</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="customer_name">
                                        Nama Pelanggan
                                    </Label>
                                    <Input
                                        id="customer_name"
                                        value={data.customer_name}
                                        onChange={(e) =>
                                            setData(
                                                'customer_name',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.customer_name}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="customer_phone">
                                        Telepon
                                    </Label>
                                    <Input
                                        id="customer_phone"
                                        value={data.customer_phone}
                                        onChange={(e) =>
                                            setData(
                                                'customer_phone',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="customer_email">
                                        Email
                                    </Label>
                                    <Input
                                        id="customer_email"
                                        type="email"
                                        value={data.customer_email}
                                        onChange={(e) =>
                                            setData(
                                                'customer_email',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Agen Sales</Label>
                                    <Select
                                        value={data.agent_id}
                                        onValueChange={(v) =>
                                            setData('agent_id', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih agen" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>
                                                Tanpa agen
                                            </SelectItem>
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
                                </div>
                                <div className="grid gap-2 sm:col-span-2">
                                    <Label htmlFor="customer_address">
                                        Alamat
                                    </Label>
                                    <Textarea
                                        id="customer_address"
                                        value={data.customer_address}
                                        onChange={(e) =>
                                            setData(
                                                'customer_address',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Item</CardTitle>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={addItem}
                                >
                                    <Plus className="mr-1 h-4 w-4" /> Tambah Item
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-12"
                                    >
                                        <div className="grid gap-1 sm:col-span-12">
                                            <Label className="text-xs">
                                                Produk (opsional)
                                            </Label>
                                            <Select
                                                value={item.product_id}
                                                onValueChange={(v) =>
                                                    onSelectProduct(index, v)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih produk" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={NONE}>
                                                        Item manual
                                                    </SelectItem>
                                                    {products.map((p) => (
                                                        <SelectItem
                                                            key={p.id}
                                                            value={String(
                                                                p.id,
                                                            )}
                                                        >
                                                            {p.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-1 sm:col-span-6">
                                            <Label className="text-xs">
                                                Deskripsi
                                            </Label>
                                            <Input
                                                value={item.description}
                                                onChange={(e) =>
                                                    updateItem(index, {
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-1 sm:col-span-2">
                                            <Label className="text-xs">
                                                Qty
                                            </Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateItem(index, {
                                                        quantity:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-1 sm:col-span-3">
                                            <Label className="text-xs">
                                                Harga
                                            </Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={item.unit_price}
                                                onChange={(e) =>
                                                    updateItem(index, {
                                                        unit_price:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="flex items-end sm:col-span-1">
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    removeItem(index)
                                                }
                                                disabled={
                                                    data.items.length === 1
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                        <div className="text-right text-sm text-muted-foreground sm:col-span-12">
                                            Subtotal:{' '}
                                            {formatCurrency(
                                                (parseFloat(item.quantity) ||
                                                    0) *
                                                    (parseFloat(
                                                        item.unit_price,
                                                    ) || 0),
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <InputError message={errors.items} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="number">No. Invoice</Label>
                                    <Input
                                        id="number"
                                        value={data.number}
                                        onChange={(e) =>
                                            setData('number', e.target.value)
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="issue_date">
                                            Tgl Terbit
                                        </Label>
                                        <Input
                                            id="issue_date"
                                            type="date"
                                            value={data.issue_date}
                                            onChange={(e) =>
                                                setData(
                                                    'issue_date',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="due_date">
                                            Jatuh Tempo
                                        </Label>
                                        <Input
                                            id="due_date"
                                            type="date"
                                            value={data.due_date}
                                            onChange={(e) =>
                                                setData(
                                                    'due_date',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(v) =>
                                            setData('status', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unpaid">
                                                Belum Dibayar
                                            </SelectItem>
                                            <SelectItem value="paid">
                                                Lunas
                                            </SelectItem>
                                            <SelectItem value="cancelled">
                                                Dibatalkan
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="discount">Diskon</Label>
                                        <Input
                                            id="discount"
                                            type="number"
                                            step="0.01"
                                            value={data.discount}
                                            onChange={(e) =>
                                                setData(
                                                    'discount',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="tax_percent">
                                            Pajak (%)
                                        </Label>
                                        <Input
                                            id="tax_percent"
                                            type="number"
                                            step="0.01"
                                            value={data.tax_percent}
                                            onChange={(e) =>
                                                setData(
                                                    'tax_percent',
                                                    e.target.value,
                                                )
                                            }
                                        />
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
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="space-y-2 pt-6 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Diskon
                                    </span>
                                    <span>- {formatCurrency(discount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Pajak ({taxPercent}%)
                                    </span>
                                    <span>{formatCurrency(taxAmount)}</span>
                                </div>
                                <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                                <Button
                                    type="submit"
                                    className="mt-2 w-full"
                                    disabled={processing}
                                >
                                    Simpan Invoice
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </>
    );
}

InvoiceForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Invoice', href: '/admin/invoices' },
    ],
};
