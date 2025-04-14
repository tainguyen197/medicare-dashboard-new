"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { PlusCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface CategorySelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
  label?: string;
  required?: boolean;
  allowCreate?: boolean;
  error?: string;
}

export default function CategorySelector({
  value,
  onChange,
  className = "",
  label = "Category",
  required = false,
  allowCreate = false,
  error,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [creatingCategory, setCreatingCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        console.error("Failed to fetch categories:", data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setCreateError("Category name is required");
      return;
    }

    setCreatingCategory(true);
    setCreateError(null);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDescription || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add the new category to the list
        setCategories((prev) => [...prev, data.data]);

        // Select the new category
        onChange(data.data.id);

        // Reset the form
        setNewCategoryName("");
        setNewCategoryDescription("");
        setShowCreateForm(false);
      } else {
        setCreateError(data.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      setCreateError("An unexpected error occurred");
    } finally {
      setCreatingCategory(false);
    }
  };

  return (
    <div className={className}>
      {label && (
        <Label htmlFor="category-selector" className="mb-2 block">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="space-y-4">
        <Select
          value={value || "none"}
          onValueChange={(val) => onChange(val === "none" ? null : val)}
          disabled={loading}
        >
          <SelectTrigger
            id="category-selector"
            className={error ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        {allowCreate && (
          <div className="mt-2">
            {!showCreateForm ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCreateForm(true)}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add New Category
              </Button>
            ) : (
              <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="new-category-name">
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="new-category-name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="New category name"
                      className={`mt-1 ${
                        createError && !newCategoryName ? "border-red-500" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-category-description">
                      Description
                    </Label>
                    <Input
                      id="new-category-description"
                      value={newCategoryDescription}
                      onChange={(e) =>
                        setNewCategoryDescription(e.target.value)
                      }
                      placeholder="Category description (optional)"
                      className="mt-1"
                    />
                  </div>

                  {createError && (
                    <p className="text-red-500 text-sm">{createError}</p>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={creatingCategory}
                      size="sm"
                    >
                      {creatingCategory ? "Creating..." : "Create Category"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewCategoryName("");
                        setNewCategoryDescription("");
                        setCreateError(null);
                      }}
                      size="sm"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
