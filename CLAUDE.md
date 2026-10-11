# CLAUDE.md

Rules of engagement for AI coding assistants (Claude Code, Codex) working on Genmage. Read every session. If something here conflicts with PRD.md, ask before deviating.

## Who you're working with

Olusegun. Senior product designer, 6+ years shipping web products. Wants senior-engineer collaboration — write production code, push back on bad ideas, don't hand him work that compiles but is structurally wrong.

This is a small, tasteful side project. The build quality matters because it's a portfolio artifact. But the *scope* is small — this is not Forge, this is not a system. Optimise for shipping fast without cutting corners on aesthetic.

## Project context (one paragraph)

Genmage is a style-locked illustration generator built on a curated multi-style architecture. Users pick a style (v1 ships one: Watercolor) and type a subject; the app silently prepends that style's locked prompt — stored in the `style` table, not in code — and calls Gemini's Nano Banana image model with a curated reference image from that style's folder. Every output within a style belongs to the same visual family. The interface is a two-section light studio — a left column (Generate + Recently generated) and the canvas, with the Adjustments panel floating in the canvas's top-right — built from `design_handoff_illustration_studio/` — white panels with hairline borders, one neutral grey ramp, and a single purple primary (`#6600FF`) on the active Generate button only. Post-generation editing offers nine sliders (intensity, rotate, saturation, brightness, contrast, tint, temperature, highlight, border weight) plus border and background colour — nudging a generation, not a photo editor. No accounts, no payments. Shareable permalinks. A $10/day Postgres-backed cost cap protects spend; per-IP rate limiting is deferred until pre-public-launch (PRD §9). Stack: Next.js 15 + TypeScript + Tailwind v4 + Supabase + Google GenAI SDK + Vercel. Read PRD.md before any non-trivial change.

## Operating rules

1. **Read PRD.md and UI-REVIEW.md before writing code in a new area.** They are the source of truth. Don't reinvent locked decisions.

   **Before finishing any UI work, run it against `UI-REVIEW.md`.** Every screen, every state. Failed items either get fixed or get logged as a deliberate exception in the commit message (`[UI-EXCEPTION: <item #> — <reason>]`).

2. **Before writing or modifying any component with a visual surface — layout, spacing, typography, borders, colors, motion, state design — invoke the Frontend Design Skill and the UI/UX Pro Max Skill.** This is mandatory, not optional. These skills exist because craft-level decisions require pattern knowledge that isn't in the training data or in the PRD. Skipping them produces work that meets the spec but misses the taste bar.

   **When to invoke:** any new component, any layout change, any tuning pass on existing components, before running the `UI-REVIEW.md` walkthrough.

   **When not to invoke:** pure schema, API, backend, or data layer work; documentation changes; dependency management.

   After invoking, briefly note in the response which skill(s) were used and what specifically was drawn from them (a pattern, a spacing principle, a state design). This creates accountability and shows the skill was actually applied, not just name-dropped.

3. **Before adding any new color, radius, spacing, or motion value, consult `design/tokens.ts` and `DESIGN-SYSTEM.md`.** If the value exists, use the token. If it doesn't, add it to `tokens.ts` first (with usage notes), then use it in the component. Inline hex codes, magic numbers, or ad-hoc spacing values are not permitted in components. Token drift is the fastest way for a design system to become fiction.

4. **Style prompts are sacred.** Each style's locked prompt lives in the `style` table (`style.prompt`), not in application code. Edit it only via a seed migration or directly in Supabase Studio — never from a route handler, never in response to user input. Never let user input override it. Never expose it to the client.

5. **Never let user text reach the model without safety.** Prompt goes through Zod validation first (3–200 chars). If Gemini refuses (safety filter), surface the refusal cleanly — never retry with modifications.

6. **The cost cap is non-negotiable; per-IP rate limiting is deferred (PRD §9).** Every successful generation increments the Postgres `daily_cost` row for the current UTC date. If the cost-cap check fails at request time, respond 402 before calling the model. No exceptions "for testing". `ip_hash` is still logged on every generation so rate limiting can be added later without a schema change.

7. **Server components by default.** `'use client'` only where genuinely needed (the prompt form, the copy-link button, the download button). If you're adding `'use client'`, write a one-line comment explaining why.

