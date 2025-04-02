import { readCommentsByArticle, addComment, addReply, updateVote } from "@/lib/db";
import { NextResponse } from "next/server";


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