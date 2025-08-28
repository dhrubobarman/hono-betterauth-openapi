import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";

import { user } from "@/db/schemas/user-auth/user";

export const twoFactor = pgTable("two_factor", {
  id: varchar("id", { length: 36 }).primaryKey(),
  secret: varchar("secret", { length: 100 }).notNull(),
  backupCodes: varchar("backup_codes", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const accountRelations = relations(twoFactor, ({ one }) => ({
  user: one(user, {
    fields: [twoFactor.userId],
    references: [user.id],
  }),
}));
