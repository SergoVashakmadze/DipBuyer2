"use client"

import { AutoInvestStrategy } from "@/components/auto-invest-strategy"

export default function AutoInvestPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Automatic Investment Strategy</h1>
      <AutoInvestStrategy />
    </div>
  )
}
