"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the blog data on component mount
  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/blogs/${params.id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch blog post");
        }

        setTitle(data.data.title);
        setContent(data.data.content || "");
        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
        setIsLoading(false);
      }
    }

    fetchBlog();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update blog post");
      }

      // Navigate back to blogs list after successful update
      router.push("/blogs");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading blog post...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/blogs"
          className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Blogs
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Blog Post</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-2xl">
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
              required
              placeholder="Enter blog title"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              required
              placeholder="Write your blog content here..."
              className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Link href="/blogs">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
