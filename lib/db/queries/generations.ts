import { db } from "@/lib/db";
import { generation, type NewGeneration } from "@/lib/db/schema";

export async function insertGeneration(values: NewGeneration) {
  const [row] = await db.insert(generation).values(values).returning();

  if (!row) {
    throw new Error("Insert did not return a generation row");
  }

  return row;
}
