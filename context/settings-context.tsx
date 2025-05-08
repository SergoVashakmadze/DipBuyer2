"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface Settings {
  undervaluationThreshold: number
  riskLevel: "low" | "medium" | "high"
  assetTypes: {
    stocks: boolean
    etfs: boolean
    crypto: boolean
  }
  maxBudgetPerTrade: number
  autoInvest: boolean
  autoInvestAmount?: number
  autoInvestFrequency?: string
  autoInvestOnlyUndervalued?: boolean
  autoInvestMinConfidenceEnabled?: boolean
  autoInvestMinConfidence?: number
  autoInvestMaxRiskLevel?: 'low' | 'medium' | 'high'
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
}

const defaultSettings: Settings = {
  undervaluationThreshold: 10,
  riskLevel: "medium",
  assetTypes: {
    stocks: true,
    etfs: true,
    crypto: true,
  },
  maxBudgetPerTrade: 1000,
  autoInvest: false,
  autoInvestAmount: 10000,
  autoInvestFrequency: "hourly",
  autoInvestOnlyUndervalued: true,
  autoInvestMinConfidenceEnabled: true,
  autoInvestMinConfidence: 80,
  autoInvestMaxRiskLevel: "medium",
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("dipbuyer-settings")
    if (savedSettings) setSettings(JSON.parse(savedSettings))
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("dipbuyer-settings", JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }))
  }

  // Add resetSettings implementation
  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.setItem("dipbuyer-settings", JSON.stringify(defaultSettings))
  }

  return <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
