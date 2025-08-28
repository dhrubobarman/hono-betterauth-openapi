import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import env from "@/env";

import * as schema from "./schemas";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const db = drizzle(pool, {
  schema,
  casing: "snake_case",
});

export default db;
