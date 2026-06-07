import {
  DrawerBackdrop,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerDialog,
  DrawerFooter,
  DrawerHeader,
  DrawerHeading,
  DrawerRoot,
} from "@heroui/react"
import * as React from "react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SheetContextValue = {
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | null>(null)

type SheetProps = {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function Sheet({ children, open, defaultOpen = false, onOpenChange }: SheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isControlled = open !== undefined
  const currentOpen = isControlled ? open : internalOpen

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen)
      }

      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange],
  )

  return (
    <SheetContext.Provider value={{ setOpen }}>
      <DrawerRoot
        data-slot="sheet"
        isOpen={currentOpen}
        onOpenChange={setOpen}
      >
        {children}
      </DrawerRoot>
    </SheetContext.Provider>
  )
}

function useSheetContext() {
  const context = React.useContext(SheetContext)

  if (!context) {
    throw new Error("Sheet components must be used within <Sheet>")
  }

  return context
}

function SheetTrigger({
  asChild,
  children,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { setOpen } = useSheetContext()
  const triggerClassName = buttonVariants({
    variant: "ghost",
    size: "default",
    className,
  })

  if (
    asChild &&
    React.isValidElement<{
      className?: string
      children?: React.ReactNode
      onClick?: React.MouseEventHandler
      size?: "default" | "sm" | "lg" | "icon"
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    }>(children)
  ) {
    return React.cloneElement(children, {
      className: cn(
        buttonVariants({
          variant: children.props.variant ?? "ghost",
          size: children.props.size ?? "default",
          className: cn(children.props.className, className),
        }),
      ),
      onClick: (event: React.MouseEvent) => {
        props.onClick?.(event as React.MouseEvent<HTMLButtonElement>)
        children.props.onClick?.(event)
        if (!event.defaultPrevented) {
          setOpen(true)
        }
      },
    })
  }

  return (
    <button
      type="button"
      data-slot="sheet-trigger"
      className={triggerClassName}
      {...props}
      onClick={(event) => {
        props.onClick?.(event)
        if (!event.defaultPrevented) {
          setOpen(true)
        }
      }}
    >
      {children}
    </button>
  )
}

function SheetClose({
  asChild,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { setOpen } = useSheetContext()

  if (asChild && React.isValidElement<{ onClick?: React.MouseEventHandler }>(children)) {
    return React.cloneElement(children, {
      onClick: (event: React.MouseEvent) => {
        props.onClick?.(event as React.MouseEvent<HTMLButtonElement>)
        children.props.onClick?.(event)
        if (!event.defaultPrevented) {
          setOpen(false)
        }
      },
    })
  }

  return (
    <button
      type="button"
      data-slot="sheet-close"
      {...props}
      onClick={(event) => {
        props.onClick?.(event)
        if (!event.defaultPrevented) {
          setOpen(false)
        }
      }}
    >
      {children}
    </button>
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: Omit<React.ComponentProps<typeof DrawerDialog>, "children"> & {
  children?: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <DrawerBackdrop data-slot="sheet-overlay">
      <DrawerContent placement={side}>
        <DrawerDialog
          data-slot="sheet-content"
          className={cn("flex flex-col gap-4", className)}
          {...props}
        >
          {children}
          <DrawerCloseTrigger />
        </DrawerDialog>
      </DrawerContent>
    </DrawerBackdrop>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<typeof DrawerHeader>) {
  return (
    <DrawerHeader
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<typeof DrawerFooter>) {
  return (
    <DrawerFooter
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerHeading>) {
  return (
    <DrawerHeading
      data-slot="sheet-title"
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
