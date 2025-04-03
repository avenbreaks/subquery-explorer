"use client"

import { motion } from "framer-motion"
import { CheckCircle, ChevronDown, Clock, Copy, ExternalLink, FileText, X, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default function TransactionDetails({ tx, onClose }) {
  const truncateAddress = (address) => {
    return `${address.substring(0, 10)}...${address.substring(address.length - 8)}`
  }

  const getTxTypeIcon = (type) => {
    switch (type) {
      case "transfer":
        return <FileText className="h-4 w-4" />
      case "contract":
        return <FileText className="h-4 w-4" />
      case "token":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
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
      default:
        return "Transaction"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background z-10 flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            {getTxTypeIcon(tx.type)}
            <h2 className="text-xl font-medium">{getTxTypeLabel(tx.type)}</h2>
            <Badge variant={tx.status === "success" ? "success" : "failed"} className="h-5 px-1.5">
              <div className="flex items-center gap-1 text-xs">
                {tx.status === "success" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {tx.status === "success" ? "Success" : "Failed"}
              </div>
            </Badge>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between py-4 border-b">
            <div className="flex items-center gap-2">
              <img
                src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040"
                alt="Ethereum Logo"
                className="h-6 w-6"
              />
              <span className="font-medium">Ethereum</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(tx.timestamp * 1000), { addSuffix: true })}</span>
            </div>
          </div>

          <div className="py-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <img
                  src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040"
                  alt="Ethereum Logo"
                  className="h-6 w-6"
                />
                <div>
                  <div className="text-sm text-muted-foreground">From</div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono">{truncateAddress(tx.from)}</span>
                    <button className="text-muted-foreground hover:text-foreground">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-foreground">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040"
                  alt="Ethereum Logo"
                  className="h-6 w-6"
                />
                <div>
                  <div className="text-sm text-muted-foreground">To</div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono">{truncateAddress(tx.to || tx.from)}</span>
                    <button className="text-muted-foreground hover:text-foreground">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-foreground">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-4 border-b">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Transfer</span>
              <span className="font-medium">{tx.value.toFixed(8)} ETH</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Fee</span>
              <span className="font-medium">{(tx.value * 0.001).toFixed(8)} ETH</span>
            </div>
          </div>

          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Token Transfers</h3>
              <button className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>View all</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040"
                  alt="Ethereum Logo"
                  className="h-6 w-6"
                />
                <div>
                  <div className="font-medium">
                    0.
                    {Math.floor(Math.random() * 10000)
                      .toString()
                      .padStart(4, "0")}{" "}
                    ETH
                  </div>
                  <div className="text-sm text-muted-foreground">
                    From {truncateAddress(tx.from)} to {truncateAddress(tx.to || tx.from)}
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">${(tx.value * 1800).toFixed(2)}</div>
            </div>
          </div>

          <div className="py-4 border-t">
            <h3 className="font-medium mb-4">Details</h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-muted-foreground">Block</td>
                  <td className="py-2 text-right font-mono">{Math.floor(Math.random() * 1000000 + 22000000)}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-muted-foreground">Block Confirmations</td>
                  <td className="py-2 text-right">29</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-muted-foreground">ETH Price</td>
                  <td className="py-2 text-right">$1,830.90 / ETH</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-muted-foreground">Gas Used</td>
                  <td className="py-2 text-right">21,000 wei</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-muted-foreground">Gas Price</td>
                  <td className="py-2 text-right">374476812 gwei</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-muted-foreground">Txn Type</td>
                  <td className="py-2 text-right">EIP-1559</td>
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground">Nonce</td>
                  <td className="py-2 text-right">2236364</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

