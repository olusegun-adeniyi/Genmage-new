# CLAUDE.md

Rules of engagement for AI coding assistants (Claude Code, Codex) working on Genmage. Read every session. If something here conflicts with PRD.md, ask before deviating.

## Who you're working with

Olusegun. Senior product designer, 6+ years shipping web products. Wants senior-engineer collaboration — write production code, push back on bad ideas, don't hand him work that compiles but is structurally wrong.

This is a small, tasteful side project. The build quality matters because it's a portfolio artifact. But the *scope* is small — this is not Forge, this is not a system. Optimise for shipping fast without cutting corners on aesthetic.

## Project context (one paragraph)

Genmage is a style-locked watercolor illustration generator. Users type a subject; the app silently prepends a locked style prompt and calls Gemini's Nano Banana image model with a curated style reference image. Every output belongs to the same visual family. No accounts, no payments. Shareable permalinks. A $10/day Postgres-backed cost cap protects spend; per-IP rate limiting is deferred until pre-public-launch (PRD §9). Stack: Next.js 15 + TypeScript + Tailwind v4 + Supabase + Google GenAI SDK + Vercel. Read PRD.md before any non-trivial change.

## Operating rules

1. **Read PRD.md and UI-REVIEW.md before writing code in a new area.** They are the source of truth. Don't reinvent locked decisions.

   **Before finishing any UI work, run it against `UI-REVIEW.md`.** Every screen, every state. Failed items either get fixed or get logged as a deliberate exception in the commit message (`[UI-EXCEPTION: <item #> — <reason>]`).

2. **The style prompt is sacred.** `lib/ai/style-prompt.ts` contains the exact locked style string. Never modify it without asking. Never let user input override it. Never expose it to the client.

3. **Never let user text reach the model without safety.** Prompt goes through Zod validation first (3–200 chars). If Gemini refuses (safety filter), surface the refusal cleanly — never retry with modifications.

4. **The cost cap is non-negotiable; per-IP rate limiting is deferred (PRD §9).** Every successful generation increments the Postgres `daily_cost` row for the current UTC date. If the cost-cap check fails at request time, respond 402 before calling the model. No exceptions "for testing". `ip_hash` is still logged on every generation so rate limiting can be added later without a schema change.

5. **Server components by default.** `'use client'` only where genuinely needed (the prompt form, the copy-link button, the download button). If you're adding `'use client'`, write a one-line comment explaining why.

6. **Follow the folder structure.** Queries in `lib/db/queries/`. AI logic in `lib/ai/`. No Supabase client imports in components — go through the query layer.

7. **Validation at every boundary.** Zod for API inputs, Gemini SDK responses, generation row inserts. No `any`. No `as any`. No `@ts-ignore`.

8. **Small scope is a feature.** Don't add pagination to the gallery. Don't add user accounts. Don't add "share to Twitter" buttons — the copy-link + OG tags handle that. Don't add analytics events beyond what Vercel Analytics already tracks.

9. **The permalink is a first-class page.** `/g/[slug]` should be as beautifully designed as `/`. It's the version most people will see, because they arrive via shared links.

10. **When Gemini is slow, tell the user.** Loading state uses the typewriter status messages defined in the PRD. No generic spinner. Silence during a 10-second wait is a UX failure.

## What "good code" looks like here

- Types first. Define the type, then write the function.
- Pure functions where possible. `lib/ai/style-prompt.ts` is a constant + a builder function, no side effects.
- Small files. If a file exceeds 200 lines, split it.
- Naming honestly. `generateImage` not `run`. `styleReferenceFilename` not `ref`.
- Comments explain *why*, not *what*. Business decisions get one line ("gemini charges per generation regardless of success — increment counter only after success"). Code descriptions do not.

## What "bad code" looks like (reject this)

- Anything that imports `@supabase/supabase-js` into a component
- Anything that adds a new dependency without checking the locked stack
- Anything that uses `any`, `as any`, or `@ts-ignore`
- Anything that hardcodes a color, radius, or spacing outside of `globals.css` tokens
- Anything that adds a settings UI, user accounts, or "advanced options"
- Anything that reaches for tRPC, GraphQL, or an RPC layer — REST is fine for 3 routes
- Anything that uses moment.js or dayjs (use `date-fns` if needed, but likely you don't)
- Anything that expands the DB schema beyond what PRD.md section 6 defines without asking

## Aesthetic non-negotiables

- Paper white background `#fbfaf6`, ink black text `#1a1815`, warm terracotta accent `#c4664a`
- Fraunces (serif) for the prompt input, headings, and editorial copy
- Geist Sans for UI elements (buttons, labels, quota indicators)
- Geist Mono for the URL / slug on the permalink page
- Subtle paper-grain SVG background — barely visible, always present
- 1px borders in `rgba(26, 24, 21, 0.08)`. No shadows on cards.
- Slow motion: `transition duration-300 ease-out` is the default (not 150ms — this is editorial, not snappy)
- Generation fade-in: 600ms, ease-out
- The single "delight" moment is when the generation appears — soft fade, no confetti, no sparkles

If you find yourself reaching for glassmorphism, purple gradients, dark mode, or generic "AI product" tropes — stop. The reference is Kinfolk magazine layouts and It's Nice That article pages, not a Vercel template.

## Style reference images

`public/style-refs/` contains 3–5 curated illustrations from Olusegun's ChatGPT sessions. Do not add, remove, or rename these without asking. The generate-image function picks one at random per request. This is what enforces style consistency; the text prompt alone is not enough.

## Permalink and Open Graph

- Every generation has a permalink at `/g/[slug]` where `slug` is an 8-char base62 string
- The page uses `generateMetadata` to produce OG tags with the image URL, prompt as description, and site name
- Test previews on iMessage, WhatsApp, X, and Instagram DM before shipping. If any look broken, the OG tags are wrong.

## When you're unsure, ask

Don't guess on:
- New dependencies
- New patterns not in this doc or PRD.md
- Whether a feature is P0 vs P1
- Whether to modify the schema, the style prompt, or the reference images
- Whether to deviate from the folder structure

A 30-second question saves a 30-minute rewrite.

## When you're confident, move

If a task is clearly within PRD scope and follows conventions, build it without asking permission for each step. Show working code, explain the choices.

## What to say at the end of a task

- What you built
- What's now broken or untested
- What the next logical task is
- Any decision you made Olusegun should know about

Skip: apologies, restating the prompt, line-by-line summaries of code. He can read code.

## Specifically for Claude Code

- Use planning mode before large multi-file changes
- Run `pnpm typecheck` and `pnpm lint` after non-trivial changes
- Don't leave `pnpm dev` hanging — start, verify, kill
- Migrations: `drizzle-kit generate` first, review SQL, then `migrate`
- Never commit `.env`, `node_modules`, or Gemini API responses cached to disk

## Specifically for Codex

- Same rules apply
- Prefer small reviewable diffs over sweeping rewrites
- Grep the repo before assuming a path or convention
