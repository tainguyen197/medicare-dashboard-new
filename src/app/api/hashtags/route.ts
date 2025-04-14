import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { hashtags as hashtagsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// GET /api/hashtags - Get all hashtags
export async function GET() {
  try {
    // Query to get all hashtags
    const allHashtags = await db
      .select({
        id: hashtagsTable.id,
        name: hashtagsTable.name,
        createdAt: hashtagsTable.createdAt,
        updatedAt: hashtagsTable.updatedAt,
      })
      .from(hashtagsTable)
      .orderBy(hashtagsTable.name);

    return NextResponse.json({
      success: true,
      data: allHashtags,
    });
  } catch (error) {
    console.error("Error fetching hashtags:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch hashtags" },
      { status: 500 }
    );
  }
}

// POST /api/hashtags - Create a new hashtag
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    // Clean the hashtag name: remove # prefix if it exists and trim
    const cleanedName = name.startsWith("#")
      ? name.slice(1).trim()
      : name.trim();

    if (!cleanedName) {
      return NextResponse.json(
        { success: false, message: "Hashtag name cannot be empty" },
        { status: 400 }
      );
    }

    // Check if a hashtag with this name already exists
    const existingHashtag = await db
      .select({ id: hashtagsTable.id })
      .from(hashtagsTable)
      .where(eq(hashtagsTable.name, cleanedName))
      .then((results) => results[0]);

    if (existingHashtag) {
      return NextResponse.json(
        { success: false, message: "A hashtag with this name already exists" },
        { status: 409 }
      );
    }

    // Create a new hashtag
    const newHashtagId = uuidv4();
    const timestamp = Math.floor(Date.now() / 1000); // Current time in seconds

    await db.insert(hashtagsTable).values([
      {
        id: newHashtagId,
        name: cleanedName,
        createdAt: new Date(timestamp * 1000),
        updatedAt: new Date(timestamp * 1000),
      },
    ]);

    // Fetch the newly created hashtag
    const newHashtag = await db
      .select({
        id: hashtagsTable.id,
        name: hashtagsTable.name,
        createdAt: hashtagsTable.createdAt,
        updatedAt: hashtagsTable.updatedAt,
      })
      .from(hashtagsTable)
      .where(eq(hashtagsTable.id, newHashtagId))
      .then((results) => results[0]);

    return NextResponse.json(
      {
        success: true,
        message: "Hashtag created successfully",
        data: newHashtag,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating hashtag:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create hashtag" },
      { status: 500 }
    );
  }
}
