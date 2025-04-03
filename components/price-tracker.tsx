"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"

export default function PriceTracker() {
  const [price, setPrice] = useState(0.0123)
  const [change, setChange] = useState(0.75)
  const [isPositive, setIsPositive] = useState(true)

  useEffect(() => {
    // Simulate price changes
    const interval = setInterval(() => {
      // Random price change between -2% and +2%
      const priceChange = price * (Math.random() * 0.04 - 0.02)
      const newPrice = price + priceChange
      setPrice(newPrice)

      // Calculate percentage change
      const newChange = change + (Math.random() * 0.5 - 0.25)
      setChange(newChange)
      setIsPositive(newChange >= 0)
    }, 30000)

    return () => clearInterval(interval)
  }, [price, change])

  return (
    <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
      <span className="font-medium text-sm">ADR</span>
      <span className="text-sm">${price.toFixed(4)}</span>
      <span className={`flex items-center text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
        {Math.abs(change).toFixed(2)}%
      </span>
    </div>
  )
}

