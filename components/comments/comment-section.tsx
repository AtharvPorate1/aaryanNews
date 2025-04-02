"use client";

import { useState, useEffect } from "react";
import { Comment, type CommentType } from "./comment";
import { CommentForm } from "./comment-form";
import { Separator } from "@/components/ui/separator";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";

interface CommentSectionProps {
  articleId: string;
}

interface UserData {
  id: string;
  fullName: string | null;
  primaryEmailAddress: {
    emailAddress: string;
  };
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [organizedComments, setOrganizedComments] = useState<any>([]);

  const { isLoaded, isSignedIn, user } = useUser();
  const id = user?.id || "";
  const fullName = user?.fullName || "";
  const emailAddress = user?.primaryEmailAddress?.emailAddress || "";

  const fetchComments = async () => {
    const response = await fetch(`/api/comments/${articleId}`);
    const { comments } = await response.json();
    setComments(comments);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const organizeComments = (flatComments: CommentType[]): CommentType[] => {
    const commentMap: Record<string, CommentType> = {};
    const rootComments: CommentType[] = [];

    // First pass: create a map of all comments by ID
    flatComments.forEach((comment) => {
      commentMap[comment.id] = {
        ...comment,
        replies: [],
      };
    });

    // Second pass: organize into parent-child relationships
    flatComments.forEach((comment) => {
      if (comment.parentId) {
        // This is a reply, add it to its parent's replies
        if (commentMap[comment.parentId]) {
          commentMap[comment.parentId].replies!.push(commentMap[comment.id]);
        }
      } else {
        // This is a root comment
        rootComments.push(commentMap[comment.id]);
      }
    });

    // Sort root comments by creation date (newest first)
    return rootComments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const handleAddComment = async (author: string, content: string) => {
    const newComment = {
      author:fullName,
      content,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      parentId: null,
    };

    const response = await fetch(`/api/comments/${articleId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    });

    if (response.ok) {
      const { comment } = await response.json();
      setComments(comment);
    }
  };

  const handleAddReply = async (
    parentId: string,
    author: string,
    content: string
  ) => {
    const newReply = {
      parentId,
      author:fullName,
      content,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      userVote: null,
    };

    const response = await fetch(`/api/comments/${articleId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReply),
    });

    if (response.ok) {
      const { reply } = await response.json();

      setComments(reply);
    }
  };

  const handleVote = async (id: string, direction: "up" | "down") => {
    const response = await fetch(`/api/comments/${articleId}/vote`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId: id, direction }),
    });

    if (response.ok) {
      const { comments } = await response.json();
      setComments(comments);
    }
  };

  useEffect(() => {
    const flattenComments = organizeComments(comments);
    setOrganizedComments(flattenComments);
  }, [comments]);

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
          {organizedComments.map((comment: any) => (
            <div key={comment.id} className="mb-6">
              <Comment
                comment={comment}
                onVote={handleVote}
                onReply={handleAddReply}
              />
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        </div>
      )}
    </section>
  );
}
