import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories as categoriesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// GET /api/categories - Get all categories
export async function GET() {
  try {
    // Query to get all categories
    const allCategories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        description: categoriesTable.description,
        createdAt: categoriesTable.createdAt,
        updatedAt: categoriesTable.updatedAt,
      })
      .from(categoriesTable)
      .orderBy(categoriesTable.name);

    return NextResponse.json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    // Check if a category with this name already exists
    const existingCategory = await db
      .select({ id: categoriesTable.id })
      .from(categoriesTable)
      .where(eq(categoriesTable.name, name))
      .then((results) => results[0]);

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "A category with this name already exists" },
        { status: 409 }
      );
    }

    // Create a new category
    const newCategoryId = uuidv4();
    const timestamp = Math.floor(Date.now() / 1000); // Current time in seconds

    await db.insert(categoriesTable).values({
      id: newCategoryId,
      name,
      description: description || null,
      createdAt: new Date(timestamp * 1000), // Convert to Date object
      updatedAt: new Date(timestamp * 1000), // Convert to Date object
    });

    // Fetch the newly created category
    const newCategory = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        description: categoriesTable.description,
        createdAt: categoriesTable.createdAt,
        updatedAt: categoriesTable.updatedAt,
      })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, newCategoryId))
      .then((results) => results[0]);

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      { status: 500 }
    );
  }
}
