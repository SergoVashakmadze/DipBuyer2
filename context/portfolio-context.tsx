"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from "react"
import { useWallet } from "./wallet-context"

export interface Asset {
  id: string
  symbol: string
  name: string
  type: "stock" | "etf" | "crypto" | "reit" | "index"
  price: number
  priceChange24h: number
  quantity: number
  value: number
  costBasis: number
  profitLoss: number
  profitLossPercentage: number
  lastTransactionAt: string // ISO date string
}

interface PortfolioHistoryEntry {
  date: string // YYYY-MM-DD
  value: number
}

interface PortfolioContextType {
  assets: Asset[]
  totalValue: number
  totalProfitLoss: number
  totalProfitLossPercentage: number
  buyAsset: (asset: Omit<Asset, "quantity" | "value" | "profitLoss" | "profitLossPercentage">, quantity: number) => void
  sellAsset: (assetId: string, quantity: number) => void
  portfolioHistory: PortfolioHistoryEntry[]
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { executeTransaction } = useWallet()
  const [assets, setAssets] = useState<Asset[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [totalProfitLoss, setTotalProfitLoss] = useState(0)
  const [totalProfitLossPercentage, setTotalProfitLossPercentage] = useState(0)
  const [portfolioHistory, setPortfolioHistory] = useState<PortfolioHistoryEntry[]>([])
  const [loadedAssets, setLoadedAssets] = useState(false)
  const [hasEverLoadedAssets, setHasEverLoadedAssets] = useState(false)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // Load saved portfolio data and history from localStorage
  useEffect(() => {
    const savedAssets = localStorage.getItem("dipbuyer-assets")
    console.log('[PortfolioProvider] Loaded dipbuyer-assets from localStorage:', savedAssets)
    if (savedAssets) setAssets(JSON.parse(savedAssets))
    setLoadedAssets(true)
    setHasEverLoadedAssets(true)
    const savedHistory = localStorage.getItem("dipbuyer-portfolio-history")
    if (savedHistory) setPortfolioHistory(JSON.parse(savedHistory))
  }, [])

  // Save portfolio data to localStorage when it changes
  useEffect(() => {
    console.log('[PortfolioProvider] Saving dipbuyer-assets to localStorage:', assets)
    localStorage.setItem("dipbuyer-assets", JSON.stringify(assets))
  }, [assets])

  // Save portfolio history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("dipbuyer-portfolio-history", JSON.stringify(portfolioHistory))
  }, [portfolioHistory])

  // Calculate portfolio totals and update history when assets change
  useEffect(() => {
    const value = assets.reduce((sum, asset) => sum + asset.value, 0)
    const costBasis = assets.reduce((sum, asset) => sum + asset.costBasis, 0)
    const profitLoss = value - costBasis
    const profitLossPercentage = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0

    setTotalValue(value)
    setTotalProfitLoss(profitLoss)
    setTotalProfitLossPercentage(profitLossPercentage)

    if (!loadedAssets || !hasEverLoadedAssets) return

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    debounceTimeout.current = setTimeout(() => {
      setPortfolioHistory((prev) => {
        // Only record a $0 value if the last entry was not zero, the portfolio was previously nonzero, and assets are truly empty
        if (assets.length === 0 && prev.length > 0 && prev[prev.length - 1].value !== 0) {
          return [...prev, { date: new Date().toISOString(), value: 0 }]
        }
        // Never record a $0 value if assets are not empty or during initial load
        if (assets.length === 0 || value === 0) return prev
        // Only add if value changed
        const now = new Date().toISOString()
        if (prev.length === 0 || prev[prev.length - 1].value !== value) {
          return [...prev, { date: now, value }]
        }
        return prev
      })
    }, 500)
  }, [assets, loadedAssets, hasEverLoadedAssets])

  const buyAsset = (
    asset: Omit<Asset, "quantity" | "value" | "profitLoss" | "profitLossPercentage">,
    quantity: number,
  ) => {
    if (quantity <= 0) return

    const cost = asset.price * quantity

    // Add transaction to wallet
    executeTransaction({
      type: "buy",
      amount: cost,
      asset: asset.symbol,
      price: asset.price,
      quantity,
    })

    // Update portfolio
    setAssets((prev) => {
      const existingAssetIndex = prev.findIndex((a) => a.id === asset.id)
      console.log('[buyAsset] Previous assets:', prev)
      console.log('[buyAsset] Buying asset:', asset, 'Quantity:', quantity)
      if (existingAssetIndex >= 0) {
        // Update existing asset
        const existingAsset = prev[existingAssetIndex]
        const newQuantity = existingAsset.quantity + quantity
        const newCostBasis = existingAsset.costBasis + cost
        const newValue = asset.price * newQuantity
        const newProfitLoss = newValue - newCostBasis
        const newProfitLossPercentage = (newProfitLoss / newCostBasis) * 100
        const now = new Date().toISOString()

        const updatedAsset = {
          ...existingAsset,
          price: asset.price,
          priceChange24h: asset.priceChange24h,
          quantity: newQuantity,
          value: newValue,
          costBasis: newCostBasis,
          profitLoss: newProfitLoss,
          profitLossPercentage: newProfitLossPercentage,
          lastTransactionAt: now,
        }

        const newAssets = [...prev]
        newAssets[existingAssetIndex] = updatedAsset
        console.log('[buyAsset] Updated existing asset:', updatedAsset)
        return newAssets
      } else {
        // Add new asset
        const now = new Date().toISOString()
        const newAsset: Asset = {
          ...asset,
          quantity,
          value: asset.price * quantity,
          costBasis: asset.price * quantity,
          profitLoss: 0,
          profitLossPercentage: 0,
          lastTransactionAt: now,
        }
        console.log('[buyAsset] Adding new asset:', newAsset)
        return [...prev, newAsset]
      }
    })
  }

  const sellAsset = (assetId: string, quantity: number) => {
    if (quantity <= 0) return

    const assetIndex = assets.findIndex((a) => a.id === assetId)
    if (assetIndex < 0) return

    const asset = assets[assetIndex]
    if (quantity > asset.quantity) return

    const saleValue = asset.price * quantity
    const costBasisPerUnit = asset.costBasis / asset.quantity
    const costBasisSold = costBasisPerUnit * quantity

    // Add transaction to wallet
    executeTransaction({
      type: "sell",
      amount: saleValue,
      asset: asset.symbol,
      price: asset.price,
      quantity,
    })

    // Update portfolio
    setAssets((prev) => {
      if (quantity === asset.quantity) {
        // Remove asset if selling all
        return prev.filter((a) => a.id !== assetId)
      } else {
        // Update asset quantity
        const newQuantity = asset.quantity - quantity
        const newCostBasis = asset.costBasis - costBasisSold
        const newValue = asset.price * newQuantity
        const newProfitLoss = newValue - newCostBasis
        const newProfitLossPercentage = (newProfitLoss / newCostBasis) * 100
        const now = new Date().toISOString()

        const updatedAsset = {
          ...asset,
          quantity: newQuantity,
          value: newValue,
          costBasis: newCostBasis,
          profitLoss: newProfitLoss,
          profitLossPercentage: newProfitLossPercentage,
          lastTransactionAt: now,
        }

        const newAssets = [...prev]
        newAssets[assetIndex] = updatedAsset
        return newAssets
      }
    })
  }

  return (
    <PortfolioContext.Provider
      value={{
        assets,
        totalValue,
        totalProfitLoss,
        totalProfitLossPercentage,
        buyAsset,
        sellAsset,
        portfolioHistory,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider")
  }
  return context
}
