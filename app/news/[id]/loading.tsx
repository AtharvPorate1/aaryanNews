import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function ArticleLoading() {
  return (
    <div className="container py-8">
      <Link href="/" className="inline-flex items-center mb-6">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft size={16} />
          Back to headlines
        </Button>
      </Link>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-12 w-full mb-3" />
          <Skeleton className="h-12 w-3/4 mb-6" />

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </header>

        <Skeleton className="w-full h-[500px] mb-8 rounded-xl" />

        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>

        <div className="mt-8 flex justify-center">
          <Skeleton className="h-12 w-64 rounded-full" />
        </div>
      </article>

      <Separator className="my-16" />

      <section className="max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="w-full h-40 mb-3 rounded-lg" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

