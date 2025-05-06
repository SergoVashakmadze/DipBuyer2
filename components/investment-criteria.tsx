"use client"

import { Info, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function InvestmentCriteria() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Criteria & Data Sources</CardTitle>
        <CardDescription>Learn about our investment methodology and data sources</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-2">
            <AccordionTrigger>Technical Analysis Indicators</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>In addition to fundamental analysis, we use these technical indicators:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Moving Averages</span>
                      <p className="text-sm text-muted-foreground">
                        50-day and 200-day moving averages to identify trends and potential reversals.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Relative Strength Index (RSI)</span>
                      <p className="text-sm text-muted-foreground">
                        Identifies overbought or oversold conditions in the market.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">MACD (Moving Average Convergence Divergence)</span>
                      <p className="text-sm text-muted-foreground">Helps identify potential entry and exit points.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Support and Resistance Levels</span>
                      <p className="text-sm text-muted-foreground">
                        Historical price points where an asset tends to find support or resistance.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Data Sources</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>Our platform aggregates data from multiple reliable sources:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">TradingView API</span>
                      <p className="text-sm text-muted-foreground">
                        For real-time and historical price data, technical indicators, and charting.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Financial Data APIs</span>
                      <p className="text-sm text-muted-foreground">
                        Including Alpha Vantage, Yahoo Finance, and IEX Cloud for fundamental data.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Coinbase Developer Platform</span>
                      <p className="text-sm text-muted-foreground">
                        For cryptocurrency data, wallet integration, and transactions.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">SEC EDGAR Database</span>
                      <p className="text-sm text-muted-foreground">
                        For official company filings and financial statements.
                      </p>
                    </div>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Note:</span> In the current demonstration version, we use simulated
                    data to showcase the platform's capabilities. In a production environment, all data would be sourced
                    from the APIs mentioned above with real-time updates.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
