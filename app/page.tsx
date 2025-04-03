import type { Metadata } from "next"
import BlockchainExplorer from "@/components/blockchain-explorer"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Sub Analytics Explorer",
  description: "Sub Analytics blockchain for EVM Compatible",
}

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <main className="min-h-screen">
        <BlockchainExplorer />
      </main>
    </ThemeProvider>
  )
}

