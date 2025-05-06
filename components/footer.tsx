import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          Copyright © {new Date().getFullYear()} Dip Buyer - All Rights Reserved.{" "}
          <Link
            href="https://www.vecteezy.com/free-vector/brand"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Brand Vectors by Vecteezy
          </Link>
        </p>
      </div>
    </footer>
  )
}
