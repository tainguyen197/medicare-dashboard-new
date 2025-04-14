import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const roles = ["owner", "admin", "editor"] as const;

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash"),
  role: text("role", { enum: roles }).notNull().default("editor"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

// Categories for blog posts
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// Hashtags for blog posts
export const hashtags = sqliteTable("hashtags", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  shortDescription: text("short_description"),
  content: text("content"),
  categoryId: text("category_id").references(() => categories.id),
  coverImage: text("cover_image"),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// Junction table for posts to hashtags (many-to-many)
export const postHashtags = sqliteTable("post_hashtags", {
  id: text("id").primaryKey(),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
  hashtagId: text("hashtag_id")
    .notNull()
    .references(() => hashtags.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

// Table for related posts
export const relatedPosts = sqliteTable("related_posts", {
  id: text("id").primaryKey(),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
  relatedPostId: text("related_post_id")
    .notNull()
    .references(() => posts.id),
  isManuallySelected: integer("is_manually_selected", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

// Table for post images
export const postImages = sqliteTable("post_images", {
  id: text("id").primaryKey(),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});
