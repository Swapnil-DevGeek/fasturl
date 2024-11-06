import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { shorturl: string } }) {
  try {
    const client = await clientPromise;
    const db = await client.db('fasturl');
    const collection = await db.collection("url");

    const { shorturl } = params;
    const result = await collection.findOne({ shorturl });

    if (!result) {
      return NextResponse.json({ message: 'Short URL not found' }, { status: 404 });
    }

    return NextResponse.json({ url: result.url }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
