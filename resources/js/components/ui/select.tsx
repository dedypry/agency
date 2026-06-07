import {
    ListBox,
    ListBoxItem,
    Select as HeroSelect,
    SelectIndicator,
    SelectPopover,
    SelectTrigger as HeroSelectTrigger,
    SelectValue as HeroSelectValue,
} from '@heroui/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface SelectProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    children?: React.ReactNode;
}

function Select({
    value,
    defaultValue,
    onValueChange,
    disabled,
    children,
}: SelectProps) {
    const controlled = value !== undefined;

    return (
        <HeroSelect
            data-slot="select"
            {...(controlled
                ? { selectedKey: value }
                : { defaultSelectedKey: defaultValue })}
            isDisabled={disabled}
            onSelectionChange={(key) =>
                onValueChange?.(key == null ? '' : String(key))
            }
        >
            {children}
        </HeroSelect>
    );
}

function SelectTrigger({
    className,
    children,
    disabled,
}: {
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
}) {
    return (
        <HeroSelectTrigger
            data-slot="select-trigger"
            isDisabled={disabled}
            className={cn('w-full', className)}
        >
            {children}
            <SelectIndicator />
        </HeroSelectTrigger>
    );
}

function SelectValue({
    placeholder,
    ...props
}: { placeholder?: React.ReactNode } & Omit<
    React.ComponentProps<typeof HeroSelectValue>,
    'children'
>) {
    return (
        <HeroSelectValue {...props}>
            {(renderProps: { isPlaceholder: boolean; selectedText: string }) =>
                renderProps.isPlaceholder
                    ? (placeholder ?? '')
                    : renderProps.selectedText
            }
        </HeroSelectValue>
    );
}

function SelectContent({
    className,
    children,
    ...props
}: React.ComponentProps<typeof SelectPopover>) {
    return (
        <SelectPopover
            data-slot="select-content"
            className={cn('min-w-(--trigger-width)', className)}
            {...props}
        >
            <ListBox>{children}</ListBox>
        </SelectPopover>
    );
}

function SelectItem({
    value,
    children,
    className,
}: {
    value: string;
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <ListBoxItem
            id={value}
            textValue={typeof children === 'string' ? children : value}
            className={cn(className)}
        >
            {children}
        </ListBoxItem>
    );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
