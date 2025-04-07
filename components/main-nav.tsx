"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Newspaper, User, User2 } from "lucide-react"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex items-center justify-between w-full">
      <div className="flex items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Newspaper className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">NewsFlash</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/" ? "text-foreground font-medium" : "text-foreground/60",
            )}
          >
            Home
          </Link>
          <Link
            href="/category/business"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/category/business") ? "text-foreground font-medium" : "text-foreground/60",
            )}
          >
            Business
          </Link>
          <Link
            href="/category/technology"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/category/technology") ? "text-foreground font-medium" : "text-foreground/60",
            )}
          >
            Technology
          </Link>
          <Link
            href="/category/health"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/category/health") ? "text-foreground font-medium" : "text-foreground/60",
            )}
          >
            Health
          </Link>
          <Link
            href="/fact-check"
            className={cn(
              "transition-colors hover:text-foreground/80 bg-red-500 p-2 rounded-md ",
              pathname?.startsWith("/fact-check") ? "text-foreground font-medium" : "text-foreground/60",
            )}
          >
            Fact Check
          </Link>
          <Link
            href="/leaderboard"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/leaderboard") ? "text-foreground font-medium" : "text-foreground/60",
            )}
          >
            LeaderBoard
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <SignedIn>
          <Link href="/profile">
            <User2/>
          </Link>
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </Link>
        </SignedOut>
      </div>
    </div>
  )
}

