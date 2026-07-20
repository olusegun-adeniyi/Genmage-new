import { NextResponse } from "next/server";

import { getActiveStyles } from "@/lib/db/queries/styles";

// Reads live DB state (which styles are active) — same reasoning as /api/generate.
export const dynamic = "force-dynamic";

export async function GET() {
  const styles = await getActiveStyles();

  return NextResponse.json(
    styles.map((activeStyle) => ({
      id: activeStyle.id,
      name: activeStyle.name,
      exampleImageUrl: activeStyle.exampleImageUrl,
    })),
  );
}
