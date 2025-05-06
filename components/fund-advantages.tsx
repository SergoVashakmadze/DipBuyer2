import { CheckCircle } from "lucide-react"

export function FundAdvantages() {
  const advantages = [
    {
      title: "Algorithmic Intelligence",
      items: [
        "Leverage the same AI-powered analysis that drives DipBuyer.ai",
        "Systematic identification of undervalued assets without emotional bias",
        "Continuous market monitoring for optimal entry points",
      ],
    },
    {
      title: "Blockchain-Native Benefits",
      items: [
        "Full transparency: all transactions, holdings, and performance visible on-chain",
        "Fractional ownership allowing investors to participate with any amount",
        "Automated operations reducing overhead and maximizing returns",
        "Permissionless access to sophisticated investment strategies",
      ],
    },
    {
      title: "Democratizing Professional Investing",
      items: [
        "Access to institutional-grade investment strategies without massive capital requirements",
        "Elimination of traditional gatekeepers and intermediaries",
        "Global accessibility regardless of location or financial status",
      ],
    },
    {
      title: "Operational Efficiency",
      items: [
        "Smart contract automation reducing management costs",
        "Near-instant settlement of transactions",
        "Programmatic rebalancing and strategy execution",
      ],
    },
    {
      title: "Enhanced Liquidity",
      items: [
        "Tokenized fund shares tradable 24/7",
        "Secondary market opportunities beyond traditional redemption",
        "No lock-up periods typical of traditional investment funds",
      ],
    },
  ]

  return (
    <section className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Key Advantages</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          BuyTheDip.Fund combines the best of traditional investment wisdom with blockchain innovation.
        </p>
      </div>

      <div className="space-y-12">
        {advantages.map((advantage, index) => (
          <div key={index} className="border-b border-border pb-8 last:border-0">
            <h3 className="text-2xl font-bold mb-4">
              {index + 1}. {advantage.title}
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advantage.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
