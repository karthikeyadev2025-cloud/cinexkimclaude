import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router.js";
import { createContext } from "./context.js";
import { env } from "./lib/env.js";

const app = new Hono();

// CORS
app.use("*", async (c, next) => {
  const origin = c.req.header("origin");
  const isAllowedOrigin =
    !origin ||
    origin === env.siteUrl ||
    origin.startsWith("http://localhost:") ||
    origin.endsWith(".kimi.page");

  if (origin && isAllowedOrigin) {
    c.header("Access-Control-Allow-Origin", origin);
    c.header("Access-Control-Allow-Credentials", "true");
  }

  c.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  c.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  if (c.req.method === "OPTIONS") {
    return c.body(null, 204);
  }

  await next();
});

// Body limit
app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// Health check
app.get("/api/health", (c) => {
  return c.json({
    ok: true,
    ts: Date.now(),
    message: "Cinex Universe API is running",
    version: "1.0.0",
  });
});

// tRPC handler
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

// Google OAuth callback
app.get("/api/oauth/google/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const error = c.req.query("error");

  if (error) {
    return c.html(`
      <html><body style="background:#060606;color:#F0F0F0;font-family:sans-serif;text-align:center;padding:50px;">
        <h2>Google Sign-In Error</h2>
        <p>${error}</p>
        <a href="/#/login" style="color:#D4A853;">Back to Login</a>
      </body></html>
    `);
  }

  if (!code) {
    return c.html(`
      <html><body style="background:#060606;color:#F0F0F0;font-family:sans-serif;text-align:center;padding:50px;">
        <h2>Sign-In Failed</h2>
        <p>Authorization code not received from Google.</p>
        <a href="/#/login" style="color:#D4A853;">Back to Login</a>
      </body></html>
    `);
  }

  try {
    const caller = appRouter.createCaller({ req: c.req.raw, resHeaders: new Headers() });
    const result = await caller.googleAuth.exchangeCode({ code, state: state || "" });

    return c.html(`
      <html>
        <body style="background:#060606;color:#F0F0F0;font-family:sans-serif;text-align:center;padding:50px;">
          <h2 style="color:#D4A853;">Welcome, ${result.user.name || "Filmmaker"}!</h2>
          <p>Sign-in successful. Redirecting to dashboard...</p>
          <script>
            localStorage.setItem('cinex_token', '${result.token}');
            setTimeout(() => window.location.href = '/#/dashboard', 100);
          </script>
        </body>
      </html>
    `);
  } catch (err: any) {
    return c.html(`
      <html><body style="background:#060606;color:#F0F0F0;font-family:sans-serif;text-align:center;padding:50px;">
        <h2 style="color:#E74C3C;">Sign-In Error</h2>
        <p>${err.message || 'Something went wrong'}</p>
        <a href="/#/login" style="color:#D4A853;">Back to Login</a>
      </body></html>
    `);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not Found", path: c.req.path }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json({ error: "Internal Server Error", message: (err as Error).message }, 500);
});

export default app;
