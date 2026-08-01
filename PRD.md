# PRD — Genmage

A style-locked image generator. Users describe anything; the output renders in one of a small library of tasteful, fully-realized illustration styles curated by Olusegun. No prompt engineering, no dials — pick a style, describe the subject, that's it.

---

## 1. Problem

Every AI image tool gives users infinite knobs and no taste. Choosing a style, writing a proper prompt, iterating for consistency — it's work, and it's the wrong work if you just want a nice illustration. The result is that most people either give up or generate slop.

Meanwhile, the person who *has* found a style they love has no easy way to share it. Sending friends the prompt doesn't work — it depends on the model, the reference images, the exact phrasing. A style worth having is worth curating and maintaining properly, not passing around as a fragile prompt.

Genmage solves this by curating a small library of tasteful, fully-realized illustration styles server-side. The user doesn't tune anything — they choose from what we've made, describe what they want to see, and the app silently prepends that style's exact locked prompt before calling the image model. Every output within a style belongs to the same visual family. v1 launches with one style, Watercolor — Olusegun's loose hand-painted food sketch aesthetic, refined through many ChatGPT sessions. Future styles are added only once they clear the same bar Watercolor did: a curated reference set and a consistency test that holds up. The curated style library is the moat and the product.

## 2. User

Friends of Olusegun, initially. Anyone with the link.
- No accounts
- No profiles
- No login
- One shared link, sent via WhatsApp / iMessage / X DM
- No expectation of privacy — every generation is publicly viewable via its permalink URL if the URL is shared

Success looks like a friend generating something, screenshotting or sharing the link, and someone else asking "how did you make that?"

## 3. Success criteria

Within 2 weeks of shipping:
- 5+ friends have used it
- Each has generated 20+ images
- At least one generation has been shared to a social platform (X, Instagram Story, group chat)
- Olusegun has personally used it 50+ times without hitting a bug or a cold Vercel function
- Daily API spend has never exceeded the $10 cap

## 4. Core principles

- **The user picks from styles we've curated, but never sees the prompt engineering.** Each style is fully realized before shipping — no coming-soon tiles, no disabled states. v1 launches with one style (Watercolor); future styles appear as tiles in the switcher only when they meet the same reference-curation and consistency-test bar.
- **One input, one output.** No history sidebar in the main view, no settings, no advanced mode. If the interface has more than one meaningful control, we've failed.
- **The surfaces are dual-tone by design, not decoration.** Dark controls panel (bg `#0a0a0a`, foreground white/warm-white) alongside a light canvas + light edit/history panels (bg `#fafaf9`, foreground `#0a0a0a`). Green accent (`#16A34A`) appears only on the Export button — that's the one place color earns its place. Wordmark stays white on the dark surface. The two surfaces sit as distinct rounded panels within a shared page background — they don't blend, they're intentionally different regions with different roles. The aesthetic anchor is still Linear/Vercel-family restraint — considered spacing, generous whitespace, snap motion, no gradients, no decorative flourishes. The dark surface is functional contrast to make the light canvas feel like art on a wall, not just another form field.
- **Free for friends, protected from abuse.** A daily cost cap exists so a runaway browser tab or a shared-too-widely link doesn't drain a credit card. Per-IP rate limiting is deferred until pre-public-launch (see §9) — v1 ships to a small trusted group.
- **Every generation is shareable.** Each result has a permalink with proper Open Graph tags. Sharing is the growth mechanism.
- **The user can nudge, not overhaul.** Post-generation editing is for finishing touches — rotation, color feel, background swap, aspect ratio — not photo editing. If someone wants Photoshop-level control, this isn't the tool. Every editing control feels like a single considered lever, not a professional editor.

## 5. Features

### P0 — must ship in week 1

**Home (`/`)**
- Single screen, four-panel layout: a dark controls panel (style switcher, prompt input, Generate button) paired with three light panels — canvas (top-right: the current generation, plus aspect/share/export controls), history log (bottom-left), and edit panel (bottom-right)
- Prompt input: placeholder rotates through curated example prompts every 4 seconds ("a quiet cup of matcha on a rainy morning", "an old man reading by a window", etc.)
- Generate button: single primary action, solid foreground-on-background, lives in the dark controls panel. Disabled while a generation is in flight.
- Canvas empty state (before the first generation of the session): 4 curated example generations from Olusegun's own testing, each showing the image + prompt used. Clicking one populates the prompt input with that prompt. Once a generation exists, the canvas shows the current result instead — past generations live in the history log, not in this empty state.

