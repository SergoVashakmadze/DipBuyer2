"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"

export function FundHero() {
  const [open, setOpen] = useState(false)
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
    <div className="relative bg-gradient-to-b from-primary/20 to-background pt-16 pb-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex flex-col items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-40 w-40 md:h-52 md:w-52 relative cursor-pointer">
                    <Image
                      src="/images/bull-market-logo.png"
                      alt="DipBuyer Fund Logo"
                      width={208}
                      height={208}
                      className="object-contain"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <span
                    className="hover:underline cursor-pointer text-blue-600"
                    onClick={() => window.open("https://www.vecteezy.com/free-vector/brand", "_blank", "noopener,noreferrer")}
                  >
                    Brand Vectors by Vecteezy
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            <span className="text-primary">Buy The Dip</span> FUND
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8">
            The evolution of investment funds - fully on-chain, transparent, and specialized in identifying undervalued
            assets across markets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="font-bold text-lg px-8" onClick={() => setOpen(true)}>
              Invest Now
            </Button>
            <Button size="lg" variant="outline" className="font-bold text-lg px-8" onClick={() => setOpen(true)}>
              Learn More
            </Button>
          </div>
        </div>
      </div>
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

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-primary/5 hidden lg:block"></div>
      <div className="absolute top-1/3 right-10 w-32 h-32 rounded-full bg-primary/5 hidden lg:block"></div>
    </div>
  )
}
