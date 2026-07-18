import { NextResponse } from "next/server";
import { z } from "zod";

import { generateImage } from "@/lib/ai/generate-image";
import { getTodaysCostUsd, incrementTodaysCost } from "@/lib/db/queries/daily-cost";
import { insertGeneration } from "@/lib/db/queries/generations";
import { hashIp } from "@/lib/ip-hash";
import { generateSlug } from "@/lib/slug";
import { uploadGenerationImage } from "@/lib/storage/upload-image";

// This route writes to Postgres, calls Gemini, and uploads to Storage on every
// request — never statically analyzable, so opt out of build-time evaluation.
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  prompt: z.string().trim().min(3).max(200),
});

function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_prompt" }, { status: 400 });
  }

  const dailyCostCapUsd = Number(process.env.DAILY_COST_CAP_USD);
  const costSoFar = await getTodaysCostUsd();

  if (costSoFar >= dailyCostCapUsd) {
    return NextResponse.json({ error: "cost_cap_reached" }, { status: 402 });
  }

  const result = await generateImage(parsed.data.prompt);

  if (result.outcome !== "success") {
    return NextResponse.json({ error: result.outcome }, { status: 500 });
  }

  const slug = generateSlug();

  const imageUrl = await uploadGenerationImage(slug, result.image.data, result.image.mimeType);

  const row = await insertGeneration({
    slug,
    prompt: parsed.data.prompt,
    styleReference: result.styleReference,
    imageUrl,
    ipHash: hashIp(clientIp(request)),
  });

  // Gemini charges per generation regardless of success — increment the counter only after success.
  await incrementTodaysCost();

  return NextResponse.json({ slug: row.slug, imageUrl: row.imageUrl, prompt: row.prompt });
}
