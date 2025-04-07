import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-8">
        <div className="flex flex-col items-center text-center">
          <div className="space-y-3 mb-6">
            <h3 className="font-bold text-lg">NewsHub</h3>
            <p className="text-muted-foreground text-sm">
              Your trusted source for the latest news and updates from around the world.
            </p>
          </div>

          <Separator className="mb-6 w-full" />

          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground w-full">
            <p>© {new Date().getFullYear()} NewsHub. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

