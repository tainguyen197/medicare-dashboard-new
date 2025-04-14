"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import RichTextEditor from "@/components/editor/RichTextEditor";
import CategorySelector from "@/components/editor/CategorySelector";
import HashtagSelector from "@/components/editor/HashtagSelector";
import RelatedPostsSelector from "@/components/editor/RelatedPostsSelector";

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [hashtagIds, setHashtagIds] = useState<string[]>([]);
  const [relatedPostIds, setRelatedPostIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    content?: string;
    category?: string;
  }>({});

  const validateForm = () => {
    const errors: {
      title?: string;
      content?: string;
      category?: string;
    } = {};

    if (!title.trim()) {
      errors.title = "Title is required";
    }

    if (!content.trim()) {
      errors.content = "Content is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          shortDescription,
          content,
          categoryId,
          hashtagIds,
          relatedPostIds,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create blog post");
      }

      // Navigate back to blogs list after successful creation
      router.push("/blogs");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/blogs"
          className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Blogs
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          Create New Blog Post
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className={`w-full ${formErrors.title ? "border-red-500" : ""}`}
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm">{formErrors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">
              Short Description (optional)
            </Label>
            <Input
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief summary of your blog post"
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              This will be displayed in blog listings and search results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategorySelector
              value={categoryId}
              onChange={setCategoryId}
              required={false}
              allowCreate={true}
              error={formErrors.category}
            />

            <HashtagSelector
              value={hashtagIds}
              onChange={setHashtagIds}
              label="Hashtags"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              error={formErrors.content}
            />
          </div>

          <RelatedPostsSelector
            value={relatedPostIds}
            onChange={setRelatedPostIds}
            label="Related Posts"
            maxRelatedPosts={3}
          />

          <div className="flex justify-end space-x-4">
            <Link href="/blogs">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Blog Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
