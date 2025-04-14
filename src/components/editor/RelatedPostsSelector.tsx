"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { X, SearchIcon, AlertCircle } from "lucide-react";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  shortDescription?: string | null;
  coverImage?: string | null;
}

interface RelatedPostsSelectorProps {
  value: string[]; // Array of post IDs
  onChange: (value: string[]) => void;
  className?: string;
  label?: string;
  error?: string;
  currentPostId?: string; // Current post ID to exclude from search
  maxRelatedPosts?: number;
}

export default function RelatedPostsSelector({
  value,
  onChange,
  className = "",
  label = "Related Posts",
  error,
  currentPostId,
  maxRelatedPosts = 3,
}: RelatedPostsSelectorProps) {
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (value.length > 0) {
      fetchSelectedPosts();
    } else {
      setSelectedPosts([]);
    }
  }, [value]);

  const fetchSelectedPosts = async () => {
    try {
      const posts = await Promise.all(
        value.map(async (id) => {
          const response = await fetch(`/api/blogs/${id}`);
          const data = await response.json();
          if (data.success) {
            return data.data;
          }
          return null;
        })
      );

      setSelectedPosts(posts.filter(Boolean));
    } catch (error) {
      console.error("Error fetching selected posts:", error);
    }
  };

  const handleSearchPosts = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setLoading(true);
    setSearchError(null);

    try {
      // You might want to implement a proper search endpoint
      // For now, we'll just fetch all posts and filter on the client side
      const response = await fetch("/api/blogs");
      const data = await response.json();

      if (data.success) {
        // Filter out the current post and already selected posts
        const filteredResults = data.data
          .filter(
            (post: Post) =>
              post.id !== currentPostId &&
              !value.includes(post.id) &&
              post.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 10); // Limit to 10 results

        setSearchResults(filteredResults);
        setShowSearchResults(true);
      } else {
        setSearchError("Failed to search posts");
      }
    } catch (error) {
      console.error("Error searching posts:", error);
      setSearchError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRelatedPost = (post: Post) => {
    if (value.length >= maxRelatedPosts) {
      setSearchError(`You can only add up to ${maxRelatedPosts} related posts`);
      return;
    }

    if (!value.includes(post.id)) {
      onChange([...value, post.id]);
    }

    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleRemoveRelatedPost = (postId: string) => {
    onChange(value.filter((id) => id !== postId));
  };

  return (
    <div className={className}>
      {label && (
        <Label htmlFor="related-posts-search" className="mb-2 block">
          {label} (max {maxRelatedPosts})
        </Label>
      )}

      <div className="space-y-4">
        {/* Selected posts */}
        <div className="space-y-2">
          {selectedPosts.length > 0 ? (
            selectedPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 border rounded-md bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center space-x-3">
                  {post.coverImage && (
                    <div className="relative w-12 h-12 rounded-md overflow-hidden mr-3 shrink-0">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {post.title}
                    </h4>
                    {post.shortDescription && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {post.shortDescription}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveRelatedPost(post.id)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
              No related posts selected
            </div>
          )}
        </div>

        {value.length < maxRelatedPosts && (
          <div className="relative">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  id="related-posts-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for posts to relate..."
                  className={error ? "border-red-500" : ""}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearchPosts();
                    }
                  }}
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  {loading && (
                    <span className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></span>
                  )}
                </div>
              </div>
              <Button
                type="button"
                onClick={handleSearchPosts}
                disabled={loading || !searchQuery.trim()}
              >
                <SearchIcon className="h-4 w-4 mr-1" />
                Search
              </Button>
            </div>

            {searchError && (
              <div className="mt-2 flex items-center text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {searchError}
              </div>
            )}

            {/* Search results dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
                <ul>
                  {searchResults.map((post) => (
                    <li
                      key={post.id}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleAddRelatedPost(post)}
                    >
                      <div className="flex items-center space-x-3">
                        {post.coverImage && (
                          <div className="relative w-12 h-12 rounded-md overflow-hidden mr-3 shrink-0">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-sm">{post.title}</h4>
                          {post.shortDescription && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {post.shortDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {showSearchResults &&
              searchResults.length === 0 &&
              searchQuery &&
              !loading && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 p-3 text-center text-gray-500">
                  No posts found matching &quot;{searchQuery}&quot;
                </div>
              )}
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}
