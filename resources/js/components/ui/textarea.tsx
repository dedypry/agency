import { TextArea as HeroTextArea } from '@heroui/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
    return (
        <HeroTextArea
            data-slot="textarea"
            fullWidth
            className={cn('min-h-20', className)}
            {...props}
        />
    );
}

export { Textarea };
