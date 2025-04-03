"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { fetchBlocks } from "@/lib/blockchain-service"

export default function BlockList({ isLoading, latestBlock, totalBlocks, onBlockSelect }) {
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && totalBlocks > 0) {
      loadBlocks()
    }
  }, [isLoading, totalBlocks, latestBlock])

  const loadBlocks = async () => {
    try {
      setLoading(true)
      const blocksData = await fetchBlocks(totalBlocks, 10)
      setBlocks(blocksData)
    } catch (error) {
      console.error("Error loading blocks:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <AnimatePresence mode="popLayout">
        {loading || isLoading
          ? Array(5)
              .fill(0)
              .map((_, i) => <Skeleton key={`skeleton-${i}`} className="h-24 w-full bg-muted/30 rounded-lg" />)
          : blocks.map((block, index) => (
              <motion.div
                key={block.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => onBlockSelect(block.number)}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border p-4 hover:bg-card/80 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-background/50 p-2 rounded-full border border-border flex items-center justify-center">
                        <img
                          src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040"
                          alt="Ethereum Logo"
                          className="h-5 w-5"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-light text-lg tracking-tight">Block #{block.number.toLocaleString()}</h3>
                          {index === 0 && (
                            <Badge variant="secondary" className="h-5 px-1.5">
                              <div className="flex items-center gap-1 text-xs">Latest</div>
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground/70 mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDistanceToNow(new Date(block.timestamp * 1000), { addSuffix: true })}</span>
                          </div>
                          <div>{block.transactions.length} transactions</div>
                          <div>Size: {(block.size || 0).toLocaleString()} bytes</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-medium">Reward 1 ADR</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                        Validator: {block.miner ? block.miner.substring(0, 10) + "..." : "Unknown"}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
      </AnimatePresence>
    </div>
  )
}

