# Cinex Universe — Vercel Deployment Checklist

## ✅ Code Fixes Applied (Committed & Ready)

| # | Fix | File |
|---|-----|------|
| 1 | **Database URL parser** — Handles `@` in passwords and raw URLs | `api/queries/connection.ts` |
| 2 | **tRPC Google Sign-In** — Changed from broken raw `fetch()` to proper tRPC client call | `src/pages/Login.tsx` |
| 3 | **Dynamic OAuth redirect URI** — Uses `SITE_URL` env var instead of hardcoded domain | `api/google-auth-router.ts`, `api/lib/env.ts` |
| 4 | **Vercel handler wrapper** — Added safe error handling around `app.fetch` | `api/index.ts` |
| 5 | **API catch-all rewrite** — All `/api/*` routes now route to the serverless function | `vercel.json` |
| 6 | **SPA fallback** — Non-API routes serve `index.html` for HashRouter compatibility | `vercel.json` |
| 7 | **API bundling** — Build now bundles `api/index.ts` for Vercel reliability | `package.json` |
| 8 | **DB availability check** — `isDbAvailable()` now actually initializes the connection instead of returning stale `false` | `api/queries/connection.ts` |
| 9 | **TypeScript errors fixed** — `admin-router.ts` + `server.ts` types cleaned | `api/admin-router.ts`, `api/server.ts`, `db/schema.ts` |
| 10 | **API tsconfig** — Added `api/tsconfig.json` so Vercel can resolve `@db/*` aliases | `api/tsconfig.json` |

---

## ⚠️ CRITICAL: Add These 10 Environment Variables in Vercel

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add ALL of these:

| Variable | Value | Required For |
|----------|-------|--------------|
| `DATABASE_URL` | `postgresql://postgres:Karthi20252026@db.bktysbxwhjrjibzamosr.supabase.co:5432/postgres` | Database connection |
| `APP_SECRET` | Any strong random string (min 32 chars) | JWT signing |
| `RAZORPAY_KEY_ID` | Your Razorpay Key ID | Payments |
| `RAZORPAY_KEY_SECRET` | Your Razorpay Key Secret | Payments |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID | Google Sign-In |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret | Google Sign-In |
| `SITE_URL` | `https://cinexuniverse-enaxisom5-karthikeyadevs-projects.vercel.app` | OAuth redirect |
| `REPLICATE_API_TOKEN` | *(your Replicate token - add in Vercel, not in code)* | AI generation |
| `OWNER_UNION_ID` | Leave empty or set your admin union ID | Super admin |
| `NODE_ENV` | `production` | Production mode |

> **Important**: The `APP_SECRET` must be at least 32 characters long. Generate one with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 🔧 Vercel Dashboard Settings

1. **Framework Preset**: `Vite`
2. **Output Directory**: `dist`
3. **Install Command**: `npm install`
4. **Build Command**: `npm run build`

---

## 🚀 Deployment Steps

1. Add all 10 environment variables above in Vercel dashboard
2. Push the latest code to GitHub (`main` branch)
3. Vercel will auto-deploy (or click **Redeploy** in Vercel dashboard)
4. Test login at `https://your-site.vercel.app/#/login`

---

## 🔍 How to Test If It Works

After deployment, test these endpoints in your browser:

- **Health Check**: `https://your-site.vercel.app/api/health`
  - Should return: `{"ok":true,"message":"Cinex Universe API is running"}`

- **tRPC Health**: `https://your-site.vercel.app/api/trpc/health`
  - Should return a JSON-RPC batch response with `ok:true`

If the health check returns HTML instead of JSON, the serverless function is crashing — check Vercel logs for the exact error.

---

## 📋 Database Schema

If tables don't exist in Supabase, run this locally:
```bash
npm run db:push
```

Or create them manually in Supabase SQL Editor using `db/schema.sql`.

---

## 🐛 Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| "Unexpected token '<'..." | API returning HTML error page | Missing env vars → check Vercel logs |
| "Database is not configured" | `DATABASE_URL` missing or wrong | Add `DATABASE_URL` in Vercel env vars |
| "Invalid email or password" | Wrong credentials or DB not connected | Check Supabase connection + credentials |
| Google Sign-In fails | Wrong redirect URI | Ensure `SITE_URL` matches Vercel deployment URL |

