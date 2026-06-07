import { ImagePlus, UploadCloud, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type ImageDropzoneProps = {
    multiple?: boolean;
    files: File[];
    onChange: (files: File[]) => void;
    label?: string;
    hint?: string;
    className?: string;
};

export function ImageDropzone({
    multiple = false,
    files,
    onChange,
    label = 'Tarik & lepas gambar di sini',
    hint = 'atau klik untuk memilih file (PNG, JPG, WEBP)',
    className,
}: ImageDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const previews = useMemo(
        () =>
            files.map((file) => ({
                key: `${file.name}-${file.size}-${file.lastModified}`,
                url: URL.createObjectURL(file),
                file,
            })),
        [files],
    );

    useEffect(() => {
        return () => {
            previews.forEach((p) => URL.revokeObjectURL(p.url));
        };
    }, [previews]);

    const addFiles = (incoming: FileList | null) => {
        if (!incoming || incoming.length === 0) return;
        const accepted = Array.from(incoming).filter((f) =>
            f.type.startsWith('image/'),
        );
        if (accepted.length === 0) return;

        onChange(multiple ? [...files, ...accepted] : [accepted[0]]);
    };

    const removeAt = (index: number) => {
        onChange(files.filter((_, i) => i !== index));
    };

    return (
        <div className={cn('space-y-3', className)}>
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    addFiles(e.dataTransfer.files);
                }}
                className={cn(
                    'flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors',
                    dragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-muted/30 hover:border-primary/60 hover:bg-muted/50',
                )}
            >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UploadCloud className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">{hint}</span>
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                className="hidden"
                onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = '';
                }}
            />

            {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {previews.map((p, index) => (
                        <div
                            key={p.key}
                            className="group relative overflow-hidden rounded-lg border border-border"
                        >
                            <img
                                src={p.url}
                                alt={p.file.name}
                                className="h-24 w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeAt(index)}
                                className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-destructive opacity-0 shadow transition-opacity group-hover:opacity-100"
                                aria-label="Hapus gambar"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {previews.length === 0 && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ImagePlus className="h-3.5 w-3.5" /> Belum ada gambar
                    dipilih.
                </p>
            )}
        </div>
    );
}
