"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { TrendingDown, Sparkles, BarChart3, Info, ArrowUpRight, Filter } from "lucide-react"
import { useSettings } from "@/context/settings-context"
import { usePortfolio } from "@/context/portfolio-context"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { calculateUndervaluation, generateHistoricalPrices, formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface AssetOpportunity {
  id: string
  symbol: string
  name: string
  type: "stock" | "etf" | "crypto" | "reit" | "index"
  price: number
  priceChange24h: number
  historicalPrices: number[]
  undervaluationScore: number
  riskScore: number
  undervaluationReason: string
  sector?: string
  peRatio?: number
  forwardPE?: number
  debtToEquity?: number
  epsGrowth?: number
  pegRatio?: number
  marketCap?: number
  meetsLynchCriteria?: boolean
  // Additional detailed undervaluation reasons
  detailedUndervaluationReasons?: {
    technical?: string[]
    fundamental?: string[]
    sentiment?: string[]
  }
}

// Expanded sample data with more assets and Peter Lynch criteria
const sampleAssets: AssetOpportunity[] = [
  {
    id: "aapl",
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "stock",
    price: 175.25,
    priceChange24h: -2.3,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 30,
    undervaluationReason: "",
    sector: "Technology",
    peRatio: 28.5,
    forwardPE: 24.2,
    debtToEquity: 112.5,
    epsGrowth: 8.1,
    pegRatio: 3.52,
    marketCap: 2750000000000,
    meetsLynchCriteria: false,
  },
  {
    id: "msft",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    type: "stock",
    price: 325.42,
    priceChange24h: -1.8,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 25,
    undervaluationReason: "",
    sector: "Technology",
    peRatio: 34.2,
    forwardPE: 29.8,
    debtToEquity: 42.1,
    epsGrowth: 16.2,
    pegRatio: 2.11,
    marketCap: 2420000000000,
    meetsLynchCriteria: false,
  },
  {
    id: "amzn",
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    type: "stock",
    price: 132.65,
    priceChange24h: -3.1,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 40,
    undervaluationReason: "",
    sector: "Consumer Cyclical",
    peRatio: 52.1,
    forwardPE: 36.5,
    debtToEquity: 81.3,
    epsGrowth: 22.4,
    pegRatio: 2.33,
    marketCap: 1370000000000,
    meetsLynchCriteria: false,
  },
  {
    id: "spy",
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    type: "etf",
    price: 430.15,
    priceChange24h: -1.5,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 20,
    undervaluationReason: "",
    sector: "Broad Market",
    peRatio: 22.5,
    forwardPE: 19.2,
    marketCap: 380000000000,
  },
  {
    id: "qqq",
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    type: "etf",
    price: 365.78,
    priceChange24h: -2.1,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 25,
    undervaluationReason: "",
    sector: "Technology",
    peRatio: 28.3,
    forwardPE: 24.1,
    marketCap: 180000000000,
  },
  {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    type: "crypto",
    price: 42500.25,
    priceChange24h: -4.2,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 70,
    undervaluationReason: "",
    marketCap: 830000000000,
  },
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    type: "crypto",
    price: 2250.75,
    priceChange24h: -5.1,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 65,
    undervaluationReason: "",
    marketCap: 270000000000,
  },
  {
    id: "sol",
    symbol: "SOL",
    name: "Solana",
    type: "crypto",
    price: 105.32,
    priceChange24h: -6.8,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 80,
    undervaluationReason: "",
    marketCap: 45000000000,
  },
  // Additional assets
  {
    id: "nvda",
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    type: "stock",
    price: 875.28,
    priceChange24h: 1.2,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 45,
    undervaluationReason: "",
    sector: "Technology",
    peRatio: 64.3,
    forwardPE: 32.1,
    debtToEquity: 41.2,
    epsGrowth: 125.3,
    pegRatio: 0.51,
    marketCap: 2160000000000,
    meetsLynchCriteria: false,
  },
  {
    id: "googl",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    type: "stock",
    price: 142.65,
    priceChange24h: -0.8,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 30,
    undervaluationReason: "",
    sector: "Communication Services",
    peRatio: 24.1,
    forwardPE: 19.8,
    debtToEquity: 12.5,
    epsGrowth: 28.2,
    pegRatio: 0.85,
    marketCap: 1790000000000,
    meetsLynchCriteria: true,
  },
  {
    id: "jnj",
    symbol: "JNJ",
    name: "Johnson & Johnson",
    type: "stock",
    price: 152.32,
    priceChange24h: 0.5,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 15,
    undervaluationReason: "",
    sector: "Healthcare",
    peRatio: 17.2,
    forwardPE: 14.8,
    debtToEquity: 32.1,
    epsGrowth: 16.5,
    pegRatio: 1.04,
    marketCap: 368000000000,
    meetsLynchCriteria: true,
  },
  {
    id: "ko",
    symbol: "KO",
    name: "The Coca-Cola Company",
    type: "stock",
    price: 62.15,
    priceChange24h: 0.3,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 10,
    undervaluationReason: "",
    sector: "Consumer Defensive",
    peRatio: 24.8,
    forwardPE: 21.3,
    debtToEquity: 156.2,
    epsGrowth: 8.2,
    pegRatio: 3.02,
    marketCap: 268000000000,
    meetsLynchCriteria: false,
  },
  {
    id: "dis",
    symbol: "DIS",
    name: "The Walt Disney Company",
    type: "stock",
    price: 112.48,
    priceChange24h: -1.2,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 35,
    undervaluationReason: "",
    sector: "Communication Services",
    peRatio: 19.5,
    forwardPE: 14.2,
    debtToEquity: 42.8,
    epsGrowth: 18.3,
    pegRatio: 1.06,
    marketCap: 205000000000,
    meetsLynchCriteria: true,
  },
  {
    id: "vti",
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    type: "etf",
    price: 235.42,
    priceChange24h: -1.1,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 20,
    undervaluationReason: "",
    sector: "Broad Market",
    peRatio: 21.8,
    forwardPE: 18.5,
    marketCap: 320000000000,
  },
  {
    id: "voo",
    symbol: "VOO",
    name: "Vanguard S&P 500 ETF",
    type: "etf",
    price: 395.28,
    priceChange24h: -1.3,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 20,
    undervaluationReason: "",
    sector: "Broad Market",
    peRatio: 22.5,
    forwardPE: 19.2,
    marketCap: 290000000000,
  },
  {
    id: "bnb",
    symbol: "BNB",
    name: "Binance Coin",
    type: "crypto",
    price: 580.15,
    priceChange24h: -3.5,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 75,
    undervaluationReason: "",
    marketCap: 89000000000,
  },
  {
    id: "ada",
    symbol: "ADA",
    name: "Cardano",
    type: "crypto",
    price: 0.45,
    priceChange24h: -2.8,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 80,
    undervaluationReason: "",
    marketCap: 16000000000,
  },
  {
    id: "o",
    symbol: "O",
    name: "Realty Income Corporation",
    type: "reit",
    price: 52.35,
    priceChange24h: 0.8,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 25,
    undervaluationReason: "",
    sector: "Real Estate",
    peRatio: 18.2,
    forwardPE: 14.5,
    debtToEquity: 84.2,
    epsGrowth: 5.8,
    pegRatio: 3.14,
    marketCap: 37000000000,
    meetsLynchCriteria: false,
  },
  {
    id: "amt",
    symbol: "AMT",
    name: "American Tower Corporation",
    type: "reit",
    price: 185.42,
    priceChange24h: -0.5,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 30,
    undervaluationReason: "",
    sector: "Real Estate",
    peRatio: 22.1,
    forwardPE: 18.3,
    debtToEquity: 315.2,
    epsGrowth: 12.5,
    pegRatio: 1.77,
    marketCap: 86000000000,
    meetsLynchCriteria: false,
  },
  // Add major indexes
  {
    id: "spx",
    symbol: "SPX",
    name: "S&P 500 Index",
    type: "index",
    price: 4780.35,
    priceChange24h: -0.8,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 20,
    undervaluationReason: "",
    sector: "Broad Market",
    peRatio: 22.5,
    forwardPE: 19.2,
    marketCap: 40000000000000,
  },
  {
    id: "dji",
    symbol: "DJI",
    name: "Dow Jones Industrial Average",
    type: "index",
    price: 38765.82,
    priceChange24h: -0.6,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 15,
    undervaluationReason: "",
    sector: "Broad Market",
    peRatio: 21.3,
    forwardPE: 18.7,
    marketCap: 12000000000000,
  },
  {
    id: "ndx",
    symbol: "NDX",
    name: "Nasdaq 100 Index",
    type: "index",
    price: 16832.92,
    priceChange24h: -1.2,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 25,
    undervaluationReason: "",
    sector: "Technology",
    peRatio: 28.4,
    forwardPE: 24.6,
    marketCap: 18000000000000,
  },
  {
    id: "rut",
    symbol: "RUT",
    name: "Russell 2000 Index",
    type: "index",
    price: 2042.58,
    priceChange24h: -1.5,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 35,
    undervaluationReason: "",
    sector: "Small Cap",
    peRatio: 19.8,
    forwardPE: 17.2,
    marketCap: 2500000000000,
  },
  // Adding more opportunities
  {
    id: "tsla",
    symbol: "TSLA",
    name: "Tesla, Inc.",
    type: "stock",
    price: 248.5,
    priceChange24h: -2.7,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 60,
    undervaluationReason: "",
    sector: "Consumer Cyclical",
    peRatio: 70.2,
    forwardPE: 58.3,
    debtToEquity: 12.8,
    epsGrowth: 35.2,
    pegRatio: 2.0,
    marketCap: 790000000000,
    meetsLynchCriteria: false,
  },
  {
    id: "meta",
    symbol: "META",
    name: "Meta Platforms, Inc.",
    type: "stock",
    price: 485.39,
    priceChange24h: 1.8,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 40,
    undervaluationReason: "",
    sector: "Communication Services",
    peRatio: 26.3,
    forwardPE: 21.5,
    debtToEquity: 10.2,
    epsGrowth: 42.1,
    pegRatio: 0.62,
    marketCap: 1240000000000,
    meetsLynchCriteria: false,
  },
  {
    id: "v",
    symbol: "V",
    name: "Visa Inc.",
    type: "stock",
    price: 275.85,
    priceChange24h: 0.3,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 20,
    undervaluationReason: "",
    sector: "Financial Services",
    peRatio: 30.8,
    forwardPE: 25.2,
    debtToEquity: 68.7,
    epsGrowth: 15.8,
    pegRatio: 1.95,
    marketCap: 560000000000,
    meetsLynchCriteria: false,
  },
  {
    id: "ma",
    symbol: "MA",
    name: "Mastercard Incorporated",
    type: "stock",
    price: 458.12,
    priceChange24h: 0.5,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 20,
    undervaluationReason: "",
    sector: "Financial Services",
    peRatio: 36.2,
    forwardPE: 29.8,
    debtToEquity: 214.5,
    epsGrowth: 14.2,
    pegRatio: 2.55,
    marketCap: 425000000000,
    meetsLynchCriteria: false,
  },
  {
    id: "pypl",
    symbol: "PYPL",
    name: "PayPal Holdings, Inc.",
    type: "stock",
    price: 62.35,
    priceChange24h: -1.2,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 45,
    undervaluationReason: "",
    sector: "Financial Services",
    peRatio: 17.5,
    forwardPE: 15.2,
    debtToEquity: 52.3,
    epsGrowth: 8.5,
    pegRatio: 2.06,
    marketCap: 65000000000,
    meetsLynchCriteria: false,
  },
  {
    id: "sq",
    symbol: "SQ",
    name: "Block, Inc.",
    type: "stock",
    price: 75.42,
    priceChange24h: -2.8,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 55,
    undervaluationReason: "",
    sector: "Financial Services",
    peRatio: 85.7,
    forwardPE: 25.3,
    debtToEquity: 30.2,
    epsGrowth: 18.7,
    pegRatio: 4.58,
    marketCap: 46000000000,
    meetsLynchCriteria: false,
  },
  {
    id: "avgo",
    symbol: "AVGO",
    name: "Broadcom Inc.",
    type: "stock",
    price: 1325.75,
    priceChange24h: 0.9,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 35,
    undervaluationReason: "",
    sector: "Technology",
    peRatio: 48.2,
    forwardPE: 22.5,
    debtToEquity: 189.5,
    epsGrowth: 32.1,
    pegRatio: 1.5,
    marketCap: 615000000000,
    meetsLynchCriteria: false,
  },
  {
    id: "amd",
    symbol: "AMD",
    name: "Advanced Micro Devices, Inc.",
    type: "stock",
    price: 158.32,
    priceChange24h: -1.5,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 50,
    undervaluationReason: "",
    sector: "Technology",
    peRatio: 145.2,
    forwardPE: 32.8,
    debtToEquity: 5.8,
    epsGrowth: 45.3,
    pegRatio: 3.2,
    marketCap: 255000000000,
    meetsLynchCriteria: false,
  },
  {
    id: "intc",
    symbol: "INTC",
    name: "Intel Corporation",
    type: "stock",
    price: 31.25,
    priceChange24h: -2.1,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 40,
    undervaluationReason: "",
    sector: "Technology",
    peRatio: 32.5,
    forwardPE: 22.3,
    debtToEquity: 42.7,
    epsGrowth: -15.2,
    pegRatio: -2.14,
    marketCap: 132000000000,
    meetsLynchCriteria: false,
  },
  {
    id: "dot",
    symbol: "DOT",
    name: "Polkadot",
    type: "crypto",
    price: 6.85,
    priceChange24h: -4.2,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 85,
    undervaluationReason: "",
    marketCap: 9800000000,
  },
  {
    id: "link",
    symbol: "LINK",
    name: "Chainlink",
    type: "crypto",
    price: 14.25,
    priceChange24h: -3.8,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 80,
    undervaluationReason: "",
    marketCap: 8500000000,
  },
  {
    id: "xrp",
    symbol: "XRP",
    name: "XRP",
    type: "crypto",
    price: 0.52,
    priceChange24h: -2.5,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 75,
    undervaluationReason: "",
    marketCap: 28500000000,
  },
  {
    id: "doge",
    symbol: "DOGE",
    name: "Dogecoin",
    type: "crypto",
    price: 0.12,
    priceChange24h: -5.2,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 90,
    undervaluationReason: "",
    marketCap: 17200000000,
  },
  {
    id: "schd",
    symbol: "SCHD",
    name: "Schwab US Dividend Equity ETF",
    type: "etf",
    price: 78.45,
    priceChange24h: -0.3,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 15,
    undervaluationReason: "",
    sector: "Dividend",
    peRatio: 15.8,
    forwardPE: 14.2,
    marketCap: 52000000000,
  },
  {
    id: "vgt",
    symbol: "VGT",
    name: "Vanguard Information Technology ETF",
    type: "etf",
    price: 485.25,
    priceChange24h: -1.2,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 30,
    undervaluationReason: "",
    sector: "Technology",
    peRatio: 32.5,
    forwardPE: 28.3,
    marketCap: 65000000000,
  },
  {
    id: "vdc",
    symbol: "VDC",
    name: "Vanguard Consumer Staples ETF",
    type: "etf",
    price: 205.75,
    priceChange24h: 0.2,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 10,
    undervaluationReason: "",
    sector: "Consumer Defensive",
    peRatio: 22.8,
    forwardPE: 20.5,
    marketCap: 7500000000,
  },
]

