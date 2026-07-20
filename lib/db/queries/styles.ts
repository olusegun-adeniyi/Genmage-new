import { and, eq } from "drizzle-orm";

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
  return getDb().select().from(style).where(eq(style.active, true));
}
