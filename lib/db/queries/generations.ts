import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { generation, type NewGeneration } from "@/lib/db/schema";
import type { EditState } from "@/lib/validation/edit-state";

export async function insertGeneration(values: NewGeneration) {
  const [row] = await getDb().insert(generation).values(values).returning();

  if (!row) {
    throw new Error("Insert did not return a generation row");
  }

  return row;
}

export async function getGenerationBySlug(slug: string) {
  const [row] = await getDb().select().from(generation).where(eq(generation.slug, slug)).limit(1);

  return row ?? null;
}

export async function updateGenerationEditState(slug: string, editState: EditState) {
  const [row] = await getDb()
    .update(generation)
    .set({ editState })
    .where(eq(generation.slug, slug))
    .returning();

  return row ?? null;
}
