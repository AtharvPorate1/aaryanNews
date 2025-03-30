import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { searchNews } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q

  if (!query) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Search News</h1>
        <p className="text-muted-foreground">Enter a search term to find articles.</p>
      </div>
    )
  }

  const results = await searchNews(query)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-muted-foreground mb-8">
        Found {results.totalResults} results for "{query}"
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.articles.map((article, index) => (
          <Link href={`/news/${encodeURIComponent(article.title)}`} key={index} className="group">
            <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative w-full h-48 overflow-hidden">
                {article.urlToImage ? (
                  <Image
                    src={article.urlToImage || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">No image available</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {article.source.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground line-clamp-3">{article.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

