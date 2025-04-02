import { readAllComments } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const comments = await readAllComments();  
    return NextResponse.json(comments, { status: 200 });
  } catch (error:any) {
    return NextResponse.json({ message: "Failed to fetch comments", error: error.message }, { status: 500 });
  }
}
