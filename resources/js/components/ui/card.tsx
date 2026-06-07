import {
  Card as HeroCard,
  CardContent as HeroCardContent,
  CardDescription as HeroCardDescription,
  CardFooter as HeroCardFooter,
  CardHeader as HeroCardHeader,
  CardTitle as HeroCardTitle,
} from "@heroui/react"
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <HeroCard
      data-slot="card"
      className={cn("flex flex-col gap-6 py-6", className)}
      {...props}
    >
      {children}
    </HeroCard>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <HeroCardHeader
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-6", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <HeroCardTitle
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <HeroCardDescription
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <HeroCardContent
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <HeroCardFooter
      data-slot="card-footer"
      className={cn("flex items-center px-6", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