**Style switcher**
- Renders a horizontal row of style tiles at the top of the controls panel
- v1: one tile (Watercolor), pre-selected, not visibly interactive as a switcher
- When style #2 exists, the switcher becomes a real choice
- Each tile shows a small example illustration + style name

**Generation flow**
- User types → clicks Generate → loading state appears in the canvas panel (typewriter status: "mixing the pigments...", "letting it dry...", "adding the shadow...") → image appears in the canvas with slow fade
- Backend prepends the locked style prompt to the user's text, optionally attaches a random style reference image from `/public/style-refs/`, calls Nano Banana, uploads result to Supabase Storage, writes generation row, returns slug + URL + default `editState` (§6, §7)
- The new generation appears at the top of the history log, newest first
- Total round-trip target: under 10 seconds
- There's no separate "New generation" button. Typing a new prompt and clicking Generate again *is* the new-generation action — the previous result isn't lost, it's already sitting in the history log, one click away.

**History log**
- Bottom-left panel on desktop; bottom-drawer on mobile
- Shows all generations from the current browser session, newest first
- Session-only, not persisted per-user (no accounts, no DB history per user) — persists across page reloads via localStorage
- Each entry: thumbnail (~48px), relative timestamp ("2m ago"), truncated prompt
- Click entry: loads that generation into the canvas with its saved edit values applied
- Empty state: "Your history will appear here"

**Post-generation editing**
- Bottom-right panel on desktop; edit tab or drawer on mobile
- Six controls modify the currently displayed generation:
  - Rotate: slider, -180° to +180°, default 0°
  - Saturation: slider, 0% to 200%, default 100%
  - Tint: slider, -100 to +100, default 0
  - Black and white: slider, 0 to 100, default 0 (a "grade," not a switch)
  - Border colour: 8 swatches + custom picker; default null (no border)
  - Background colour: 8 swatches + custom picker; default null (transparent)
- Non-destructive: original generation preserved server-side, edits applied client-side
  - Rotate + Saturation + Tint + B&W = CSS filters on the preview
  - Border + Background = composited layer on export (canvas API)
- Reset button restores all defaults
- Edit state persists per generation in localStorage during the session
- On Export or Share, `edit_state` is persisted to the DB row for that generation

**Aspect ratio selector**
- Top-right of canvas: aspect selector, Share, Export, left to right
- Functional in v1, not aspirational
- Options: Square 1:1 (default), Portrait 4:5, Landscape 16:9
- Changes canvas display AND export dimensions
- Changing aspect on an existing generation crops the export (center-crop) — doesn't regenerate

**Share button**
- Top-right of canvas, between the aspect selector and Export
- Icon: link/chain (lucide-react `Link` or `Share2`)
- Copies the `/g/[slug]` permalink to the clipboard, shows a toast: "Link copied"
- Only enabled when a generation exists (disabled/hidden in the empty state, same as Export)
- Before copying, PATCHes the current `edit_state` to the DB row (same endpoint Export uses, §7) — so the permalink always reflects what's currently on screen, not a stale earlier edit

**Export button**
- Top-right of canvas, after the aspect selector and Share button
- Produces the composited edited image as PNG
- 1024px on the longest edge
- Filename: `genmage-<slug>.png`
- Only enabled when a generation exists
- Also PATCHes the current `edit_state` to the DB row before producing the file (§7) — same reasoning as Share: the permalink should never be stale relative to what was just exported

**Permalink page (`/g/[slug]`)**
- Single beautiful page showing one generation: image, prompt, "made with Genmage" footer link back to home
- Renders the generation with its saved `edit_state` applied — filters, border, background, aspect ratio — so what someone sees when they open the link matches what the creator saw when they hit Share or Export, not the raw unedited generation
- Proper Open Graph meta tags so link previews on iMessage, WhatsApp, X, and Instagram render the image cleanly
- No comments, no likes, no anything social — just the artifact

**Cost protection**
- Per-IP rate limiting is deferred until pre-public-launch (see §9) — not shipped in v1
- Global cost cap: $10/day total spend, tracked via a Postgres `daily_cost` table, incremented on each successful generation
- When the cap is hit: UI shows a warm empty state ("The studio's closed for the day — come back tomorrow") instead of the input

### P1 — ship in week 2 if time

