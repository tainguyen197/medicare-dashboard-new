import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  categories as categoriesTable,
  posts as postsTable,
} from "@/db/schema";
import { eq, and, count, not } from "drizzle-orm";

// GET /api/categories/[id] - Get a specific category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;

    // Find the category with the given ID
    const category = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        description: categoriesTable.description,
        createdAt: categoriesTable.createdAt,
        updatedAt: categoriesTable.updatedAt,
      })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, categoryId))
      .then((results) => results[0]);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Count posts in this category
    const postsCount = await db
      .select({ count: count() })
      .from(postsTable)
      .where(eq(postsTable.categoryId, categoryId))
      .then((result) => result[0]?.count || 0);

    return NextResponse.json({
      success: true,
      data: {
        ...category,
        postsCount,
      },
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;
    const { name, description } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    // Check if the category exists
    const existingCategory = await db
      .select({ id: categoriesTable.id })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, categoryId))
      .then((results) => results[0]);

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Check if another category with the same name exists
    const duplicateCategory = await db
      .select({ id: categoriesTable.id })
      .from(categoriesTable)
      .where(
        and(
          eq(categoriesTable.name, name),
          not(eq(categoriesTable.id, categoryId))
        )
      )
      .then((results) => results[0]);

    if (duplicateCategory) {
      return NextResponse.json(
        { success: false, message: "A category with this name already exists" },
        { status: 409 }
      );
    }

    // Update the category
    const timestamp = Math.floor(Date.now() / 1000); // Current time in seconds

    await db
      .update(categoriesTable)
      .set({
        name,
        description: description || null,
        updatedAt: new Date(timestamp * 1000),
      })
      .where(eq(categoriesTable.id, categoryId));

    // Fetch the updated category
    const updatedCategory = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        description: categoriesTable.description,
        createdAt: categoriesTable.createdAt,
        updatedAt: categoriesTable.updatedAt,
      })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, categoryId))
      .then((results) => results[0]);

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;

    // Check if the category exists
    const existingCategory = await db
      .select({ id: categoriesTable.id })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, categoryId))
      .then((results) => results[0]);

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Check if there are posts using this category
    const postsCount = await db
      .select({ count: count() })
      .from(postsTable)
      .where(eq(postsTable.categoryId, categoryId))
      .then((result) => result[0]?.count || 0);

    if (postsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete category: it is used by ${postsCount} posts. Please reassign these posts first.`,
        },
        { status: 400 }
      );
    }

    // Delete the category
    await db.delete(categoriesTable).where(eq(categoriesTable.id, categoryId));

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 }
    );
  }
}
