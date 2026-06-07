import {
  ModalBackdrop,
  ModalCloseTrigger,
  ModalContainer,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  ModalRoot,
} from "@heroui/react"
import * as React from "react"

import { cn } from "@/lib/utils"

type DialogContextValue = {
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

type DialogProps = {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function Dialog({ children, open, defaultOpen = false, onOpenChange }: DialogProps) {
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
    <DialogContext.Provider value={{ setOpen }}>
      <ModalRoot
        data-slot="dialog"
        isOpen={currentOpen}
        onOpenChange={setOpen}
      >
        {children}
      </ModalRoot>
    </DialogContext.Provider>
  )
}

function useDialogContext() {
  const context = React.useContext(DialogContext)

  if (!context) {
    throw new Error("Dialog components must be used within <Dialog>")
  }

  return context
}

function DialogTrigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { setOpen } = useDialogContext()

  if (asChild && React.isValidElement<{ onClick?: React.MouseEventHandler }>(children)) {
    return React.cloneElement(children, {
      onClick: (event: React.MouseEvent) => {
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
      data-slot="dialog-trigger"
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

function DialogClose({
  asChild,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { setOpen } = useDialogContext()

  if (asChild && React.isValidElement<{ onClick?: React.MouseEventHandler }>(children)) {
    return React.cloneElement(children, {
      onClick: (event: React.MouseEvent) => {
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
      data-slot="dialog-close"
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

function DialogPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof ModalBackdrop>) {
  return (
    <ModalBackdrop
      data-slot="dialog-overlay"
      className={className}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof ModalDialog>, "children"> & {
  children?: React.ReactNode
}) {
  return (
    <DialogOverlay data-slot="dialog-portal">
      <ModalContainer placement="center">
        <ModalDialog
          data-slot="dialog-content"
          className={cn(
            "grid w-full max-w-[calc(100%-2rem)] gap-4 p-6 sm:max-w-lg",
            className
          )}
          {...props}
        >
          {children}
          <ModalCloseTrigger />
        </ModalDialog>
      </ModalContainer>
    </DialogOverlay>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof ModalHeading>) {
  return (
    <ModalHeading
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
