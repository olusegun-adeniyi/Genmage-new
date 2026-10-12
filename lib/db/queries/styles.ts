import { and, asc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { style } from "@/lib/db/schema";

export async function getActiveStyle(styleId: string) {
  const [row] = await getDb()
    .select()
    .from(style)
    .where(and(eq(style.id, styleId), eq(style.active, true)));

  return row ?? null;
}

export async function getActiveStyles() {
  // Oldest first, so the style grid's order is stable as styles are added.
  return getDb().select().from(style).where(eq(style.active, true)).orderBy(asc(style.createdAt));
}
