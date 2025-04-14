import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  posts as postsTable,
  users as usersTable,
  categories as categoriesTable,
  postHashtags,
  relatedPosts,
  hashtags as hashtagsTable,
} from "@/db/schema";
import { eq, and, not } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// GET /api/blogs/[id] - Get a specific blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogId = params.id;

    // Find the blog post with the given ID
    const blogPost = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        shortDescription: postsTable.shortDescription,
        content: postsTable.content,
        categoryId: postsTable.categoryId,
        coverImage: postsTable.coverImage,
        authorId: postsTable.authorId,
        createdAt: postsTable.createdAt,
        updatedAt: postsTable.updatedAt,
        authorName: usersTable.name,
        authorEmail: usersTable.email,
        categoryName: categoriesTable.name,
      })
      .from(postsTable)
      .leftJoin(usersTable, eq(postsTable.authorId, usersTable.id))
      .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
      .where(eq(postsTable.id, blogId))
      .then((results) => results[0]);

    if (!blogPost) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    // Get hashtags for this post
    const hashtags = await db
      .select({
        id: hashtagsTable.id,
        name: hashtagsTable.name,
      })
      .from(postHashtags)
      .leftJoin(hashtagsTable, eq(postHashtags.hashtagId, hashtagsTable.id))
      .where(eq(postHashtags.postId, blogId));

    // Get related posts
    const relatedPostsData = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        isManuallySelected: relatedPosts.isManuallySelected,
      })
      .from(relatedPosts)
      .leftJoin(postsTable, eq(relatedPosts.relatedPostId, postsTable.id))
      .where(eq(relatedPosts.postId, blogId));

    // Format the post
    const formattedPost = {
      id: blogPost.id,
      title: blogPost.title,
      shortDescription: blogPost.shortDescription,
      content: blogPost.content,
      categoryId: blogPost.categoryId,
      coverImage: blogPost.coverImage,
      authorId: blogPost.authorId,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
      author: {
        name: blogPost.authorName,
        email: blogPost.authorEmail,
      },
      category: blogPost.categoryName
        ? {
            id: blogPost.categoryId,
            name: blogPost.categoryName,
          }
        : null,
      hashtags,
      relatedPosts: relatedPostsData,
    };

    return NextResponse.json({
      success: true,
      data: formattedPost,
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[id] - Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogId = params.id;
    const {
      title,
      shortDescription,
      content,
      categoryId,
      hashtagIds,
      hashtagNames,
      relatedPostIds,
      coverImage,
    } = await request.json();

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { success: false, message: "Title is required" },
        { status: 400 }
      );
    }

    // Check if blog post exists
    const existingPost = await db
      .select({ id: postsTable.id })
      .from(postsTable)
      .where(eq(postsTable.id, blogId))
      .then((results) => results[0]);

    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    // In a real app, also check if the user is authorized to update this post

    // Update the blog post
    const timestamp = Math.floor(Date.now() / 1000);
    const timestampDate = new Date(timestamp * 1000);

    await db
      .update(postsTable)
      .set({
        title,
        shortDescription: shortDescription || null,
        content: content || null,
        categoryId: categoryId || null,
        coverImage: coverImage || null,
        updatedAt: timestampDate,
      })
      .where(eq(postsTable.id, blogId));

    // Handle hashtags
    if (hashtagIds !== undefined || hashtagNames !== undefined) {
      // Delete existing hashtags for this post
      await db.delete(postHashtags).where(eq(postHashtags.postId, blogId));

      const hashtagsToAdd = [];

      // Add existing hashtags
      if (hashtagIds && hashtagIds.length > 0) {
        for (const hashtagId of hashtagIds) {
          hashtagsToAdd.push({
            id: uuidv4(),
            postId: blogId,
            hashtagId,
            createdAt: timestampDate,
          });
        }
      }

      // Add new hashtags
      if (hashtagNames && hashtagNames.length > 0) {
        for (const name of hashtagNames) {
          // Clean the hashtag name
          const cleanedName = name.startsWith("#")
            ? name.slice(1).trim()
            : name.trim();
          if (!cleanedName) continue;

          // Check if this hashtag already exists
          let hashtag = await db
            .select({ id: hashtagsTable.id })
            .from(hashtagsTable)
            .where(eq(hashtagsTable.name, cleanedName))
            .then((results) => results[0]);

          if (!hashtag) {
            // Create new hashtag
            const newHashtagId = uuidv4();
            await db.insert(hashtagsTable).values([
              {
                id: newHashtagId,
                name: cleanedName,
                createdAt: timestampDate,
                updatedAt: timestampDate,
              },
            ]);
            hashtag = { id: newHashtagId };
          }

          // Add to junction table
          hashtagsToAdd.push({
            id: uuidv4(),
            postId: blogId,
            hashtagId: hashtag.id,
            createdAt: timestampDate,
          });
        }
      }

      // Insert hashtags
      if (hashtagsToAdd.length > 0) {
        await db.insert(postHashtags).values(hashtagsToAdd);
      }
    }

    // Handle related posts
    if (relatedPostIds !== undefined) {
      // Delete existing related posts
      await db.delete(relatedPosts).where(eq(relatedPosts.postId, blogId));

      if (relatedPostIds && relatedPostIds.length > 0) {
        const relatedPostsToAdd = relatedPostIds
          .slice(0, 3)
          .map((relatedPostId: string) => ({
            id: uuidv4(),
            postId: blogId,
            relatedPostId,
            isManuallySelected: true,
            createdAt: timestampDate,
          }));

        if (relatedPostsToAdd.length > 0) {
          await db.insert(relatedPosts).values(relatedPostsToAdd);
        }
      } else if (categoryId) {
        // Auto-select related posts from the same category (up to 3)
        const sameCategoryPosts = await db
          .select({ id: postsTable.id })
          .from(postsTable)
          .where(
            and(
              eq(postsTable.categoryId, categoryId),
              not(eq(postsTable.id, blogId))
            )
          )
          .orderBy(postsTable.createdAt)
          .limit(3);

        if (sameCategoryPosts.length > 0) {
          const autoRelatedPosts = sameCategoryPosts.map((relPost) => ({
            id: uuidv4(),
            postId: blogId,
            relatedPostId: relPost.id,
            isManuallySelected: false,
            createdAt: timestampDate,
          }));

          await db.insert(relatedPosts).values(autoRelatedPosts);
        }
      }
    }

    // Fetch the updated post
    const updatedPost = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        shortDescription: postsTable.shortDescription,
        content: postsTable.content,
        categoryId: postsTable.categoryId,
        coverImage: postsTable.coverImage,
        authorId: postsTable.authorId,
        createdAt: postsTable.createdAt,
        updatedAt: postsTable.updatedAt,
        authorName: usersTable.name,
        authorEmail: usersTable.email,
        categoryName: categoriesTable.name,
      })
      .from(postsTable)
      .leftJoin(usersTable, eq(postsTable.authorId, usersTable.id))
      .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
      .where(eq(postsTable.id, blogId))
      .then((results) => results[0]);

    if (!updatedPost) {
      throw new Error("Failed to retrieve the updated post");
    }

    // Get hashtags for this post
    const hashtags = await db
      .select({
        id: hashtagsTable.id,
        name: hashtagsTable.name,
      })
      .from(postHashtags)
      .leftJoin(hashtagsTable, eq(postHashtags.hashtagId, hashtagsTable.id))
      .where(eq(postHashtags.postId, blogId));

    // Get related posts
    const related = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        isManuallySelected: relatedPosts.isManuallySelected,
      })
      .from(relatedPosts)
      .leftJoin(postsTable, eq(relatedPosts.relatedPostId, postsTable.id))
      .where(eq(relatedPosts.postId, blogId));

    // Format the post
    const formattedPost = {
      id: updatedPost.id,
      title: updatedPost.title,
      shortDescription: updatedPost.shortDescription,
      content: updatedPost.content,
      categoryId: updatedPost.categoryId,
      coverImage: updatedPost.coverImage,
      authorId: updatedPost.authorId,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
      author: {
        name: updatedPost.authorName,
        email: updatedPost.authorEmail,
      },
      category: updatedPost.categoryName
        ? {
            id: updatedPost.categoryId,
            name: updatedPost.categoryName,
          }
        : null,
      hashtags,
      relatedPosts: related,
    };

    return NextResponse.json({
      success: true,
      message: "Blog post updated successfully",
      data: formattedPost,
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id] - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogId = params.id;

    // Check if blog post exists
    const existingPost = await db
      .select({ id: postsTable.id })
      .from(postsTable)
      .where(eq(postsTable.id, blogId))
      .then((results) => results[0]);

    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    // In a real app, also check if the user is authorized to delete this post

    // Delete related data first (hashtags and related posts)
    await db.delete(postHashtags).where(eq(postHashtags.postId, blogId));
    await db.delete(relatedPosts).where(eq(relatedPosts.postId, blogId));

    // Also remove this post from being related to other posts
    await db.delete(relatedPosts).where(eq(relatedPosts.relatedPostId, blogId));

    // Delete the blog post
    await db.delete(postsTable).where(eq(postsTable.id, blogId));

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
