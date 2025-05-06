"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function FundCTA() {
  const [open, setOpen] = useState(false)
  const [visionOpen, setVisionOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message: "Fund interest",
        }),
      })
      if (res.ok) {
        setStatus("success")
        setName("")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <section className="py-12">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-8 md:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Future of Investing?</h2>
            <p className="text-lg mb-8">
              BuyTheDip.Fund bridges traditional finance and DeFi, offering sophisticated contrarian investing with the
              innovations of blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="font-bold text-lg px-8" onClick={() => setOpen(true)}>
                Invest Now
              </Button>
              <Button size="lg" variant="outline" className="font-bold text-lg px-8" onClick={() => setOpen(true)}>
                Download Whitepaper
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Launching Soon</DialogTitle>
            <DialogDescription>Leave your details and we will keep you posted about the launch.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {status === "success" ? (
              <div className="text-center py-6">
                <div className="rounded-full bg-primary/20 p-3 mx-auto mb-2 w-fit">
                  <svg width="32" height="32" fill="none"><path d="M16 29C23.1797 29 29 23.1797 29 16C29 8.8203 23.1797 3 16 3C8.8203 3 3 8.8203 3 16C3 23.1797 8.8203 29 16 29Z" fill="#22C55E"/><path d="M10 16.5L14 20.5L22 12.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-xl font-semibold">Message Sent!</h3>
                <p className="text-muted-foreground">Thank you for your interest. We'll keep you posted about the launch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <p>Meanwhile, leave your details and we'll keep you posted.</p>
                <Input
                  type="text"
                  placeholder="Your Name"
                  className="w-full"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="w-full"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Button className="w-full mt-2" type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Submitting..." : "Submit"}
                </Button>
                {status === "error" && (
                  <div className="text-red-600 text-sm mt-2">Failed to send. Please try again.</div>
                )}
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-4">Strategic Positioning</h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          BuyTheDip.Fund isn't just another crypto project; it's a practical application of blockchain that solves real
          problems in the investment world. We're creating not just a product but a movement toward more transparent,
          efficient, and accessible investment vehicles.
        </p>
        <div className="flex justify-center">
          <Button variant="link" className="text-lg" onClick={() => setVisionOpen(true)}>
            Learn more about our vision →
          </Button>
        </div>
        <Dialog open={visionOpen} onOpenChange={setVisionOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Our Vision</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p>We envision a world where anyone can access the best investment opportunities, regardless of background or resources. BuyTheDip.Fund is committed to transparency, inclusion, and innovation in finance.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
