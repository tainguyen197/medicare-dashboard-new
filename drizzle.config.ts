import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
