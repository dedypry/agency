import { Chip } from '@heroui/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

function Badge({
    className,
    variant = 'default',
    color: _ignoredColor,
    children,
    ...props
}: React.ComponentProps<'span'> & { variant?: BadgeVariant }) {
    const color =
        variant === 'destructive'
            ? 'danger'
            : variant === 'default'
              ? 'accent'
              : 'default';
    const chipVariant =
        variant === 'secondary' || variant === 'outline' ? 'soft' : undefined;

    return (
        <Chip
            data-slot="badge"
            size="sm"
            color={color}
            variant={chipVariant}
            className={cn('rounded-md', className)}
            {...props}
        >
            {children}
        </Chip>
    );
}

export { Badge };
