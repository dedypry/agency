import {
  AvatarFallback as HeroAvatarFallback,
  AvatarImage as HeroAvatarImage,
  AvatarRoot as HeroAvatarRoot,
} from "@heroui/react"
import * as React from "react"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  children,
  ...props
}: React.ComponentProps<typeof HeroAvatarRoot>) {
  return (
    <HeroAvatarRoot
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </HeroAvatarRoot>
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof HeroAvatarImage>) {
  return (
    <HeroAvatarImage
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof HeroAvatarFallback>) {
  return (
    <HeroAvatarFallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
