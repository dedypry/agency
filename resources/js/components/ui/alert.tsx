import {
  Alert as HeroAlert,
  AlertDescription as HeroAlertDescription,
  AlertTitle as HeroAlertTitle,
} from "@heroui/react"
import * as React from "react"

import { cn } from "@/lib/utils"

type AlertVariant = "default" | "destructive"

function Alert({
  className,
  children,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: AlertVariant }) {
  return (
    <HeroAlert
      data-slot="alert"
      role="alert"
      status={variant === "destructive" ? "danger" : "default"}
      className={cn(className)}
      {...props}
    >
      {children}
    </HeroAlert>
  )
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<typeof HeroAlertTitle>) {
  return (
    <HeroAlertTitle
      data-slot="alert-title"
      className={cn("font-medium tracking-tight", className)}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<typeof HeroAlertDescription>) {
  return (
    <HeroAlertDescription
      data-slot="alert-description"
      className={cn("text-sm", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
