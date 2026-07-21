# CLAUDE.md

Rules of engagement for AI coding assistants (Claude Code, Codex) working on Genmage. Read every session. If something here conflicts with PRD.md, ask before deviating.

## Who you're working with

Olusegun. Senior product designer, 6+ years shipping web products. Wants senior-engineer collaboration — write production code, push back on bad ideas, don't hand him work that compiles but is structurally wrong.

This is a small, tasteful side project. The build quality matters because it's a portfolio artifact. But the *scope* is small — this is not Forge, this is not a system. Optimise for shipping fast without cutting corners on aesthetic.

## Project context (one paragraph)

Genmage is a style-locked illustration generator built on a curated multi-style architecture. Users pick a style (v1 ships one: Watercolor) and type a subject; the app silently prepends that style's locked prompt — stored in the `style` table, not in code — and calls Gemini's Nano Banana image model with a curated reference image from that style's folder. Every output within a style belongs to the same visual family. No accounts, no payments. Shareable permalinks. A $10/day Postgres-backed cost cap protects spend; per-IP rate limiting is deferred until pre-public-launch (PRD §9). Stack: Next.js 15 + TypeScript + Tailwind v4 + Supabase + Google GenAI SDK + Vercel. Read PRD.md before any non-trivial change.

## Operating rules

1. **Read PRD.md and UI-REVIEW.md before writing code in a new area.** They are the source of truth. Don't reinvent locked decisions.

   **Before finishing any UI work, run it against `UI-REVIEW.md`.** Every screen, every state. Failed items either get fixed or get logged as a deliberate exception in the commit message (`[UI-EXCEPTION: <item #> — <reason>]`).

2. **Before writing or modifying any component with a visual surface — layout, spacing, typography, borders, colors, motion, state design — invoke the Frontend Design Skill and the UI/UX Pro Max Skill.** This is mandatory, not optional. These skills exist because craft-level decisions require pattern knowledge that isn't in the training data or in the PRD. Skipping them produces work that meets the spec but misses the taste bar.

   **When to invoke:** any new component, any layout change, any tuning pass on existing components, before running the `UI-REVIEW.md` walkthrough.

   **When not to invoke:** pure schema, API, backend, or data layer work; documentation changes; dependency management.

   After invoking, briefly note in the response which skill(s) were used and what specifically was drawn from them (a pattern, a spacing principle, a state design). This creates accountability and shows the skill was actually applied, not just name-dropped.

3. **Style prompts are sacred.** Each style's locked prompt lives in the `style` table (`style.prompt`), not in application code. Edit it only via a seed migration or directly in Supabase Studio — never from a route handler, never in response to user input. Never let user input override it. Never expose it to the client.

4. **Never let user text reach the model without safety.** Prompt goes through Zod validation first (3–200 chars). If Gemini refuses (safety filter), surface the refusal cleanly — never retry with modifications.

5. **The cost cap is non-negotiable; per-IP rate limiting is deferred (PRD §9).** Every successful generation increments the Postgres `daily_cost` row for the current UTC date. If the cost-cap check fails at request time, respond 402 before calling the model. No exceptions "for testing". `ip_hash` is still logged on every generation so rate limiting can be added later without a schema change.

6. **Server components by default.** `'use client'` only where genuinely needed (the prompt form, the copy-link button, the download button). If you're adding `'use client'`, write a one-line comment explaining why.

7. **Follow the folder structure.** Queries in `lib/db/queries/`. AI logic in `lib/ai/`. No Supabase client imports in components — go through the query layer.

8. **Validation at every boundary.** Zod for API inputs, Gemini SDK responses, generation row inserts. No `any`. No `as any`. No `@ts-ignore`.

9. **Small scope is a feature.** Don't add pagination to the gallery. Don't add user accounts. Don't add "share to Twitter" buttons — the copy-link + OG tags handle that. Don't add analytics events beyond what Vercel Analytics already tracks.

10. **The permalink is a first-class page.** `/g/[slug]` should be as beautifully designed as `/`. It's the version most people will see, because they arrive via shared links.

