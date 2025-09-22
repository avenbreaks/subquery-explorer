"use client"

import { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Server } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { Circle } from "@/components/ui/circle"

interface ValidatorsCardProps {
  isLoading: boolean
}

export function ValidatorsCard({ isLoading }: ValidatorsCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const ethereumRef = useRef<HTMLDivElement>(null)
  const solanaRef = useRef<HTMLDivElement>(null)

  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-card/50 border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Validators</CardTitle>
        <div className="bg-background/50 p-2 rounded-full border border-border">
          <Server className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Skeleton key="skeleton" className="h-8 w-24 bg-muted/50" />
          ) : (
            <motion.div
              key="validators"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-light tracking-tight"
            >
              21
            </motion.div>
          )}
        </AnimatePresence>
        <CardDescription className="text-muted-foreground/70 mt-1 text-xs mb-4">Active validators</CardDescription>

        <div className="relative flex w-full items-center justify-center overflow-hidden py-2" ref={containerRef}>
          <div className="flex w-full flex-col items-stretch justify-between gap-4">
            <div className="flex flex-row justify-between">
              <Circle ref={ethereumRef}>
                <img
                  src="/images/genetic.svg"
                  alt="Ethereum Logo"
                  className="h-full w-full"
                />
              </Circle>
              <Circle ref={solanaRef}>
                <img
                  src="/images/genetic-engine.svg"
                  alt="Solana Logo"
                  className="h-full w-full"
                />
              </Circle>
            </div>
          </div>

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={ethereumRef}
            toRef={solanaRef}
            startYOffset={10}
            endYOffset={10}
            curvature={-20}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={ethereumRef}
            toRef={solanaRef}
            startYOffset={-10}
            endYOffset={-10}
            curvature={20}
            reverse
          />
        </div>
      </CardContent>
    </Card>
  )
}

