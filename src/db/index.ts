import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema/index";

// Create a client using the environment variables
const client = createClient({
  url: process.env.DATABASE_URL as string,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

// Create a Drizzle ORM instance
export const db = drizzle(client, { schema });
