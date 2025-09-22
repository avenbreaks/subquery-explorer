"use client"

import { TabsContent } from "@/components/ui/tabs"

import { TabsTrigger } from "@/components/ui/tabs"

import { TabsList } from "@/components/ui/tabs"

import { Tabs } from "@/components/ui/tabs"

import type React from "react"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Activity, Clock, Database, Layers, RefreshCw, Search, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { StatsCard } from "@/components/stats/stats-card"
import { ValidatorsCard } from "@/components/stats/validators-card"
import BlockList from "@/components/block-list"
import TransactionList from "@/components/transaction-list"
import BlockDetails from "@/components/block-details"
import NetworkStats from "@/components/network-stats"
import NetworkHeader from "@/components/network-header"
import { fetchBlockchainData } from "@/lib/blockchain-service"
import { formatGasPrice } from "@/lib/utils/format"

// Dynamically import client-only components to avoid hydration issues
const GeometricLines = dynamic(() => import("@/components/geometric-lines").then(mod => ({ default: mod.GeometricLines })), {
  ssr: false,
})

const PriceTracker = dynamic(() => import("@/components/price-tracker"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
      <span className="font-medium text-sm">ADR</span>
      <span className="text-sm">Loading...</span>
    </div>
  ),
})

// Types for blockchain data
interface BlockchainData {
  latestBlock: any | null
  totalBlocks: number
  totalTransactions: number
  averageBlockTime: number
  gasPrice: number
  totalAddresses: number
  isLoading: boolean
}

export default function BlockchainExplorer() {
  // State
  const [data, setData] = useState<BlockchainData>({
    latestBlock: null,
    totalBlocks: 0,
    totalTransactions: 0,
    averageBlockTime: 0,
    gasPrice: 0,
    totalAddresses: 0,
    isLoading: true,
  })
  const [refreshing, setRefreshing] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch blockchain data
  const fetchData = async () => {
    try {
      setRefreshing(true)
      const blockchainData = await fetchBlockchainData()
      setData({
        ...blockchainData,
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching blockchain data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  // Initial data fetch and polling
  useEffect(() => {
    fetchData()

    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 15000) // Refresh every 15 seconds

    return () => clearInterval(interval)
  }, [])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)

    // Check if it's a block number
    if (/^\d+$/.test(searchQuery)) {
      setSelectedBlock(Number.parseInt(searchQuery))
    }

    // Reset search field
    setSearchQuery("")
  }

  return (
    <div className="relative">
      <GeometricLines />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <NetworkHeader data={data} />

        {/* Controls and Tabs */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold"></h2>
            <div className="flex items-center gap-4">
              <PriceTracker />
              <ThemeToggle />
              <button
                onClick={fetchData}
                className="flex items-center gap-2 bg-background hover:bg-muted px-4 py-2 rounded-full border border-border transition-colors"
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 mb-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by address / tx hash / block / token..."
                className="pl-10 bg-background/50 border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Network Stats */}
          <NetworkStats data={data} />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Latest Block"
              value={data.isLoading ? null : data.totalBlocks.toLocaleString()}
              description="Current blockchain height"
              icon={<Layers className="h-5 w-5" />}
              isLoading={data.isLoading}
            />
            <StatsCard
              title="Total Transactions"
              value={data.isLoading ? null : data.totalTransactions.toLocaleString()}
              description="Processed on the network"
              icon={<Activity className="h-5 w-5" />}
              isLoading={data.isLoading}
            />
            <StatsCard
              title="Average Block Time"
              value={data.isLoading ? null : `${data.averageBlockTime.toFixed(2)}s`}
              description="Time between blocks"
              icon={<Clock className="h-5 w-5" />}
              isLoading={data.isLoading}
              showProgressCircle={true}
            />
            <StatsCard
              title="Gas Price"
              value={data.isLoading ? null : formatGasPrice(data.gasPrice)}
              description="Current gas price"
              icon={<Database className="h-5 w-5" />}
              isLoading={data.isLoading}
            />
            <ValidatorsCard isLoading={data.isLoading} />
            <StatsCard
              title="Total Addresses"
              value={data.isLoading ? null : data.totalAddresses.toLocaleString()}
              description="Unique addresses"
              icon={<Users className="h-5 w-5" />}
              isLoading={data.isLoading}
            />
          </div>

          {/* Blocks and Transactions Tabs */}
          <Tabs defaultValue="blocks" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="blocks">Latest Blocks</TabsTrigger>
              <TabsTrigger value="transactions">Latest Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="blocks">
              <BlockList
                isLoading={data.isLoading}
                latestBlock={data.latestBlock}
                totalBlocks={data.totalBlocks}
                onBlockSelect={setSelectedBlock}
              />
            </TabsContent>
            <TabsContent value="transactions">
              <TransactionList isLoading={data.isLoading} latestBlock={data.latestBlock} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Block Details Modal */}
        {selectedBlock && <BlockDetails blockNumber={selectedBlock} onClose={() => setSelectedBlock(null)} />}
      </div>
    </div>
  )
}

