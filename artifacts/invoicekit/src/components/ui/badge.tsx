import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "whitespace-nowrap inline-flex items-center rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f77ff]",
  {
    variants: {
      variant: {
        default:
          "bg-[#f5f3ff] text-[#091135] border border-[#e1e9f0] px-3 py-1",
        secondary:
          "bg-[#e1e9f0]/60 text-[#36394a] border border-[#e1e9f0] px-3 py-1",
        outline:
          "text-[#091135] border border-[#e1e9f0] bg-transparent px-3 py-1",
        accent:
          "bg-[#f5f3ff] text-[#0f77ff] border border-[#0f77ff]/30 px-3 py-1 font-semibold",
        destructive:
          "bg-red-50 text-red-700 border border-red-200 px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
