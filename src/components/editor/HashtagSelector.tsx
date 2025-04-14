"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { X, Plus, Tag, Loader2 } from "lucide-react";

interface Hashtag {
  id: string;
  name: string;
}

interface HashtagSelectorProps {
  value: string[]; // Array of hashtag IDs
  onChange: (value: string[]) => void;
  className?: string;
  label?: string;
  error?: string;
}

export default function HashtagSelector({
  value,
  onChange,
  className = "",
  label = "Hashtags",
  error,
}: HashtagSelectorProps) {
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState<Hashtag[]>([]);
  const [filteredHashtags, setFilteredHashtags] = useState<Hashtag[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [creatingHashtag, setCreatingHashtag] = useState(false);

  useEffect(() => {
    fetchHashtags();
  }, []);

  useEffect(() => {
    // Filter hashtags based on input
    if (inputValue) {
      const filtered = hashtags.filter(
        (hashtag) =>
          hashtag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !value.includes(hashtag.id)
      );
      setFilteredHashtags(filtered);
    } else {
      setFilteredHashtags([]);
    }
  }, [inputValue, hashtags, value]);

  useEffect(() => {
    // Fetch selected hashtags info based on value (IDs)
    const selected = hashtags.filter((hashtag) => value.includes(hashtag.id));
    setSelectedHashtags(selected);
  }, [hashtags, value]);

  const fetchHashtags = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/hashtags");
      const data = await response.json();
      if (data.success) {
        setHashtags(data.data);
      } else {
        console.error("Failed to fetch hashtags:", data.message);
      }
    } catch (error) {
      console.error("Error fetching hashtags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHashtag = async () => {
    if (!inputValue.trim()) return;

    setCreatingHashtag(true);
    try {
      const response = await fetch("/api/hashtags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: inputValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add the new hashtag to the list
        setHashtags((prev) => [...prev, data.data]);

        // Add to selected hashtags
        onChange([...value, data.data.id]);

        // Reset the input
        setInputValue("");
        setShowDropdown(false);
      } else {
        console.error("Failed to create hashtag:", data.message);
      }
    } catch (error) {
      console.error("Error creating hashtag:", error);
    } finally {
      setCreatingHashtag(false);
    }
  };

  const handleSelectHashtag = (hashtagId: string) => {
    if (!value.includes(hashtagId)) {
      onChange([...value, hashtagId]);
    }
    setInputValue("");
    setShowDropdown(false);
  };

  const handleRemoveHashtag = (hashtagId: string) => {
    onChange(value.filter((id) => id !== hashtagId));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // If a hashtag is selected in the dropdown, select it
      if (filteredHashtags.length > 0) {
        handleSelectHashtag(filteredHashtags[0].id);
      } else if (inputValue.trim()) {
        // Otherwise create a new hashtag
        handleCreateHashtag();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div className={className}>
      {label && (
        <Label htmlFor="hashtag-input" className="mb-2 block">
          {label}
        </Label>
      )}

      <div className="space-y-3">
        <div className="relative">
          <div
            className={`flex items-center flex-wrap gap-2 p-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white dark:bg-gray-800`}
          >
            {selectedHashtags.map((hashtag) => (
              <div
                key={hashtag.id}
                className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 text-sm"
              >
                <Tag className="h-3 w-3 mr-1" />
                {hashtag.name}
                <button
                  type="button"
                  onClick={() => handleRemoveHashtag(hashtag.id)}
                  className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <div className="flex-1">
              <Input
                id="hashtag-input"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (e.target.value) {
                    setShowDropdown(true);
                  }
                }}
                onFocus={() => {
                  if (inputValue) {
                    setShowDropdown(true);
                  }
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Type to search or create hashtags..."
                className="border-0 shadow-none focus-visible:ring-0 p-0 h-8"
              />
            </div>
          </div>

          {/* Dropdown for hashtag suggestions */}
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
              {filteredHashtags.length > 0 ? (
                <ul>
                  {filteredHashtags.map((hashtag) => (
                    <li
                      key={hashtag.id}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                      onClick={() => handleSelectHashtag(hashtag.id)}
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      {hashtag.name}
                    </li>
                  ))}
                </ul>
              ) : (
                inputValue && (
                  <div className="p-3">
                    <div className="flex justify-between items-center">
                      <span>Create &quot;{inputValue}&quot;</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleCreateHashtag}
                        disabled={creatingHashtag}
                      >
                        {creatingHashtag ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Plus className="h-4 w-4 mr-1" />
                        )}
                        Create
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}
