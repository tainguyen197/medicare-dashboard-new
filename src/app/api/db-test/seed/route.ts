import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { users, posts } from "@/db/schema/index";

export async function GET() {
  try {
    // Insert a test user if no users exist
    const existingUsers = await db.select().from(users);

    if (existingUsers.length === 0) {
      // Insert a test user
      const userId = crypto.randomUUID();
      await db.insert(users).values({
        id: userId,
        name: "Test User",
        email: "test@example.com",
      });

      // Insert a test post
      await db.insert(posts).values({
        id: crypto.randomUUID(),
        title: "Test Post",
        content: "This is a test post content",
        authorId: userId,
      });

      return NextResponse.json({
        success: true,
        message: "Test data seeded successfully",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database already has data, skipping seed",
      data: existingUsers,
    });
  } catch (error) {
    console.error("Database seeding error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Database seeding failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
