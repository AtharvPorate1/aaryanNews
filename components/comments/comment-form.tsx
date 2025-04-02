"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/hooks/use-toast"

interface CommentFormProps {
  articleId: string
  onAddComment: (author: string, content: string) => void
}

export function CommentForm({ articleId, onAddComment }: CommentFormProps) {
  const [author, setAuthor] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("commentAuthor") || ""
    }
    return ""
  })
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
//   const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // if (!author.trim()) {
    //   toast({
    //     title: "Name required",
    //     description: "Please enter your name to comment",
    //     variant: "destructive",
    //   })
    //   return
    // }

    // if (!content.trim()) {
    //   toast({
    //     title: "Comment required",
    //     description: "Please enter a comment",
    //     variant: "destructive",
    //   })
    //   return
    // }

    setIsSubmitting(true)

    // Save author name to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("commentAuthor", author)
    }

    // Add comment
     onAddComment(author, content)

    // Reset form
    setContent("")
    setIsSubmitting(false)

    // toast({
    //   title: "Comment added",
    //   description: "Your comment has been added successfully",
    // })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary">
            {author ? author[0].toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          {/* <input
            type="text"
            placeholder="Your name"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          /> */}

          <Textarea
            placeholder="Add a comment..."
            className="min-h-[100px] resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

