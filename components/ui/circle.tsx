import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface CircleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Circle = forwardRef<HTMLDivElement, CircleProps>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Circle.displayName = "Circle"

