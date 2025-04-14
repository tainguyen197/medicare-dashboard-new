import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, roles } from "@/db/schema";
import { v4 as uuidv4 } from "uuid"; // For generating user IDs

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password, role } = body;

    // Basic validation
    if (!email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "Email, password, and role are required" },
        { status: 400 }
      );
    }

    if (!roles.includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role specified" },
        { status: 400 }
      );
    }

    // TODO: Implement proper password hashing here
    const passwordHash = password; // Storing plain text temporarily
    debugger;
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 } // Conflict
      );
    }

    // Create user
    const userId = uuidv4();
    await db.insert(users).values({
      id: userId,
      email,
      name: name || null, // Name is optional
      passwordHash, // Store the plain text password for now
      role,
    });

    // Exclude passwordHash from the response
    const newUser = { id: userId, email, name, role };

    return NextResponse.json(
      { success: true, message: "User created successfully", data: newUser },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
