"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { X } from 'lucide-react'
import { format } from "date-fns"
import { fetchBlockByNumber } from "@/lib/blockchain-service"

export default function BlockDetails({ blockNumber, onClose }) {
  const [blockData, setBlockData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Format gas price
  const formatGasPrice = (gasPrice) => {
    if (!gasPrice) return "0 Gwei";
    
    // Convert to Gwei (1 Gwei = 10^9 Wei)
    const gweiValue = gasPrice / 1e9;
    
    // Format based on the value
    if (gweiValue < 0.01) {
      return `${(gweiValue * 1000).toFixed(2)} MGwei`;
    } else if (gweiValue >= 1000) {
      return `${(gweiValue / 1000).toFixed(2)} KGwei`;
    } else {
      return `${gweiValue.toFixed(2)} Gwei`;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchBlockByNumber(blockNumber, true);
        
        // Also fetch gas price for this block if needed
        // const gasPrice = await fetchGasPrice();
        
        setBlockData({
          ...data,
          // gasPrice
        });
      } catch (error) {
        console.error("Error fetching block details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [blockNumber]);

  // Format timestamp to date string
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp * 1000)
    return format(date, "yyyy-MM-dd HH:mm:ss 'UTC+7'")
  }

  // Format bytes with unit
  const formatBytes = (bytes) => {
    return `${bytes} bytes`
  }

  // Format gas percentage
  const formatGasPercentage = (used, limit) => {
    if (!used || !limit) return "0 (0%)"
    const percentage = (used / limit) * 100
    return `${used.toLocaleString()} (${percentage.toFixed(2)}%)`
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
          <h2 className="text-xl font-medium">Block Info</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          </div>
        ) : blockData ? (
          <div className="p-4">
            <table className="w-full border-collapse">
              <tbody>
                <BlockInfoRow label="Block Height" value={blockData.number.toLocaleString()} />

                <BlockInfoRow
                  label="Block Age"
                  value={`${formatDistanceToNow(new Date(blockData.timestamp * 1000))} ago (${formatTimestamp(blockData.timestamp)})`}
                />

                <BlockInfoRow
                  label="Tx Amount"
                  value={`${blockData.transactions.length} tx and 0 internal tx are in this block`}
                />

                <BlockInfoRow label="Validator" value={blockData.miner} isAddress />

                <BlockInfoRow label="Reward" value="1 ADR" />

                <BlockInfoRow label="Block Size" value={formatBytes(blockData.size)} />

                <BlockInfoRow label="Gas Used" value={formatGasPercentage(blockData.gasUsed, blockData.gasLimit)} />

                <BlockInfoRow label="Gas Limit" value={blockData.gasLimit.toLocaleString()} />

                <BlockInfoRow label="Block Hash" value={blockData.hash} isHash />

                <BlockInfoRow label="Parent Block Hash" value={blockData.parentHash} isHash />

                <BlockInfoRow label="Nonce" value={blockData.nonce} />

                <BlockInfoRow label="Extra Data" value={blockData.extraData} isLongText />
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p>Block data not found</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function BlockInfoRow({ label, value, isHash = false, isAddress = false, isLongText = false }) {
  return (
    <tr className="border-b last:border-b-0">
      <td className="py-4 pr-4 align-top text-muted-foreground font-medium w-1/4">{label}</td>
      <td className="py-4 break-words">
        {isLongText ? (
          <div className="bg-muted/30 p-2 rounded-md overflow-x-auto text-xs font-mono">{value}</div>
        ) : isHash || isAddress ? (
          <div className="font-mono text-sm">{value}</div>
        ) : (
          value
        )}
      </td>
    </tr>
  )
}

function formatDistanceToNow(date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} secs`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} mins`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hours`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} days`
}

