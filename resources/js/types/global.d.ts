import type { Auth } from '@/types/auth';
import type { NotificationBag } from '@/types/models';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            flash?: {
                success?: string | null;
                error?: string | null;
            };
            notifications?: NotificationBag | null;
            [key: string]: unknown;
        };
    }
}
