import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
      <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
      <Link href="/">
        <Button>Return to Home</Button>
      </Link>
    </div>
  )
}

