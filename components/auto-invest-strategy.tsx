"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { useSettings } from "@/context/settings-context"

export function AutoInvestStrategy() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const [amount, setAmount] = useState(settings?.autoInvestAmount?.toString() || "10000")
  const [frequency, setFrequency] = useState(settings?.autoInvestFrequency || "hourly")
  const [onlyUndervalued, setOnlyUndervalued] = useState(settings?.autoInvestOnlyUndervalued ?? true)
  const [minConfidenceEnabled, setMinConfidenceEnabled] = useState(settings?.autoInvestMinConfidenceEnabled ?? true)
  const [minConfidence, setMinConfidence] = useState(settings?.autoInvestMinConfidence ?? 80)
  const [maxRiskLevel, setMaxRiskLevel] = useState<'low' | 'medium' | 'high'>(settings?.autoInvestMaxRiskLevel || "medium")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [resetting, setResetting] = useState(false)

  // Calculate monthly investment based on frequency
  const getMonthlyInvestment = () => {
    const amountNum = Number.parseFloat(amount) || 0
    switch (frequency) {
      case "hourly":
        return amountNum * 24 * 30
      case "daily":
        return amountNum * 30
      case "weekly":
        return amountNum * 4
      case "biweekly":
        return amountNum * 2
      case "monthly":
        return amountNum
      default:
        return amountNum * 4
    }
  }
  const monthlyInvestment = getMonthlyInvestment()

  // Generate projected growth data
  const generateGrowthData = () => {
    const data = []
    let value = 0
    for (let month = 0; month <= 60; month += 6) {
      value = monthlyInvestment * month * (1 + 0.08) ** (month / 12)
      data.push({
        month: `${month}m`,
        value: Math.round(value),
      })
    }
    return data
  }
  const growthData = generateGrowthData()
  const estimatedValue = growthData[growthData.length - 1].value

  const handleSave = () => {
    setSaving(true)
    updateSettings({
      autoInvestAmount: Number(amount),
      autoInvestFrequency: frequency,
      autoInvestOnlyUndervalued: onlyUndervalued,
      autoInvestMinConfidenceEnabled: minConfidenceEnabled,
      autoInvestMinConfidence: minConfidence,
      autoInvestMaxRiskLevel: maxRiskLevel,
    })
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1200)
  }

  // Add a handleBuy function to use the current investment amount as the default buy amount
  const handleBuy = (balance: number, amount: string, onPrompt: (msg: string) => void) => {
    const buyAmount = Number.parseFloat(amount) || 0
    if (buyAmount > balance) {
      onPrompt("You do not have enough funds. Please change the investment amount or add funds to your wallet.")
      return false
    }
    // Proceed with buy logic here
    return true
  }

  // Add a handleReset function
  const handleReset = () => {
    setResetting(true)
    // Reset global settings, but set autoInvestAmount to 0
    resetSettings()
    updateSettings({ autoInvestAmount: 0 })
    // Reset local state to default values, but amount to "0"
    setAmount("0")
    setFrequency("hourly")
    setOnlyUndervalued(true)
    setMinConfidenceEnabled(true)
    setMinConfidence(80)
    setMaxRiskLevel("medium")
    setTimeout(() => setResetting(false), 1000)
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Configuration */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Configure Your Strategy</h2>
          <div className="space-y-6">
            {/* Investment Amount */}
            <div>
              <Label htmlFor="investment-amount">Investment Amount (per period)</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input
                  id="investment-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  placeholder="Enter amount"
                />
              </div>
            </div>
            {/* Investment Frequency */}
            <div>
              <Label htmlFor="investment-frequency">Investment Frequency</Label>
              <select
                id="investment-frequency"
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
                className="w-full border rounded p-2 mt-1"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            {/* Investment Criteria */}
            <div>
              <Label className="block mb-2">Investment Criteria</Label>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="undervalued-only"
                    checked={onlyUndervalued}
                    onChange={e => setOnlyUndervalued(e.target.checked)}
                  />
                  <Label htmlFor="undervalued-only">Only invest in undervalued assets</Label>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="min-confidence-enabled"
                      checked={minConfidenceEnabled}
                      onChange={e => setMinConfidenceEnabled(e.target.checked)}
                    />
                    <Label htmlFor="min-confidence-enabled">Minimum AI confidence score</Label>
                  </div>
                  {minConfidenceEnabled && (
                    <>
                      <Slider
                        min={50}
                        max={100}
                        step={1}
                        value={[minConfidence]}
                        onValueChange={([v]) => setMinConfidence(v)}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground">{minConfidence}%</div>
                    </>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Maximum risk level</Label>
                  <div className="flex gap-4 mt-1">
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
            </div>
            {/* Save and Reset Buttons */}
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? <span className="animate-pulse">Saving...</span> : saved ? "Saved!" : "Save"}
              </Button>
              <Button onClick={handleReset} disabled={resetting} variant="outline" className="w-full">
                {resetting ? <span className="animate-pulse">Resetting...</span> : "Reset"}
              </Button>
            </div>
          </div>
        </div>
        {/* Right column - Preview */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Strategy Preview</h2>
          <Card className="p-4 mb-6">
            <h3 className="text-lg font-medium mb-3">Monthly Investment: ${monthlyInvestment}</h3>
            <div className="mb-2 text-sm text-muted-foreground">
              Frequency: <span className="font-medium capitalize">{frequency}</span>
            </div>
            <div className="mb-2 text-sm text-muted-foreground">
              Only undervalued: <span className="font-medium">{onlyUndervalued ? "Yes" : "No"}</span>
            </div>
            <div className="mb-2 text-sm text-muted-foreground">
              Minimum AI confidence: <span className="font-medium">{minConfidenceEnabled ? `${minConfidence}%` : "Disabled"}</span>
            </div>
            <div className="mb-2 text-sm text-muted-foreground">
              Maximum risk level: <span className="font-medium capitalize">{maxRiskLevel}</span>
            </div>
          </Card>
          <Card className="p-4 mb-6">
            <h3 className="text-lg font-medium mb-3">Projected Growth (5 Years)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2 text-sm text-gray-500">
              Estimated portfolio value: ${estimatedValue.toLocaleString()}
            </div>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
