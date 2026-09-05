import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const progress = sqliteTable("progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  itemId: text("item_id").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  updatedAt: text("updated_at").notNull(),
}, (table) => [uniqueIndex("idx_progress_user_item").on(table.userId, table.itemId)]);
