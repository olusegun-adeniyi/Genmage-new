import { readFile, writeFile } from "fs/promises";
import path from "path";

import postgres from "postgres";

const API_URL = "http://localhost:3000/api/generate";
const DELAY_MS = 2000;
const PROMPTS_PATH = path.join(process.cwd(), "scripts", "test-prompts.json");
const RESULTS_PATH = path.join(process.cwd(), "scripts", "consistency-results.md");

type TestPrompt = {
  bucket: string;
  style: string;
  adversarial: boolean;
  prompt: string;
};

type GenerateSuccess = {
  slug: string;
  imageUrl: string;
  prompt: string;
};

type TestResult =
  | { status: "success"; entry: TestPrompt; slug: string; imageUrl: string; styleReference: string }
  | { status: "error"; entry: TestPrompt; error: string };

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadPrompts(): Promise<TestPrompt[]> {
  const raw = await readFile(PROMPTS_PATH, "utf-8");
  return JSON.parse(raw) as TestPrompt[];
}

let sql: postgres.Sql | null = null;

function getSql(): postgres.Sql {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  if (!sql) {
    sql = postgres(process.env.DATABASE_URL, { prepare: false });
  }

  return sql;
}

async function lookupStyleReference(slug: string): Promise<string> {
  const rows = await getSql()<{ style_reference: string }[]>`
    select style_reference from generation where slug = ${slug}
  `;
  return rows[0]?.style_reference ?? "unknown";
}

function errorMessageFrom(body: unknown, status: number): string {
  if (typeof body === "object" && body !== null && "error" in body) {
    return String((body as { error: unknown }).error);
  }
  return `HTTP ${status}`;
}

async function generate(entry: TestPrompt): Promise<TestResult> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: entry.prompt }),
  });

  const body: unknown = await response.json();

  if (!response.ok) {
    return { status: "error", entry, error: errorMessageFrom(body, response.status) };
  }

  const { slug, imageUrl } = body as GenerateSuccess;
  const styleReference = await lookupStyleReference(slug);

  return { status: "success", entry, slug, imageUrl, styleReference };
}

function formatResultEntry(result: TestResult): string {
  if (result.status === "success") {
    return [
      `### ${result.entry.prompt}`,
      "",
      `![${result.entry.prompt}](${result.imageUrl})`,
      "",
      `- **Slug:** \`${result.slug}\``,
      `- **Style reference:** \`${result.styleReference}\``,
      `- **Style:** ${result.entry.style}`,
      "",
    ].join("\n");
  }

  return [
    `### ${result.entry.prompt}`,
    "",
    `**Failed:** ${result.error}`,
    "",
    `- **Style:** ${result.entry.style}`,
    "",
  ].join("\n");
}

function groupByBucket(results: TestResult[]): Map<string, TestResult[]> {
  const groups = new Map<string, TestResult[]>();

  for (const result of results) {
    const bucket = result.entry.bucket;
    const existing = groups.get(bucket) ?? [];
    existing.push(result);
    groups.set(bucket, existing);
  }

  return groups;
}

function buildMarkdown(results: TestResult[]): string {
  const successCount = results.filter((result) => result.status === "success").length;
  const groups = groupByBucket(results);

  const sections = Array.from(groups.entries()).map(([bucket, bucketResults]) => {
    const heading = `## ${bucket} (${bucketResults.length})`;
    const entries = bucketResults.map(formatResultEntry).join("\n");
    return `${heading}\n\n${entries}`;
  });

  return [
    "# Style consistency test results",
    "",
    `Generated ${successCount}/${results.length} images successfully.`,
    "",
    sections.join("\n"),
  ].join("\n");
}

async function main(): Promise<void> {
  const prompts = await loadPrompts();
  const results: TestResult[] = [];

  for (let i = 0; i < prompts.length; i++) {
    const entry = prompts[i];

    if (!entry) continue;

    console.log(`[${i + 1}/${prompts.length}] generating: "${entry.prompt}"`);

    const result = await generate(entry);
    results.push(result);

    if (result.status === "success") {
      console.log(`  ok -> ${result.slug} (ref: ${result.styleReference})`);
    } else {
      console.log(`  failed -> ${result.error}`);
    }

    if (i < prompts.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  await writeFile(RESULTS_PATH, buildMarkdown(results), "utf-8");
  console.log(`\nWrote ${RESULTS_PATH}`);

  if (sql) {
    await sql.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
