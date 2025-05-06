import { ArrowUpRight, Shield, Zap, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function FundValueProposition() {
  return (
    <section className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Core Value Proposition</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          BuyTheDip.Fund represents the evolution of investment funds - a fully on-chain, transparent investment vehicle
          that specializes in identifying and capitalizing on undervalued assets across markets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <ArrowUpRight className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Algorithmic Intelligence</h3>
                <p className="text-muted-foreground">
                  Leverage the same AI-powered analysis that drives DipBuyer.ai for systematic identification of
                  undervalued assets without emotional bias.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Blockchain-Native Benefits</h3>
                <p className="text-muted-foreground">
                  Full transparency with all transactions, holdings, and performance visible on-chain, plus fractional
                  ownership allowing investors to participate with any amount.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Democratizing Professional Investing</h3>
                <p className="text-muted-foreground">
                  Access to institutional-grade investment strategies without massive capital requirements, eliminating
                  traditional gatekeepers and intermediaries.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Enhanced Liquidity</h3>
                <p className="text-muted-foreground">
                  Tokenized fund shares tradable 24/7 with secondary market opportunities beyond traditional redemption
                  and no lock-up periods.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
