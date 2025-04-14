"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link as LinkIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  className = "",
  error,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [showLinkInput, setShowLinkInput] = useState<boolean>(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert focus:outline-none max-w-none min-h-[200px] p-4",
        placeholder,
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`border rounded-md bg-white dark:bg-gray-900 ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
      } ${className}`}
    >
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={
            editor.isActive("underline") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={
            editor.isActive("strike") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={
            editor.isActive("code") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        {!showLinkInput ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setShowLinkInput(true);
              // If text is selected and is part of a link, pre-fill the input
              if (editor.isActive("link")) {
                setLinkUrl(editor.getAttributes("link").href);
              }
            }}
            className={
              editor.isActive("link") ? "bg-gray-200 dark:bg-gray-700" : ""
            }
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex items-center">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL"
              className="text-sm p-1 border rounded mr-1 w-[150px]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (!linkUrl) {
                    editor.chain().focus().unsetLink().run();
                  } else {
                    // Add https:// if no protocol is specified
                    const url = linkUrl.includes("://")
                      ? linkUrl
                      : `https://${linkUrl}`;
                    editor.chain().focus().setLink({ href: url }).run();
                  }
                  setLinkUrl("");
                  setShowLinkInput(false);
                } else if (e.key === "Escape") {
                  setShowLinkInput(false);
                  setLinkUrl("");
                }
              }}
              autoFocus
            />
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (!linkUrl) {
                  editor.chain().focus().unsetLink().run();
                } else {
                  // Add https:// if no protocol is specified
                  const url = linkUrl.includes("://")
                    ? linkUrl
                    : `https://${linkUrl}`;
                  editor.chain().focus().setLink({ href: url }).run();
                }
                setLinkUrl("");
                setShowLinkInput(false);
              }}
            >
              Set
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl("");
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <EditorContent editor={editor} />

      {error && <p className="text-red-500 text-sm p-2 mt-1">{error}</p>}
    </div>
  );
}
