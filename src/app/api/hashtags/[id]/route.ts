import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  hashtags as hashtagsTable,
  postHashtags as postHashtagsTable,
} from "@/db/schema";
import { eq, and, not } from "drizzle-orm";

// GET /api/hashtags/[id] - Get a specific hashtag
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hashtagId = params.id;

    // Find the hashtag with the given ID
    const hashtag = await db
      .select({
        id: hashtagsTable.id,
        name: hashtagsTable.name,
        createdAt: hashtagsTable.createdAt,
        updatedAt: hashtagsTable.updatedAt,
      })
      .from(hashtagsTable)
      .where(eq(hashtagsTable.id, hashtagId))
      .then((results) => results[0]);

    if (!hashtag) {
      return NextResponse.json(
        { success: false, message: "Hashtag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: hashtag,
    });
  } catch (error) {
    console.error("Error fetching hashtag:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch hashtag" },
      { status: 500 }
    );
  }
}

// PUT /api/hashtags/[id] - Update a hashtag
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hashtagId = params.id;
    const { name } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    // Clean the hashtag name
    const cleanedName = name.startsWith("#")
      ? name.slice(1).trim()
      : name.trim();

    if (!cleanedName) {
      return NextResponse.json(
        { success: false, message: "Hashtag name cannot be empty" },
        { status: 400 }
      );
    }

    // Check if hashtag exists
    const existingHashtag = await db
      .select({ id: hashtagsTable.id })
      .from(hashtagsTable)
      .where(eq(hashtagsTable.id, hashtagId))
      .then((results) => results[0]);

    if (!existingHashtag) {
      return NextResponse.json(
        { success: false, message: "Hashtag not found" },
        { status: 404 }
      );
    }

    // Check if another hashtag with the new name already exists
    const nameConflict = await db
      .select({ id: hashtagsTable.id })
      .from(hashtagsTable)
      .where(
        and(
          eq(hashtagsTable.name, cleanedName),
          not(eq(hashtagsTable.id, hashtagId))
        )
      )
      .then((results) => results[0]);

    if (nameConflict) {
      return NextResponse.json(
        {
          success: false,
          message: "Another hashtag with this name already exists",
        },
        { status: 409 }
      );
    }

    // Update the hashtag
    const timestamp = Math.floor(Date.now() / 1000);
    await db
      .update(hashtagsTable)
      .set({
        name: cleanedName,
        updatedAt: new Date(timestamp * 1000),
      })
      .where(eq(hashtagsTable.id, hashtagId));

    // Fetch the updated hashtag
    const updatedHashtag = await db
      .select({
        id: hashtagsTable.id,
        name: hashtagsTable.name,
        createdAt: hashtagsTable.createdAt,
        updatedAt: hashtagsTable.updatedAt,
      })
      .from(hashtagsTable)
      .where(eq(hashtagsTable.id, hashtagId))
      .then((results) => results[0]);

    return NextResponse.json({
      success: true,
      message: "Hashtag updated successfully",
      data: updatedHashtag,
    });
  } catch (error) {
    console.error("Error updating hashtag:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update hashtag" },
      { status: 500 }
    );
  }
}

// DELETE /api/hashtags/[id] - Delete a hashtag
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hashtagId = params.id;

    // Check if hashtag exists
    const existingHashtag = await db
      .select({ id: hashtagsTable.id })
      .from(hashtagsTable)
      .where(eq(hashtagsTable.id, hashtagId))
      .then((results) => results[0]);

    if (!existingHashtag) {
      return NextResponse.json(
        { success: false, message: "Hashtag not found" },
        { status: 404 }
      );
    }

    // Delete references in the postHashtags junction table first
    await db
      .delete(postHashtagsTable)
      .where(eq(postHashtagsTable.hashtagId, hashtagId));

    // Delete the hashtag itself
    await db.delete(hashtagsTable).where(eq(hashtagsTable.id, hashtagId));

    return NextResponse.json({
      success: true,
      message: "Hashtag deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hashtag:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete hashtag" },
      { status: 500 }
    );
  }
}
