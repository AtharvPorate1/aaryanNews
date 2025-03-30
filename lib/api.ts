export interface NewsArticle {
    source: {
      id: string | null
      name: string
    }
    author: string | null
    title: string
    description: string
    url: string
    urlToImage: string | null
    publishedAt: string
    content: string | null
  }
  
  export interface NewsResponse {
    status: string
    totalResults: number
    articles: NewsArticle[]
  }
  
  export async function getTopHeadlines(country = "us", category?: string): Promise<NewsResponse> {
    const apiKey = process.env.NEWS_API_KEY
  
    if (!apiKey) {
      throw new Error("NEWS_API_KEY environment variable is not set")
    }
  
    let url = `https://newsapi.org/v2/top-headlines?country=${country}`
  
    if (category) {
      url += `&category=${category}`
    }
  
    url += `&apiKey=${apiKey}`
  
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
  
    if (!response.ok) {
      throw new Error("Failed to fetch news")
    }
  
    return response.json()
  }
  
  export async function searchNews(query: string): Promise<NewsResponse> {
    const apiKey = process.env.NEWS_API_KEY
  
    if (!apiKey) {
      throw new Error("NEWS_API_KEY environment variable is not set")
    }
  
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`
  
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
  
    if (!response.ok) {
      throw new Error("Failed to search news")
    }
  
    return response.json()
  }
  
  export async function getArticleByTitle(title: string): Promise<NewsArticle | null> {
    const news = await getTopHeadlines()
    return news.articles.find((article) => article.title === title) || null
  }
  
  