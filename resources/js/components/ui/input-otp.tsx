import {
  InputOTP as HeroInputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@heroui/react"
import * as React from "react"

function InputOTP({
  disabled,
  ...props
}: React.ComponentProps<typeof HeroInputOTP> & { disabled?: boolean }) {
  return <HeroInputOTP isDisabled={disabled} {...props} />
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