// Generate detailed undervaluation reasons
function generateDetailedUndervaluationReasons(
  asset: AssetOpportunity,
  score: number,
): {
  technical: string[]
  fundamental: string[]
  sentiment: string[]
} {
  const technical = []
  const fundamental = []
  const sentiment = []

  // Technical reasons
  if (score > 5) {
    technical.push(`${asset.symbol} is trading below its 50-day moving average.`)

    if (score > 15) {
      technical.push(`RSI indicator shows ${asset.symbol} is in oversold territory at 28.`)
    }

    if (score > 25) {
      technical.push(`${asset.symbol} has formed a bullish divergence pattern on the MACD indicator.`)
      technical.push(`Price is testing a major support level at ${formatCurrency(asset.price * 0.95)}.`)
    }
  }

  // Fundamental reasons
  if (asset.type === "stock" || asset.type === "reit") {
    if (asset.peRatio && asset.peRatio < 25) {
      fundamental.push(
        `P/E ratio of ${asset.peRatio.toFixed(1)} is below industry average of ${(asset.peRatio * 1.2).toFixed(1)}.`,
      )
    }

    if (asset.forwardPE && asset.forwardPE < 15) {
      fundamental.push(
        `Forward P/E of ${asset.forwardPE.toFixed(1)} suggests attractive valuation relative to growth prospects.`,
      )
    }

    if (asset.debtToEquity && asset.debtToEquity < 35) {
      fundamental.push(
        `Low debt-to-equity ratio of ${asset.debtToEquity.toFixed(1)}% indicates strong balance sheet health.`,
      )
    }

    if (asset.epsGrowth && asset.epsGrowth > 15) {
      fundamental.push(
        `Strong earnings growth of ${asset.epsGrowth.toFixed(1)}% exceeds industry average of ${(asset.epsGrowth * 0.7).toFixed(1)}%.`,
      )
    }

    if (asset.pegRatio && asset.pegRatio < 1.2) {
      fundamental.push(
        `PEG ratio of ${asset.pegRatio.toFixed(2)} shows good value relative to growth rate (below 1.2 is considered attractive).`,
      )
    }
  } else if (asset.type === "crypto") {
    if (score > 10) {
      fundamental.push(`${asset.symbol} is trading below its realized price (average cost basis of all holders).`)
      fundamental.push(`Network activity metrics show increasing adoption despite price decline.`)
    }
  } else if (asset.type === "etf" || asset.type === "index") {
    if (score > 10) {
      fundamental.push(`Current price-to-book ratio is below 5-year average.`)
      fundamental.push(`Dividend yield of ${(Math.random() * 2 + 1.5).toFixed(2)}% is above historical average.`)
    }
  }

  // Sentiment reasons
  if (score > 15) {
    sentiment.push(`Market sentiment indicators show excessive pessimism, often a contrarian buy signal.`)

    if (score > 25) {
      sentiment.push(
        `Institutional ownership has increased by ${Math.floor(Math.random() * 10 + 5)}% in the last quarter.`,
      )
      sentiment.push(`Recent negative news has created a short-term overreaction in price.`)
    }
  }

  // Ensure we have at least one reason in each category if the score is high enough
  if (score > 20 && technical.length === 0) {
    technical.push(`${asset.symbol} is showing a potential reversal pattern on the daily chart.`)
  }

  if (score > 20 && fundamental.length === 0) {
    fundamental.push(
      `${asset.symbol} is trading at a discount to its intrinsic value based on discounted cash flow analysis.`,
    )
  }

  if (score > 20 && sentiment.length === 0) {
    sentiment.push(`Analyst sentiment has become overly negative, creating a potential contrarian opportunity.`)
  }

  return {
    technical,
    fundamental,
    sentiment,
  }
}

