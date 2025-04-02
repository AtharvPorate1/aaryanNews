import { Button } from "@/components/ui/button"
import { getArticleByTitle, getTopHeadlines } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Calendar, ExternalLink, MessageSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CommentSection } from "@/components/comments/comment-section"

export async function generateStaticParams() {
  const news = await getTopHeadlines()

  return news.articles.map((article) => ({
    id: encodeURIComponent(article.title),
  }))
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const {id} = await params;
  const decodedTitle = decodeURIComponent(id)
  const article = await getArticleByTitle(decodedTitle)

  if (!article) {
    notFound()
  }

  // Get related articles (just using other articles from top headlines for demo)
  const news = await getTopHeadlines()
  const relatedArticles = news.articles.filter((a) => a.title !== article.title).slice(0, 3)

  return (
    <div className="container py-8">
      <Link href="/" className="inline-flex items-center mb-6">
        <Button variant="ghost" className="gap-2 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to headlines
        </Button>
      </Link>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Badge className="mb-4">{article.source.name}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{article.title}</h1>

          <div className="flex items-center gap-6 text-muted-foreground">
            {article.author && (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{article.author[0]}</AvatarFallback>
                </Avatar>
                <span>{article.author}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <time dateTime={article.publishedAt}>
                {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
              </time>
            </div>

            <div className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>Comments</span>
            </div>
          </div>
        </header>

        {article.urlToImage && (
          <figure className="relative w-full h-[500px] mb-8 rounded-xl overflow-hidden">
            <Image
              src={article.urlToImage || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <figcaption className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-3 py-1">
              Image: {article.source.name}
            </figcaption>
          </figure>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl leading-relaxed mb-6">{article.description}</p>
          <p className="leading-relaxed">{article.content?.split("[+")[0] || "No content available"}</p>
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-full transition-colors"
          >
            Read full article on {article.source.name}
            <ExternalLink size={16} />
          </a>
        </div>

        <Separator className="my-12" />

        {/* Comment Section */}
        <CommentSection articleId={id} />
      </article>

      <Separator className="my-16" />

      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedArticles.map((relatedArticle, index) => (
            <Link href={`/news/${encodeURIComponent(relatedArticle.title)}`} key={index} className="group">
              <div className="relative w-full h-40 mb-3 overflow-hidden rounded-lg">
                {relatedArticle.urlToImage ? (
                  <Image
                    src={relatedArticle.urlToImage || "/placeholder.svg"}
                    alt={relatedArticle.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">No image available</p>
                  </div>
                )}
              </div>
              <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                {relatedArticle.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(relatedArticle.publishedAt), { addSuffix: true })}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

