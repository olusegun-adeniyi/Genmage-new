import { eq, sql } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { dailyCost } from "@/lib/db/schema";

// Nano Banana per-image cost (PRD §9) — flat rate regardless of prompt length or output size.
const GENERATION_COST_USD = 0.04;

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getTodaysCostUsd(): Promise<number> {
  const [row] = await getDb().select().from(dailyCost).where(eq(dailyCost.date, todayUtc()));
  return row ? Number(row.amountUsd) : 0;
}

export async function incrementTodaysCost(): Promise<void> {
  const date = todayUtc();

  await getDb()
    .insert(dailyCost)
    .values({ date, amountUsd: GENERATION_COST_USD.toString() })
    .onConflictDoUpdate({
      target: dailyCost.date,
      set: { amountUsd: sql`${dailyCost.amountUsd} + ${GENERATION_COST_USD}` },
    });
}
