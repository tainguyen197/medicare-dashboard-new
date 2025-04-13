import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { users } from "@/db/schema/index";

export async function GET() {
  try {
    // Test the database connection by querying all users
    const allUsers = await db.select().from(users);

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data: allUsers,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
