'use client'

import { motion, useInView, Variant } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface TimelineContentProps {
  children: React.ReactNode
  animationNum: number
  timelineRef: React.RefObject<HTMLElement | null>
  customVariants?: {
    hidden: Variant
    visible: Variant | ((i: number) => Variant)
  }
  className?: string
  as?: React.ElementType
}

export function TimelineContent({
  children,
  animationNum,
  timelineRef,
  customVariants,
  className,
  as: Component = "div",
}: TimelineContentProps) {
  const isInView = useInView(timelineRef, { once: true, margin: "-100px" })

  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  const variants = customVariants || defaultVariants

  return (
    <Component
      className={cn(className)}
    >
      <motion.div
        custom={animationNum}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={variants}
      >
        {children}
      </motion.div>
    </Component>
  )
}
