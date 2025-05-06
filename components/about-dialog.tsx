"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button id="about-dialog-trigger" variant="ghost">
          About
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>About DipBuyer</DialogTitle>
          <DialogDescription>AI-Powered Undervalued Asset Buying Agent</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <p>
              DipBuyer is an AI-powered agent designed to identify potentially undervalued financial assets including
              stocks, ETFs, and cryptocurrencies.
            </p>
            <p className="mt-2">
              The agent leverages advanced algorithms to analyze market data and identify assets that may be trading
              below their intrinsic value, presenting opportunities for investment.
            </p>
            <p className="mt-2">
              This is a simulation environment for educational purposes. No real transactions are made.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              document.querySelector('[data-state="open"]')?.dispatchEvent(new Event("close", { bubbles: true }))
            }
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
