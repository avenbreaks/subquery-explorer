/**
 * Format gas price from wei to a human-readable format
 */
export function formatGasPrice(gasPrice: number | undefined): string {
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

/**
 * Format number with K, M, B suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  } else {
    return num.toString()
  }
}

