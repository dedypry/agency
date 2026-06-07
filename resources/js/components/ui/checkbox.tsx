import { Checkbox as HeroCheckbox } from "@heroui/react"
import * as React from "react"

import { cn } from "@/lib/utils"

type CheckedState = boolean | "indeterminate"

function Checkbox({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  tabIndex: _tabIndex,
  ...props
}: Omit<React.ComponentProps<typeof HeroCheckbox>, "onChange" | "isSelected" | "defaultSelected" | "isDisabled"> & {
  checked?: CheckedState
  defaultChecked?: CheckedState
  onCheckedChange?: (checked: CheckedState) => void
  disabled?: boolean
  tabIndex?: number
}) {
  return (
    <HeroCheckbox
      data-slot="checkbox"
      isSelected={checked === "indeterminate" ? undefined : checked}
      defaultSelected={
        defaultChecked === "indeterminate" ? undefined : defaultChecked
      }
      isIndeterminate={checked === "indeterminate"}
      isDisabled={disabled}
      onChange={(isSelected) => onCheckedChange?.(isSelected)}
      className={cn("peer", className)}
      {...props}
    >
      <HeroCheckbox.Control>
        <HeroCheckbox.Indicator />
      </HeroCheckbox.Control>
    </HeroCheckbox>
  )
}

export { Checkbox }
