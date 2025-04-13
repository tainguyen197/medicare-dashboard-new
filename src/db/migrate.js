import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as dotenv from "dotenv";

dotenv.config();

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  console.log("Running migrations...");

  // Create a client
  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  // Create a Drizzle ORM instance
  const db = drizzle(client);

  try {
    // Run migrations
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("Migrations completed successfully");
  } catch (error) {
    // Check if the error is because tables already exist
    if (error.message && error.message.includes("already exists")) {
      console.log("Tables already exist, skipping migration");
    } else {
      // For other errors, rethrow
      console.error("Migration failed:", error);
      process.exit(1);
    }
  }

  process.exit(0);
}

runMigrations().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
