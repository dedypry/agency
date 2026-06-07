import {
  TooltipArrow,
  TooltipContent as HeroTooltipContent,
  TooltipRoot,
  TooltipTrigger as HeroTooltipTrigger,
} from "@heroui/react"
import * as React from "react"

import { cn } from "@/lib/utils"

function TooltipProvider({
  children,
  ...props
}: { children?: React.ReactNode; delayDuration?: number }) {
  void props

  return <>{children}</>
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipRoot>) {
  return <TooltipRoot data-slot="tooltip" {...props} />
}

function TooltipTrigger({
  asChild: _asChild,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  return (
    <HeroTooltipTrigger
      data-slot="tooltip-trigger"
      className={className}
      {...props}
    >
      {children}
    </HeroTooltipTrigger>
  )
}

function TooltipContent({
  className,
  sideOffset = 4,
  side,
  align: _align,
  children,
  ...props
}: Omit<React.ComponentProps<typeof HeroTooltipContent>, "offset"> & {
  sideOffset?: number
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
}) {
  return (
    <HeroTooltipContent
      data-slot="tooltip-content"
      offset={sideOffset}
      placement={side}
      showArrow
      className={cn("max-w-sm text-xs", className)}
      {...props}
    >
      {children}
      <TooltipArrow />
    </HeroTooltipContent>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
