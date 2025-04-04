
import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db/dbconfig";
import Comment from "@/lib/db/models/comment";

connectToDb();
export async function PATCH(req: any, { params }: any) {
  try {
    const { articleId } = await params;

    const { commentId, direction } = await req.json();

    const comment: any = await Comment.findById(commentId);
    
    comment.upvotes = Number(comment.upvotes) || 0;
    comment.downvotes = Number(comment.downvotes) || 0;
    
    if (comment.uservote === direction) {
      // Remove the vote if user clicks the same button again
      if (direction === "up") comment.upvotes--;
      else comment.downvotes--;
      comment.uservote = null;
    } else {
      // Switch vote if already voted the opposite way
      if (comment.uservote) {
        if (direction === "up") {
          comment.upvotes++;
          comment.downvotes--;
        } else {
          comment.downvotes++;
          comment.upvotes--;
        }
      } else {
        // Normal voting
        if (direction === "up") comment.upvotes++;
        else comment.downvotes++;
      }
      comment.uservote = direction;
    }

     // Update the comment
     const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { upvotes: comment.upvotes, downvotes: comment.downvotes, uservote: comment.uservote } },
      { new: true }
    );

    const allcommentsById = await Comment.find({ articleId });

    console.log("allCommentsONVOTE ", allcommentsById);

    return NextResponse.json(
      { success: true, comments: allcommentsById },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
