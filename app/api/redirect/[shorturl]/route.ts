//@ts-ignore
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {//@ts-ignore
    const client = await clientPromise;
    const db = client.db("fasturl");
    const collection = db.collection("url");

    let { shorturl } = await req.json();  // Request body is valid here
    const myurl = shorturl.split("/")[1];
    console.log(myurl);
    // Find the document with the given shorturl
    const result = await collection.findOne({ shorturl:myurl });

    // If the shorturl doesn't exist, return a 404 response
    if (!result) {
      return NextResponse.json(
        { message: "Short URL not found" },
        { status: 404 }
      );
    }

    // Return the long URL if found
    return NextResponse.json({ url: result.url }, { status: 200 });
    
  } catch (error) {
    // Return a 500 error in case of an internal server error
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