8. **Follow the folder structure.** Queries in `lib/db/queries/`. AI logic in `lib/ai/`. No Supabase client imports in components — go through the query layer.

9. **Validation at every boundary.** Zod for API inputs, Gemini SDK responses, generation row inserts. No `any`. No `as any`. No `@ts-ignore`.

10. **Small scope is a feature.** Don't add pagination to the gallery. Don't add user accounts. Don't add "share to Twitter" buttons — the copy-link + OG tags handle that. Don't add analytics events beyond what Vercel Analytics already tracks.

11. **The permalink is a first-class page.** `/g/[slug]` should be as beautifully designed as `/`. It's the version most people will see, because they arrive via shared links.

12. **When Gemini is slow, tell the user.** Loading state uses the typewriter status messages defined in the PRD. No generic spinner. Silence during a 10-second wait is a UX failure.

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
- Anything that hardcodes a color, radius, spacing, or motion value outside of `design/tokens.ts` / `globals.css`
- Anything that adds a settings UI, user accounts, or "advanced options"
- Anything that reaches for tRPC, GraphQL, or an RPC layer — REST is fine for 4 routes
- Anything that uses moment.js or dayjs (use `date-fns` if needed, but likely you don't)
- Anything that expands the DB schema beyond what PRD.md section 6 defines without asking

## Aesthetic non-negotiables

Source of truth: `design_handoff_illustration_studio/README.md` (high-fidelity) for palette and proportions → `design/tokens.ts` → `app/globals.css` for sizes. The handoff was scaled down ~20% (2026-10-08) so the studio fits a laptop viewport — `tokens.ts` sizes win over the handoff's pixel values.

- **Two sections, no page scroll from 1024px up.** Left column (Generate + Recently generated) at 20% (256px floor on narrower laptops), canvas filling the rest, 20px gap, 20px margin on every side of the screen. The Adjustments panel floats inside the canvas at its top-right; everything in the canvas keeps a 16px padding from its edge, and the illustration sits left of the panel so it's never covered. If the viewport is too short, Adjustments and the recent list scroll inside themselves. Below 1024px the layout stacks into one column (Adjustments below the canvas) and the page scrolls.

- **Light and dark themes, light by default.** A toggle in the canvas's top-left sets `<html data-theme>` and remembers the choice (applied before paint, no flash). Light: page `#F5F5F5` with a low-contrast dot grid (`#DCDCDC`, 1px dots, 24px apart — `bg-dot-grid`), panels and canvas `#FFFFFF` (all with the 1px `#EAEAEA` border), fields `#F6F6F6`, action bar `#F0F0F0`. Dark values live in `tokens.darkColors` / the `:root[data-theme="dark"]` block — every colour token must have both. **The canvas stays white in both themes** so illustrations (and their paper-removed edges) never change; the dark UI frames the art. Components use semantic tokens only, so they theme for free — never hard-code a light-only value.
- **One primary, one moment:** `--color-primary` (`#6600FF`) is the active Generate button. Nowhere else — Export is a plain toolbar button, the selected style tile uses an ink ring, not colour.
- **One type style:** system SF Pro stack, 13px / 18px, weight 400, everywhere (the prompt textarea goes to 16px on touch screens so iOS doesn't zoom). Hierarchy comes from colour (`foreground-strong` → `foreground` → `muted-foreground`), never size or weight. Tabular numerals wherever digits appear.
- **Borders, not shadows:** 1px `#EAEAEA` on panels. The style grid and the recent list sit directly in their panels with no outline of their own. The aspect menu is the only elevated (shadowed) surface.
- **Radius scale** (`design/tokens.ts` → `radii`): `xs` 6 (thumbnails), `sm` 8 (list/menu items), `md` 10 (buttons, sliders, tiles, rows), `lg` 14 (prompt box, action bar, aspect menu), `xl` 16 (reserved), `2xl` 20 (panels), `full`.
- **Fast motion:** 150ms ease-out default; 120ms for the slider label flip; the generation fade-in (400ms) is the one deliberate pause. All motion off under `prefers-reduced-motion`.

If you find yourself reaching for glassmorphism, gradients, or generic "AI product" tropes — stop. The illustration on the canvas should always be the most colourful thing on screen.

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
