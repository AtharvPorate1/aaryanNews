import { readCommentsByArticle, addComment, addReply, updateVote } from "@/lib/db";
import { NextResponse } from "next/server";



export async function POST(req:any, { params }:any) {
  try {
    const { articleId } = await params;
    const { parentId, author, content } = await req.json();

    if (parentId) {
      const newReply = {
        author,
        content,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        parentId,
      };

      const addedReply = addReply(articleId, parentId, newReply);
      if (!addedReply) {
        return NextResponse.json({ success: false, error: "Parent comment not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, reply: addedReply }, { status: 201 });
    } else {
      const newComment = {
        author,
        content,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        parentId: null,
      };

      const addedComment = addComment(articleId, newComment);
      return NextResponse.json({ success: true, comment: addedComment }, { status: 201 });
    }
  } catch (error:any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function PATCH(req:any, { params }:any) {
    try {

      const { articleId } = await params;
      const { commentId, direction } = await req.json();

  
      const updatedComments = updateVote(articleId, commentId, direction);
      if (!updatedComments) {
        return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, comments: updatedComments }, { status: 200 });
    } catch (error:any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }

export async function GET(req:any, { params }:any) {
    try {

      const { articleId } = await params;
     
      const comments = readCommentsByArticle(articleId);
      if (!comments) {
        return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, comments: comments }, { status: 200 });
    } catch (error:any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
