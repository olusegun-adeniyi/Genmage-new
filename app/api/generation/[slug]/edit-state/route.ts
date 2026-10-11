import { NextResponse } from "next/server";
import { z } from "zod";

import { getGenerationBySlug, updateGenerationEditState } from "@/lib/db/queries/generations";
import { editStateSchema } from "@/lib/validation/edit-state";

// Writes to Postgres on every request — never statically analyzable.
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  editState: editStateSchema,
});

type RouteParams = { params: Promise<{ slug: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_edit_state" }, { status: 400 });
  }

  const existing = await getGenerationBySlug(slug);

  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const row = await updateGenerationEditState(slug, parsed.data.editState);

  if (!row) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ slug: row.slug, editState: row.editState });
}
