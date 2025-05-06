"use client"

import { useTheme } from "@/components/theme-provider"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

export function FundChart() {
  const { theme } = useTheme()
  // Only allow these three symbols
  const allowedSymbols = [
    { label: "S&P 500", symbol: "FOREXCOM:SPXUSD" },
    { label: "Nasdaq 100", symbol: "FOREXCOM:NSXUSD" },
    { label: "Bitcoin", symbol: "BITSTAMP:BTCUSD" },
  ]
  const [selectedSymbol, setSelectedSymbol] = useState<string>(allowedSymbols[0].symbol)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const widgetRef = useRef<any>(null)
  const chartIdRef = useRef<string>(`tradingview-widget-${Date.now()}`)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Force a refresh of the chart
  const refreshChart = () => {
    setIsLoading(true)
    setError(null)
    chartIdRef.current = `tradingview-widget-${Date.now()}`
    if (widgetRef.current) {
      try {
        widgetRef.current = null
      } catch (e) {
        console.error("Error cleaning up widget:", e)
      }
    }
    initializeChart()
  }

  useEffect(() => {
    const handleAnalyzeAsset = (event: CustomEvent) => {
      if (!event.detail || !event.detail.symbol) return
      setSelectedSymbol(event.detail.symbol)
      setIsLoading(true)
      setError(null)
      chartIdRef.current = `tradingview-widget-${Date.now()}`
    }
    window.addEventListener("analyzeAsset", handleAnalyzeAsset as EventListener)
    return () => {
      window.removeEventListener("analyzeAsset", handleAnalyzeAsset as EventListener)
    }
  }, [])

  const safeRemoveScript = () => {
    if (scriptRef.current) {
      try {
        if (scriptRef.current.parentNode === document.head) {
          document.head.removeChild(scriptRef.current)
        }
        scriptRef.current = null
      } catch (e) {
        console.error("Error removing script:", e)
      }
    }
  }

  const initializeChart = () => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ""
    setIsLoading(true)
    setError(null)
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }
    loadingTimeoutRef.current = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        setError("Chart loading timed out. Please try refreshing.")
      }
    }, 15000)
    const isDarkMode =
      theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    const widgetContainer = document.createElement("div")
    widgetContainer.id = chartIdRef.current
    widgetContainer.style.width = "100%"
    widgetContainer.style.height = "100%"
    containerRef.current.appendChild(widgetContainer)
    if (window.TradingView) {
      createWidget(widgetContainer.id, isDarkMode)
      return
    }
    safeRemoveScript()
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => {
      createWidget(widgetContainer.id, isDarkMode)
    }
    script.onerror = () => {
      setError("Failed to load TradingView chart library")
      setIsLoading(false)
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
    }
    document.head.appendChild(script)
    scriptRef.current = script
  }

  const createWidget = (containerId: string, isDarkMode: boolean) => {
    if (!window.TradingView) {
      setError("TradingView library not loaded")
      setIsLoading(false)
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
      return
    }
    try {
      const widgetOptions = {
        autosize: true,
        symbol: selectedSymbol,
        interval: "D",
        timezone: "Etc/UTC",
        theme: isDarkMode ? "dark" : "light",
        style: "1",
        locale: "en",
        toolbar_bg: isDarkMode ? "#1e293b" : "#ffffff",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: containerId,
        studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
        backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
        gridColor: isDarkMode ? "#475569" : "#cbd5e1",
        overrides: {
          "mainSeriesProperties.candleStyle.upColor": "#22c55e",
          "mainSeriesProperties.candleStyle.downColor": "#ef4444",
          "mainSeriesProperties.lineStyle.color": isDarkMode ? "#60a5fa" : "#2563eb",
          "scalesProperties.textColor": isDarkMode ? "#f8fafc" : "#334155",
          "paneProperties.background": isDarkMode ? "#1e293b" : "#ffffff",
          "paneProperties.vertGridProperties.color": isDarkMode
            ? "rgba(148, 163, 184, 0.3)"
            : "rgba(100, 116, 139, 0.2)",
          "paneProperties.horzGridProperties.color": isDarkMode
            ? "rgba(148, 163, 184, 0.3)"
            : "rgba(100, 116, 139, 0.2)",
        },
        loading_screen: { backgroundColor: isDarkMode ? "#1e293b" : "#ffffff" },
        hide_side_toolbar: false,
        saved_data: null,
        disabled_features: [],
        enabled_features: [],
      }
      const widget = new window.TradingView.widget(widgetOptions)
      widgetRef.current = widget
      setTimeout(() => {
        setIsLoading(false)
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current)
          loadingTimeoutRef.current = null
        }
      }, 3000)
    } catch (e) {
      console.error("Error creating TradingView widget:", e)
      setError("Failed to create chart")
      setIsLoading(false)
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
    }
  }

  useEffect(() => {
    initializeChart()
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
      safeRemoveScript()
      widgetRef.current = null
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [selectedSymbol, theme])

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Market Chart</h2>
        <p className="text-muted-foreground">Interactive TradingView chart for S&amp;P 500, Nasdaq, and Bitcoin</p>
        <div className="flex gap-2 mt-2">
          {allowedSymbols.map((item) => (
            <Button
              key={item.symbol}
              variant={selectedSymbol === item.symbol ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSymbol(item.symbol)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="relative" style={{ minHeight: 500 }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Loading chart data...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80">
            <div className="text-center max-w-md p-4">
              <p className="text-sm text-destructive font-medium mb-2">{error}</p>
              <p className="text-xs text-muted-foreground">Try refreshing the chart or selecting a different asset.</p>
              <button className="mt-4 btn btn-primary" onClick={refreshChart}>Retry</button>
            </div>
          </div>
        )}
        <div
          ref={containerRef}
          style={{ height: "500px", width: "100%", backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff" }}
        />
      </div>
    </div>
  )
}
