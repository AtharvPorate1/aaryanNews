export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface FactCheck {
  is_fake: boolean;
  message: string | null;
  prediction: string | null;
}

export async function getTopHeadlines(
  country = "us",
  category?: string
): Promise<NewsResponse> {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    throw new Error("NEWS_API_KEY environment variable is not set");
  }

  let url = `https://newsapi.org/v2/top-headlines?country=${country}`;

  if (category) {
    url += `&category=${category}`;
  }

  url += `&apiKey=${apiKey}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  return response.json();
}

export async function searchNews(query: string): Promise<NewsResponse> {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    throw new Error("NEWS_API_KEY environment variable is not set");
  }

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    query
  )}&apiKey=${apiKey}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error("Failed to search news");
  }

  return response.json();
}

export async function getArticleByTitle(
  title: string
): Promise<NewsArticle | null> {
  const news = await getTopHeadlines();
  return news.articles.find((article) => article.title === title) || null;
}

export async function factCheck(
  title: string,
  author: string,
  description: string
): Promise<FactCheck | null> {
  let url = "https://fake-news-ai-0re4.onrender.com/predict";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, text: description }),
  });

  if (!response.ok) {
    throw new Error("Failed to fact-check article");
  }

  return response.json();
}

export async function pingServer(): Promise<string> {
  const url = "https://fake-news-ai-0re4.onrender.com/";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to ping server");
  }
  return response.text();
}

setInterval(async () => {
  try {
    const result = await pingServer();
    console.log("Ping successful:", result);
  } catch (error) {
    console.error("Ping failed:", error);
  }
}, 300000);
