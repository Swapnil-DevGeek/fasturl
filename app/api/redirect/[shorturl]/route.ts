import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("fasturl");
    const collection = db.collection("url");

    let { shorturl } = await req.json();

    // Validate shorturl presence
    if (!shorturl) {
      return NextResponse.json(
        { message: "Invalid request: shorturl is required" },
        { status: 400 }
      );
    }

    // Extract the unique identifier part of shorturl
    const myurl = shorturl.split("/")[1];
    console.log("Parsed short URL:", myurl);

    // Find document based on shorturl
    const result = await collection.findOne({ shorturl: myurl });

    // If shorturl is not found, return a 404 response
    if (!result) {
      return NextResponse.json(
        { message: "Short URL not found" },
        { status: 404 }
      );
    }

    // Return the long URL if found
    return NextResponse.json({ url: result.url }, { status: 200 });

  } catch (error) {
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
