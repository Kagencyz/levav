import { Hono } from "hono";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { rateLimiter } from "hono-rate-limiter";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";

const app = new Hono<{ Bindings: HttpBindings }>();

/* ============================================================
   SECURITY MIDDLEWARE
   ============================================================ */

/* CORS — Strict origin policy */
app.use("*", cors({
  origin: env.isProduction
    ? ["https://levavtalent.com", "https://www.levavtalent.com"]
    : ["http://localhost:3000", "http://localhost:5173"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "x-local-auth-token"],
  credentials: true,
  maxAge: 86400,
}));

/* Security Headers — Applied to all responses */
app.use("*", async (c, next) => {
  await next();
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("X-XSS-Protection", "1; mode=block");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (env.isProduction) {
    c.header("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    c.header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://levavtalent.com;");
  }
});

/* Rate Limiting — Auth endpoints (strict) */
const authRateLimit = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // 10 requests per window
  standardHeaders: true,
  keyGenerator: (c) => {
    /* Use IP + user agent hash */
    const ip = c.req.header("x-forwarded-for") ??
               c.req.header("x-real-ip") ??
               "unknown";
    return ip;
  },
  handler: (c) => {
    return c.json({ error: "Too many requests. Please try again later." }, 429);
  },
});

/* Apply strict rate limit to auth endpoints */
app.use("/api/trpc/localAuth.register", authRateLimit);
app.use("/api/trpc/localAuth.login", authRateLimit);
app.use("/api/trpc/localAuth.verifyEmail", authRateLimit);
app.use("/api/trpc/localAuth.resendCode", authRateLimit);
app.use("/api/trpc/localAuth.forgotPassword", authRateLimit);

/* General rate limiting — all API routes */
const generalRateLimit = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  limit: 60, // 60 requests per minute
  standardHeaders: true,
  keyGenerator: (c) => {
    return c.req.header("x-forwarded-for") ??
           c.req.header("x-real-ip") ??
           "unknown";
  },
});
app.use("/api/*", generalRateLimit);

/* Body size limit — 50MB max for file uploads */
app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

/* ============================================================
   ROUTES
   ============================================================ */

/* Health check endpoint */
app.get("/api/health", async (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: env.isProduction ? "production" : "development",
  }, 200);
});

/* OAuth callback */
app.get(Paths.oauthCallback, createOAuthCallbackHandler());

/* tRPC handler */
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

/* 404 handler */
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`[Levav] Server running on port ${port}`);
  });
}
