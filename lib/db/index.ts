import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

type Database = ReturnType<typeof drizzle<typeof schema>>;

let db: Database | null = null;

// Lazy init: reading DATABASE_URL at module scope would throw during Next.js's
// build-time page data collection, before real env vars are available.
export function getDb(): Database {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  if (!db) {
    db = drizzle(postgres(process.env.DATABASE_URL, { prepare: false }), { schema });
  }

  return db;
}
