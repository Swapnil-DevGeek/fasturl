import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db('fasturl');
        const collection = db.collection("url");
        
        const { url, shorturl } = await req.json();

        // Check if a document with the same shorturl exists
        const found_short = await collection.findOne({ shorturl });
        if (found_short) {
            return NextResponse.json({ message: "URL already exists!" }, { status: 409 }); 
        }

        // Insert the new URL into the collection
        await collection.insertOne({ url, shorturl });
        return NextResponse.json({ message: "URL created", url, shorturl }, { status: 201 }); // Include the URL in the response
    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 }); 
    }
}
