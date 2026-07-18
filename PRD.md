# PRD — Genmage

A style-locked image generator. Users describe anything; the output arrives in a single, curated watercolor illustration style. No prompt engineering, no style menus, no dials — just the vibe.

---

## 1. Problem

Every AI image tool gives users infinite knobs and no taste. Choosing a style, writing a proper prompt, iterating for consistency — it's work, and it's the wrong work if you just want a nice illustration. The result is that most people either give up or generate slop.

Meanwhile, the person who *has* found a style they love (in this case, Olusegun's loose hand-painted watercolor food sketch aesthetic, refined through many ChatGPT sessions) has no easy way to share it. Sending friends the prompt doesn't work — it depends on the model, the reference images, the exact phrasing.

Genmage solves this by locking the style server-side. Users type what they want to see. The app silently prepends the exact style prompt and calls the image model. Every output belongs to the same visual family. The style is the moat and the product.

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

- **The style is invisible to the user.** They never see the style portion of the prompt. They never pick a style. The style just *is*.
- **One input, one output.** No history sidebar in the main view, no settings, no advanced mode. If the interface has more than one meaningful control, we've failed.
- **The UI belongs to the same universe as the outputs.** Serif type, warm paper background, generous whitespace, slow editorial motion. If you take a screenshot of the app and one of the illustrations, they should feel of a piece.
- **Free for friends, protected from abuse.** A daily cost cap exists so a runaway browser tab or a shared-too-widely link doesn't drain a credit card. Per-IP rate limiting is deferred until pre-public-launch (see §9) — v1 ships to a small trusted group.
- **Every generation is shareable.** Each result has a permalink with proper Open Graph tags. Sharing is the growth mechanism.

## 5. Features

### P0 — must ship in week 1

**Home (`/`)**
- Serif-typed prompt input, centered, no chrome. Placeholder rotates through curated example prompts every 4 seconds ("a quiet cup of matcha on a rainy morning", "an old man reading by a window", etc.)
- Empty state below the input: 4 curated example generations from Olusegun's own testing, each showing the image + prompt used. Clicking one populates the input with that prompt for the user to modify.
- Generation button: single primary action, warm terracotta accent. Disabled while a generation is in flight.
- Result surface: fades in below the input when generation completes. Shows the image, the user's prompt, and three actions: [Download], [Copy link], [New generation].

**Generation flow**
- User types → clicks Generate → loading state appears (typewriter status: "mixing the pigments...", "letting it dry...", "adding the shadow...") → image appears with slow fade
- Backend prepends the locked style prompt to the user's text, optionally attaches a random style reference image from `/public/style-refs/`, calls Nano Banana, uploads result to Supabase Storage, writes generation row, returns slug + URL
- Total round-trip target: under 10 seconds

**Permalink page (`/g/[slug]`)**
- Single beautiful page showing one generation: image, prompt, "made with Genmage" footer link back to home
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
- Multi-style variants (defeats the "one locked style" principle unless carefully designed)
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

Supabase Postgres via Drizzle ORM. Two tables.

```
generation
  id                uuid, primary key
  slug              text, unique, 8-char random (base62)
  prompt            text, the user's input
  style_reference   text, filename of the style ref used (e.g. "ref_03.jpg")
  image_url         text, Supabase Storage public URL
  ip_hash           text, sha256 of IP + salt — logged now, enforced once per-IP rate limiting ships (see §9)
  featured          boolean, default false, hand-toggled for /gallery
  reported          boolean, default false, for future moderation
  created_at        timestamptz, default now()
  
  INDEX on slug (for permalink lookup)
  INDEX on featured, created_at desc (for gallery)

daily_cost
  date              date, primary key (UTC date)
  amount_usd        numeric(6,2), default 0, running total spend for that date
```

Cost cap state lives in Postgres, not a separate KV store — there's no per-IP counter to justify Redis while rate limiting is deferred (see §9).

## 7. API surface

Three routes. All Next.js Route Handlers, all server-side.

```
POST /api/generate
  body: { prompt: string }
  → validates prompt (3–200 chars, no obvious injection),
  → hashes IP (logged for future rate limiting, not yet enforced — see §9),
  → checks global cost cap against today's `daily_cost` row,
  → selects random style reference from public/style-refs/,
  → calls Nano Banana with prompt + reference,
  → uploads image to Supabase Storage,
  → writes generation row,
  → increments today's `daily_cost` row,
  → returns { slug, imageUrl, prompt }
  → errors: 402 (cost cap hit), 500 (generation failed)

GET /api/quota
  → returns { capReached: boolean, resetsAt: ISO string }
  → used by the frontend to show the "studio's closed" empty state and hide the input once the daily cap is reached

GET /g/[slug]
  → server-rendered React page (not an API route),
  → fetches generation by slug,
  → renders with OG tags for social preview
```

## 8. AI integration

**Model:** Google Gemini 2.5 Flash Image (Nano Banana) via `@google/genai` SDK.

**Approach: reference-image + text.** Every generation call includes:
1. A randomly selected style reference image from `/public/style-refs/` (Olusegun's curated best outputs from ChatGPT)
2. The locked style prompt: *"The illustration style is a loose hand-painted watercolor food sketch with soft transparent washes, organic ink-like outlines, warm natural colors, expressive brush textures, subtle color bleeding, and a light blue-grey shadow on a clean white background."*
3. The user's prompt, prepended with "Subject: "

Combined structure (pseudocode):
```
generateContent({
  model: "gemini-2.5-flash-image",
  contents: [
    { inlineData: { data: styleRefBase64, mimeType: "image/jpeg" } },
    { text: `${LOCKED_STYLE_PROMPT}\n\nSubject: ${userPrompt}\n\nMatch the illustration style of the reference image exactly. 1024x1024 square composition, centered.` }
  ],
  config: { responseModalities: ["IMAGE"] }
})
```

Full prompt logic lives in `lib/ai/style-prompt.ts` and `lib/ai/generate-image.ts`.

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
- **Styling:** Tailwind v4 + Fraunces (serif) + Geist Sans + Geist Mono
- **Image gen:** `@google/genai` (Gemini 2.5 Flash Image / Nano Banana)
- **DB:** Supabase Postgres + Drizzle ORM (also backs the cost cap — see §9)
- **Storage:** Supabase Storage (public bucket for generated images)
- **Hosting:** Vercel
- **Analytics:** Vercel Analytics (usage counts only, no personal data)
- **Fonts:** `next/font/google` for Fraunces, `geist` package for Geist

Deliberately NOT in the stack:
- Any auth service
- Any email service
- Any payment processor
- Prisma (Drizzle is the choice)
- Any CSS-in-JS library
- Upstash Redis / any KV store — the cost cap lives in Postgres for v1 since rate limiting is deferred (see §9); revisit if per-IP limiting ships and a Postgres row-per-IP-per-day turns out to be the wrong shape

## 11. Build sequence

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

**Day 4 — Design system**
19. Install Fraunces + Geist via next/font
20. Define tokens in `globals.css`: paper white bg, ink black text, terracotta accent, borders, radii
21. Paper-grain SVG background
22. Redesign `app/page.tsx` with serif input, rotating placeholder, editorial layout
23. Design result surface with fade-in and three action buttons

**Day 5 — Polish**
24. Curated empty-state gallery with 4 hand-picked examples
25. Loading state: typewriter status messages
26. Micro-interactions: download button feedback, copy-link confirmation
27. Error states (cost cap, generation failure) with warm copy
28. Run UI-REVIEW.md against the app

**Day 6 — Permalinks + sharing**
29. `/g/[slug]` page with server-rendered generation
30. Open Graph meta tags with the generation image
31. Test link previews on iMessage, WhatsApp, X, Instagram DM
32. Add [Copy link] button on result surface

**Day 7 — Ship**
33. Generate 20 examples for gallery seeding
34. Lighthouse audit, fix any P0 issues
35. Deploy to production (custom domain if available)
36. Send link to 5 friends, watch analytics, note first-day feedback

## 12. Non-goals for v1 (saying out loud)

- It won't handle prompts in languages other than English gracefully (Nano Banana handles them fine, but the placeholder rotation and error copy are English)
- It won't stop someone from generating something ugly — the reference-based style gives ~85% consistency; some outputs will miss
- It won't have undo, versions, or history — each generation is its own permalink and that's the record
- It won't scale to 10,000 users a day. The $10/day cap makes that impossible by design. If it starts hitting the cap regularly, that's the signal to add real accounts + rate limits per user + probably paid tiers, which is a v2 conversation.
- It won't stop a single visitor from generating a lot in one sitting — per-IP rate limiting is deferred (§9). The global cost cap still bounds total daily spend at $10, but one person could exhaust a meaningful share of it before anyone else gets a turn. Acceptable risk for a friends-only link; revisit before the link goes any wider.

## 13. Naming note

"Genmage" is the current name. Chosen for availability, short character count, and "gen" (generate) + "mage" (craft/magic) semantics. Buy the domain (`genmage.app` or similar) before shipping publicly. Confirm no trademark conflict via a quick USPTO / UK IPO search before any marketing.

## 14. Legal / content policy (light-touch)

- Gemini's built-in safety filters catch most problematic prompts. When Gemini refuses to generate, surface that refusal to the user as "That prompt didn't work — try something else"
- Permalink pages include a small `[report]` link that mails a preformatted email to a `report@` address for manual review
- Terms shown as a single sentence in the footer: "Generated images are provided for personal use. Genmage doesn't claim ownership. Don't be a jerk."
- No commercial use grant, no licensing framework — this is a friends-only tool for v1
