import { Link, router, usePage } from '@inertiajs/react';
import { Bell, CheckCheck, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'baru saja';
    if (mins < 60) return `${mins} mnt lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    return `${Math.floor(hours / 24)} hr lalu`;
}

export function NotificationBell() {
    const { notifications } = usePage().props;

    if (!notifications) {
        return null;
    }

    const { unread_count, items } = notifications;

    const markAllRead = () => {
        router.post(
            '/admin/notifications/read-all',
            {},
            { preserveScroll: true, preserveState: true },
        );
    };

    const openOrder = (id: string, orderId: number) => {
        router.post(
            `/admin/notifications/${id}/read`,
            {},
            {
                preserveScroll: true,
                onFinish: () =>
                    router.visit(`/admin/orders/${orderId}`),
            },
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Notifikasi"
                >
                    <Bell className="h-5 w-5" />
                    {unread_count > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                            {unread_count > 9 ? '9+' : unread_count}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                    <span className="text-sm font-semibold">Notifikasi</span>
                    {unread_count > 0 && (
                        <button
                            type="button"
                            onClick={markAllRead}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <CheckCheck className="h-3.5 w-3.5" /> Tandai semua
                        </button>
                    )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                    {items.length === 0 && (
                        <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                            Belum ada notifikasi.
                        </p>
                    )}
                    {items.map((n) => (
                        <button
                            type="button"
                            key={n.id}
                            onClick={() => openOrder(n.id, n.data.order_id)}
                            className={`flex w-full gap-3 border-b border-border/60 px-3 py-3 text-left transition-colors hover:bg-muted/60 ${
                                n.read_at ? 'opacity-60' : 'bg-primary/5'
                            }`}
                        >
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <ShoppingCart className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-medium">
                                    {n.data.message}
                                </span>
                                <span className="block truncate text-xs text-muted-foreground">
                                    {n.data.product_name}
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                    {timeAgo(n.created_at)}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>

                <div className="border-t border-border p-2">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="w-full"
                    >
                        <Link href="/admin/orders">Lihat semua pesanan</Link>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
