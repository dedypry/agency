import { Toast } from "@heroui/react"

import { useFlashToast } from "@/hooks/use-flash-toast"

function Toaster() {
  useFlashToast()

  return (
    <Toast.Provider
      placement="bottom end"
      maxVisibleToasts={4}
      width={420}
    />
  )
}

export { Toaster }
