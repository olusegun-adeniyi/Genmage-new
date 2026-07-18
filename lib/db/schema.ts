import { boolean, date, index, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const generation = pgTable(
  "generation",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    prompt: text("prompt").notNull(),
    styleReference: text("style_reference").notNull(),
    imageUrl: text("image_url").notNull(),
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
