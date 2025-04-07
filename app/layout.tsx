import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Search } from "@/components/search"
import { ClerkProvider } from "@clerk/nextjs"
import { Footer } from "@/components/footer"
// import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "Veracity Terminal",
  description: "Latest news from around the world",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen w-full flex justify-center bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center justify-between">
                <MainNav />
                <div className="flex items-center gap-4">
                  <Search />
                  <ModeToggle />
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <Footer/>
          </div>
          {/* <Toaster /> */}
         
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}

