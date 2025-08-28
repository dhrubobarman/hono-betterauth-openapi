import type z from "zod";

import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

import { account } from "@/db/schemas/user-auth/account";
import { session } from "@/db/schemas/user-auth/session";
import { twoFactor } from "@/db/schemas/user-auth/two-factor";

export const RoleEnum = pgEnum("role", ["admin", "user"]);

export const user = pgTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID as string (36 chars)
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: varchar("image", { length: 512 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  role: RoleEnum("role").default("user").notNull(),
  banned: boolean("banned").default(false),
  banReason: varchar("banReason", { length: 500 }),
  banExpires: timestamp("banExpires"),
  twoFactorEnabled: boolean("two_factor_enabled"),
});

export const usersRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  twoFactor: many(twoFactor),
}));

export const selectUserSchema = createSelectSchema(user);
export type UserType = z.infer<typeof selectUserSchema>;
