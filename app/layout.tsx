import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { TradingViewTickerTape } from "@/components/trading-view-ticker-tape"
import { CoinbaseProvider } from "@/components/coinbase-provider"
import { WalletProvider } from "@/context/wallet-context"
import { PortfolioProvider } from "@/context/portfolio-context"
import { SettingsProvider } from "@/context/settings-context"
// Import Navbar as a default import
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DipBuyer - AI-Powered Undervalued Asset Buying Agent",
  description: "Identify and invest in undervalued financial assets with AI-powered analysis",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
        <link rel="stylesheet" href="/tradingview-fix.css" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <SettingsProvider>
              <CoinbaseProvider>
                <WalletProvider>
                  <PortfolioProvider>
                    <div className="flex min-h-screen flex-col">
                      <TradingViewTickerTape />
                      <Navbar />
                      <main className="flex-1">{children}</main>
                      <Footer />
                      <div className="text-xs text-muted-foreground text-center mt-2">
                        <a href="https://www.vecteezy.com/free-vector/brand" className="hover:underline">
                          Brand Vectors by Vecteezy
                        </a>
                      </div>
                    </div>
                    <Toaster />
                  </PortfolioProvider>
                </WalletProvider>
              </CoinbaseProvider>
            </SettingsProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
