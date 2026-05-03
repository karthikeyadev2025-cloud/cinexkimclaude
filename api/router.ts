import { authRouter } from "./auth-router.js";
import { localAuthRouter } from "./local-auth-router.js";
import { googleAuthRouter } from "./google-auth-router.js";
import { castingRouter } from "./casting-router.js";
import { projectRouter } from "./project-router.js";
import { adminRouter } from "./admin-router.js";
import { aiProxyRouter } from "./ai-proxy-router.js";
import { paymentRouter } from "./payment-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  health: publicQuery.query(async () => {
    return {
      ok: true,
      ts: Date.now(),
      message: "Cinex Universe API is running",
    };
  }),
  auth: authRouter,
  localAuth: localAuthRouter,
  googleAuth: googleAuthRouter,
  casting: castingRouter,
  project: projectRouter,
  admin: adminRouter,
  ai: aiProxyRouter,
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;
