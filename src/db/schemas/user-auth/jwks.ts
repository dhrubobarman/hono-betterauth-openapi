import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const jwks = pgTable("jwks", {
  id: varchar("id", { length: 36 }).primaryKey(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
