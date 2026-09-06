import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f77ff] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#127ee3] text-white border border-[#127ee3] hover:bg-[#0f77ff] shadow-none active:scale-[0.99]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-none",
        outline:
          "border border-[#e1e9f0] bg-transparent text-[#091135] hover:bg-[#f5f3ff] hover:border-[#b1bbcd] shadow-none",
        secondary:
          "bg-[#f5f3ff] text-[#091135] border border-[#e1e9f0] hover:bg-[#e1e9f0]/60 shadow-none",
        ghost:
          "bg-transparent text-[#091135] hover:bg-[#f5f3ff] border border-transparent shadow-none",
        link:
          "text-[#127ee3] underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "min-h-10 px-5 py-2.5 text-sm",
        sm: "min-h-8 rounded-lg px-3 text-xs",
        lg: "min-h-12 rounded-lg px-6 text-base",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
