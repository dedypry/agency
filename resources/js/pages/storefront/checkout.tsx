import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ImageIcon, Loader2, ShoppingBag } from 'lucide-react';
import SiteLayout from '@/components/storefront/site-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { assetUrl, formatCurrency } from '@/lib/utils';
import type { CompanyProfile, Product } from '@/types';

export default function Checkout({
    product,
    company,
}: {
    product: Product;
    company: CompanyProfile;
}) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        quantity: 1,
        notes: '',
    });

    const unitPrice = Number(product.price);
    const total = unitPrice * (Number(data.quantity) || 0);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/checkout/${product.slug}`);
    };

    return (
        <SiteLayout company={company}>
            <Head title={`Checkout - ${product.name}`} />

            <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <Button asChild variant="ghost" size="sm" className="mb-6">
                    <Link href={`/products/${product.slug}`}>
                        <ArrowLeft className="mr-1 h-4 w-4" /> Kembali ke produk
                    </Link>
                </Button>

                <h1 className="text-2xl font-bold">Checkout Pesanan</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Lengkapi data Anda, tim kami akan segera menghubungi untuk
                    konfirmasi.
                </p>

                <form
                    onSubmit={submit}
                    className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]"
                >
                    {/* Form fields */}
                    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
                        <div className="grid gap-2">
                            <Label htmlFor="customer_name">Nama Lengkap</Label>
                            <Input
                                id="customer_name"
                                value={data.customer_name}
                                onChange={(e) =>
                                    setData('customer_name', e.target.value)
                                }
                                required
                            />
                            {errors.customer_name && (
                                <p className="text-sm text-destructive">
                                    {errors.customer_name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="customer_phone">
                                    No. WhatsApp / Telepon
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
                                    required
                                />
                                {errors.customer_phone && (
                                    <p className="text-sm text-destructive">
                                        {errors.customer_phone}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="customer_email">
                                    Email (opsional)
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
                                {errors.customer_email && (
                                    <p className="text-sm text-destructive">
                                        {errors.customer_email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="customer_address">
                                Alamat (opsional)
                            </Label>
                            <Textarea
                                id="customer_address"
                                value={data.customer_address}
                                onChange={(e) =>
                                    setData('customer_address', e.target.value)
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="quantity">Jumlah</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min={1}
                                value={data.quantity}
                                onChange={(e) =>
                                    setData(
                                        'quantity',
                                        Number(e.target.value),
                                    )
                                }
                                className="w-32"
                                required
                            />
                            {errors.quantity && (
                                <p className="text-sm text-destructive">
                                    {errors.quantity}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Catatan (opsional)</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                placeholder="Spesifikasi, waktu, dll."
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6">
                        <h2 className="font-semibold">Ringkasan Pesanan</h2>
                        <div className="flex gap-3">
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                                {product.image ? (
                                    <img
                                        src={assetUrl(product.image)}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                        <ImageIcon className="h-6 w-6" />
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate font-medium">
                                    {product.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {formatCurrency(product.price)}
                                    {product.unit && ` ${product.unit}`}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1 border-t border-border pt-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Harga satuan
                                </span>
                                <span>{formatCurrency(unitPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Jumlah
                                </span>
                                <span>{data.quantity}</span>
                            </div>
                            <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                                <span>Total</span>
                                <span className="text-primary">
                                    {formatCurrency(total)}
                                </span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing ? (
                                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            ) : (
                                <ShoppingBag className="mr-1 h-4 w-4" />
                            )}
                            Kirim Pesanan
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                            Dengan mengirim pesanan, Anda menyetujui untuk
                            dihubungi oleh tim {company.name}.
                        </p>
                    </div>
                </form>
            </div>
        </SiteLayout>
    );
}
