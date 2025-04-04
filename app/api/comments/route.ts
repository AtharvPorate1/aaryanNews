import { NextResponse } from "next/server";
import {connectToDb} from '@/lib/db/dbconfig'
import Comment from '@/lib/db/models/comment'

connectToDb()


export async function GET(req: Request) {
  try {
    const comments = await Comment.find();  
    return NextResponse.json(comments, { status: 200 });
  } catch (error:any) {
    return NextResponse.json({ message: "Failed to fetch comments", error: error.message }, { status: 500 });
  }
}
