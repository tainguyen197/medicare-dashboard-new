import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

interface Params {
  id: string;
}

// DELETE /api/users/:id - Deletes a specific user
export async function DELETE(request: Request, { params }: { params: Params }) {
  const userId = params.id;

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: true }, // Only select id to check existence
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Delete the user
    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 } // Can also use 204 No Content
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    // Handle potential foreign key constraint errors if users are linked to other tables
    if (
      error instanceof Error &&
      error.message.includes("FOREIGN KEY constraint failed")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot delete user. They may be associated with other data (e.g., posts).",
        },
        { status: 409 } // Conflict
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
