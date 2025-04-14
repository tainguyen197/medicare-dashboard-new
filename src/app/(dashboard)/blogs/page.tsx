"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { Trash2, Pencil, PlusCircle } from "lucide-react";

// Define the blog type based on our schema
interface Blog {
  id: string;
  title: string;
  content: string | null;
  authorId: string;
  createdAt: number;
  updatedAt: number | null;
  author?: {
    name: string | null;
    email: string;
  };
}

export default function BlogsListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/blogs");
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch blogs");
      }
      setBlogs(data.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while fetching blogs");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete blog post");
      }

      // Refresh the blog list after successful deletion
      fetchBlogs();
      alert("Blog post deleted successfully!");
    } catch (err) {
      let errorMessage = "Failed to delete blog post.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      alert(`Error: ${errorMessage}`);
      console.error("Delete error:", err);
    }
  };

  // Helper to format timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  // Helper to truncate content for preview
  const truncateContent = (content: string | null, maxLength: number = 100) => {
    if (!content) return "No content";
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Blog Management</h1>
        <Link href="/blogs/create" passHref>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Blog
          </Button>
        </Link>
      </div>

      {isLoading && <p className="py-4">Loading blogs...</p>}

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Content Preview</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No blog posts found. Create your first blog post.
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>{truncateContent(blog.content)}</TableCell>
                    <TableCell>
                      {blog.author?.name || blog.author?.email || "Unknown"}
                    </TableCell>
                    <TableCell>
                      {new Date(blog.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {blog.updatedAt
                        ? new Date(blog.updatedAt).toLocaleString()
                        : "Not updated"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/blogs/edit/${blog.id}`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteBlog(blog.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
