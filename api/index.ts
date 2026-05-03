import app from "./boot.js";

export default async function handler(request: Request): Promise<Response> {
  try {
    return await app.fetch(request);
  } catch (err: any) {
    console.error("[Vercel] API fatal error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: err?.message || "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
