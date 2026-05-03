import path from "path"
const __dirname = import.meta.dirname
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig(async ({ mode }) => {
  const plugins: any[] = [react()]

  if (mode === "development") {
    const [{ default: devServer }, { inspectAttr }] = await Promise.all([
      new Function('return import("@hono/vite-dev-server")')() as Promise<any>,
      new Function('return import("plugin-inspect-react-code")')() as Promise<any>,
    ])
    plugins.unshift(
      devServer({ entry: "api/boot.ts", exclude: [/^\/(?!api\/).*$/] }),
      inspectAttr(),
    )
  }

  return {
    base: "/",
    plugins,
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@contracts": path.resolve(__dirname, "./contracts"),
        "@db": path.resolve(__dirname, "./db"),
        "db": path.resolve(__dirname, "./db"),
      },
    },
    envDir: path.resolve(__dirname),
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
    },
  }
})
