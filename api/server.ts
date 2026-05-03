import { serve } from "@hono/node-server";
import { serveStaticFiles } from "./lib/vite.js";
import app from "./boot.js";

serveStaticFiles(app as any);

const port = parseInt(process.env.PORT || "3000");
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
