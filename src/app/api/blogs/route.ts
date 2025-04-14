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
import { eq, and, not, inArray } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// GET /api/blogs - Get all blogs
export async function GET() {
  try {
    // Query to get all blog posts with author info
    const blogPosts = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        shortDescription: postsTable.shortDescription,
        content: postsTable.content,
        authorId: postsTable.authorId,
        categoryId: postsTable.categoryId,
        coverImage: postsTable.coverImage,
        createdAt: postsTable.createdAt,
        updatedAt: postsTable.updatedAt,
        authorName: usersTable.name,
        authorEmail: usersTable.email,
        categoryName: categoriesTable.name,
      })
      .from(postsTable)
      .leftJoin(usersTable, eq(postsTable.authorId, usersTable.id))
      .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
      .orderBy(postsTable.createdAt);

    // Get hashtags for each post
    const postIds = blogPosts.map((post) => post.id);

    // Query for hashtags
    const hashtagsByPost = await db
      .select({
        postId: postHashtags.postId,
        hashtagId: postHashtags.hashtagId,
        hashtagName: hashtagsTable.name,
      })
      .from(postHashtags)
      .leftJoin(hashtagsTable, eq(postHashtags.hashtagId, hashtagsTable.id))
      .where(inArray(postHashtags.postId, postIds));

    // Query for related posts
    const relatedPostsData = await db
      .select({
        postId: relatedPosts.postId,
        relatedPostId: relatedPosts.relatedPostId,
        isManuallySelected: relatedPosts.isManuallySelected,
        relatedTitle: postsTable.title,
      })
      .from(relatedPosts)
      .leftJoin(postsTable, eq(relatedPosts.relatedPostId, postsTable.id))
      .where(inArray(relatedPosts.postId, postIds));

    // Transform the result to match the expected format
    const formattedPosts = blogPosts.map((post) => {
      // Find hashtags for this post
      const hashtags = hashtagsByPost
        .filter((h) => h.postId === post.id)
        .map((h) => ({ id: h.hashtagId, name: h.hashtagName }));

      // Find related posts for this post
      const related = relatedPostsData
        .filter((r) => r.postId === post.id)
        .map((r) => ({
          id: r.relatedPostId,
          title: r.relatedTitle,
          isManuallySelected: r.isManuallySelected,
        }));

      return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        authorId: post.authorId,
        categoryId: post.categoryId,
        coverImage: post.coverImage,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: {
          name: post.authorName,
          email: post.authorEmail,
        },
        category: post.categoryName
          ? {
              id: post.categoryId,
              name: post.categoryName,
            }
          : null,
        hashtags,
        relatedPosts: related,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedPosts,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    // In a real app, we would verify the session token
    // For now, we'll use a mock user ID
    const mockUserId = "12375d19-19c8-47ae-90fe-c8e6a305b502"; // This would normally come from the auth session

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

    // Create a new blog post with the user ID as the author
    const newPostId = uuidv4();
    const timestamp = Math.floor(Date.now() / 1000);
    const timestampDate = new Date(timestamp * 1000);

    // Insert the new post
    await db.insert(postsTable).values([
      {
        id: newPostId,
        title,
        shortDescription: shortDescription || null,
        content: content || null,
        categoryId: categoryId || null,
        coverImage: coverImage || null,
        authorId: mockUserId,
        createdAt: timestampDate,
        updatedAt: timestampDate,
      },
    ]);

    // Process hashtags (both existing hashtags by ID and new hashtags by name)
    const hashtagsToAdd = [];

    // Add existing hashtags
    if (hashtagIds && hashtagIds.length > 0) {
      for (const hashtagId of hashtagIds) {
        hashtagsToAdd.push({
          id: uuidv4(),
          postId: newPostId,
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
          postId: newPostId,
          hashtagId: hashtag.id,
          createdAt: timestampDate,
        });
      }
    }

    // Insert hashtags
    if (hashtagsToAdd.length > 0) {
      await db.insert(postHashtags).values(hashtagsToAdd);
    }

    // Process related posts
    if (relatedPostIds && relatedPostIds.length > 0) {
      const relatedPostsToAdd = relatedPostIds
        .slice(0, 3)
        .map((relatedPostId: string) => ({
          id: uuidv4(),
          postId: newPostId,
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
            not(eq(postsTable.id, newPostId))
          )
        )
        .orderBy(postsTable.createdAt)
        .limit(3);

      if (sameCategoryPosts.length > 0) {
        const autoRelatedPosts = sameCategoryPosts.map((relPost) => ({
          id: uuidv4(),
          postId: newPostId,
          relatedPostId: relPost.id,
          isManuallySelected: false,
          createdAt: timestampDate,
        }));

        await db.insert(relatedPosts).values(autoRelatedPosts);
      }
    }

    // Fetch the newly created post with all relationships
    const newPost = await db
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
      .where(eq(postsTable.id, newPostId))
      .then((results) => results[0]);

    if (!newPost) {
      throw new Error("Failed to retrieve the newly created post");
    }

    // Get the hashtags for this post
    const hashtags = await db
      .select({
        id: hashtagsTable.id,
        name: hashtagsTable.name,
      })
      .from(postHashtags)
      .leftJoin(hashtagsTable, eq(postHashtags.hashtagId, hashtagsTable.id))
      .where(eq(postHashtags.postId, newPostId));

    // Get related posts
    const related = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        isManuallySelected: relatedPosts.isManuallySelected,
      })
      .from(relatedPosts)
      .leftJoin(postsTable, eq(relatedPosts.relatedPostId, postsTable.id))
      .where(eq(relatedPosts.postId, newPostId));

    // Format the post
    const formattedPost = {
      id: newPost.id,
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      authorId: newPost.authorId,
      categoryId: newPost.categoryId,
      coverImage: newPost.coverImage,
      createdAt: newPost.createdAt,
      updatedAt: newPost.updatedAt,
      author: {
        name: newPost.authorName,
        email: newPost.authorEmail,
      },
      category: newPost.categoryName
        ? {
            id: newPost.categoryId,
            name: newPost.categoryName,
          }
        : null,
      hashtags,
      relatedPosts: related,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Blog post created successfully",
        data: formattedPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
