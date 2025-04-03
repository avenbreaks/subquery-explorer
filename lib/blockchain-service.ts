// RPC endpoint for CoinEx Smart Chain
const RPC_URL = "https://rpc.coinex.net"
const CHAIN_ID = 52
const SYMBOL = "CET"

// Helper function to make JSON-RPC calls
async function jsonRpcCall(method: string, params: any[] = []) {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: 1,
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(`RPC error: ${data.error.message}`)
  }

  return data.result
}

// Convert hex string to number
function hexToNumber(hex: string): number {
  return Number.parseInt(hex, 16)
}

// Fetch the latest block
export async function fetchLatestBlock() {
  const block = await jsonRpcCall("eth_getBlockByNumber", ["latest", true])
  return {
    number: hexToNumber(block.number),
    hash: block.hash,
    timestamp: hexToNumber(block.timestamp),
    transactions: block.transactions,
    gasUsed: hexToNumber(block.gasUsed),
    gasLimit: hexToNumber(block.gasLimit),
    size: hexToNumber(block.size),
    miner: block.miner,
    parentHash: block.parentHash,
    nonce: block.nonce,
    extraData: block.extraData,
  }
}

// Fetch block by number
export async function fetchBlockByNumber(blockNumber: number, includeTransactions = true) {
  const blockHex = `0x${blockNumber.toString(16)}`
  const block = await jsonRpcCall("eth_getBlockByNumber", [blockHex, includeTransactions])

  if (!block) return null

  return {
    number: hexToNumber(block.number),
    hash: block.hash,
    timestamp: hexToNumber(block.timestamp),
    transactions: block.transactions,
    gasUsed: hexToNumber(block.gasUsed),
    gasLimit: hexToNumber(block.gasLimit),
    size: hexToNumber(block.size),
    miner: block.miner,
    parentHash: block.parentHash,
    nonce: block.nonce,
    extraData: block.extraData,
  }
}

// Fetch multiple blocks
export async function fetchBlocks(latestBlockNumber: number, count: number) {
  const blocks = []

  for (let i = 0; i < count; i++) {
    const blockNumber = latestBlockNumber - i
    if (blockNumber < 0) break

    const block = await fetchBlockByNumber(blockNumber)
    if (block) {
      blocks.push(block)
    }
  }

  return blocks
}

// Fetch transactions from a block
export async function fetchTransactions(latestBlock: any) {
  if (!latestBlock || !latestBlock.transactions) {
    return []
  }

  // Add timestamp to transactions
  return latestBlock.transactions
    .map((tx: any) => ({
      ...tx,
      timestamp: latestBlock.timestamp,
    }))
    .slice(0, 10) // Limit to 10 transactions
}

// Calculate average block time
export async function calculateAverageBlockTime(latestBlockNumber: number) {
  // Fetch the latest block and a block from 100 blocks ago to calculate average
  const latestBlock = await fetchBlockByNumber(latestBlockNumber)
  const oldBlock = await fetchBlockByNumber(Math.max(0, latestBlockNumber - 100))

  if (!latestBlock || !oldBlock) {
    return 13.2 // Default average if we can't calculate
  }

  const timeDiff = latestBlock.timestamp - oldBlock.timestamp
  const blockDiff = latestBlock.number - oldBlock.number

  return timeDiff / blockDiff
}

// Fetch gas price
export async function fetchGasPrice() {
  try {
    const gasPrice = await jsonRpcCall("eth_gasPrice")
    console.log("Raw gas price from API:", gasPrice)
    return hexToNumber(gasPrice)
  } catch (error) {
    console.error("Error fetching gas price:", error)
    return 0
  }
}

// Fetch all blockchain data
export async function fetchBlockchainData() {
  // Fetch total blocks (latest block number)
  const blockNumberHex = await jsonRpcCall("eth_blockNumber")
  const totalBlocks = hexToNumber(blockNumberHex)

  // Fetch latest block with transactions
  const latestBlock = await fetchLatestBlock()

  // Calculate average block time
  const averageBlockTime = await calculateAverageBlockTime(totalBlocks)

  // Fetch gas price
  const gasPrice = await fetchGasPrice()
  console.log("Converted gas price:", gasPrice)

  // Calculate total transactions (this is an estimate based on latest block)
  // In a real explorer, you'd have a database with the actual count
  const totalTransactions = latestBlock.number * (latestBlock.transactions.length || 10)

  return {
    latestBlock,
    totalBlocks,
    totalTransactions,
    averageBlockTime,
    gasPrice,
  }
}

