import { Hono } from "hono";
import { z } from "zod";

// Type for environment bindings
type Bindings = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
  SESSION_STORE: KVNamespace;
};

// Create a new Hono app for auth routes
const auth = new Hono<{ Bindings: Bindings }>();

// Login schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Login endpoint
auth.post("/login", async (c) => {
  try {
    // Get request body
    const body = await c.req.json();

    // Validate request body
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return c.json({ error: "Invalid request body" }, 400);
    }

    // Mock authentication - in a real app, you would check against the database
    const { email, password } = result.data;

    // Mock successful login
    if (email === "admin@example.com" && password === "password123") {
      // Generate a session token
      const sessionToken = crypto.randomUUID();

      // Store session in KV
      await c.env.SESSION_STORE.put(
        sessionToken,
        JSON.stringify({
          userId: "1",
          email,
          role: "admin",
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        })
      );

      return c.json({
        token: sessionToken,
        user: {
          id: "1",
          email,
          role: "admin",
        },
      });
    }

    // If credentials don't match
    return c.json({ error: "Invalid credentials" }, 401);
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Authentication failed" }, 500);
  }
});

// Logout endpoint
auth.post("/logout", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Missing or invalid authorization header" }, 401);
    }

    const token = authHeader.substring(7);

    // Delete the session from KV
    await c.env.SESSION_STORE.delete(token);

    return c.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return c.json({ error: "Logout failed" }, 500);
  }
});

export { auth };
