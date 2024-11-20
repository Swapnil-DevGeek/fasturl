// //@ts-ignore
// import clientPromise from "@/lib/mongodb";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {

//     try {//@ts-ignore
//         const client = await clientPromise;
//         const db = client.db('fasturl');
//         const collection = db.collection("url");
        
//         const { url, shorturl } = await req.json();

//         // Check if a document with the same shorturl exists
//         const found_short = await collection.findOne({ shorturl });
//         if (found_short) {
//             return NextResponse.json({ message: "URL already exists!" }, { status: 409 }); 
//         }

//         // Insert the new URL into the collection
//         await collection.insertOne({ url, shorturl });
//         return NextResponse.json({ message: "URL created", url, shorturl }, { status: 201 }); // Include the URL in the response
//     } catch (error) {//@ts-ignore
//         return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 }); 
//     }
// }

//@ts-ignore
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

const generateRandomSlug = (length: number = 6): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

// Function to check if slug exists in database
async function isSlugUnique( slug: string): Promise<boolean> {//@ts-ignore
    const client = await clientPromise;
    const db = client.db('fasturl');
    const collection = db.collection("url");
  const existingUrl = await collection.findOne({ shorturl: slug });
  return !existingUrl;
}

// Function to generate unique slug
async function generateUniqueSlug(collection: any, maxAttempts: number = 5): Promise<string | null> {
  for (let i = 0; i < maxAttempts; i++) {
    const slug = generateRandomSlug();
    if (await isSlugUnique(slug)) {
      return slug;
    }
  }
  return null; // Return null if we couldn't generate a unique slug after maxAttempts
}

export async function POST(req: NextRequest) {
    try {
        //@ts-ignore
        const client = await clientPromise;
        const db = client.db('fasturl');
        const collection = db.collection("url");
        
        const { url, shorturl, generateRandom = false } = await req.json();

        // Validate URL
        try {
            new URL(url);
        } catch (e) {
            return NextResponse.json(
                { message: "Invalid URL format" },
                { status: 400 }
            );
        }

        let slugToUse: string | null = shorturl;

        // Handle random slug generation
        if (generateRandom) {
            slugToUse = await generateUniqueSlug(collection);
            if (!slugToUse) {
                return NextResponse.json(
                    { message: "Failed to generate unique slug. Please try again." },
                    { status: 500 }
                );
            }
        } else {
            // For custom slug, check if it already exists
            const found_short = await collection.findOne({ shorturl: slugToUse });
            if (found_short) {
                return NextResponse.json(
                    { message: "Short URL already exists!" },
                    { status: 409 }
                );
            }
        }

        // Create timestamp for tracking
        const created_at = new Date();

        // Insert the new URL into the collection
        await collection.insertOne({
            url,
            shorturl: slugToUse,
        });

        return NextResponse.json(
            {
                message: "URL created",
                url,
                shorturl: slugToUse,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error in URL shortening:', error);
        //@ts-ignore
        return NextResponse.json(// @ts-ignore
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}