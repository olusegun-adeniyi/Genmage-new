# UI Review Checklist

Run this against every screen and every state before considering it done. This is the bar. Failed items are fixed or logged as deliberate exceptions in the commit message (`[UI-EXCEPTION: <item #> — <reason>]`).

Apply to:
- Every page (`app/**/page.tsx`)
- Every significant component (`components/canvas.tsx`, `components/prompt-input.tsx`, `components/generation-result.tsx`, etc.)
- Every state (empty, loading, populated, error, rate-limited, cost-capped)

---

## 1. Does this screen use only approved tokens?

**Pass criteria:**
- Colors from CSS variables in `globals.css` `@theme` block. No hex codes in component files.
- Approved palette only: `--background` (`#fafaf9`), `--foreground` (`#0a0a0a`), `--muted` (`#f5f5f4`), `--muted-foreground` (`#737373`), `--border` (`rgba(0,0,0,0.08)`), `--border-hover` (`rgba(0,0,0,0.12)`), `--danger` (`#b91c1c`). No terracotta, no color accent — monochrome only.
- Spacing from Tailwind scale (`gap-4`, `gap-6`, `gap-8`, `gap-12`). No arbitrary values.
- Border radii from token set: `rounded-sm` (6px), `rounded-md` (12px), `rounded-lg` (20px). No `rounded-[9px]`.
- Typography: Inter for everything — headings, body, UI, slugs, URLs, quota indicators. No separate mono, no second sans. Use tabular numerals (`font-variant-numeric: tabular-nums`) on any numeric display for alignment.

**Fail signals:**
- Any inline `style={{ color: '#...' }}`
- Tailwind palette colors (`bg-orange-500`, `text-stone-800`) not mapped to tokens
- Any arbitrary spacing or radius
- A new font import
- A numeric display (quota count, slug) without tabular-nums

---

## 2. Is there a clear primary action?

**Pass criteria:**
- One primary action per screen, solid foreground fill, dominant.
- Secondary actions are ghost or bordered variant, in `--muted-foreground`.
- No two solid-fill buttons visible simultaneously.

**Fail signals:**
- "Generate" and "Try again" both styled as primary
- A screen where the eye doesn't know where to land first
- Primary action below the fold on mobile

**Genmage-specific:** On `/`, the Generate button is the primary. On `/g/[slug]`, it's [Copy link]. Everything else recedes.

---

## 3. Is spacing consistent?

**Pass criteria:**
- Vertical rhythm uses `gap-4` (16px) or `gap-6` (24px) for most sections. `gap-8` (32px) is reserved for genuinely major section breaks — the exception, not the default. This is Linear-density, not the old generous-editorial scale.
- Card internals use `gap-4` (16px).
- Text-to-text within a group uses `gap-2` (8px).
- Horizontal padding at layout level: `px-6` mobile, `px-12` desktop.
- Result surface and input have equal horizontal padding.

**Fail signals:**
- Two visually similar elements with different spacing for no reason
- Loose, airy spacing used as a default rather than a deliberate exception — tight and precise is correct here
- Custom margin hacks on individual children

---

## 4. Are touch targets at least 44px?

**Pass criteria:**
- All interactive elements minimum 44×44px on mobile.
- Icon buttons: `size-11` (44px) with icon at `size-5` centered.
- The Generate button minimum 48px tall — it's the hero action, don't make it precious.
- Adjacent taps have 8px+ clear space between them.
- Native input behaviors: `<textarea>` for the prompt input, autoresize, iOS-safe font size (16px+ to prevent zoom).

**Fail signals:**
- A `<button>` with `p-1` and an icon
- Download / share / copy buttons stacked too tightly on the result surface
- Prompt input smaller than 16px on mobile (triggers iOS zoom)

---

## 5. Are loading, empty, and error states included?

**Pass criteria:**
- **Loading:** Typewriter status messages rotating every ~2s ("mixing the pigments...", "letting it dry...", "adding the shadow..."). Not a generic spinner. Placeholder shape matches the coming result (square, same width as image).
- **Empty (home):** 4 curated example generations displayed as a gentle grid below the input. Each is clickable to populate the input with that prompt. Copy above them: "or start from one of these" in `--muted-foreground`.
- **Rate limited (per-IP):** Warm copy: "You've made 20 today — the studio reopens at midnight UTC." Input disabled, examples still visible.
- **Cost capped (global):** Warm copy: "The studio's closed for the day — come back tomorrow." Input hidden, examples still visible.
- **Error (generation failed):** "That one didn't work — try a different prompt." Input remains populated, button re-enabled.
- **Safety refusal (Gemini blocked prompt):** "That prompt didn't work — try something else." No detail on why.
- **Permalink 404:** Beautiful centered message: "This one's gone." + link home.

**Fail signals:**
- Any state showing a raw error message or JSON
- Blank screens during loading
- Generic "An error occurred" toast
- Silent failures (button clicked, nothing happens)

---

## 6. Is the hierarchy obvious within 3 seconds?

