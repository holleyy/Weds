import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-02e825ae/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-02e825ae/signup", async (c) => {
  try {
    const { username, pin } = await c.req.json();

    if (!username || !pin) {
      return c.json({ error: "Username and PIN are required" }, 400);
    }

    // Check if username already exists
    const existingUser = await kv.get(`user:${username}`);
    if (existingUser) {
      return c.json({ error: "Username already exists" }, 409);
    }

    // Create user account with hashed PIN
    const userId = crypto.randomUUID();
    const userAccount = {
      id: userId,
      username,
      pin, // In production, this should be hashed
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${username}`, userAccount);
    await kv.set(`userId:${userId}`, userAccount);

    return c.json({ 
      success: true, 
      userId,
      username 
    });
  } catch (error) {
    console.log(`Error during signup: ${error}`);
    return c.json({ error: `Signup failed: ${error}` }, 500);
  }
});

// Login endpoint
app.post("/make-server-02e825ae/login", async (c) => {
  try {
    const { username, pin } = await c.req.json();

    if (!username || !pin) {
      return c.json({ error: "Username and PIN are required" }, 400);
    }

    // Hardcoded admin account
    if (username === "Admin" && pin === "Winner") {
      return c.json({
        success: true,
        userId: "admin",
        username: "Admin",
        isAdmin: true,
      });
    }

    const user = await kv.get(`user:${username}`);
    if (!user || user.pin !== pin) {
      return c.json({ error: "Invalid username or PIN" }, 401);
    }

    return c.json({
      success: true,
      userId: user.id,
      username: user.username,
      isAdmin: false,
    });
  } catch (error) {
    console.log(`Error during login: ${error}`);
    return c.json({ error: `Login failed: ${error}` }, 500);
  }
});

// Save ballot (draft or submitted)
app.post("/make-server-02e825ae/ballot/save", async (c) => {
  try {
    const { userId, ballot, isSubmitted } = await c.req.json();

    if (!userId || !ballot) {
      return c.json({ error: "User ID and ballot data are required" }, 400);
    }

    const ballotData = {
      userId,
      ballot,
      isSubmitted: isSubmitted || false,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`ballot:${userId}`, ballotData);

    if (isSubmitted) {
      await kv.set(`ballot:submitted:${userId}`, ballotData);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving ballot: ${error}`);
    return c.json({ error: `Failed to save ballot: ${error}` }, 500);
  }
});

// Get user's ballot
app.get("/make-server-02e825ae/ballot/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const ballot = await kv.get(`ballot:${userId}`);

    if (!ballot) {
      return c.json({ ballot: null });
    }

    return c.json({ ballot });
  } catch (error) {
    console.log(`Error fetching ballot: ${error}`);
    return c.json({ error: `Failed to fetch ballot: ${error}` }, 500);
  }
});

// Get all submitted ballots
app.get("/make-server-02e825ae/ballots/submitted", async (c) => {
  try {
    const ballots = await kv.getByPrefix("ballot:submitted:");
    
    // Get usernames for each ballot
    const ballotsWithUsernames = await Promise.all(
      ballots.map(async (ballotData) => {
        const user = await kv.get(`userId:${ballotData.userId}`);
        return {
          ...ballotData,
          username: user?.username || "Unknown",
        };
      })
    );

    return c.json({ ballots: ballotsWithUsernames });
  } catch (error) {
    console.log(`Error fetching submitted ballots: ${error}`);
    return c.json({ error: `Failed to fetch ballots: ${error}` }, 500);
  }
});

// Get voting statistics
app.get("/make-server-02e825ae/stats", async (c) => {
  try {
    const ballots = await kv.getByPrefix("ballot:submitted:");
    
    // Calculate stats for each category and nominee
    const stats: Record<string, Record<string, { willWin: number; shouldWin: number }>> = {};

    ballots.forEach((ballotData) => {
      Object.entries(ballotData.ballot).forEach(([category, picks]: [string, any]) => {
        if (!stats[category]) {
          stats[category] = {};
        }

        if (picks.willWin) {
          if (!stats[category][picks.willWin]) {
            stats[category][picks.willWin] = { willWin: 0, shouldWin: 0 };
          }
          stats[category][picks.willWin].willWin++;
        }

        if (picks.shouldWin) {
          if (!stats[category][picks.shouldWin]) {
            stats[category][picks.shouldWin] = { willWin: 0, shouldWin: 0 };
          }
          stats[category][picks.shouldWin].shouldWin++;
        }
      });
    });

    return c.json({ stats, totalBallots: ballots.length });
  } catch (error) {
    console.log(`Error calculating stats: ${error}`);
    return c.json({ error: `Failed to calculate stats: ${error}` }, 500);
  }
});

// Save film log
app.post("/make-server-02e825ae/film-log/save", async (c) => {
  try {
    const { userId, filmLog } = await c.req.json();

    if (!userId || !filmLog) {
      return c.json({ error: "User ID and film log data are required" }, 400);
    }

    const filmLogData = {
      userId,
      filmLog,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`filmLog:${userId}`, filmLogData);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving film log: ${error}`);
    return c.json({ error: `Failed to save film log: ${error}` }, 500);
  }
});

// Get user's film log
app.get("/make-server-02e825ae/film-log/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const filmLogData = await kv.get(`filmLog:${userId}`);

    if (!filmLogData) {
      return c.json({ filmLog: {} });
    }

    return c.json({ filmLog: filmLogData.filmLog });
  } catch (error) {
    console.log(`Error fetching film log: ${error}`);
    return c.json({ error: `Failed to fetch film log: ${error}` }, 500);
  }
});

// Get current winners (public)
app.get("/make-server-02e825ae/winners", async (c) => {
  try {
    const winners = await kv.get("winners");
    return c.json({ winners: winners || {} });
  } catch (error) {
    console.log(`Error fetching winners: ${error}`);
    return c.json({ error: `Failed to fetch winners: ${error}` }, 500);
  }
});

// Set winners (admin only)
app.post("/make-server-02e825ae/winners", async (c) => {
  try {
    const { username, pin, winners } = await c.req.json();

    if (username !== "Admin" || pin !== "Winner") {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!winners || typeof winners !== "object") {
      return c.json({ error: "Winners data is required" }, 400);
    }

    await kv.set("winners", winners);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving winners: ${error}`);
    return c.json({ error: `Failed to save winners: ${error}` }, 500);
  }
});

Deno.serve(app.fetch);