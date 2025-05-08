"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, PieChart, Wallet, BookOpen, Zap } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { BuyTheDipFundButton } from "@/components/buy-the-dip-fund-button"
import { ContactDialog } from "@/components/contact-dialog"

export default function Navbar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/portfolio",
      label: "Portfolio",
      icon: PieChart,
      active: pathname === "/portfolio",
    },
    {
      href: "/wallet",
      label: "Wallet",
      icon: Wallet,
      active: pathname === "/wallet",
    },
    {
      href: "/auto-invest",
      label: "Auto-Invest",
      icon: Zap,
      active: pathname === "/auto-invest",
    },
    {
      href: "/learn",
      label: "Learn",
      icon: BookOpen,
      active: pathname === "/learn",
    },
  ]

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-24 w-24 relative mt-4" style={{ width: 120, height: 'auto' }}>
                  <Image
                    src="/images/bull-market-logo.png"
                    alt="DipBuyer Logo"
                    width={120}
                    height={120}
                    className="object-contain"
                    priority
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
          <span className="text-xl font-bold">DipBuyer</span>
          <span className="hidden md:inline-block text-sm text-muted-foreground ml-2">
            - AI Agent for Buying Undervalued Assets
          </span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <Button asChild>
              <Link href="/about">About</Link>
            </Button>
            {routes.map((route) => (
              <Button key={route.href} variant={route.active ? "default" : "ghost"} asChild>
                <Link href={route.href} className="flex items-center gap-2">
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
            <ContactDialog />
            <BuyTheDipFundButton />
          </div>
          <ThemeToggle />
        </div>
      </div>
      <div className="md:hidden flex justify-between px-2 pb-2">
        <Button asChild>
          <Link href="/about">About</Link>
        </Button>
        {routes.map((route) => (
          <Button
            key={route.href}
            variant={route.active ? "default" : "ghost"}
            size="sm"
            asChild
            className={cn("flex-1 justify-center", route.active ? "bg-primary text-primary-foreground" : "")}
          >
            <Link href={route.href} className="flex flex-col items-center gap-1 py-1">
              <route.icon className="h-4 w-4" />
              <span className="text-xs">{route.label}</span>
            </Link>
          </Button>
        ))}
        <ContactDialog />
        <BuyTheDipFundButton />
      </div>
    </nav>
  )
}

// Also export as named export for compatibility
export { Navbar }
