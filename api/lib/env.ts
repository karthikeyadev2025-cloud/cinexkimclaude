import "dotenv/config";

function getEnv(name: string): string {
  return process.env[name] ?? "";
}

export const env = {
  appId: getEnv("APP_ID"),
  appSecret: getEnv("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: getEnv("DATABASE_URL"),
  kimiAuthUrl: getEnv("KIMI_AUTH_URL"),
  kimiOpenUrl: getEnv("KIMI_OPEN_URL"),
  ownerUnionId: getEnv("OWNER_UNION_ID") || "",
  replicateApiToken: getEnv("REPLICATE_API_TOKEN") || "",
  razorpayKeyId: getEnv("RAZORPAY_KEY_ID") || "",
  razorpayKeySecret: getEnv("RAZORPAY_KEY_SECRET") || "",
  googleClientId: getEnv("GOOGLE_CLIENT_ID") || "",
  googleClientSecret: getEnv("GOOGLE_CLIENT_SECRET") || "",
  siteUrl: getEnv("SITE_URL") || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://cinexuniverse.com"),
  appUrl: getEnv("APP_URL") || getEnv("SITE_URL") || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://cinexuniverse.com"),
};