// Generate undervaluation reasons based on Peter Lynch criteria
function generateUndervaluationReason(asset: AssetOpportunity, score: number): string {
  if (score < 10) {
    return "This asset is currently trading at or near its fair value based on our analysis of historical price patterns, moving averages, and market indicators."
  }

  const reasons = []

  // Remove Peter Lynch specific criteria
  // Only add technical analysis reasons
  const technicalReasons = [
    `${asset.symbol} is trading below its 50-day moving average, suggesting a potential buying opportunity.`,
    `Recent market sentiment has pushed ${asset.symbol} below its historical support levels, indicating possible undervaluation.`,
    `Technical indicators like RSI suggest ${asset.symbol} may be oversold, potentially creating a buying opportunity.`,
    `${asset.symbol} has experienced a temporary dip due to market volatility unrelated to its fundamentals.`,
  ]

  // Always add two technical reasons
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * technicalReasons.length)
    reasons.push(technicalReasons[randomIndex])
    technicalReasons.splice(randomIndex, 1)
  }

  return reasons.join(" ")
}

// Utility function to get TradingView chart URL for a symbol
export function getTradingViewChartUrl(tvSymbol: string) {
  // Special case for RUT: use the working TradingView chart link
  if (tvSymbol === "TVC:RUT") {
    return "https://www.tradingview.com/chart/hdn9PAlw/?symbol=TVC%3ARUT&utm_source=www.tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=TVC%3ARUT";
  }
  // Generic TradingView chart link for all other symbols
  return `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tvSymbol)}`;
}

