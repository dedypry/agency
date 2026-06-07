import {
  DisclosureContent,
  DisclosureRoot,
  DisclosureTrigger,
} from "@heroui/react"
import * as React from "react"

type CollapsibleProps = Omit<
  React.ComponentProps<typeof DisclosureRoot>,
  "isExpanded" | "defaultExpanded" | "onExpandedChange"
> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function Collapsible({
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: CollapsibleProps) {
  return (
    <DisclosureRoot
      data-slot="collapsible"
      isExpanded={open}
      defaultExpanded={defaultOpen}
      onExpandedChange={onOpenChange}
      {...props}
    />
  )
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof DisclosureTrigger>) {
  return <DisclosureTrigger data-slot="collapsible-trigger" {...props} />
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof DisclosureContent>) {
  return <DisclosureContent data-slot="collapsible-content" {...props} />
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
