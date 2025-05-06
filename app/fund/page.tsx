import { TradingViewTickerTape } from "@/components/trading-view-ticker-tape"
import { FundHero } from "@/components/fund-hero"
import { FundValueProposition } from "@/components/fund-value-proposition"
import { FundAdvantages } from "@/components/fund-advantages"
import { FundChart } from "@/components/fund-chart"
import { FundCTA } from "@/components/fund-cta"

export default function FundPage() {
  return (
    <div className="min-h-screen bg-background">
      <TradingViewTickerTape />
      <FundHero />
      <div className="container mx-auto px-4 py-12 space-y-16">
        <FundValueProposition />
        <FundChart />
        <FundAdvantages />
        <FundCTA />
      </div>
    </div>
  )
}
