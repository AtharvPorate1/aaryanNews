import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db/dbconfig";
import Comment from "@/lib/db/models/comment";

connectToDb();

export async function POST(req: any, { params }: any) {
  try {
    const { articleId } = await params;
    const { parentId, author, content } = await req.json();

    if (parentId) {
      const newReply = {
        author,
        articleId,
        content,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        parentId,
      };

      // const addedReply = addReply(articleId, parentId, newReply);
      const addedReply = await Comment.create(newReply);
      if (!addedReply) {
        return NextResponse.json(
          { success: false, error: "Parent comment not found" },
          { status: 404 }
        );
      }
    } else {
      const newComment = {
        author,
        articleId,
        content,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        parentId: null,
      };

      const addedComment = await Comment.create(newComment);
    }

    const allComments = await Comment.find({ articleId: articleId });
    return NextResponse.json(
      { success: true, comments: allComments },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: any, { params }: any) {
  try {
    const { articleId } = await params;

    const comments = await Comment.find({ articleId: articleId });
    if (!comments) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, comments: comments },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
