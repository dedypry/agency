import { router } from '@inertiajs/react';
import { toast } from '@heroui/react';
import { useEffect } from 'react';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            if (!data) {
                return;
            }

            if (data.type === 'error') {
                toast.danger(data.message);
                return;
            }

            toast[data.type](data.message);
        });
    }, []);
}