**Pass criteria:**
- Squint test: blurred, the primary element (canvas on `/`, image on `/g/[slug]`) is still identifiable.
- One H1 per screen, if present at all — Inter, large (`text-3xl` mobile, `text-5xl` desktop), tight tracking. The new layout may not need a heading at all; the canvas does the work a headline used to.
- The user's prompt on the result surface is Inter, `text-lg`, sits above the image with breathing room.
- Supporting elements (quota indicator, footer link) recede: `text-sm text-muted-foreground`.
- Three-second rule: put the screen in front of yourself fresh. Can you say what to do next in three seconds? If not, fix hierarchy.

**Fail signals:**
- A screen where every text size is the same
- Prompt input competing visually with generated image on the result state
- Quota indicator ("15 left today") competing with the Generate button

**Genmage-specific reading order on `/` (mobile):** (1) canvas — dominant, top half of the viewport, (2) prompt input — visual weight, sits below the canvas, (3) style tile + Generate — bottom of screen, thumb-reachable (matches item 7's mobile-reach requirement). On `/g/[slug]`: (1) generated image, (2) prompt, (3) copy-link action.

---

## 7. Does the screen feel native to mobile?

**Pass criteria:**
- Mobile-first layout — the mobile version isn't a shrunk desktop.
- Prompt input is thumb-reachable, not pinned to the top.
- Generate button is comfortable to reach in the bottom 60% of the viewport.
- Safe area insets respected: `pb-[env(safe-area-inset-bottom)]` on any bottom-fixed element.
- Native input behaviors: textarea autoresize, `enterKeyHint="go"`, `autocomplete="off"`, `spellCheck` on.
- Image on result renders responsively — never overflows, always fills the intended width.
- Tap feedback: `active:opacity-80` or `active:scale-[0.98]` on all interactive elements.

**Fail signals:**
- Prompt input too small to type comfortably with thumbs
- Generate button top-right (unreachable one-handed)
- Result image overflows on narrow screens
- No visible tap feedback (interaction feels dead)

---

## 8. Are there any one-off styles?

**Pass criteria:**
- Every style traces to a token or a reusable component.
- No inline `style={{ }}` unless computing a dynamic value.
- ClassName strings kept short — long strings suggest a component should be extracted.
- No `!important` anywhere.

**Fail signals:**
- Two buttons that are "almost the same" with slight differences
- A one-off color that doesn't match any token
- Bespoke spacing that duplicates existing scale values

---

## 9. Is the UI too dense?

**Pass criteria:**
- Precise and uncluttered. This is Linear energy — tight, not empty — not Notion-sidebar clutter and not Kinfolk-generous either.
- On `/`, the only elements are: canvas, input, style tile, button, quota indicator (small), and (in empty state) example gallery. That's it.
- On `/g/[slug]`, the only elements are: image, prompt, action buttons, footer link. That's it.
- Sections separated by whitespace, not borders where possible.
- No decoration for decoration's sake — every element earns its place.

**Fail signals:**
- Every pixel occupied
- Explanatory helper text that could be omitted
- Multiple containers nested for no reason
- The result page has more chrome than image

**Inverse failure (also reject):** So sparse it feels broken. Generous ≠ vacant. There should be enough visual presence that the page feels intentional, not incomplete.

---

## 10. Is the copy clear and human?

**Pass criteria:**
- Plain, warm, direct English — Linear-precise, not Kinfolk-editorial. Say the thing, don't dress it up.
- Placeholder examples in the input are evocative and specific: "a quiet cup of matcha on a rainy morning", "an old man reading by a window", "wildflowers in a jam jar" — never "Generate an image of..."
- Loading messages are handmade, not mechanical: "mixing the pigments...", "letting it dry...", "adding the shadow...". Never "Processing...", "Loading...", "Please wait...".
- Rate limit / cost cap copy uses the studio metaphor: "the studio's closed", "the studio reopens at midnight". Consistent voice.
- Button labels are verbs, one or two words: "Generate", "Download", "Copy link", "Try again". Sentence case.
- No emojis in UI copy. None. Still banned.
- Error copy says what failed and offers a next step: "That one didn't work — try a different prompt." Never "Error 500" or "Something went wrong".
- Footer sentence: "Generated images are provided for personal use. Don't be a jerk." Warm, human, brief.

**Fail signals:**
- "Awesome! 🎉 Your image is ready!"
- "Please enter a valid prompt"
- Button labeled "Submit" or "Click here"
- Toast messages longer than 8 words
- Any emoji in the UI
- Mixed capitalization across the same screen

**Genmage tone:** Direct, warm, human — Linear-precise, not Kinfolk-editorial. Treats the user as taste-having and busy. Not a coach, not a cheerleader, not "AI-forward." Precise, not precious.

---

## Process

When Claude Code finishes a screen or state:
1. Open this file.
2. Walk each item against the work.
3. For each item: pass, fail (with reason), or N/A (with reason).
4. Fix all fails before marking task done.
5. If a fail is intentional: log in commit message with `[UI-EXCEPTION: <item #> — <reason>]`.

When in doubt (especially items 6, 9, 10): screenshot and ask Olusegun. Don't ship contested calls silently.
