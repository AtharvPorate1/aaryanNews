"use client"

import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Mail, MessageSquare, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

// Placeholder data for user comments
// const userComments = [
//   {
//     id: 1,
//     article: "Why Electric Vehicles Are the Future of Transportation",
//     category: "Technology",
//     comment:
//       "I've been driving an EV for two years now and completely agree with this article. The charging infrastructure has improved dramatically in my area.",
//     date: "2 days ago",
//     likes: 14,
//     replies: 3,
//   },
//   {
//     id: 2,
//     article: "Global Markets React to Interest Rate Changes",
//     category: "Business",
//     comment:
//       "This analysis misses some key factors about how emerging markets are responding differently this time. The situation in Southeast Asia is particularly interesting.",
//     date: "1 week ago",
//     likes: 27,
//     replies: 8,
//   },
//   {
//     id: 3,
//     article: "New Study Reveals Benefits of Intermittent Fasting",
//     category: "Health",
//     comment:
//       "I've been practicing 16:8 intermittent fasting for months now. While I've seen some of the benefits mentioned, I think the article overstates the weight loss effects.",
//     date: "2 weeks ago",
//     likes: 9,
//     replies: 5,
//   },
//   {
//     id: 4,
//     article: "Fact Check: Viral Social Media Post About Climate Change",
//     category: "Fact Check",
//     comment:
//       "Thank you for this thorough fact check. I've seen this misinformation shared by several friends and now I can point them to this article.",
//     date: "3 weeks ago",
//     likes: 32,
//     replies: 0,
//   },
// ]

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [userComments, setUserComments] = useState<any>([])


 const fetchComments = async () => {
    // console.log('Fetching comments for ', user?.fullName);
    
    const response = await fetch(`/api/comments/${user?.fullName}`);
    const { comments } = await response.json();
    
    setUserComments(comments);
  };

  const getTotalUpvotes = () => {
    return userComments.reduce((sum: number, comment: any) => {
      return sum + (comment.upvotes || 0);
    }, 0);
  };

  useEffect(()=>{
    if(user?.fullName){
      fetchComments()
    }
  },[user?.fullName])



  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>
  }

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{user?.fullName}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {user?.primaryEmailAddress?.emailAddress}
            </CardDescription>
            <CardDescription className="flex items-center gap-1 mt-1">
              <CalendarDays className="h-4 w-4" />
              Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Technology</Badge>
                  <Badge>Business</Badge>
                  <Badge>Health</Badge>
                  <Badge>Politics</Badge>
                  <Badge>Science</Badge>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-2">Activity</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>{userComments.length} Comments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    <span>{getTotalUpvotes()}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Activity */}
        <div className="md:col-span-2">
          <Tabs defaultValue="comments">
            <TabsList className="mb-4">
              <TabsTrigger value="comments">My Comments</TabsTrigger>
              <TabsTrigger value="saved">Saved Articles</TabsTrigger>
              <TabsTrigger value="history">Reading History</TabsTrigger>
            </TabsList>

            <TabsContent value="comments">
              <div className="space-y-4">
                {userComments.map((comment:any) => (
                  <Card key={comment._id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{comment.articleId}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            {/* <Badge variant="outline">{comment.category}</Badge> */}
                            <span className="text-xs text-muted-foreground">{comment.date}</span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{comment.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>{comment.upvotes} likes</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{Math.floor(Math.random() * 10)} replies</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="saved">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Articles</CardTitle>
                  <CardDescription>Articles you've saved for later reading</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">You haven't saved any articles yet.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Reading History</CardTitle>
                  <CardDescription>Articles you've recently read</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Your reading history will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

