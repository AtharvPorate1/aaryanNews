"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, ThumbsDown, Flag, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReplyForm } from "./reply-form"

export interface CommentType {
  id: string
  author: string
  content: string
  createdAt: string
  upvotes: number
  downvotes: number
  userVote?: "up" | "down" | null
  parentId?: string | null
  replies?: CommentType[]
}

interface CommentProps {
  comment: CommentType
  onVote: (id: string, direction: "up" | "down") => void
  onReply: (parentId: string, author: string, content: string) => void
  depth?: number
  maxDepth?: number
}

export function Comment({ comment, onVote, onReply, depth = 0, maxDepth = 5 }: CommentProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(true)
  const hasReplies = comment.replies && comment.replies.length > 0
  const replyCount = comment.replies?.length || 0

  const handleVote = (direction: "up" | "down") => {
    setIsVoting(true)
    onVote(comment.id, direction)
    setTimeout(() => setIsVoting(false), 300)
  }

  const handleReplySubmit = (author: string, content: string) => {
    onReply(comment.id, author, content)
    setShowReplyForm(false)
  }

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm)
  }

  const toggleReplies = () => {
    setShowReplies(!showReplies)
  }

  return (
    <div className={cn("animate-in fade-in-0 duration-500", depth > 0 && "ml-6 pl-6 border-l")}>
      <div className="flex gap-4 py-4 group">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary">{comment.author[0].toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{comment.author}</h4>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Flag className="h-4 w-4" />
              <span className="sr-only">Report</span>
            </Button>
          </div>

          <p className="text-sm">{comment.content}</p>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-8 px-2 text-xs gap-1", comment.userVote === "up" && "text-primary font-medium")}
                onClick={() => handleVote("up")}
                disabled={isVoting}
              >
                <ThumbsUp
                  className={cn("h-4 w-4", comment.userVote === "up" && "fill-primary", isVoting && "animate-ping")}
                />
                <span>{comment.upvotes}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={cn("h-8 px-2 text-xs gap-1", comment.userVote === "down" && "text-destructive font-medium")}
                onClick={() => handleVote("down")}
                disabled={isVoting}
              >
                <ThumbsDown
                  className={cn(
                    "h-4 w-4",
                    comment.userVote === "down" && "fill-destructive",
                    isVoting && "animate-ping",
                  )}
                />
                <span>{comment.downvotes}</span>
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1" onClick={toggleReplyForm}>
              <MessageSquare className="h-4 w-4" />
              <span>Reply</span>
            </Button>

            {hasReplies && (
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1" onClick={toggleReplies}>
                {showReplies ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span>
                      Hide {replyCount} {replyCount === 1 ? "reply" : "replies"}
                    </span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>
                      Show {replyCount} {replyCount === 1 ? "reply" : "replies"}
                    </span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-12 mt-2 mb-4">
          <ReplyForm onReply={handleReplySubmit} />
        </div>
      )}

      {hasReplies && showReplies && depth < maxDepth && (
        <div className="mt-1 mb-2">
          {comment.replies!.map((reply) => (
            <div key={reply.id}>
              <Comment comment={reply} onVote={onVote} onReply={onReply} depth={depth + 1} maxDepth={maxDepth} />
            </div>
          ))}
        </div>
      )}

      {hasReplies && showReplies && depth >= maxDepth && (
        <div className="ml-6 pl-6 border-l py-3">
          <Button variant="link" className="text-xs p-0 h-auto">
            Continue this thread ({comment.replies!.length} more {comment.replies!.length === 1 ? "reply" : "replies"})
          </Button>
        </div>
      )}
    </div>
  )
}

