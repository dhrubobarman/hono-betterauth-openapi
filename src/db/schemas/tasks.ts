import { bigint, boolean, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  done: boolean("done").notNull().default(false),
  createdAt: bigint("created_at", { mode: "number" }).$defaultFn(() => new Date().getTime()),
  updatedAt: bigint("updated_at", { mode: "number" }).$defaultFn(() => new Date().getTime()).$onUpdate(() => new Date().getTime()),
});

export const selectTasksSchema = createSelectSchema(tasks);
export const insertTaskSchema = createInsertSchema(tasks, {
  name: schema => schema.min(1).max(100),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const patchTasksSchema = insertTaskSchema.partial();
