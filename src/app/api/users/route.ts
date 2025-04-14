import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";

// GET /api/users - Fetches all users
export async function GET() {
  try {
    // Select all users, excluding the passwordHash
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users);

    return NextResponse.json(
      { success: true, data: allUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
