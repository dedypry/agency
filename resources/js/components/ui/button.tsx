import { buttonVariants as heroButtonVariants } from '@heroui/react';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant =
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';

type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const variantMap = {
    default: 'primary',
    destructive: 'danger',
    outline: 'outline',
    secondary: 'secondary',
    ghost: 'ghost',
    link: 'tertiary',
} as const;

const sizeMap = {
    default: 'md',
    sm: 'sm',
    lg: 'lg',
    icon: 'md',
} as const;

function buttonVariants({
    variant = 'default',
    size = 'default',
    className,
}: {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
} = {}) {
    return cn(
        heroButtonVariants({
            variant: variantMap[variant],
            size: sizeMap[size],
            isIconOnly: size === 'icon',
        }),
        variant === 'link' &&
            'h-auto rounded-none bg-transparent px-1 underline-offset-4 hover:underline',
        className,
    );
}

function Button({
    className,
    variant = 'default',
    size = 'default',
    asChild = false,
    ...props
}: React.ComponentProps<'button'> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    asChild?: boolean;
}) {
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp
            data-slot="button"
            className={buttonVariants({ variant, size, className })}
            {...props}
        />
    );
}

export { Button, buttonVariants };
