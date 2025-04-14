import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { postImages, posts as postsTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// GET /api/blogs/images?postId=123 - Get all images for a specific post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { success: false, message: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if the post exists
    const post = await db
      .select({ id: postsTable.id })
      .from(postsTable)
      .where(eq(postsTable.id, postId))
      .then((results) => results[0]);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Get all images for this post, ordered by sort order
    const images = await db
      .select({
        id: postImages.id,
        postId: postImages.postId,
        imageUrl: postImages.imageUrl,
        caption: postImages.caption,
        sortOrder: postImages.sortOrder,
        createdAt: postImages.createdAt,
      })
      .from(postImages)
      .where(eq(postImages.postId, postId))
      .orderBy(postImages.sortOrder);

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Error fetching post images:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch post images" },
      { status: 500 }
    );
  }
}

// POST /api/blogs/images - Add a new image to a post
export async function POST(request: NextRequest) {
  try {
    const { postId, imageUrl, caption, sortOrder } = await request.json();

    // Validate required fields
    if (!postId) {
      return NextResponse.json(
        { success: false, message: "Post ID is required" },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "Image URL is required" },
        { status: 400 }
      );
    }

    // Check if the post exists
    const post = await db
      .select({ id: postsTable.id })
      .from(postsTable)
      .where(eq(postsTable.id, postId))
      .then((results) => results[0]);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // If sort order is not provided, get the maximum sort order for this post and add 1
    let finalSortOrder = sortOrder || 0;
    if (finalSortOrder === 0) {
      const maxSortOrderResult = await db
        .select({
          maxSort: sql<number>`MAX(${postImages.sortOrder})`.as("maxSort"),
        })
        .from(postImages)
        .where(eq(postImages.postId, postId))
        .then((results) => results[0]);

      finalSortOrder = (maxSortOrderResult?.maxSort || 0) + 1;
    }

    // Create a new image
    const newImageId = uuidv4();
    const timestamp = Math.floor(Date.now() / 1000);
    const timestampDate = new Date(timestamp * 1000);

    await db.insert(postImages).values([
      {
        id: newImageId,
        postId,
        imageUrl,
        caption: caption || null,
        sortOrder: finalSortOrder,
        createdAt: timestampDate,
      },
    ]);

    // Fetch the newly created image
    const newImage = await db
      .select({
        id: postImages.id,
        postId: postImages.postId,
        imageUrl: postImages.imageUrl,
        caption: postImages.caption,
        sortOrder: postImages.sortOrder,
        createdAt: postImages.createdAt,
      })
      .from(postImages)
      .where(eq(postImages.id, newImageId))
      .then((results) => results[0]);

    return NextResponse.json(
      {
        success: true,
        message: "Image added successfully",
        data: newImage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding post image:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add post image" },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/images?id=123 - Delete an image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("id");

    if (!imageId) {
      return NextResponse.json(
        { success: false, message: "Image ID is required" },
        { status: 400 }
      );
    }

    // Check if the image exists
    const image = await db
      .select({ id: postImages.id, postId: postImages.postId })
      .from(postImages)
      .where(eq(postImages.id, imageId))
      .then((results) => results[0]);

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image not found" },
        { status: 404 }
      );
    }

    // Delete the image
    await db.delete(postImages).where(eq(postImages.id, imageId));

    // Reorder the remaining images
    const remainingImages = await db
      .select({
        id: postImages.id,
        sortOrder: postImages.sortOrder,
      })
      .from(postImages)
      .where(eq(postImages.postId, image.postId))
      .orderBy(postImages.sortOrder);

    // Update sort orders to be sequential
    for (let i = 0; i < remainingImages.length; i++) {
      await db
        .update(postImages)
        .set({ sortOrder: i + 1 })
        .where(eq(postImages.id, remainingImages[i].id));
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post image:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete post image" },
      { status: 500 }
    );
  }
}

// PATCH /api/blogs/images - Update image info or reorder images
export async function PATCH(request: NextRequest) {
  try {
    const { id, caption, sortOrder, reorderAll } = await request.json();

    // If we're reordering all images for a post
    if (reorderAll && Array.isArray(reorderAll)) {
      for (const item of reorderAll) {
        if (!item.id || typeof item.sortOrder !== "number") {
          return NextResponse.json(
            {
              success: false,
              message: "Each reorder item must have an id and sortOrder",
            },
            { status: 400 }
          );
        }

        await db
          .update(postImages)
          .set({ sortOrder: item.sortOrder })
          .where(eq(postImages.id, item.id));
      }

      return NextResponse.json({
        success: true,
        message: "Images reordered successfully",
      });
    }

    // Otherwise, we're updating a single image
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Image ID is required" },
        { status: 400 }
      );
    }

    // Check if the image exists
    const image = await db
      .select({ id: postImages.id })
      .from(postImages)
      .where(eq(postImages.id, id))
      .then((results) => results[0]);

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image not found" },
        { status: 404 }
      );
    }

    // Update the image
    interface UpdateData {
      caption?: string | null;
      sortOrder?: number;
    }

    const updateData: UpdateData = {};

    if (caption !== undefined) {
      updateData.caption = caption || null;
    }

    if (sortOrder !== undefined) {
      updateData.sortOrder = sortOrder;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 }
      );
    }

    await db.update(postImages).set(updateData).where(eq(postImages.id, id));

    // Fetch the updated image
    const updatedImage = await db
      .select({
        id: postImages.id,
        postId: postImages.postId,
        imageUrl: postImages.imageUrl,
        caption: postImages.caption,
        sortOrder: postImages.sortOrder,
        createdAt: postImages.createdAt,
      })
      .from(postImages)
      .where(eq(postImages.id, id))
      .then((results) => results[0]);

    return NextResponse.json({
      success: true,
      message: "Image updated successfully",
      data: updatedImage,
    });
  } catch (error) {
    console.error("Error updating post image:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update post image" },
      { status: 500 }
    );
  }
}
