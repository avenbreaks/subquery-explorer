"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Clock, Database, Layers, RefreshCw, Search, Server, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import BlockList from "@/components/block-list"
import TransactionList from "@/components/transaction-list"
import { fetchBlockchainData } from "@/lib/blockchain-service"
import { ThemeToggle } from "@/components/theme-toggle"
import { GeometricLines } from "@/components/geometric-lines"
import BlockDetails from "@/components/block-details"
import NetworkStats from "@/components/network-stats"
import PriceTracker from "@/components/price-tracker"

export default function BlockchainExplorer() {
  const [data, setData] = useState({
    latestBlock: null,
    totalBlocks: 0,
    totalTransactions: 0,
    averageBlockTime: 0,
    gasPrice: 0,
    isLoading: true,
  })
  const [refreshing, setRefreshing] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

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

  useEffect(() => {
    fetchData()

    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 15000) // Refresh every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    // Handle search logic here
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
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light tracking-tight">Sub Analytics Explorer</h1>
              <p className="text-muted-foreground mt-1 font-light">Real-time blockchain data</p>
            </div>
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
        </header>

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

        <NetworkStats data={data} />

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
          />
          <StatsCard
            title="Gas Price"
            value={data.isLoading ? null : formatGasPrice(data.gasPrice)}
            description="Current gas price"
            icon={<Database className="h-5 w-5" />}
            isLoading={data.isLoading}
          />
          <StatsCard
            title="Validators"
            value="21"
            description="Active validators"
            icon={<Server className="h-5 w-5" />}
            isLoading={data.isLoading}
          />
          <StatsCard
            title="Total Addresses"
            value="1.2M+"
            description="Unique addresses"
            icon={<Users className="h-5 w-5" />}
            isLoading={data.isLoading}
          />
        </div>

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

      {selectedBlock && <BlockDetails blockNumber={selectedBlock} onClose={() => setSelectedBlock(null)} />}
    </div>
  )
}

function StatsCard({ title, value, description, icon, isLoading }) {
  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-card/50 border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="bg-background/50 p-2 rounded-full border border-border">{icon}</div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Skeleton key="skeleton" className="h-8 w-24 bg-muted/50" />
          ) : (
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-light tracking-tight"
            >
              {value}
            </motion.div>
          )}
        </AnimatePresence>
        <CardDescription className="text-muted-foreground/70 mt-1 text-xs">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function formatGasPrice(gasPrice) {
  if (!gasPrice) return "0 Gwei"

  // Convert to Gwei (1 Gwei = 10^9 Wei)
  const gweiValue = gasPrice / 1e9

  // Format based on the value
  if (gweiValue < 0.01) {
    return `${(gweiValue * 1000).toFixed(2)} MGwei`
  } else if (gweiValue >= 1000) {
    return `${(gweiValue / 1000).toFixed(2)} KGwei`
  } else {
    return `${gweiValue.toFixed(2)} Gwei`
  }
}

