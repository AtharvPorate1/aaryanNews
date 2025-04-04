"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/hooks/use-toast"

interface ReplyFormProps {
  onReply: (author: string, content: string) => void
}

export function ReplyForm({ onReply }: ReplyFormProps) {
  const [author, setAuthor] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("commentAuthor") || ""
    }
    return ""
  })
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // if (!author.trim()) {
    //   toast({
    //     title: "Name required",
    //     description: "Please enter your name to reply",
    //     variant: "destructive",
    //   })
    //   return
    // }

    // if (!content.trim()) {
    //   toast({
    //     title: "Reply required",
    //     description: "Please enter a reply",
    //     variant: "destructive",
    //   })
    //   return
    // }

    setIsSubmitting(true)

    // Save author name to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("commentAuthor", author)
    }

    // Add reply
    onReply(author, content)

    // Reset form
    setContent("")
    setIsSubmitting(false)

    // toast({
    //   title: "Reply added",
    //   description: "Your reply has been added successfully",
    // })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* <input
        type="text"
        placeholder="Your name"
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      /> */}

      <Textarea
        placeholder="Write a reply..."
        className="min-h-[80px] resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <div className="flex justify-end gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Reply"}
        </Button>
      </div>
    </form>
  )
}

