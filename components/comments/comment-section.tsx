"use client"

import { useState, useEffect } from "react"
import { Comment, type CommentType } from "./comment"
import { CommentForm } from "./comment-form"
import { Separator } from "@/components/ui/separator"
import { v4 as uuidv4 } from "uuid"

interface CommentSectionProps {
  articleId: string
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load comments from localStorage on mount
  useEffect(() => {
    const loadComments = () => {
      if (typeof window !== "undefined") {
        const savedComments = localStorage.getItem(`comments-${articleId}`)
        if (savedComments) {
          setComments(JSON.parse(savedComments))
        }
        setIsLoading(false)
      }
    }

    loadComments()
  }, [articleId])

  // Save comments to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && !isLoading) {
      localStorage.setItem(`comments-${articleId}`, JSON.stringify(comments))
    }
  }, [comments, articleId, isLoading])

  // Function to organize comments into a tree structure
  const organizeComments = (flatComments: CommentType[]): CommentType[] => {
    const commentMap: Record<string, CommentType> = {}
    const rootComments: CommentType[] = []

    // First pass: create a map of all comments by ID
    flatComments.forEach((comment) => {
      commentMap[comment.id] = {
        ...comment,
        replies: [],
      }
    })

    // Second pass: organize into parent-child relationships
    flatComments.forEach((comment) => {
      if (comment.parentId) {
        // This is a reply, add it to its parent's replies
        if (commentMap[comment.parentId]) {
          commentMap[comment.parentId].replies!.push(commentMap[comment.id])
        }
      } else {
        // This is a root comment
        rootComments.push(commentMap[comment.id])
      }
    })

    // Sort root comments by creation date (newest first)
    return rootComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const handleAddComment = (author: string, content: string) => {
    const newComment: CommentType = {
      id: uuidv4(),
      author,
      content,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      parentId: null,
      replies: [],
    }

    setComments((prev) => [newComment, ...prev])
  }

  const handleAddReply = (parentId: string, author: string, content: string) => {
    const newReply: CommentType = {
      id: uuidv4(),
      author,
      content,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      parentId,
    }

    setComments((prev) => [...prev, newReply])
  }

  const handleVote = (id: string, direction: "up" | "down") => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === id) {
          // If user already voted the same way, remove the vote
          if (comment.userVote === direction) {
            return {
              ...comment,
              upvotes: direction === "up" ? comment.upvotes - 1 : comment.upvotes,
              downvotes: direction === "down" ? comment.downvotes - 1 : comment.downvotes,
              userVote: null,
            }
          }

          // If user voted the opposite way, switch the vote
          if (comment.userVote) {
            return {
              ...comment,
              upvotes: direction === "up" ? comment.upvotes + 1 : comment.upvotes - 1,
              downvotes: direction === "down" ? comment.downvotes + 1 : comment.downvotes - 1,
              userVote: direction,
            }
          }

          // If user hasn't voted yet
          return {
            ...comment,
            upvotes: direction === "up" ? comment.upvotes + 1 : comment.upvotes,
            downvotes: direction === "down" ? comment.downvotes + 1 : comment.downvotes,
            userVote: direction,
          }
        }
        return comment
      }),
    )
  }

  // Organize comments into a tree structure
  const organizedComments = organizeComments(comments)

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      <CommentForm articleId={articleId} onAddComment={handleAddComment} />

      <Separator className="my-8" />

      {isLoading ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Loading comments...</p>
        </div>
      ) : organizedComments.length > 0 ? (
        <div className="space-y-4">
          {organizedComments.map((comment) => (
            <div key={comment.id} className="mb-6">
              <Comment comment={comment} onVote={handleVote} onReply={handleAddReply} />
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </section>
  )
}

