import { boolean, date, index, jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { EditState } from "@/lib/validation/edit-state";

export const style = pgTable("style", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  prompt: text("prompt").notNull(),
  active: boolean("active").notNull().default(false),
  exampleImageUrl: text("example_image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Style = typeof style.$inferSelect;
export type NewStyle = typeof style.$inferInsert;

export const generation = pgTable(
  "generation",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    prompt: text("prompt").notNull(),
    style: text("style")
      .notNull()
      .default("watercolor")
      .references(() => style.id),
    styleReference: text("style_reference").notNull(),
    imageUrl: text("image_url").notNull(),
    // Nullable — written only on Export or Share (§ PRD Post-generation editing). A
    // fresh generation has no edit_state row until one of those actions happens.
    editState: jsonb("edit_state").$type<EditState>(),
    ipHash: text("ip_hash").notNull(),
    featured: boolean("featured").notNull().default(false),
    reported: boolean("reported").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("generation_slug_idx").on(table.slug),
    index("generation_featured_created_at_idx").on(table.featured, table.createdAt.desc()),
  ],
);

export type Generation = typeof generation.$inferSelect;
export type NewGeneration = typeof generation.$inferInsert;

export const dailyCost = pgTable("daily_cost", {
  date: date("date").primaryKey(),
  amountUsd: numeric("amount_usd", { precision: 6, scale: 2 }).notNull().default("0"),
});

export type DailyCost = typeof dailyCost.$inferSelect;
