import {
  DropdownPopover,
  DropdownRoot,
  DropdownTrigger,
  Separator,
} from "@heroui/react"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import * as React from "react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DropdownMenuProps = React.ComponentProps<typeof DropdownRoot>

function DropdownMenu({ ...props }: DropdownMenuProps) {
  return <DropdownRoot data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuTrigger({
  asChild,
  children,
  className,
  ...props
}: React.ComponentProps<typeof DropdownTrigger> & { asChild?: boolean }) {
  if (
    asChild &&
    React.isValidElement<{
      "aria-label"?: string
      className?: string
      children?: React.ReactNode
      disabled?: boolean
      size?: "default" | "sm" | "lg" | "icon"
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
      "data-test"?: string
    }>(children)
  ) {
    const isSidebarTrigger = children.props["data-test"] === "sidebar-menu-button"
    const triggerClassName = isSidebarTrigger
      ? cn(
          "flex h-12 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
          children.props.className,
          className,
        )
      : buttonVariants({
          variant: children.props.variant ?? "ghost",
          size: children.props.size ?? "default",
          className: cn(children.props.className, className),
        })

    return (
      <DropdownTrigger
        data-slot="dropdown-menu-trigger"
        aria-label={children.props["aria-label"]}
        isDisabled={children.props.disabled}
        className={triggerClassName}
        {...props}
      >
        {children.props.children}
      </DropdownTrigger>
    )
  }

  return (
    <DropdownTrigger
      data-slot="dropdown-menu-trigger"
      className={className}
      {...props}
    >
      {children}
    </DropdownTrigger>
  )
}

type DropdownPlacementSide = "top" | "right" | "bottom" | "left"
type DropdownPlacementAlign = "start" | "center" | "end"

function toPlacement(
  side: DropdownPlacementSide = "bottom",
  align: DropdownPlacementAlign = "center",
) {
  return align === "center" ? side : `${side} ${align}`
}

function DropdownMenuContent({
  className,
  side = "bottom",
  align = "center",
  sideOffset: _sideOffset = 4,
  children,
  ...props
}: Omit<React.ComponentProps<typeof DropdownPopover>, "placement"> & {
  side?: DropdownPlacementSide
  align?: DropdownPlacementAlign
  sideOffset?: number
}) {
  return (
    <DropdownPopover
      data-slot="dropdown-menu-content"
      placement={toPlacement(side, align) as React.ComponentProps<typeof DropdownPopover>["placement"]}
      className={cn("min-w-32 overflow-hidden p-1", className)}
      {...props}
    >
      {children}
    </DropdownPopover>
  )
}

function DropdownMenuGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-group"
      className={cn("py-1", className)}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  asChild,
  children,
  disabled,
  onSelect,
  onClick,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
  inset?: boolean
  variant?: "default" | "destructive"
  disabled?: boolean
  onSelect?: (event: Event) => void
}) {
  const itemClassName = cn(
    "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-default-hover focus:bg-default-hover data-[inset=true]:pl-8 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    variant === "destructive" && "text-danger hover:bg-danger-soft",
    disabled && "pointer-events-none opacity-50",
    className,
  )

  if (asChild && React.isValidElement<{ className?: string; onClick?: React.MouseEventHandler }>(children)) {
    return React.cloneElement(children, {
      className: cn(itemClassName, children.props.className),
      onClick: (event: React.MouseEvent) => {
        onClick?.(event as React.MouseEvent<HTMLDivElement>)
        children.props.onClick?.(event)
        if (!event.defaultPrevented) {
          onSelect?.(event.nativeEvent)
        }
      },
    })
  }

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? undefined : 0}
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      aria-disabled={disabled}
      className={itemClassName}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          onSelect?.(event.nativeEvent)
        }
      }}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem> & { checked?: boolean }) {
  return (
    <DropdownMenuItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn("pl-8", className)}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {checked && <CheckIcon className="size-4" />}
      </span>
      {children}
    </DropdownMenuItem>
  )
}

function DropdownMenuRadioGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-radio-group"
      className={cn("py-1", className)}
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem> & { checked?: boolean }) {
  return (
    <DropdownMenuItem
      data-slot="dropdown-menu-radio-item"
      className={cn("pl-8", className)}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {checked && <CircleIcon className="size-2 fill-current" />}
      </span>
      {children}
    </DropdownMenuItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn("px-2 py-1.5 text-sm font-medium data-[inset=true]:pl-8", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  )
}

function DropdownMenuSub({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem> & { inset?: boolean }) {
  return (
    <DropdownMenuItem
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={className}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuItem>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={className}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