**Curated gallery (`/gallery`)**
- A page of the best generations, hand-picked by Olusegun via a `featured` flag toggled in Supabase Studio
- Purpose: give first-time visitors a sense of what's possible before they type anything
- No user-generated gallery ever — quality control matters more than volume

**Regenerate variation**
- Button on the result: [Try again with same prompt]
- Uses a different style reference image to produce a variation
- Counts against the daily cost cap

### P2 — deferred

- Custom aspect ratios (v1 is 1024×1024 only)
- High-res download (2048px, 3× the API cost — gate behind a "worth it" moment later)
- Text overlays / captions
- Additional styles beyond Watercolor (doodle, dither, simple line, etc.) — the switcher architecture already supports this (§6, §11); adding one is curation work (reference images, a locked prompt, a consistency test), not a code project. Added opportunistically post-launch, no fixed schedule.
- Any form of user account
- Any form of payment
- Comment / like / follow system
- Fine-tuning a custom model on Olusegun's generations (interesting long-term, not v1)

### Explicitly out of scope

- User accounts
- Content moderation UI (relies on Gemini's built-in safety + a report button on permalinks going to email)
- Cookie banner (no tracking cookies; an IP hash is logged per generation for future rate limiting, but no cookie is set)
- Marketing site / landing page (the app is the landing page)
- SEO (this is a shared-link tool, not a search-discovered one)
- Mobile app (PWA-installable is enough)

## 6. Data model

Supabase Postgres via Drizzle ORM. Three tables.

```
generation
  id                uuid, primary key
  slug              text, unique, 8-char random (base62)
  prompt            text, the user's input
  style             text, not null, default 'watercolor' — references style.id
  style_reference   text, filename of the style ref used (e.g. "ref_03.jpg")
  image_url         text, Supabase Storage public URL
  edit_state        jsonb, nullable — see structure below; written on Export or Share
  ip_hash           text, sha256 of IP + salt — logged now, enforced once per-IP rate limiting ships (see §9)
  featured          boolean, default false, hand-toggled for /gallery
  reported          boolean, default false, for future moderation
  created_at        timestamptz, default now()
  
  INDEX on slug (for permalink lookup)
  INDEX on featured, created_at desc (for gallery)

style
  id                 text, primary key (e.g. "watercolor", "doodle", "dither", "simple")
  name               text, display name (e.g. "Watercolor")
  prompt             text, the locked style prompt for this style
  active             boolean, default false — only active styles appear in the UI
  example_image_url  text, tile thumbnail
  created_at         timestamptz, default now()

daily_cost
  date              date, primary key (UTC date)
  amount_usd        numeric(6,2), default 0, running total spend for that date
```

**Seed data:** one `style` row — `id: 'watercolor'`, `name: 'Watercolor'`, `active: true`, `prompt`: *"The illustration style is a loose hand-painted watercolor food sketch with soft transparent washes, organic ink-like outlines, warm natural colors, expressive brush textures, subtle color bleeding, and a light blue-grey shadow on a clean white background."* Style reference images move from `public/style-refs/` to `public/style-refs/watercolor/` — the folder path is now keyed by style id, ready for `public/style-refs/doodle/` etc. later.

**`edit_state` structure:**
```
{
  rotate: number,                    // -180 to 180, default 0
  saturation: number,                // 0-200, default 100
  tint: number,                      // -100 to 100, default 0
  bw: number,                        // 0-100, default 0
  borderColor: string | null,        // hex or null
  backgroundColor: string | null,    // hex or null
  aspectRatio: '1:1' | '4:5' | '16:9' // default '1:1'
}
```

Session history is client-side only (localStorage), not in Postgres. Only `edit_state` persists per generation, and only on Export or Share.

Cost cap state lives in Postgres, not a separate KV store — there's no per-IP counter to justify Redis while rate limiting is deferred (see §9).

## 7. API surface

Five routes. All Next.js Route Handlers, all server-side.

```
POST /api/generate
  body: { prompt: string, style?: string }        (style defaults to "watercolor" if omitted)
  → validates prompt (3–200 chars, no obvious injection) and style (must match an active style row),
  → hashes IP (logged for future rate limiting, not yet enforced — see §9),
  → checks global cost cap against today's `daily_cost` row,
  → looks up the style's locked prompt and selects a random reference image from public/style-refs/{style}/,
  → calls Nano Banana with prompt + reference,
  → uploads image to Supabase Storage,
  → writes generation row (including style),
  → increments today's `daily_cost` row,
  → returns { slug, imageUrl, prompt, style, editState }
    (editState is the default object from §6 — rotate 0, saturation 100, tint 0, bw 0,
    borderColor null, backgroundColor null, aspectRatio '1:1' — so the client never has
    to invent defaults itself)
  → errors: 402 (cost cap hit), 500 (generation failed)

PATCH /api/generation/[slug]/edit-state
  body: { editState: EditState }                  (shape defined in §6)
  → validates editState against the §6 schema (ranges, enum, hex-or-null),
  → updates the generation row's edit_state column,
  → called on Export AND on Share — not on every slider drag. Both actions persist the
    current edit_state before completing their own thing (file download / clipboard copy),
    so the permalink is never stale relative to what was last exported or shared
  → returns { slug, editState }
  → errors: 400 (invalid editState shape), 404 (slug not found)

GET /api/styles
  → returns active styles: [{ id, name, exampleImageUrl }]
  → used by the frontend to render the style switcher tiles

GET /api/quota
  → returns { capReached: boolean, resetsAt: ISO string }
  → used by the frontend to show the "studio's closed" empty state and hide the input once the daily cap is reached
  → **status: not yet built.** Documented since Day 3 (§11 step 16) but never implemented — POST /api/generate and GET /api/styles exist, this one doesn't

GET /g/[slug]
  → server-rendered React page (not an API route),
  → fetches generation by slug,
  → applies the row's `edit_state` (if any) when rendering — filters, border, background,
    aspect ratio — so the permalink matches what was last exported or shared, not the raw
    unedited generation,
  → renders with OG tags for social preview
```

## 8. AI integration

**Model:** Google Gemini 2.5 Flash Image (Nano Banana) via `@google/genai` SDK.

**Approach: reference-image + text.** Every generation call includes:
1. A randomly selected style reference image from `/public/style-refs/{style}/` (one curated folder per style; v1 only has `watercolor/`)
2. The locked style prompt for the requested style, looked up from the `style` table (see §6) — not hardcoded
3. The user's prompt, prepended with "Subject: "

Combined structure (pseudocode):
```
const style = await getActiveStyle(styleId)   // from `style` table
const styleRef = await pickRandomReference(`public/style-refs/${styleId}/`)

generateContent({
  model: "gemini-2.5-flash-image",
  contents: [
    { inlineData: { data: styleRefBase64, mimeType: "image/jpeg" } },
    { text: `${style.prompt}\n\nSubject: ${userPrompt}\n\nMatch the illustration style of the reference image exactly. 1024x1024 square composition, centered.` }
  ],
  config: { responseModalities: ["IMAGE"] }
})
```

Full prompt logic lives in `lib/ai/generate-image.ts`, which resolves the style's locked prompt and reference folder by style ID rather than importing a hardcoded constant.

**Fallback:** If Nano Banana outputs disappoint in Day 2 testing, swap to Flux 1.1 Pro via Replicate (~$0.04/image) or GPT-Image-1 via OpenAI (~$0.19/image, highest quality). The generate-image module is the only thing that changes.

## 9. Cost protection (rate limiting deferred)

**Per-IP rate limiting is deferred until pre-public-launch.** v1 ships to a small, trusted group of friends via a single shared link — the realistic failure mode is a link circulating further than expected, not one person hammering the endpoint. The global cost cap is a hard ceiling either way, so it's the only enforced guard for v1. `ip_hash` is still captured on every generation (see §6) so per-IP limiting can be added later without a schema change or a backfill.

**Global cost cap:** $10/day. Enforced by a `daily_cost` row in Postgres, keyed by UTC date. `POST /api/generate` reads today's row before calling the model; if `amount_usd >= 10`, it responds 402 without calling Gemini. On a successful generation, the row is incremented by $0.04 (Nano Banana per-image cost) — an `UPDATE ... SET amount_usd = amount_usd + 0.04` is enough at this traffic volume; a missing row for the current date is created first (upsert). Reset is implicit — a new UTC date means a new row starting at 0.

**IP hashing:** SHA256 of `IP + APP_SECRET` so no raw IPs are stored. Logged now, not yet checked against any limit.

**Failure modes:**
- Global cap hit: UI shows "The studio's closed for the day"
- API failure: UI shows "Something went wrong, please try again" — no charge to the counter

**Before public launch:** revisit per-IP rate limiting once the link leaves the friends-only circle. Upstash Redis (or similar) is the natural fit if a KV counter with TTL ends up cheaper to reason about than a Postgres row per IP per day — that's a decision to make when it's actually needed, not now.

## 10. Tech stack — locked

- **Framework:** Next.js 15 App Router + TypeScript strict
- **Styling:** Tailwind v4 + Inter (single typeface, no serif, no separate mono)
- **Image gen:** `@google/genai` (Gemini 2.5 Flash Image / Nano Banana)
- **DB:** Supabase Postgres + Drizzle ORM (also backs the cost cap — see §9)
- **Storage:** Supabase Storage (public bucket for generated images)
- **Hosting:** Vercel
- **Analytics:** Vercel Analytics (usage counts only, no personal data)
- **Fonts:** `next/font/google` for Inter (weights 400/500/600/700)

**Pending stack decisions (not locked yet):**
- **Composite export:** `html-to-image` (or investigate `dom-to-image-more` if it turns out better) for rendering the edited canvas — filters, border, background — to a PNG. Choose during Phase E, not now (§11).
- **Edit state management:** `zustand` or React Context for holding the six-lever edit state client-side. Choose during Phase D, not now (§11).

Deliberately NOT in the stack:
- Any auth service
- Any email service
- Any payment processor
- Prisma (Drizzle is the choice)
- Any CSS-in-JS library
- Upstash Redis / any KV store — the cost cap lives in Postgres for v1 since rate limiting is deferred (see §9); revisit if per-IP limiting ships and a Postgres row-per-IP-per-day turns out to be the wrong shape

## 11. Build sequence

**Days 1–4 are complete:** foundation end-to-end (Day 1), style consistency dialed in (Day 2), cost protection (Day 3), design system + multi-style scaffolding (Day 4). What follows is the remaining work, replanned around the dual-tone pivot and the editing system — the original Day 5–7 plan (polish → permalinks → ship) is superseded by Phases D–G below, though permalinks and shipping are still in there, just relocated.

**Day 1 — Foundation, ugly but working end-to-end**
1. `pnpm create next-app@latest genmage --typescript --tailwind --app`
2. Install: `drizzle-orm`, `drizzle-kit`, `@google/genai`, `@supabase/supabase-js`, `zod`
3. Set up Supabase project, get connection string, create Storage bucket `generations` (public)
4. Get Gemini API key from Google AI Studio
5. Write `lib/db/schema.ts`, run `drizzle-kit generate` + `migrate`
6. Write `lib/ai/generate-image.ts` — basic Nano Banana call, no reference yet
7. Write `POST /api/generate` — no cost cap yet
8. Write a hideous `app/page.tsx` — one input, one button, one image tag
9. Deploy to Vercel. Confirm end-to-end works.

**Day 2 — Style dialed in**
10. Upload 3–5 of Olusegun's best ChatGPT watercolor generations to `public/style-refs/`
11. Update `generate-image.ts` to include random style reference
12. Generate 30+ test images across varied prompts (food, animals, scenes, objects, abstract, portraits)
13. Judge consistency. Tune the locked style prompt in `lib/ai/style-prompt.ts` if needed
14. **Decision gate:** if consistency is bad, swap model (Flux/GPT-Image-1) before proceeding

**Day 3 — Cost protection**
15. Add `daily_cost` table (Drizzle migration) and cost-cap check in `POST /api/generate`
16. `GET /api/quota` route (cost-cap status only)
17. Cost-cap UI: quota-exhausted empty state ("the studio's closed for the day")
18. Test hitting the cap locally

**Day 4 — Design system + multi-style scaffolding**
19. Add `style` table (Drizzle migration), seed one `watercolor` row; add `style` column to `generation` (default `'watercolor'`) — scaffolding for future styles, even though only one ships in v1
20. Move `public/style-refs/*` → `public/style-refs/watercolor/`; update `generate-image.ts` to resolve the style's locked prompt and reference folder by style ID instead of a hardcoded constant
21. Update `POST /api/generate` to accept `{ prompt, style }` (defaults to `'watercolor'`); add `GET /api/styles`
22. Build the style switcher component — single pre-selected, non-interactive tile in v1
23. Install Inter via next/font (weights 400/500/600/700)
24. Define tokens in `globals.css`: background/foreground/muted/border/danger, radius scale, Inter font mapping, `duration-150` default transition
25. Redesign `app/page.tsx` with Inter input, rotating placeholder, monochrome layout, style switcher at top of controls panel — **blocked on `GET /api/quota` existing** (§7); the home screen can't render a quota indicator or gracefully show the cost-cap empty state without it
26. Design result surface with fade-in and three action buttons

**Phase D (Days 5–7) — Dark surface pivot + scaffolding, generation flow end-to-end**
27. Dark-surface tokens (`--surface-dark`, `--foreground-on-dark`) and the green `--accent` token (§ CLAUDE.md Aesthetic non-negotiables); apply dark surface to the controls panel only
28. History log panel — scaffolded UI (bottom-left desktop / bottom-drawer mobile), reads/writes localStorage, empty state ("Your history will appear here"); click-to-load wired
29. Edit panel — scaffolded UI (bottom-right desktop / edit tab or drawer mobile), six controls rendered at their defaults, not yet wired to the canvas
30. Aspect ratio selector — functional: Square 1:1 / Portrait 4:5 / Landscape 16:9, changes canvas display dimensions
31. Share button — functional: PATCHes the current `edit_state` (§7), copies `/g/[slug]` to the clipboard, "Link copied" toast
32. Export button — functional but produces the raw (unedited) generation for now; compositing lands in Phase E
33. Wire the generation flow end-to-end: Generate → canvas shows result → history log records the entry → entry click reloads it

**Phase E (Days 8–10) — Edit panel wired, composite export**
34. Rotate wired first (simplest — CSS `transform: rotate()` on the preview)
35. Saturation, tint, black-and-white wired (CSS `filter` on the preview)
36. Border colour + background colour swatches and custom picker wired
37. Reset button restores all six controls to default
38. `edit_state` persists per generation to localStorage during the session, and to the `generation` row on Export or Share (`PATCH /api/generation/[slug]/edit-state`, §7)
39. Composite export pipeline: canvas API renders the edited image (filters + border + background) to PNG, 1024px longest edge, `genmage-<slug>.png`

**Phase F (Days 11–12) — Mobile adaptation**
40. Adapt the four-panel desktop layout (controls / canvas / history / edit) for mobile — bottom-sheet drawers for history and edit
41. Test the full flow on a real device, not just responsive mode in a desktop browser

**Phase G (Days 13–14) — Permalinks, polish, ship**
42. `/g/[slug]` page with server-rendered generation, carried over from the original plan (not dropped)
43. Open Graph meta tags with the generation image; test link previews on iMessage, WhatsApp, X, Instagram DM
44. Motion tuning pass, PWA install manifest
45. Lighthouse audit, fix any P0 issues; run UI-REVIEW.md against the full four-panel app
46. Deploy to production, send link to 5 friends, watch first-day feedback

**Estimate:** shipping in 10–14 days from this PRD update.

## 12. Non-goals for v1 (saying out loud)

- It won't handle prompts in languages other than English gracefully (Nano Banana handles them fine, but the placeholder rotation and error copy are English)
- It won't stop someone from generating something ugly — the reference-based style gives ~85% consistency; some outputs will miss
- Session history is not cross-device or cross-browser. Someone who generates on their phone and opens Genmage on their laptop sees an empty history log. This is deliberate — persistent per-user history requires accounts, which we're not building.
- It won't scale to 10,000 users a day. The $10/day cap makes that impossible by design. If it starts hitting the cap regularly, that's the signal to add real accounts + rate limits per user + probably paid tiers, which is a v2 conversation.
- It won't stop a single visitor from generating a lot in one sitting — per-IP rate limiting is deferred (§9). The global cost cap still bounds total daily spend at $10, but one person could exhaust a meaningful share of it before anyone else gets a turn. Acceptable risk for a friends-only link; revisit before the link goes any wider.

## 13. Naming note

"Genmage" is the current name. Chosen for availability, short character count, and "gen" (generate) + "mage" (craft/magic) semantics. Buy the domain (`genmage.app` or similar) before shipping publicly. Confirm no trademark conflict via a quick USPTO / UK IPO search before any marketing.

## 14. Legal / content policy (light-touch)

- Gemini's built-in safety filters catch most problematic prompts. When Gemini refuses to generate, surface that refusal to the user as "That prompt didn't work — try something else"
- Permalink pages include a small `[report]` link that mails a preformatted email to a `report@` address for manual review
- Terms shown as a single sentence in the footer: "Generated images are provided for personal use. Genmage doesn't claim ownership. Don't be a jerk."
- No commercial use grant, no licensing framework — this is a friends-only tool for v1
