import { Input as HeroInput } from "@heroui/react"
import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <HeroInput
      type={type}
      data-slot="input"
      fullWidth
      className={cn("min-w-0", className)}
      {...props}
    />
  )
}

export { Input }
