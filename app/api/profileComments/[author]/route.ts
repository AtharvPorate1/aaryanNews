import { NextResponse } from "next/server";
import {connectToDb} from '@/lib/db/dbconfig'
import Comment from '@/lib/db/models/comment'


connectToDb();


export async function GET(req:any, { params }:any) {
    try {

      const { author } = await params;
      if (!author) {
        return NextResponse.json({ success: false, error: "Author is required" }, { status: 400 });
      }
      
     
      const comments = await Comment.find({author});
      if (!comments) {
        return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, comments: comments }, { status: 200 });
    } catch (error:any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
