"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { ArrowUpRight, CheckCircle, Clock, Coins, FileText, XCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { fetchTransactions } from "@/lib/blockchain-service"
import TransactionDetails from "@/components/transaction-details"

export default function TransactionList({ isLoading, latestBlock }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTx, setSelectedTx] = useState(null)

  useEffect(() => {
    if (!isLoading && latestBlock) {
      loadTransactions()
    }
  }, [isLoading, latestBlock])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const txData = await fetchTransactions(latestBlock)

      // Add random transaction types and status for demo
      const enhancedTxs = txData.map((tx) => ({
        ...tx,
        type: getRandomTxType(),
        status: Math.random() > 0.1 ? "success" : "failed",
        value: Math.random() * 10,
      }))

      setTransactions(enhancedTxs)
    } catch (error) {
      console.error("Error loading transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const truncateAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const getRandomTxType = () => {
    const types = ["transfer", "contract", "token", "swap", "mint", "burn"]
    return types[Math.floor(Math.random() * types.length)]
  }

  const getTxTypeIcon = (type) => {
    switch (type) {
      case "transfer":
        return <Coins className="h-4 w-4" />
      case "contract":
        return <FileText className="h-4 w-4" />
      case "token":
        return <ArrowUpRight className="h-4 w-4" />
      default:
        return <ArrowUpRight className="h-4 w-4" />
    }
  }

  const getTxTypeLabel = (type) => {
    switch (type) {
      case "transfer":
        return "Coin transfer"
      case "contract":
        return "Contract call"
      case "token":
        return "Token transfer"
      case "swap":
        return "Token swap"
      case "mint":
        return "Token mint"
      case "burn":
        return "Token burn"
      default:
        return "Transaction"
    }
  }

  const getTxTypeBadge = (type) => {
    switch (type) {
      case "transfer":
        return "transfer"
      case "contract":
        return "info"
      case "token":
        return "warning"
      case "swap":
        return "evm"
      case "mint":
        return "success"
      case "burn":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <AnimatePresence mode="popLayout">
        {loading || isLoading
          ? Array(5)
              .fill(0)
              .map((_, i) => <Skeleton key={`skeleton-${i}`} className="h-24 w-full bg-muted/30 rounded-lg" />)
          : transactions.map((tx, index) => (
              <motion.div
                key={tx.hash}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedTx(tx)}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border p-4 hover:bg-card/80 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-background/50 p-2 rounded-full border border-border">
                        {getTxTypeIcon(tx.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-light text-lg tracking-tight">{truncateAddress(tx.hash)}</h3>
                          <Badge variant={tx.status === "success" ? "success" : "failed"} className="h-5 px-1.5">
                            <div className="flex items-center gap-1 text-xs">
                              {tx.status === "success" ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {tx.status === "success" ? "Success" : "Failed"}
                            </div>
                          </Badge>
                          <Badge variant={getTxTypeBadge(tx.type)} className="h-5 px-1.5">
                            <div className="flex items-center gap-1 text-xs">
                              {getTxTypeIcon(tx.type)}
                              {getTxTypeLabel(tx.type)}
                            </div>
                          </Badge>
                          {tx.type === "transfer" && (
                            <Badge variant="transfer" className="h-5 px-1.5">
                              <div className="flex items-center gap-1 text-xs">
                                <ArrowUpRight className="h-3 w-3" />
                                Transfer
                              </div>
                            </Badge>
                          )}
                          {tx.type === "token" && (
                            <Badge variant="info" className="h-5 px-1.5">
                              <div className="flex items-center gap-1 text-xs">
                                <Coins className="h-3 w-3" />
                                Token
                              </div>
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground/70 mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDistanceToNow(new Date(tx.timestamp * 1000), { addSuffix: true })}</span>
                          </div>
                          <div>From: {truncateAddress(tx.from)}</div>
                          {tx.to && <div>To: {truncateAddress(tx.to)}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-medium">Value {tx.value.toFixed(5)} ADR</div>
                      <div className="text-xs text-muted-foreground">Fee {(tx.value * 0.001).toFixed(6)} ADR</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
      </AnimatePresence>

      {selectedTx && <TransactionDetails tx={selectedTx} onClose={() => setSelectedTx(null)} />}
    </div>
  )
}

