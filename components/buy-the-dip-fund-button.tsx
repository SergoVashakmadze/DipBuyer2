"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function BuyTheDipFundButton() {
  const router = useRouter()

  const handleClick = () => {
    // In a real application, this would redirect to www.buythedip.fund
    // For this demo, we'll navigate to the fund page within our app
    router.push("/fund")
  }

  return (
    <Button onClick={handleClick} variant="ghost" className="flex items-center gap-2">
      Fund
    </Button>
  )
}
