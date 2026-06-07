import { Link } from '@inertiajs/react';
import { ImageIcon, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { assetUrl, formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';

const typeLabels: Record<string, string> = {
    property: 'Properti',
    service: 'Jasa',
    material: 'Material',
    product: 'Produk',
};

export function ProductCard({ product }: { product: Product }) {
    return (
        <Link
            href={`/products/${product.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {product.image ? (
                    <img
                        src={assetUrl(product.image)}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-10 w-10" />
                    </div>
                )}
                <Badge className="absolute left-3 top-3" variant="secondary">
                    {typeLabels[product.type] ?? product.type}
                </Badge>
            </div>

            <div className="flex flex-1 flex-col p-4">
                {product.category && (
                    <span className="text-xs font-medium text-primary">
                        {product.category.name}
                    </span>
                )}
                <h3 className="mt-1 line-clamp-2 font-semibold leading-snug group-hover:text-primary">
                    {product.name}
                </h3>
                {product.location && (
                    <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {product.location}
                    </span>
                )}
                {product.short_description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {product.short_description}
                    </p>
                )}

                <div className="mt-auto flex items-end justify-between pt-4">
                    <div>
                        <span className="text-lg font-bold text-foreground">
                            {formatCurrency(product.price)}
                        </span>
                        {product.unit && (
                            <span className="text-xs text-muted-foreground">
                                {' '}
                                {product.unit}
                            </span>
                        )}
                    </div>
                    {product.agent && (
                        <span className="text-right text-xs text-muted-foreground">
                            Agen
                            <br />
                            <span className="font-medium text-foreground">
                                {product.agent.name}
                            </span>
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
