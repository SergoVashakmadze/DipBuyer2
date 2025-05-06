"use client"

import { useState, useEffect } from "react"
import { Plus, Info, Zap, Calendar, DollarSign, BarChart3, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { useSettings } from "@/context/settings-context"

interface Asset {
  id: string
  symbol: string
  name: string
  type: "stock" | "etf" | "crypto" | "reit" | "index"
  price: number
  allocation: number
  isUndervalued: boolean
  aiConfidence: number
  riskLevel: "low" | "medium" | "high"
}

const availableAssets: Asset[] = [
  {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    type: "crypto",
    price: 42500.25,
    allocation: 30,
    isUndervalued: true,
    aiConfidence: 85,
    riskLevel: "high",
  },
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    type: "crypto",
    price: 2250.75,
    allocation: 20,
    isUndervalued: true,
    aiConfidence: 82,
    riskLevel: "high",
  },
  {
    id: "spy",
    symbol: "SPY",
    name: "S&P 500 ETF",
    type: "etf",
    price: 430.15,
    allocation: 50,
    isUndervalued: false,
    aiConfidence: 90,
    riskLevel: "medium",
  },
  // Add major indexes
  {
    id: "spx",
    symbol: "SPX",
    name: "S&P 500 Index",
    type: "index",
    price: 4780.35,
    allocation: 0,
    isUndervalued: false,
    aiConfidence: 92,
    riskLevel: "medium",
  },
  {
    id: "dji",
    symbol: "DJI",
    name: "Dow Jones Industrial Average",
    type: "index",
    price: 38765.82,
    allocation: 0,
    isUndervalued: false,
    aiConfidence: 94,
    riskLevel: "low",
  },
  {
    id: "ndx",
    symbol: "NDX",
    name: "Nasdaq 100 Index",
    type: "index",
    price: 16832.92,
    allocation: 0,
    isUndervalued: false,
    aiConfidence: 88,
    riskLevel: "medium",
  },
  {
    id: "rut",
    symbol: "RUT",
    name: "Russell 2000 Index",
    type: "index",
    price: 2042.58,
    allocation: 0,
    isUndervalued: true,
    aiConfidence: 86,
    riskLevel: "medium",
  },
  // Other assets
  {
    id: "aapl",
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "stock",
    price: 175.25,
    allocation: 0,
    isUndervalued: false,
    aiConfidence: 75,
    riskLevel: "medium",
  },
  {
    id: "msft",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    type: "stock",
    price: 325.42,
    allocation: 0,
    isUndervalued: false,
    aiConfidence: 78,
    riskLevel: "medium",
  },
  {
    id: "googl",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    type: "stock",
    price: 142.65,
    allocation: 0,
    isUndervalued: true,
    aiConfidence: 88,
    riskLevel: "medium",
  },
  {
    id: "amzn",
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    type: "stock",
    price: 132.65,
    allocation: 0,
    isUndervalued: false,
    aiConfidence: 76,
    riskLevel: "medium",
  },
  {
    id: "voo",
    symbol: "VOO",
    name: "Vanguard S&P 500 ETF",
    type: "etf",
    price: 395.28,
    allocation: 0,
    isUndervalued: false,
    aiConfidence: 92,
    riskLevel: "low",
  },
  {
    id: "vti",
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    type: "etf",
    price: 235.42,
    allocation: 0,
    isUndervalued: false,
    aiConfidence: 91,
    riskLevel: "low",
  },
  {
    id: "qqq",
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    type: "etf",
    price: 365.78,
    allocation: 0,
    isUndervalued: false,
    aiConfidence: 87,
    riskLevel: "medium",
  },
  {
    id: "sol",
    symbol: "SOL",
    name: "Solana",
    type: "crypto",
    price: 105.32,
    allocation: 0,
    isUndervalued: true,
    aiConfidence: 79,
    riskLevel: "high",
  },
  {
    id: "bnb",
    symbol: "BNB",
    name: "Binance Coin",
    type: "crypto",
    price: 580.15,
    allocation: 0,
    isUndervalued: false,
    aiConfidence: 81,
    riskLevel: "high",
  },
  {
    id: "o",
    symbol: "O",
    name: "Realty Income Corporation",
    type: "reit",
    price: 52.35,
    allocation: 0,
    isUndervalued: true,
    aiConfidence: 84,
    riskLevel: "medium",
  },
]

