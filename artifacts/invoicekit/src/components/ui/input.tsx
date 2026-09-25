import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#e1e9f0] bg-white px-3.5 py-2 text-sm text-[#091135] shadow-none transition-all placeholder:text-[#36394a]/60 focus-visible:outline-none focus-visible:border-[#0f77ff] focus-visible:ring-1 focus-visible:ring-[#0f77ff] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
