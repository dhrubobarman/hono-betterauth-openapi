import { defineConfig } from "drizzle-kit";

// drizzle.config.ts
import env from "@/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schemas/index.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
