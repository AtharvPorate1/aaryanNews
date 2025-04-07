import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { getTopHeadlines } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function Home() {
  const news = await getTopHeadlines()

  // Get the first article for the featured section
  const featuredArticle = news.articles[0]
  const remainingArticles = news.articles.slice(1)

  return (
    <div className="container py-8">
      <section className="mb-12">
        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
          <div className="relative h-[500px] w-full">
            {featuredArticle.urlToImage ? (
              <Image
                src={featuredArticle.urlToImage || "/placeholder.svg"}
                alt={featuredArticle.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <Badge variant="secondary" className="mb-3">
              Featured
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{featuredArticle.title}</h1>
            <p className="text-white/90 mb-4 max-w-3xl">{featuredArticle.description}</p>
            <div className="flex items-center gap-4">
              <p className="text-white/70 text-sm">{featuredArticle.source.name}</p>
              <span className="text-white/70">•</span>
              <p className="text-white/70 text-sm">
                {formatDistanceToNow(new Date(featuredArticle.publishedAt), { addSuffix: true })}
              </p>
              <Link
                href={`/news/${encodeURIComponent(featuredArticle.title)}`}
                className="ml-auto text-white bg-blue-500 hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Tabs defaultValue="all" className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Latest News</h2>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="world">World</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="tech">Tech</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingArticles.map((article, index) => (
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
        </TabsContent>

        {/* Other tabs would have similar content but filtered by category */}
        <TabsContent value="world" className="mt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Select a category to view filtered news.</p>
          </div>
        </TabsContent>
        <TabsContent value="business" className="mt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Select a category to view filtered news.</p>
          </div>
        </TabsContent>
        <TabsContent value="tech" className="mt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Select a category to view filtered news.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

