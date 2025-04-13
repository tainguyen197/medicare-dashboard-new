import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./routes/auth";
import { patients } from "./routes/patients";
import { claims } from "./routes/claims";

// Environment interface
interface Env {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
  MEDICARE_BUCKET: R2Bucket;
  SESSION_STORE: KVNamespace;
}

// Create Hono app
const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use("*", cors());

// Add routes
app.route("/auth", auth);
app.route("/patients", patients);
app.route("/claims", claims);

// Root endpoint
app.get("/", (c) => {
  return c.json({
    message: "Medicare Dashboard API",
    version: "1.0.0",
  });
});

// Export default for Cloudflare Workers
export default app;
