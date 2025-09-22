"use client"

import { Badge } from "@/components/ui/badge"

export default function NetworkHeader({ data }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/wlogo.png"
            alt="Ethereum Logo"
            className="h-10 w-10"
          />
          <div>
            <h1 className="text-3xl font-bold">
              Sub <span className="text-muted-foreground">Analytics Chains</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="evm">EVM</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

