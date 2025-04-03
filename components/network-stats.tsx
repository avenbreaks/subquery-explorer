"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowUp, BarChart3, Clock, Database, Layers } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NetworkStats({ data }) {
  const [networkUtilization, setNetworkUtilization] = useState(52.76)
  const [dailyTxs, setDailyTxs] = useState(null)

  useEffect(() => {
    // Simulate changing network utilization
    const interval = setInterval(() => {
      setNetworkUtilization((prev) => {
        const change = (Math.random() - 0.5) * 5
        return Math.max(10, Math.min(90, prev + change))
      })
    }, 30000)

    // Simulate daily transactions data
    if (data && !data.isLoading && data.totalTransactions) {
      // Generate a random daily transaction count based on total
      const dailyEstimate = Math.floor(data.totalTransactions * (Math.random() * 0.01 + 0.001))
      setDailyTxs(dailyEstimate)
    }

    return () => clearInterval(interval)
  }, [data])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="col-span-1 md:col-span-3 bg-card/50 backdrop-blur-sm border-border overflow-hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="h-4 w-4" />
                <span>Total blocks</span>
              </div>
              {data.isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-2xl font-light">{data.totalBlocks.toLocaleString()}</div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Average block time</span>
              </div>
              {data.isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-light">{data.averageBlockTime.toFixed(1)}s</div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="h-4 w-4" />
                <span>Daily transactions</span>
              </div>
              {data.isLoading || !dailyTxs ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="flex items-end gap-3">
                  <div className="text-2xl font-light">{formatNumber(dailyTxs)}</div>
                  <div className="flex items-center text-xs text-green-500 mb-1">
                    <ArrowUp className="h-3 w-3 mr-0.5" />
                    2.4%
                  </div>
                  <TxChart />
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4" />
                <span>Network utilization: {networkUtilization.toFixed(2)}%</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatNumber(Math.floor(data.totalBlocks * 0.05))} txns/day
              </div>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${networkUtilization}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TxChart() {
  // Generate random data points for the mini chart
  const generatePoints = () => {
    const points = []
    for (let i = 0; i < 10; i++) {
      points.push(10 + Math.random() * 20)
    }
    return points
  }

  const points = generatePoints()
  const maxPoint = Math.max(...points)
  const minPoint = Math.min(...points)

  // Convert points to SVG path
  const pathData = points
    .map((point, i) => {
      const x = (i / (points.length - 1)) * 60
      const y = 20 - ((point - minPoint) / (maxPoint - minPoint)) * 20
      return `${i === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  return (
    <svg width="60" height="20" viewBox="0 0 60 20" className="text-blue-500">
      <path
        d={pathData}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function formatNumber(num) {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  } else {
    return num.toString()
  }
}

