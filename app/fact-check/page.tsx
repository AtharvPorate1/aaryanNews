"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, AlertTriangle, Info, Search, Clock, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Mock function to simulate fact checking
// In a real application, this would call an API or use an AI model
function simulateFactCheck(title: string, description: string) {
  // Simple simulation logic - in reality, this would be a sophisticated algorithm
  const combinedText = (title + " " + description).toLowerCase()

  // Keywords that might indicate fake news
  const fakeNewsIndicators = [
    "shocking",
    "they don't want you to know",
    "conspiracy",
    "secret",
    "miracle",
    "cure",
    "government hiding",
    "cover up",
    "hoax",
    "scam",
  ]

  // Count how many fake news indicators are present
  const indicatorsFound = fakeNewsIndicators.filter((word) => combinedText.includes(word))

  // Calculate a "truth score" - this is just for demonstration
  // In reality, this would be based on much more sophisticated analysis
  let truthScore = 85 // Start with a default score

  // Reduce score for each indicator found
  truthScore -= indicatorsFound.length * 15

  // Add some randomness to make it interesting
  truthScore += Math.floor(Math.random() * 10) - 5

  // Ensure score stays within 0-100 range
  truthScore = Math.max(0, Math.min(100, truthScore))

  // Generate a verdict based on the score
  let verdict = ""
  let icon = null
  let color = ""

  if (truthScore >= 80) {
    verdict = "Likely True"
    icon = <CheckCircle2 className="h-6 w-6 text-green-500" />
    color = "bg-green-500"
  } else if (truthScore >= 60) {
    verdict = "Partially True"
    icon = <Info className="h-6 w-6 text-blue-500" />
    color = "bg-blue-500"
  } else if (truthScore >= 40) {
    verdict = "Unverified"
    icon = <Clock className="h-6 w-6 text-yellow-500" />
    color = "bg-yellow-500"
  } else if (truthScore >= 20) {
    verdict = "Misleading"
    icon = <AlertTriangle className="h-6 w-6 text-orange-500" />
    color = "bg-orange-500"
  } else {
    verdict = "Likely False"
    icon = <XCircle className="h-6 w-6 text-red-500" />
    color = "bg-red-500"
  }

  // Generate reasoning based on the verdict
  let reasoning = ""
  if (indicatorsFound.length > 0) {
    reasoning = `The text contains potentially misleading terms: ${indicatorsFound.join(", ")}. `
  }

  reasoning += {
    "Likely True":
      "The information appears to be consistent with verified sources and does not contain typical misinformation patterns.",
    "Partially True":
      "Some aspects of this information appear accurate, but certain details may be misleading or require additional context.",
    Unverified:
      "This information cannot be verified with reliable sources at this time. Exercise caution before sharing.",
    Misleading:
      "While some elements may be factual, the overall framing appears to be misleading or lacks important context.",
    "Likely False":
      "This information contains multiple red flags consistent with known misinformation patterns and contradicts verified sources.",
  }[verdict]

  // Generate related verified facts
  const relatedFacts = [
    "According to recent studies, verifying information across multiple reputable sources increases accuracy by 73%.",
    "Fact-checking organizations follow rigorous methodologies to verify claims before publishing results.",
    "Headlines designed to trigger emotional responses are more likely to contain misinformation.",
    "Context is crucial - even factually accurate statements can be misleading when presented without proper context.",
  ]

  // Simulate a brief delay to make it feel like processing is happening
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        verdict,
        truthScore,
        reasoning,
        relatedFacts,
        icon,
        color,
        indicatorsFound,
      })
    }, 1500)
  })
}

export default function FactCheckPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [recentChecks, setRecentChecks] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setIsChecking(true)
    try {
      const checkResult = await simulateFactCheck(title, description)
      setResult(checkResult)

      // Add to recent checks
      setRecentChecks((prev) => [
        {
          id: Date.now(),
          title,
          verdict: (checkResult as any).verdict,
          icon: (checkResult as any).icon,
        },
        ...prev.slice(0, 4),
      ])
    } catch (error) {
      console.error("Error checking facts:", error)
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Fact Check</h1>
          <p className="text-muted-foreground mt-2">
            Verify the accuracy of news stories by submitting the title and content below.
          </p>
        </div>

        <Tabs defaultValue="check">
          <TabsList>
            <TabsTrigger value="check">Check Facts</TabsTrigger>
            <TabsTrigger value="recent">Recent Checks</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="check" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Submit News for Fact Checking
                </CardTitle>
                <CardDescription>Enter the title and content of the news you want to verify</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">News Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter the headline or title of the news"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">News Content</Label>
                    <Textarea
                      id="description"
                      placeholder="Paste the full text or main claims of the news article"
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isChecking}>
                    {isChecking ? "Analyzing..." : "Check Facts"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {isChecking && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2 text-center">
                    <p>Analyzing content and checking against verified sources...</p>
                    <Progress value={45} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {result && !isChecking && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result.icon}
                      <span>Fact Check Result: {result.verdict}</span>
                    </div>
                    <Badge variant="outline" className="text-white" style={{ backgroundColor: result.color }}>
                      {result.truthScore}% confidence
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Analysis</h3>
                    <p>{result.reasoning}</p>

                    {result.indicatorsFound && result.indicatorsFound.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-1">Potential misinformation indicators found:</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.indicatorsFound.map((indicator: string, i: number) => (
                            <Badge key={i} variant="secondary">
                              {indicator}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Related Verified Facts</h3>
                    <ul className="space-y-2">
                      {result.relatedFacts.map((fact: string, i: number) => (
                        <li key={i} className="flex gap-2">
                          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTitle("")
                      setDescription("")
                      setResult(null)
                    }}
                  >
                    Check Another
                  </Button>
                  <Button>Share Result</Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recent" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Fact Checks</CardTitle>
                <CardDescription>Your previously checked news items</CardDescription>
              </CardHeader>
              <CardContent>
                {recentChecks.length > 0 ? (
                  <div className="space-y-4">
                    {recentChecks.map((check) => (
                      <div key={check.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div className="flex items-center gap-3">
                          {check.icon}
                          <div>
                            <p className="font-medium">{check.title}</p>
                            <p className="text-sm text-muted-foreground">Result: {check.verdict}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No recent fact checks. Start by checking a news item.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>About Our Fact Checking</CardTitle>
                <CardDescription>How we verify information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our fact-checking process combines advanced AI analysis with journalistic standards to evaluate the
                  accuracy of news content. We analyze text patterns, cross-reference with verified sources, and provide
                  a confidence score based on multiple factors.
                </p>

                <div>
                  <h3 className="font-medium mb-2">Our Rating System</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Likely True (80-100%)</p>
                        <p className="text-sm text-muted-foreground">Information is consistent with verified sources</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Partially True (60-79%)</p>
                        <p className="text-sm text-muted-foreground">Some aspects accurate, but may need context</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Unverified (40-59%)</p>
                        <p className="text-sm text-muted-foreground">Cannot be verified with reliable sources</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Misleading (20-39%)</p>
                        <p className="text-sm text-muted-foreground">Contains misleading elements or lacks context</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">Likely False (0-19%)</p>
                        <p className="text-sm text-muted-foreground">
                          Contains multiple red flags or contradicts verified sources
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Important Note</AlertTitle>
                  <AlertDescription>
                    This is a demonstration tool and should not be the sole basis for determining the accuracy of
                    information. Always verify important news with multiple reputable sources.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

