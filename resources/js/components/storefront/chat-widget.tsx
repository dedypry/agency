import { Bot, MessageCircle, Send, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { CompanyProfile } from '@/types';

type ChatMessage = {
    role: 'user' | 'bot';
    text: string;
};

function readCookie(name: string): string | null {
    const match = document.cookie.match(
        new RegExp('(^|;\\s*)' + name + '=([^;]*)'),
    );
    return match ? decodeURIComponent(match[2]) : null;
}

export function ChatWidget({ company }: { company: CompanyProfile }) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'bot',
            text: `Halo! Saya asisten ${company.name}. Ada yang bisa saya bantu seputar produk atau layanan kami?`,
        },
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages, open, loading]);

    const send = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || loading) return;

        const history = messages.slice(-10);
        const next = [...messages, { role: 'user' as const, text }];
        setMessages(next);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': readCookie('XSRF-TOKEN') ?? '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ message: text, history }),
            });
            const payload = await res.json();
            setMessages((prev) => [
                ...prev,
                {
                    role: 'bot',
                    text:
                        payload.reply ??
                        'Maaf, terjadi kendala. Coba lagi ya.',
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'bot',
                    text: 'Maaf, koneksi bermasalah. Silakan coba lagi.',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const suggestions = [
        'Produk apa saja yang tersedia?',
        'Berapa kisaran harganya?',
        'Bagaimana cara memesan?',
    ];

    return (
        <>
            {/* Panel */}
            <div
                className={cn(
                    'fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-200 sm:right-6',
                    open
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-4 opacity-0',
                )}
                style={{ height: '28rem', maxHeight: 'calc(100vh - 8rem)' }}
            >
                <div className="flex items-center gap-3 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                        <Bot className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">Asisten {company.name}</p>
                        <p className="text-xs text-primary-foreground/80">
                            Biasanya membalas dalam beberapa detik
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="rounded-full p-1 hover:bg-white/20"
                        aria-label="Tutup chat"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div
                    ref={scrollRef}
                    className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4"
                >
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={cn(
                                'flex gap-2',
                                m.role === 'user' && 'flex-row-reverse',
                            )}
                        >
                            <span
                                className={cn(
                                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                                    m.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-secondary-foreground',
                                )}
                            >
                                {m.role === 'user' ? (
                                    <User className="h-4 w-4" />
                                ) : (
                                    <Bot className="h-4 w-4" />
                                )}
                            </span>
                            <div
                                className={cn(
                                    'max-w-[78%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm',
                                    m.role === 'user'
                                        ? 'rounded-tr-sm bg-primary text-primary-foreground'
                                        : 'rounded-tl-sm bg-card text-foreground shadow-sm',
                                )}
                            >
                                {m.text}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-2">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                <Bot className="h-4 w-4" />
                            </span>
                            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-card px-3 py-3 shadow-sm">
                                <Dot delay="0ms" />
                                <Dot delay="150ms" />
                                <Dot delay="300ms" />
                            </div>
                        </div>
                    )}

                    {messages.length <= 1 && !loading && (
                        <div className="space-y-2 pt-2">
                            {suggestions.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setInput(s)}
                                    className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <form
                    onSubmit={send}
                    className="flex items-center gap-2 border-t border-border bg-card p-3"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Tulis pertanyaan..."
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={loading || !input.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>

            {/* Toggle button */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105 sm:right-6"
                aria-label="Buka chat"
            >
                {open ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageCircle className="h-6 w-6" />
                )}
            </button>
        </>
    );
}

function Dot({ delay }: { delay: string }) {
    return (
        <span
            className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
            style={{ animationDelay: delay }}
        />
    );
}
