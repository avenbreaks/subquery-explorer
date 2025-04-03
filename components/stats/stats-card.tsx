"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatsCardProps {
  title: string
  value: string | number | null
  description: string
  icon: React.ReactNode
  isLoading: boolean
  showProgressCircle?: boolean
}

export function StatsCard({ title, value, description, icon, isLoading, showProgressCircle = false }: StatsCardProps) {
  const [progress, setProgress] = useState(0)
  const blockTimeInSeconds = 3 // 3 seconds per block

  useEffect(() => {
    if (!showProgressCircle) return

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 100 / blockTimeInSeconds
        return newProgress >= 100 ? 0 : newProgress
      })
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [showProgressCircle])

  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-card/50 border-border relative">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="bg-background/50 p-2 rounded-full border border-border relative z-10">
          {icon}
          {showProgressCircle && (
            <svg className="absolute inset-0 -m-1 h-[calc(100%+0.5rem)] w-[calc(100%+0.5rem)]" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="8" />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(59, 130, 246, 0.8)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progress) / 100}
                initial={{ rotate: -90 }}
                animate={{ rotate: -90 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </svg>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Skeleton key="skeleton" className="h-8 w-24 bg-muted/50" />
          ) : (
            <motion.div
              key={value?.toString()}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-light tracking-tight"
            >
              {value}
              {showProgressCircle && (
                <span className="text-sm text-blue-500 ml-2">
                  Next block in {Math.ceil(blockTimeInSeconds - (blockTimeInSeconds * progress) / 100)}s
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <CardDescription className="text-muted-foreground/70 mt-1 text-xs">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