interface AssetOpportunitiesProps {
  className?: string
}

export function AssetOpportunities({ className }: AssetOpportunitiesProps) {
  const { settings } = useSettings()
  const { buyAsset, sellAsset, assets } = usePortfolio()
  const { balance } = useWallet()
  const { toast } = useToast()
  const [opportunities, setOpportunities] = useState<AssetOpportunity[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [selectedAsset, setSelectedAsset] = useState<AssetOpportunity | null>(null)
  const [purchaseAmount, setPurchaseAmount] = useState<string>("")
  const [sellQuantity, setSellQuantity] = useState<number>(0)
  const [action, setAction] = useState<"buy" | "sell" | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<string>("undervaluation")
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false)

  // Filter states
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 10000])
  const [selectedAssetTypes, setSelectedAssetTypes] = useState<string[]>(["stock", "etf", "crypto", "reit", "index"])
  const [valuationFilter, setValuationFilter] = useState<string[]>(["undervalued", "fair", "overvalued"])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>(["low", "medium", "high"])

  // Always use autoInvestAmount and autoInvestFrequency if set, otherwise fallback to maxBudgetPerTrade
  const maxInvestmentPerPeriod = (settings.autoInvestAmount ?? settings.maxBudgetPerTrade ?? 10000);

  const PURCHASES_KEY = 'dipbuyer-purchases-per-period';
  const purchasesThisPeriod = useRef<{ periodKey: string, amount: number }[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(PURCHASES_KEY)
    if (saved) {
      try {
        purchasesThisPeriod.current = JSON.parse(saved)
      } catch {}
    }
  }, [])

  // Generate historical prices and calculate undervaluation scores
  useEffect(() => {
    const assetsWithScores = sampleAssets.map((asset) => {
      const historicalPrices = generateHistoricalPrices(
        asset.price,
        100,
        asset.type === "crypto" ? 0.04 : asset.type === "stock" ? 0.02 : 0.01,
      )

      // Artificially make some assets appear undervalued for demonstration
      const artificialDip = Math.random() > 0.5
      const currentPrice = artificialDip ? asset.price * (0.85 + Math.random() * 0.1) : asset.price

      // Calculate undervaluation score
      let undervaluationScore = calculateUndervaluation(currentPrice, historicalPrices)

      // Ensure undervaluation scores are realistic (0-50% range)
      undervaluationScore = Math.min(undervaluationScore, 50)

      // Special cases for demonstration
      if (asset.symbol === "SPY") {
        undervaluationScore = 35 // Specific undervaluation for SPY
      } else if (asset.symbol === "AAPL" || asset.symbol === "MSFT") {
        undervaluationScore = Math.floor(Math.random() * 10) // Low undervaluation
      } else if (asset.symbol === "NVDA" || asset.symbol === "GOOGL") {
        undervaluationScore = Math.floor(Math.random() * 15) + 10 // Medium undervaluation
      } else if (asset.symbol === "JNJ" || asset.symbol === "DIS") {
        undervaluationScore = Math.floor(Math.random() * 15) + 25 // Higher undervaluation
      } else if (asset.symbol === "RUT") {
        undervaluationScore = 28 // Specific undervaluation for RUT
      } else if (asset.symbol === "BNB") {
        undervaluationScore = 32 // Specific undervaluation for BNB
      } else if (asset.symbol === "PYPL" || asset.symbol === "SQ") {
        undervaluationScore = Math.floor(Math.random() * 15) + 30 // Higher undervaluation for fintech
      } else if (asset.symbol === "INTC") {
        undervaluationScore = 40 // High undervaluation for Intel
      } else if (asset.symbol === "LINK" || asset.symbol === "DOT") {
        undervaluationScore = Math.floor(Math.random() * 15) + 25 // Higher undervaluation for some altcoins
      }

      // Generate reason for undervaluation
      const undervaluationReason = generateUndervaluationReason(asset, undervaluationScore)

      // Generate detailed undervaluation reasons
      const detailedUndervaluationReasons = generateDetailedUndervaluationReasons(asset, undervaluationScore)

      return {
        ...asset,
        price: currentPrice,
        historicalPrices,
        undervaluationScore,
        undervaluationReason,
        detailedUndervaluationReasons,
      }
    })

    setOpportunities(assetsWithScores)
  }, [])

  // Filter assets based on settings and tab
  const filteredOpportunities = opportunities
    .filter((asset) => {
      // Filter by asset type based on settings and selected asset types
      if (!selectedAssetTypes.includes(asset.type)) return false

      // Filter by undervaluation threshold
      if (asset.undervaluationScore < settings.undervaluationThreshold) return false

      // Filter by risk level
      if (!selectedRiskLevels.includes(asset.riskScore <= 30 ? "low" : asset.riskScore <= 60 ? "medium" : "high"))
        return false

      // Filter by tab
      if (activeTab !== "all" && asset.type !== activeTab) return false

      // Filter by budget range
      if (asset.price < budgetRange[0] || asset.price > budgetRange[1]) return false

      // Filter by valuation
      const assetValuation =
        asset.undervaluationScore > 20 ? "undervalued" : asset.undervaluationScore > 5 ? "fair" : "overvalued"
      if (!valuationFilter.includes(assetValuation)) return false

      // Filter by category/sector if any selected
      if (selectedCategories.length > 0 && asset.sector && !selectedCategories.includes(asset.sector)) return false

      return true
    })
    .sort((a, b) => {
      if (sortBy === "undervaluation") {
        return b.undervaluationScore - a.undervaluationScore
      } else if (sortBy === "price") {
        return a.price - b.price
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "risk") {
        return a.riskScore - b.riskScore
      } else {
        return b.undervaluationScore - a.undervaluationScore
      }
    })

  const handleBuy = (asset: AssetOpportunity) => {
    // Enforce max investment per period (optional: can be removed if you want to allow any modal open)
    if (asset.price > maxInvestmentPerPeriod) {
      toast({
        title: "Investment limit exceeded",
        description: `Your investment strategy only allows up to $${maxInvestmentPerPeriod.toLocaleString()} per period. Please lower your investment amount or update your strategy.`,
        variant: "destructive"
      })
      return
    }
    setSelectedAsset(asset)
    setPurchaseAmount("")
    setAction("buy")
  }

  const handleSell = (asset: AssetOpportunity) => {
    const portfolioAsset = assets.find((a) => a.symbol === asset.symbol)
    if (!portfolioAsset || portfolioAsset.quantity <= 0) {
      toast({
        title: "Cannot sell",
        description: `You don't own any ${asset.symbol} to sell`,
        variant: "destructive",
      })
      return
    }

    setSelectedAsset(asset)
    setSellQuantity(portfolioAsset.quantity)
    setAction("sell")
  }

  // Update the handleAnalyze function to ensure proper symbol mapping
  const handleAnalyze = (asset: AssetOpportunity) => {
    // Scroll to the chart section
    const marketOverviewCard = document.getElementById("market-overview")
    if (marketOverviewCard) {
      marketOverviewCard.scrollIntoView({ behavior: "smooth" })
    }

    // Map the symbol to the appropriate format for TradingView
    let tvSymbol = ""

    // For crypto, use the appropriate format
    if (asset.type === "crypto") {
      // Ensure all crypto symbols are properly mapped
      if (asset.symbol === "BTC") {
        tvSymbol = "BINANCE:BTCUSDT"
      } else if (asset.symbol === "ETH") {
        tvSymbol = "BINANCE:ETHUSDT"
      } else if (asset.symbol === "SOL") {
        tvSymbol = "BINANCE:SOLUSDT"
      } else if (asset.symbol === "BNB") {
        tvSymbol = "BINANCE:BNBUSDT"
      } else if (asset.symbol === "ADA") {
        tvSymbol = "BINANCE:ADAUSDT"
      } else if (asset.symbol === "DOT") {
        tvSymbol = "BINANCE:DOTUSDT"
      } else if (asset.symbol === "LINK") {
        tvSymbol = "BINANCE:LINKUSDT"
      } else if (asset.symbol === "XRP") {
        tvSymbol = "BINANCE:XRPUSDT"
      } else if (asset.symbol === "DOGE") {
        tvSymbol = "BINANCE:DOGEUSDT"
      } else {
        tvSymbol = `BINANCE:${asset.symbol}USDT`
      }
    }
    // For stocks and ETFs, use the correct exchange prefix
    else if (asset.type === "etf") {
      if (asset.symbol === "SPY") {
        tvSymbol = "AMEX:SPY"
      } else if (asset.symbol === "QQQ") {
        tvSymbol = "NASDAQ:QQQ"
      } else if (asset.symbol === "VTI") {
        tvSymbol = "AMEX:VTI"
      } else if (asset.symbol === "VOO") {
        tvSymbol = "AMEX:VOO"
      } else if (asset.symbol === "SCHD") {
        tvSymbol = "AMEX:SCHD"
      } else if (asset.symbol === "VGT") {
        tvSymbol = "AMEX:VGT"
      } else if (asset.symbol === "VDC") {
        tvSymbol = "AMEX:VDC"
      } else {
        tvSymbol = `AMEX:${asset.symbol}`
      }
    } else if (asset.type === "reit") {
      if (asset.symbol === "O") {
        tvSymbol = "NYSE:O"
      } else if (asset.symbol === "AMT") {
        tvSymbol = "NYSE:AMT"
      } else {
        tvSymbol = `NYSE:${asset.symbol}`
      }
    } else if (asset.type === "index") {
      if (asset.symbol === "SPX") {
        tvSymbol = "FOREXCOM:SPX500"
      } else if (asset.symbol === "DJI") {
        tvSymbol = "DJ:DJI"
      } else if (asset.symbol === "NDX") {
        tvSymbol = "NASDAQ:NDX"
      } else if (asset.symbol === "RUT") {
        tvSymbol = "TVC:RUT" // Always use this for RUT
      } else {
        tvSymbol = `INDEX:${asset.symbol}`
      }
    } else {
      // Use NYSE for certain stocks, otherwise default to NASDAQ
      const nyseSymbols = ["KO", "O", "AMT", "JNJ", "DIS", "V", "MA"];
      if (nyseSymbols.includes(asset.symbol)) {
        tvSymbol = `NYSE:${asset.symbol}`;
      } else {
        tvSymbol = `NASDAQ:${asset.symbol}`;
      }
    }

    // Dispatch custom event to update the chart with the correct symbol
    const event = new CustomEvent("analyzeAsset", {
      detail: {
        symbol: tvSymbol,
      },
    })
    window.dispatchEvent(event)

    toast({
      title: "Analyzing Asset",
      description: `Displaying chart for ${asset.symbol}`,
    })
  }

  const handlePurchaseAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPurchaseAmount(e.target.value)
  }

  const handleSellQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedAsset) return

    const portfolioAsset = assets.find((a) => a.symbol === selectedAsset.symbol)
    if (!portfolioAsset) return

    const quantity = Number.parseFloat(e.target.value)
    if (isNaN(quantity) || quantity <= 0) {
      setSellQuantity(0)
      return
    }

    setSellQuantity(Math.min(quantity, portfolioAsset.quantity))
  }

  const handleConfirmBuy = () => {
    if (!selectedAsset) return
    const amountNum = Number.parseFloat(purchaseAmount)
    // Calculate how much is left for this period
    const periodKey = getPeriodKey(settings.autoInvestFrequency || "daily")
    const spentThisPeriod = purchasesThisPeriod.current.filter(p => p.periodKey === periodKey).reduce((sum, p) => sum + p.amount, 0)
    const remainingThisPeriod = Math.max(0, maxInvestmentPerPeriod - spentThisPeriod)
    if (
      isNaN(amountNum) ||
      amountNum <= 0 ||
      amountNum > balance ||
      amountNum > remainingThisPeriod
    ) {
      toast({
        title: "Investment limit exceeded",
        description: `You can only invest up to $${remainingThisPeriod.toLocaleString()} this period. Please lower your investment amount or wait for the next period.`,
        variant: "destructive"
      })
      return
    }

    const quantity = amountNum / selectedAsset.price

    console.log('[handleConfirmBuy] Buying asset:', selectedAsset, 'Amount:', amountNum, 'Quantity:', quantity)
    buyAsset(
      {
        id: selectedAsset.id,
        symbol: selectedAsset.symbol,
        name: selectedAsset.name,
        type: selectedAsset.type,
        price: selectedAsset.price,
        priceChange24h: selectedAsset.priceChange24h,
        costBasis: amountNum,
      },
      quantity,
    )
    setTimeout(() => {
      const assetsAfter = JSON.parse(localStorage.getItem('dipbuyer-assets') || '[]')
      console.log('[handleConfirmBuy] Assets in localStorage after buy:', assetsAfter)
    }, 500)

    // Track this purchase for the current period
    purchasesThisPeriod.current.push({ periodKey, amount: amountNum })
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchasesThisPeriod.current))
    const spentAfter = spentThisPeriod + amountNum
    const remaining = Math.max(0, maxInvestmentPerPeriod - spentAfter)

    toast({
      title: "Purchase successful",
      description: `You have purchased ${quantity.toFixed(6)} ${selectedAsset.symbol} for ${formatCurrency(amountNum)}`,
      action: (
        <div className="mt-2 text-xs">
          Remaining this period: <span className="font-bold">{formatCurrency(remaining)}</span>
        </div>
      ),
    })

    setSelectedAsset(null)
    setPurchaseAmount("")
    setAction(null)
  }

  const handleConfirmSell = () => {
    if (!selectedAsset || sellQuantity <= 0) return

    const portfolioAsset = assets.find((a) => a.symbol === selectedAsset.symbol)
    if (!portfolioAsset || sellQuantity > portfolioAsset.quantity) return

    sellAsset(portfolioAsset.id, sellQuantity)

    toast({
      title: "Sale successful",
      description: `You have sold ${sellQuantity.toFixed(6)} ${selectedAsset.symbol} for ${formatCurrency(sellQuantity * selectedAsset.price)}`,
    })

    setSelectedAsset(null)
    setSellQuantity(0)
    setAction(null)
  }

  const getRiskBadge = (riskScore: number) => {
    if (riskScore <= 30) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Low Risk</Badge>
    } else if (riskScore <= 60) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Medium Risk</Badge>
      )
    } else {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">High Risk</Badge>
    }
  }

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case "stock":
        return <TrendingDown className="h-5 w-5" />
      case "etf":
        return <BarChart3 className="h-5 w-5" />
      case "crypto":
        return <Sparkles className="h-5 w-5" />
      case "reit":
        return <ArrowUpRight className="h-5 w-5" />
      case "index":
        return <BarChart3 className="h-5 w-5" />
      default:
        return <TrendingDown className="h-5 w-5" />
    }
  }

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case "stock":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
      case "etf":
        return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
      case "crypto":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
      case "reit":
        return "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300"
      case "index":
        return "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
      default:
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
    }
  }

  // Get all unique sectors from assets
  const allSectors = Array.from(new Set(opportunities.map((asset) => asset.sector).filter(Boolean))) as string[]

  // Helper to get period key based on frequency
  function getPeriodKey(frequency: string): string {
    const now = new Date()
    if (frequency === "hourly") {
      return now.toISOString().slice(0, 13) // YYYY-MM-DDTHH
    } else if (frequency === "weekly") {
      // Get ISO week number
      const year = now.getUTCFullYear()
      const firstDayOfYear = new Date(Date.UTC(year, 0, 1))
      const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000
      const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getUTCDay() + 1) / 7)
      return `${year}-W${week}`
    } else if (frequency === "monthly") {
      return now.toISOString().slice(0, 7) // YYYY-MM
    } else {
      // Default: daily
      return now.toISOString().slice(0, 10) // YYYY-MM-DD
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Investment Opportunities</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Popover open={showFilterMenu} onOpenChange={setShowFilterMenu}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 max-h-[60vh] overflow-y-auto" align="end">
                <div className="space-y-4 pb-4">
                  <div>
                    <h3 className="font-medium mb-2">Filter by Budget</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>${budgetRange[0]}</span>
                        <span>${budgetRange[1]}</span>
                      </div>
                      <Slider
                        value={budgetRange}
                        min={0}
                        max={10000}
                        step={100}
                        onValueChange={(value) => setBudgetRange(value as [number, number])}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Filter by Asset Type</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="all-asset-types"
                          checked={selectedAssetTypes.length === 5}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAssetTypes(["stock", "etf", "crypto", "reit", "index"])
                            } else {
                              setSelectedAssetTypes([])
                            }
                          }}
                        />
                        <Label htmlFor="all-asset-types">All Asset Types</Label>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {["stock", "etf", "crypto", "reit", "index"].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`asset-type-${type}`}
                              checked={selectedAssetTypes.includes(type)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedAssetTypes([...selectedAssetTypes, type])
                                } else {
                                  setSelectedAssetTypes(selectedAssetTypes.filter((t) => t !== type))
                                }
                              }}
                            />
                            <Label htmlFor={`asset-type-${type}`} className="capitalize">
                              {type === "etf" ? "ETFs" : type === "reit" ? "REITs" : type.charAt(0).toUpperCase() + type.slice(1)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Filter by Valuation</h3>
                    <div className="space-y-2">
                      {["undervalued", "fair", "overvalued"].map((val) => (
                        <div key={val} className="flex items-center space-x-2">
                          <Checkbox
                            id={`valuation-${val}`}
                            checked={valuationFilter.includes(val)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setValuationFilter([...valuationFilter, val])
                              } else {
                                setValuationFilter(valuationFilter.filter((v) => v !== val))
                              }
                            }}
                          />
                          <Label htmlFor={`valuation-${val}`} className="capitalize">
                            {val}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Filter by Category</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="all-categories"
                          checked={selectedCategories.length === 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([])
                            } else {
                              setSelectedCategories(allSectors)
                            }
                          }}
                        />
                        <Label htmlFor="all-categories">All Categories</Label>
                      </div>

                      {allSectors.map((sector) => (
                        <div key={sector} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${sector}`}
                            checked={selectedCategories.includes(sector)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, sector])
                              } else {
                                setSelectedCategories(selectedCategories.filter((s) => s !== sector))
                              }
                            }}
                          />
                          <Label htmlFor={`category-${sector}`}>{sector}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Filter by Risk Level</h3>
                    <div className="space-y-2">
                      {["low", "medium", "high"].map((risk) => (
                        <div key={risk} className="flex items-center space-x-2">
                          <Checkbox
                            id={`risk-${risk}`}
                            checked={selectedRiskLevels.includes(risk)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedRiskLevels([...selectedRiskLevels, risk])
                              } else {
                                setSelectedRiskLevels(selectedRiskLevels.filter((r) => r !== risk))
                              }
                            }}
                          />
                          <Label htmlFor={`risk-${risk}`} className="capitalize">
                            {risk} Risk
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBudgetRange([0, 10000])
                        setSelectedAssetTypes([])
                        setValuationFilter([])
                        setSelectedCategories([])
                        setSelectedRiskLevels([])
                        setShowFilterMenu(false)
                      }}
                    >
                      Reset
                    </Button>
                    <Button size="sm" onClick={() => setShowFilterMenu(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-r-none ${viewMode === "grid" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-l-none ${viewMode === "list" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>

            <div className="flex items-center">
              <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="undervaluation">Undervaluation</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
                <option value="risk">Risk</option>
              </select>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden md:block">
              <TabsList className="grid grid-cols-5 h-9">
                <TabsTrigger value="all" className="text-xs px-2">
                  All
                </TabsTrigger>
                <TabsTrigger value="stock" className="text-xs px-2">
                  Stocks
                </TabsTrigger>
                <TabsTrigger value="etf" className="text-xs px-2">
                  ETFs
                </TabsTrigger>
                <TabsTrigger value="crypto" className="text-xs px-2">
                  Crypto
                </TabsTrigger>
                <TabsTrigger value="index" className="text-xs px-2">
                  Indexes
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="md:hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="stock">Stocks</TabsTrigger>
                <TabsTrigger value="etf">ETFs</TabsTrigger>
                <TabsTrigger value="crypto">Crypto</TabsTrigger>
                <TabsTrigger value="index">Indexes</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredOpportunities.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-center">
            <div className="text-muted-foreground">
              <p>No investment opportunities found</p>
              <p className="text-sm">Try adjusting your filters or check back later</p>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOpportunities.map((asset) => {
              const portfolioAsset = assets.find((a) => a.symbol === asset.symbol)
              const hasAsset = portfolioAsset && portfolioAsset.quantity > 0

              return (
                <Card key={asset.id} className="overflow-hidden hover-lift h-[420px] flex flex-col">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${getAssetTypeColor(asset.type)}`}>
                          {getAssetTypeIcon(asset.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{asset.symbol}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{asset.name}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">{getRiskBadge(asset.riskScore)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Price</p>
                          <p className="text-lg font-bold">{formatCurrency(asset.price)}</p>
                          <p className={`text-xs ${asset.priceChange24h < 0 ? 'text-red-500' : 'text-green-500'}`}>{asset.priceChange24h > 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="text-sm text-muted-foreground">Undervalued</p>
                            <TooltipProvider delayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                    <span className="sr-only">Info</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center" className="max-w-xs p-4 z-50">
                                  <div className="space-y-3">
                                    <p className="font-medium">
                                      {asset.undervaluationScore > 0
                                        ? `${asset.symbol} appears to be ${asset.undervaluationScore.toFixed(0)}% undervalued`
                                        : `${asset.symbol} is trading at fair value`}
                                    </p>

                                    {asset.detailedUndervaluationReasons && (
                                      <>
                                        {asset.detailedUndervaluationReasons.technical &&
                                          asset.detailedUndervaluationReasons.technical.length > 0 && (
                                            <div>
                                              <h4 className="text-sm font-medium mb-1">Technical Analysis:</h4>
                                              <ul className="text-xs space-y-1 list-disc pl-4">
                                                {asset.detailedUndervaluationReasons.technical.map((reason, idx) => (
                                                  <li key={idx}>{reason}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}

                                        {asset.detailedUndervaluationReasons.fundamental &&
                                          asset.detailedUndervaluationReasons.fundamental.length > 0 && (
                                            <div>
                                              <h4 className="text-sm font-medium mb-1">Fundamental Analysis:</h4>
                                              <ul className="text-xs space-y-1 list-disc pl-4">
                                                {asset.detailedUndervaluationReasons.fundamental.map((reason, idx) => (
                                                  <li key={idx}>{reason}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}

                                        {asset.detailedUndervaluationReasons.sentiment &&
                                          asset.detailedUndervaluationReasons.sentiment.length > 0 && (
                                            <div>
                                              <h4 className="text-sm font-medium mb-1">Market Sentiment:</h4>
                                              <ul className="text-xs space-y-1 list-disc pl-4">
                                                {asset.detailedUndervaluationReasons.sentiment.map((reason, idx) => (
                                                  <li key={idx}>{reason}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                      </>
                                    )}

                                    {asset.type === "stock" && (
                                      <div className="mt-2 pt-2 border-t text-xs space-y-1">
                                        <p>
                                          <span className="font-medium">P/E Ratio:</span>{" "}
                                          {asset.peRatio?.toFixed(1) || "N/A"}
                                        </p>
                                        <p>
                                          <span className="font-medium">Forward P/E:</span>{" "}
                                          {asset.forwardPE?.toFixed(1) || "N/A"}
                                        </p>
                                        <p>
                                          <span className="font-medium">Debt/Equity:</span>{" "}
                                          {asset.debtToEquity?.toFixed(1) || "N/A"}%
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-lg font-bold">{asset.undervaluationScore.toFixed(0)}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto min-h-[56px] flex gap-2 items-center justify-between">
                      <Button size="sm" onClick={() => handleAnalyze(asset)}>
                        Analyze
                      </Button>
                      <Button size="sm" onClick={() => handleBuy(asset)} disabled={balance <= 0}>
                        Buy
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleSell(asset)} disabled={!hasAsset}>
                        Sell
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left">
                  <th className="px-4 py-2">Asset</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">24h Change</th>
                  <th className="px-4 py-2">Undervaluation</th>
                  <th className="px-4 py-2">Risk</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOpportunities.map((asset) => {
                  const portfolioAsset = assets.find((a) => a.symbol === asset.symbol)
                  const hasAsset = portfolioAsset && portfolioAsset.quantity > 0

                  return (
                    <tr key={asset.id} className="border-b border-border">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-full p-2 ${getAssetTypeColor(asset.type)}`}>
                            {getAssetTypeIcon(asset.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">{asset.symbol}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">{asset.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">{formatCurrency(asset.price)}</td>
                      <td className={`px-4 py-2 ${asset.priceChange24h < 0 ? "text-red-500" : "text-green-500"}`}>
                        {asset.priceChange24h > 0 ? "+" : ""}
                        {asset.priceChange24h.toFixed(2)}%
                      </td>
                      <td className="px-4 py-2">{asset.undervaluationScore.toFixed(0)}%</td>
                      <td className="px-4 py-2">{getRiskBadge(asset.riskScore)}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAnalyze(asset)}>
                            Analyze
                          </Button>
                          <Button size="sm" onClick={() => handleBuy(asset)} disabled={balance <= 0}>
                            Buy
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleSell(asset)} disabled={!hasAsset}>
                            Sell
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* Buy/Sell Modal */}
      {action && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="capitalize">
                {action} {selectedAsset.symbol}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {action === "buy" ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="amount">Amount</Label>
                    <input
                      type="number"
                      id="amount"
                      value={purchaseAmount}
                      onChange={handlePurchaseAmountChange}
                      min="0"
                      placeholder="Enter amount"
                      className="col-span-2 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  {(() => {
                    const periodKey = getPeriodKey(settings.autoInvestFrequency || "daily")
                    const spentThisPeriod = purchasesThisPeriod.current.filter(p => p.periodKey === periodKey).reduce((sum, p) => sum + p.amount, 0)
                    const remainingThisPeriod = Math.max(0, maxInvestmentPerPeriod - spentThisPeriod)
                    return (
                      <div className="text-xs text-muted-foreground">
                        Remaining this period: <span className="font-semibold">{formatCurrency(remainingThisPeriod)}</span>
                      </div>
                    )
                  })()}
                  <div className="text-right text-muted-foreground">Balance: {typeof balance === 'number' && !isNaN(balance) ? formatCurrency(balance) : '$0.00'}</div>
                  <Button onClick={handleConfirmBuy} disabled={Number.isNaN(Number.parseFloat(purchaseAmount)) || Number.parseFloat(purchaseAmount) <= 0 || Number.parseFloat(purchaseAmount) > balance || Number.parseFloat(purchaseAmount) > maxInvestmentPerPeriod}>
                    Confirm Purchase
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="quantity">Quantity</Label>
                    <input
                      type="number"
                      id="quantity"
                      value={sellQuantity}
                      onChange={handleSellQuantityChange}
                      className="col-span-2 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="text-right text-muted-foreground">
                    Available: {assets.find((a) => a.symbol === selectedAsset.symbol)?.quantity}
                  </div>
                  <Button onClick={handleConfirmSell}>Confirm Sale</Button>
                </div>
              )}
            </CardContent>
            {/* Close Button */}
            <div className="p-4 flex justify-end">
              <Button variant="secondary" onClick={() => setAction(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  )
}
