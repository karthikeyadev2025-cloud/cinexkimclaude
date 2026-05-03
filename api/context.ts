import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "../db/schema.js";
import { verifyLocalToken } from "./lib/local-jwt.js";
import { getDb } from "./queries/connection.js";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema.js";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try local JWT auth
  if (!ctx.user) {
    try {
      const authHeader = opts.req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7);
        const payload = await verifyLocalToken(token);
        if (payload) {
          const user = await getDb()
            .select()
            .from(schema.users)
            .where(eq(schema.users.id, payload.userId))
            .then((rows) => rows.at(0));
          if (user && user.isActive) {
            ctx.user = user;
          }
        }
      }
    } catch {
      // Local auth failed
    }
  }

  return ctx;
}
