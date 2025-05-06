"use client"

import React, { useRef, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import Image from "next/image"
import { getTradingViewChartUrl } from "@/components/asset-opportunities"

export default function AboutPage() {
  const quoteRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!quoteRef.current || !videoRef.current) return

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play()
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(quoteRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <DashboardShell>
      <DashboardHeader heading="About DipBuyer" description="Learn the philosophy and mission behind DipBuyer." />
      <div className="prose max-w-3xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-primary mb-4">Our Mission: Financial Inclusion for All</h2>
        <p className="mb-8 text-lg">
          DipBuyer is designed for everyone. Whether you're a seasoned investor or just starting out, our tools help you identify, analyze, and invest in undervalued opportunities—no expertise required.
        </p>
        <h3>Buy Low, Sell High: The Rationale</h3>
        <p>
          The core principle of investing is simple: <b>Buy Low, Sell High</b>. DipBuyer is built around this timeless wisdom, making it accessible to everyone. "Buying the Dip" means purchasing assets when their prices have fallen, often due to temporary market overreactions, with the expectation that they will recover and grow in value.
        </p>
        <h4>What is "Buying the Dip"?</h4>
        <p>
          "Buying the Dip" is a contrarian investment strategy that involves purchasing assets after they have experienced a decline, under the belief that the drop is temporary and the asset will rebound. This approach is supported by decades of market data and is often cited by legendary investors like Warren Buffett and Peter Lynch. As Buffett famously said, "Be fearful when others are greedy and greedy when others are fearful."
        </p>
        <h4>Why Undervalued Assets Matter</h4>
        <p>
          Undervalued assets exist even in strong bull markets. DipBuyer empowers anyone—regardless of technical or financial background—to benefit from these opportunities. Our mission is to promote <b>financial inclusion</b> by making sophisticated investment strategies simple and accessible.
        </p>
        <section className="press-headlines">
          <h2 className="text-xl font-bold mb-2">Press Headlines</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <a
                href="https://www.reuters.com/business/finance/for-our-country-chinas-patriots-are-buying-dip-2025-04-22/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                For Our Country: China's Patriots Are Buying the Dip – Reuters
              </a>
            </li>
            <li>
              <a
                href="https://www.britannica.com/money/buy-the-dip"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Buy the Dip – Britannica Money
              </a>
            </li>
            <li>
              <a
                href="https://www.bloomberg.com/news/articles/2025-04-15/retail-traders-unbowed-by-market-tumult-preach-dip-buying-mantra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Retail Traders Unbowed by Market Tumult Preach Dip-Buying Mantra – Bloomberg
              </a>
            </li>
            <li>
              <a
                href="https://fortune.com/2025/04/11/retail-investors-buying-dip-trump-tariffs/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Retail Investors Are Buying the Dip: Investment Platforms Report Spikes – Fortune
              </a>
            </li>
          </ul>
        </section>
        <h4>Opportunity in Crisis: The Chinese Perspective</h4>
        <p>
          The phrase "in the middle of difficulty lies opportunity" is often associated with the Chinese character for "crisis", which is 危机 (wēi jī). While 危 (wēi) means "danger," 机 (jī) can be interpreted as a crucial point or inflection, where opportunity may arise. This concept is echoed in the famous (though not literal) quote by John F. Kennedy: "When written in Chinese, the word 'crisis' is composed of two characters—one represents danger, and the other represents opportunity." It reminds us that challenges in the market can also be moments of great potential.
        </p>
        <blockquote>
          "In the middle of difficulty lies opportunity." — Albert Einstein
        </blockquote>
        <blockquote>
          "Be fearful when others are greedy and greedy when others are fearful." — Warren Buffett
        </blockquote>
        <blockquote ref={quoteRef}>
          <span style={{
            fontSize: '2rem',
            color: '#d7263d',
            fontWeight: 'bold',
            display: 'block',
            textAlign: 'center',
            margin: '2em 0'
          }}>
            "Don't be a schmuck! Buy the Dip!"
          </span>
        </blockquote>
        <div className="flex justify-center gap-4 mb-8">
          <video
            ref={videoRef}
            controls
            muted
            style={{ maxWidth: '800px', width: '100%', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}
          >
            <source src="/AdobeStock_853801422.mp4" type="video/mp4" />
            <source src="/AdobeStock_853801422.mov" type="video/quicktime" />
            Your browser does not support the video tag. Please try a different browser or contact support.
          </video>
        </div>
        <p className="mt-8 text-center text-lg font-bold text-primary">
          Ready to start? <a href="/" className="underline">Go to Dashboard</a>
        </p>
      </div>
    </DashboardShell>
  )
} 