11. **When Gemini is slow, tell the user.** Loading state uses the typewriter status messages defined in the PRD. No generic spinner. Silence during a 10-second wait is a UX failure.

## What "good code" looks like here

- Types first. Define the type, then write the function.
- Pure functions where possible. Once a style's prompt is fetched from the DB, building the final text sent to Gemini is a pure function — no other side effects.
- Small files. If a file exceeds 200 lines, split it.
- Naming honestly. `generateImage` not `run`. `styleReferenceFilename` not `ref`.
- Comments explain *why*, not *what*. Business decisions get one line ("gemini charges per generation regardless of success — increment counter only after success"). Code descriptions do not.

## What "bad code" looks like (reject this)

- Anything that imports `@supabase/supabase-js` into a component
- Anything that adds a new dependency without checking the locked stack
- Anything that uses `any`, `as any`, or `@ts-ignore`
- Anything that hardcodes a color, radius, or spacing outside of `globals.css` tokens
- Anything that adds a settings UI, user accounts, or "advanced options"
- Anything that reaches for tRPC, GraphQL, or an RPC layer — REST is fine for 4 routes
- Anything that uses moment.js or dayjs (use `date-fns` if needed, but likely you don't)
- Anything that expands the DB schema beyond what PRD.md section 6 defines without asking

## Aesthetic non-negotiables

- Background `#fafaf9`, foreground (ink) `#0a0a0a`, muted `#f5f5f4`, muted-foreground `#737373`. No terracotta, no color accent — primary actions are solid foreground-on-background. Monochrome by design.
- Inter for everything — headings, body, UI, slugs, URLs, quota indicators. No serif, no separate mono. `font-feature-settings: "cv11" 1, "ss01" 1` on the body (single-story 'a', open digits).
- Tabular numerals (`font-variant-numeric: tabular-nums`) wherever digits appear, so they don't shift width.
- 1px borders in `rgba(0, 0, 0, 0.08)`, hover state `rgba(0, 0, 0, 0.12)`. No shadows on cards.
- Radius scale: `rounded-sm` (6px), `rounded-md` (12px), `rounded-lg` (20px).
- Fast, precise motion: `transition duration-150 ease-out` is the default. This is deliberately snappy, not editorial-slow.
- The generation fade-in is still the one deliberate "delight" moment (currently 600ms, ease-out) — worth revisiting the exact number once the result surface is actually built, but it should read as a deliberate pause against the otherwise-fast system, not another 150ms transition.

If you find yourself reaching for glassmorphism, gradients, dark mode, or generic "AI product" tropes — stop. The reference is Linear: precise, monochrome, information-dense without feeling cramped, motion that feels instant, not performative.

## Style reference images

`public/style-refs/{style_id}/` contains 3–5 curated illustrations per style (v1: `public/style-refs/watercolor/` only). Do not add, remove, or rename these without asking. The generate-image function picks one at random per request, scoped to the requested style's folder. This is what enforces style consistency; the text prompt alone is not enough. A new style needs its own folder in place before it can go `active` in the `style` table.

## Permalink and Open Graph

- Every generation has a permalink at `/g/[slug]` where `slug` is an 8-char base62 string
- The page uses `generateMetadata` to produce OG tags with the image URL, prompt as description, and site name
- Test previews on iMessage, WhatsApp, X, and Instagram DM before shipping. If any look broken, the OG tags are wrong.

## When you're unsure, ask

Don't guess on:
- New dependencies
- New patterns not in this doc or PRD.md
- Whether a feature is P0 vs P1
- Whether to modify the schema, any style's locked prompt, or its reference images
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
- Phases and commits are 1:1. Every discrete phase of work ends with a commit and a push before any next-phase work begins. Do not batch multiple phases into one commit. If a phase completes and no commit instruction is given by Olusegun, ask before proceeding — silence on commits is not permission to defer them.

## Specifically for Codex

- Same rules apply
- Prefer small reviewable diffs over sweeping rewrites
- Grep the repo before assuming a path or convention