export function InvestmentStrategy() {
  const { toast } = useToast()
  const { settings, updateSettings } = useSettings()
  const [investmentAmount, setInvestmentAmount] = useState<number>(100)
  const [frequency, setFrequency] = useState<string>("weekly")
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>(availableAssets.slice(0, 3))
  const [showAllAssets, setShowAllAssets] = useState<boolean>(false)
  const [onlyUndervalued, setOnlyUndervalued] = useState<boolean>(true)
  const [minConfidence, setMinConfidence] = useState<number>(80)
  const [maxRiskLevel, setMaxRiskLevel] = useState<'low' | 'medium' | 'high'>("medium")
  const [rebalanceFrequency, setRebalanceFrequency] = useState<string>("monthly")
  const [dollarCostAveraging, setDollarCostAveraging] = useState<boolean>(true)
  const [taxLossHarvesting, setTaxLossHarvesting] = useState<boolean>(false)
  const [strategyType, setStrategyType] = useState<string>("balanced")
  const [activeTab, setActiveTab] = useState<string>("configure")
  
  // Settings state
  const [undervaluationThreshold, setUndervaluationThreshold] = useState<number>(settings.undervaluationThreshold)
  const [maxBudgetPerTrade, setMaxBudgetPerTrade] = useState<number>(settings.maxBudgetPerTrade)
  const [riskLevel, setRiskLevel] = useState<string>(settings.riskLevel)
  const [assetTypes, setAssetTypes] = useState({
    stocks: settings.assetTypes.stocks,
    etfs: settings.assetTypes.etfs,
    crypto: settings.assetTypes.crypto,
    indexes: true,
  })

  // Calculate monthly investment amount based on frequency
  const getMonthlyAmount = () => {
    switch (frequency) {
      case "hourly":
        return investmentAmount * 24 * 30 // 24 hours per day, 30 days
      case "daily":
        return investmentAmount * 30
      case "weekly":
        return investmentAmount * 4
      case "biweekly":
        return investmentAmount * 2
      case "monthly":
        return investmentAmount
      default:
        return investmentAmount * 4
    }
  }

  // Calculate next investment date
  const getNextInvestmentDate = () => {
    const now = new Date()
    const nextDate = new Date()

    switch (frequency) {
      case "daily":
        nextDate.setDate(now.getDate() + 1)
        break
      case "weekly":
        nextDate.setDate(now.getDate() + (7 - now.getDay()))
        break
      case "biweekly":
        nextDate.setDate(now.getDate() + 14)
        break
      case "monthly":
        nextDate.setMonth(now.getMonth() + 1)
        nextDate.setDate(1)
        break
      case "quarterly":
        nextDate.setMonth(now.getMonth() + 3)
        nextDate.setDate(1)
        break
      default:
        nextDate.setDate(now.getDate() + 7)
    }

    return nextDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Generate projected growth data
  const generateProjectedGrowth = () => {
    const monthlyAmount = getMonthlyAmount()
    const data = []
    let totalInvested = 0
    let portfolioValue = 0

    // Assume average annual return of 8% (0.64% monthly)
    const monthlyReturn = 0.0064

    // Generate data for 5 years (60 months)
    for (let month = 0; month <= 60; month += 6) {
      if (month === 0) {
        data.push({
          month,
          value: 0,
        })
        continue
      }

      // Add monthly investments
      totalInvested += monthlyAmount * 6

      // Apply returns (compounding)
      portfolioValue = totalInvested * Math.pow(1 + monthlyReturn, month)

      // Add some randomness to make the chart look more realistic
      const randomFactor = 1 + (Math.random() * 0.1 - 0.05)
      portfolioValue *= randomFactor

      data.push({
        month,
        value: Math.round(portfolioValue),
      })
    }

    return data
  }

  // Handle asset selection
  const toggleAssetSelection = (asset: Asset) => {
    if (selectedAssets.some((a) => a.id === asset.id)) {
      setSelectedAssets(selectedAssets.filter((a) => a.id !== asset.id))
    } else {
      setSelectedAssets([...selectedAssets, { ...asset, allocation: 0 }])
    }
  }

  // Update asset allocation
  const updateAssetAllocation = (assetId: string, allocation: number) => {
    setSelectedAssets(
      selectedAssets.map((asset) => {
        if (asset.id === assetId) {
          return { ...asset, allocation }
        }
        return asset
      }),
    )
  }

  // Ensure allocations sum to 100%
  useEffect(() => {
    const totalAllocation = selectedAssets.reduce((sum, asset) => sum + asset.allocation, 0)

    if (totalAllocation !== 100 && selectedAssets.length > 0) {
      // Adjust the last asset to make total 100%
      const newSelectedAssets = [...selectedAssets]
      const lastAsset = newSelectedAssets[newSelectedAssets.length - 1]
      lastAsset.allocation = lastAsset.allocation + (100 - totalAllocation)

      // Ensure no negative allocations
      if (lastAsset.allocation < 0) {
        lastAsset.allocation = 0
        // Redistribute remaining allocation
        const remainingAssets = newSelectedAssets.slice(0, -1)
        const remainingTotal = remainingAssets.reduce((sum, asset) => sum + asset.allocation, 0)
        if (remainingTotal > 0) {
          const factor = 100 / remainingTotal
          remainingAssets.forEach((asset) => {
            asset.allocation = Math.round(asset.allocation * factor)
          })
        }
      }

      setSelectedAssets(newSelectedAssets)
    }
  }, [selectedAssets])

  // Apply predefined strategy
  const applyStrategy = (strategy: string) => {
    let newAssets: Asset[] = []

    switch (strategy) {
      case "conservative":
        // 60% ETFs/Indexes, 30% Stocks, 10% Crypto
        newAssets = [
          { ...availableAssets.find((a) => a.symbol === "SPY")!, allocation: 30 },
          { ...availableAssets.find((a) => a.symbol === "SPX")!, allocation: 30 },
          { ...availableAssets.find((a) => a.symbol === "AAPL")!, allocation: 15 },
          { ...availableAssets.find((a) => a.symbol === "MSFT")!, allocation: 15 },
          { ...availableAssets.find((a) => a.symbol === "BTC")!, allocation: 10 },
        ]
        break
      case "balanced":
        // 40% ETFs/Indexes, 40% Stocks, 20% Crypto
        newAssets = [
          { ...availableAssets.find((a) => a.symbol === "SPY")!, allocation: 20 },
          { ...availableAssets.find((a) => a.symbol === "NDX")!, allocation: 20 },
          { ...availableAssets.find((a) => a.symbol === "AAPL")!, allocation: 15 },
          { ...availableAssets.find((a) => a.symbol === "GOOGL")!, allocation: 15 },
          { ...availableAssets.find((a) => a.symbol === "AMZN")!, allocation: 10 },
          { ...availableAssets.find((a) => a.symbol === "BTC")!, allocation: 10 },
          { ...availableAssets.find((a) => a.symbol === "ETH")!, allocation: 10 },
        ]
        break
      case "aggressive":
        // 20% ETFs/Indexes, 30% Stocks, 50% Crypto
        newAssets = [
          { ...availableAssets.find((a) => a.symbol === "NDX")!, allocation: 20 },
          { ...availableAssets.find((a) => a.symbol === "MSFT")!, allocation: 15 },
          { ...availableAssets.find((a) => a.symbol === "GOOGL")!, allocation: 15 },
          { ...availableAssets.find((a) => a.symbol === "BTC")!, allocation: 25 },
          { ...availableAssets.find((a) => a.symbol === "ETH")!, allocation: 15 },
          { ...availableAssets.find((a) => a.symbol === "SOL")!, allocation: 10 },
        ]
        break
      case "crypto":
        // 100% Crypto
        newAssets = [
          { ...availableAssets.find((a) => a.symbol === "BTC")!, allocation: 50 },
          { ...availableAssets.find((a) => a.symbol === "ETH")!, allocation: 30 },
          { ...availableAssets.find((a) => a.symbol === "SOL")!, allocation: 10 },
          { ...availableAssets.find((a) => a.symbol === "BNB")!, allocation: 10 },
        ]
        break
      case "income":
        // Focus on dividend stocks and REITs
        newAssets = [
          { ...availableAssets.find((a) => a.symbol === "SPY")!, allocation: 30 },
          { ...availableAssets.find((a) => a.symbol === "O")!, allocation: 30 },
          { ...availableAssets.find((a) => a.symbol === "AAPL")!, allocation: 20 },
          { ...availableAssets.find((a) => a.symbol === "MSFT")!, allocation: 20 },
        ]
        break
      case "index":
        // 100% Indexes
        newAssets = [
          { ...availableAssets.find((a) => a.symbol === "SPX")!, allocation: 40 },
          { ...availableAssets.find((a) => a.symbol === "DJI")!, allocation: 20 },
          { ...availableAssets.find((a) => a.symbol === "NDX")!, allocation: 30 },
          { ...availableAssets.find((a) => a.symbol === "RUT")!, allocation: 10 },
        ]
        break;
    }

    setSelectedAssets(newAssets.filter((a) => a !== undefined) as Asset[])
    setStrategyType(strategy)
  }

  // Handle activation
  const handleActivate = () => {
    // Show loading state
    const button = document.activeElement as HTMLButtonElement;
    if (button) {
      const originalText = button.innerHTML;
      button.innerHTML = '<span class="animate-pulse">Activating...</span>';
      
      // Simulate API call
      setTimeout(() => {
        button.innerHTML = originalText;
        
        toast({
          title: "Auto-Invest Activated",
          description: `Your auto-invest strategy has been activated. Next investment: ${getNextInvestmentDate()}`,
        });
        setActiveTab("preview");
      }, 1500);
    } else {
      toast({
        title: "Auto-Invest Activated",
        description: `Your auto-invest strategy has been activated. Next investment: ${getNextInvestmentDate()}`,
      });
      setActiveTab("preview");
    }
  };

  // Handle save as draft
  const handleSaveAsDraft = () => {
    // Show loading state
    const button = document.activeElement as HTMLButtonElement;
    if (button) {
      const originalText = button.innerHTML;
      button.innerHTML = '<span class="animate-pulse">Saving...</span>';
      
      // Simulate API call
      setTimeout(() => {
        button.innerHTML = originalText;
        
        toast({
          title: "Strategy Saved",
          description: "Your investment strategy has been saved as a draft.",
        });
      }, 1500);
    } else {
      toast({
        title: "Strategy Saved",
        description: "Your investment strategy has been saved as a draft.",
      });
    }
  };

  // Save settings
  const handleSaveSettings = () => {
    updateSettings({
      undervaluationThreshold,
      maxBudgetPerTrade,
      riskLevel,
      assetTypes,
    })

    toast({
      title: "Settings Saved",
      description: "Your investment settings have been updated.",
    })
  }

  const projectedGrowthData = generateProjectedGrowth()
  const monthlyAmount = getMonthlyAmount()
  const estimatedValue = projectedGrowthData[projectedGrowthData.length - 1]?.value || 0
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configure">Configure Strategy</TabsTrigger>
          <TabsTrigger value="preview">Strategy Preview</TabsTrigger>
          <TabsTrigger value="settings">Investment Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-6 pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Configure Your Strategy</CardTitle>
                <CardDescription>Set up your automated investment parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strategy-type">Strategy Template</Label>
                    <Select value={strategyType} onValueChange={(value) => applyStrategy(value)}>
                      <SelectTrigger id="strategy-type">
                        <SelectValue placeholder="Select a strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative (Low Risk)</SelectItem>
                        <SelectItem value="balanced">Balanced (Moderate Risk)</SelectItem>
                        <SelectItem value="aggressive">Aggressive (High Risk)</SelectItem>
                        <SelectItem value="crypto">Crypto-Focused</SelectItem>
                        <SelectItem value="income">Income-Focused</SelectItem>
                        <SelectItem value="index">Index-Focused</SelectItem>
                        <SelectItem value="custom">Custom Strategy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="investment-amount">Investment Amount (per period)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-foreground">$</span>
                      <Input
                        id="investment-amount"
                        type="number"
                        className="pl-7"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                        min={1}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="frequency">Investment Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="rebalance">Portfolio Rebalancing</Label>
                    <Select value={rebalanceFrequency} onValueChange={setRebalanceFrequency}>
                      <SelectTrigger id="rebalance">
                        <SelectValue placeholder="Select rebalancing frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never (Manual Only)</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="semiannually">Semi-Annually</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Advanced Features</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="dca" checked={dollarCostAveraging} onCheckedChange={setDollarCostAveraging} />
                    <div className="grid gap-1.5">
                      <Label htmlFor="dca" className="flex items-center gap-2">
                        Dollar-Cost Averaging
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              Invest a fixed amount at regular intervals, regardless of asset price, to reduce the
                              impact of volatility.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="tax-loss" checked={taxLossHarvesting} onCheckedChange={setTaxLossHarvesting} />
                    <div className="grid gap-1.5">
                      <Label htmlFor="tax-loss" className="flex items-center gap-2">
                        Tax-Loss Harvesting
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              Automatically sell investments that have experienced losses to offset capital gains taxes
                              on other investments.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Criteria</CardTitle>
                <CardDescription>Define rules for your automated investments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="undervalued"
                      checked={onlyUndervalued}
                      onCheckedChange={(checked) => setOnlyUndervalued(checked === true)}
                    />
                    <Label htmlFor="undervalued" className="flex items-center gap-2">
                      Only invest in undervalued assets
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            The system will only invest in assets that are identified as undervalued based on our
                            analysis.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="confidence" className="flex items-center gap-2">
                        <input type="checkbox" checked={minConfidence > 0} onChange={e => setMinConfidence(e.target.checked ? 80 : 0)} />
                        Minimum AI confidence score
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              Our AI assigns a confidence score to each investment recommendation. This setting filters out recommendations below your threshold.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                    </div>
                    {minConfidence > 0 && (
                      <input
                        type="range"
                        min={50}
                        max={100}
                        step={1}
                        value={minConfidence}
                        onChange={e => setMinConfidence(Number(e.target.value))}
                        className="w-full"
                      />
                    )}
                    {minConfidence > 0 && <div className="text-xs text-muted-foreground">{minConfidence}%</div>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="risk" className="flex items-center gap-2">
                      Maximum risk level
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            Sets the maximum risk level for assets in your portfolio. Higher risk may lead to higher
                            potential returns but with increased volatility.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="flex gap-4">
                      {["low", "medium", "high"].map(risk => (
                        <label key={risk} className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="maxRiskLevel"
                            value={risk}
                            checked={maxRiskLevel === risk}
                            onChange={() => setMaxRiskLevel(risk as 'low' | 'medium' | 'high')}
                          />
                          <span className="capitalize">{risk}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Market Conditions</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="bear-market" defaultChecked />
                    <Label htmlFor="bear-market" className="flex items-center gap-2">
                      Increase investments during bear markets
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            Automatically increase your investment amount during market downturns to take advantage of
                            lower prices.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="volatility" defaultChecked />
                    <Label htmlFor="volatility" className="flex items-center gap-2">
                      Pause during extreme volatility
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            Temporarily pause investments during periods of extreme market volatility.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6 pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Preview</CardTitle>
                <CardDescription>Overview of your automated investment plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Monthly Investment: {formatCurrency(monthlyAmount)}</h3>
                  <div className="mt-4 space-y-4">
                    {selectedAssets.map((asset) => (
                      <div key={asset.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span>
                            {asset.symbol} ({asset.name})
                          </span>
                          <span className="font-medium">
                            {formatCurrency((monthlyAmount * asset.allocation) / 100)} ({asset.allocation}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${asset.allocation}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Strategy Details</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Frequency:</span>
                    </div>
                    <span className="text-sm font-medium capitalize">{frequency}</span>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Amount per period:</span>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(investmentAmount)}</span>

                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Rebalancing:</span>
                    </div>
                    <span className="text-sm font-medium capitalize">{rebalanceFrequency}</span>

                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Strategy type:</span>
                    </div>
                    <span className="text-sm font-medium capitalize">{strategyType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projected Growth (5 Years)</CardTitle>
                <CardDescription>Estimated portfolio value over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectedGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={(value) => `${value}m`}
                        label={{ value: "Months", position: "insideBottom", offset: -5 }}
                      />
                      <YAxis
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                        label={{ value: "Portfolio Value", angle: -90, position: "insideLeft" }}
                      />
                      <RechartsTooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
                        labelFormatter={(label: number) => `Month ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Estimated portfolio value: {formatCurrency(estimatedValue)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on historical average returns. Actual results may vary.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Auto-Invest Schedule</CardTitle>
              <CardDescription>Your upcoming automated investments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Next investment:</p>
                    <p className="font-medium">{getNextInvestmentDate()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Frequency:</p>
                    <p className="font-medium capitalize">{frequency}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Amount per period:</p>
                    <p className="font-medium">{formatCurrency(investmentAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Monthly total:</p>
                    <p className="font-medium">{formatCurrency(monthlyAmount)}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-2">Upcoming Investments</h3>
                  <div className="border rounded-md divide-y">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const date = new Date()
                      switch (frequency) {
                        case "daily":
                          date.setDate(date.getDate() + i + 1)
                          break
                        case "weekly":
                          date.setDate(date.getDate() + (i + 1) * 7)
                          break
                        case "biweekly":
                          date.setDate(date.getDate() + (i + 1) * 14)
                          break
                        case "monthly":
                          date.setMonth(date.getMonth() + i + 1)
                          break
                        case "quarterly":
                          date.setMonth(date.getMonth() + (i + 1) * 3)
                          break
                      }

                      return (
                        <div key={i} className="p-3 grid grid-cols-3">
                          <div>
                            <p className="font-medium">
                              {date.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm">{formatCurrency(investmentAmount)}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">Scheduled</Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("configure")}>
                Edit Strategy
              </Button>
              <Button variant="destructive">Pause Auto-Invest</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Settings</CardTitle>
              <CardDescription>Configure your global investment preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="undervaluation-threshold">Undervaluation Threshold (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="undervaluation-threshold"
                      value={[undervaluationThreshold]}
                      min={0}
                      max={50}
                      step={1}
                      className="flex-1"
                      onValueChange={(value) => setUndervaluationThreshold(value[0])}
                    />
                    <span className="w-12 text-center">{undervaluationThreshold}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Only show assets undervalued by at least this percentage
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-budget">Maximum Budget per Trade</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-foreground">$</span>
                    <Input
                      id="max-budget"
                      type="number"
                      className="pl-7"
                      value={maxBudgetPerTrade}
                      onChange={(e) => setMaxBudgetPerTrade(Number(e.target.value))}
                      min={1}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maximum amount to invest in a single trade
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="risk-level">Risk Level</Label>
                  <div className="flex gap-4">
                    {["low", "medium", "high"].map(risk => (
                      <label key={risk} className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="maxRiskLevel"
                          value={risk}
                          checked={maxRiskLevel === risk}
                          onChange={() => setMaxRiskLevel(risk as 'low' | 'medium' | 'high')}
                        />
                        <span className="capitalize">{risk}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Asset Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="stocks"
                        checked={assetTypes.stocks}
                        onCheckedChange={(checked) => setAssetTypes({ ...assetTypes, stocks: !!checked })}
                      />
                      <Label htmlFor="stocks">Stocks</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="etfs"
                        checked={assetTypes.etfs}
                        onCheckedChange={(checked) => setAssetTypes({ ...assetTypes, etfs: !!checked })}
                      />
                      <Label htmlFor="etfs">ETFs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="crypto"
                        checked={assetTypes.crypto}
                        onCheckedChange={(checked) => setAssetTypes({ ...assetTypes, crypto: !!checked })}
                      />
                      <Label htmlFor="crypto">Crypto</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="indexes"
                        checked={assetTypes.indexes}
                        onCheckedChange={(checked) => setAssetTypes({ ...assetTypes, indexes: !!checked })}
                      />
                      <Label htmlFor="indexes">Indexes</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
