import { buttonVariants as heroButtonVariants } from '@heroui/react';
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
    children,
    ...props
}: React.ComponentProps<'button'> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    asChild?: boolean;
}) {
    const buttonClassName = buttonVariants({ variant, size, className });

    if (asChild && React.isValidElement<{ className?: string }>(children)) {
        return React.cloneElement(children, {
            ...props,
            className: cn(buttonClassName, children.props.className),
        });
    }

    return (
        <button
            data-slot="button"
            className={buttonClassName}
            {...props}
        >
            {children}
        </button>
    );
}

export { Button, buttonVariants };
