# Genmage Design System

Canonical reference for every visual decision in the product. If a component's styling contradicts this document, the document wins — fix the component. If this document is missing something a component needs, add it here first (see "How to extend"), then use it.

Source of truth for raw values: [`design/tokens.ts`](design/tokens.ts). This document explains *why* those values are what they are and *how* to apply them; `tokens.ts` and `app/globals.css` are what components actually consume.

Built consulting the **Frontend Design Skill** and **UI/UX Pro Max Skill** (mandatory per CLAUDE.md rule 2) — specific attributions are called out throughout, not just claimed once here.

---

## Overview

Genmage is dual-tone by design: a dark controls panel paired with light canvas, history, and edit surfaces, sitting as distinct rounded regions within a shared warm-off-white page background — they don't blend into one wash of color, they're deliberately different regions with different jobs. Restraint is the actual design tool here, not an absence of one: per the Frontend Design Skill's "spend your boldness in one place" principle, exactly one accent color (green, `#16a34a`) exists in the entire product, and it appears in exactly one place — the Export button. Everywhere else is monochrome, and that exclusivity is what makes the accent mean something when it shows up. Inter is the only typeface, used at every weight and size the product needs, because a second typeface would be a second decision nobody's making. Motion is fast and precise — 150ms is the default, nothing floats or eases in slowly — because the product's job is to get out of the way of the artwork, not perform for the user. Whitespace is generous rather than cramped; a dashboard-dense layout would fight the "one considered lever per control" philosophy the editing system is built on.

---

## Tokens

Full detail lives in `design/tokens.ts`. This table is the at-a-glance version.

### Colors

| Name | Value | Usage |
|---|---|---|
| `pageBackground` | `#fafaf9` | Whole-page background, outside all panels |
| `surfaceDark` | `#0a0a0a` | Controls panel (dark). **Not yet applied in code** — Phase D |
| `surfaceLight` | `#ffffff` | Canvas panel. Deliberately pure white, distinct from `pageBackground` |
| `surfaceMuted` | `#f5f5f4` | History + edit panels — lighter than page, warmer than canvas |
| `foregroundOnLight` | `#0a0a0a` | Text/icons on `pageBackground`, `surfaceLight`, `surfaceMuted` |
| `foregroundOnDark` | `#fafaf9` | Text/icons on `surfaceDark`. Phase D |
| `mutedForegroundOnLight` | `#737373` | Secondary text on light surfaces — labels, captions, timestamps |
| `mutedForegroundOnDark` | `#a3a3a3` | Secondary text on `surfaceDark`. Phase D |
| `borderOnLight` | `rgba(0,0,0,0.08)` | Hairline borders on light surfaces |
| `borderOnLightHover` | `rgba(0,0,0,0.12)` | Hover state of the above |
| `borderOnDark` | `rgba(255,255,255,0.08)` | Hairline borders on `surfaceDark`. Phase D |
| `borderOnDarkHover` | `rgba(255,255,255,0.12)` | Hover state of the above. Phase D |
| `accent` | `#16a34a` | **Export button only.** See "Never" list below |
| `inputBackground` | `#e8e4e4` | Prompt input specifically — its own semantic slot, not a `surfaceMuted` reuse |
| `sliderTrack` | `#e5e5e5` | Inactive slider track. Phase E |
| `sliderThumb` | `#0a0a0a` | Slider thumb — same value as `foregroundOnLight`, kept as its own named token for call-site clarity |
| `danger` | `#b91c1c` | Destructive/error states — subtle, not alarming |

### Radii

| Name | Value | Usage |
|---|---|---|
| `sm` | `6px` | Smallest interactive elements. Not yet used by any built component |
| `md` | `8px` | Style tiles, sample image cards — formalizes the Phase C tuning pass's `rounded-[8px]` arbitrary value into a real token |
| `lg` | `12px` | Cards — the outer panel containers, the canvas panel |
| `xl` | `20px` | Reserved for a larger container tier. Nothing currently uses it |
| `full` | `9999px` | Pill buttons — Generate, Export, Aspect selector, icon buttons |

**Note on the refactor:** this is a genuinely different scale from what shipped in Phase C (`sm 6 / md 12 / lg 20`), not a rename. `md` used to mean 12px; now it means 8px. Every existing `rounded-*` usage was individually re-checked against this new scale during the refactor pass below — see the refactor summary for the exact before/after per component.

### Spacing (semantic only)

| Name | Value | Usage |
|---|---|---|
| `sectionGap` | `112px` | Major sections inside the controls panel (style switcher → prompt input → sample images) |
| `panelGap` | `24px` | Between the four panels on desktop |
| `cardGap` | `32px` | Inside a card's own internal layout |
| `tightGap` | `8px` | Text-to-text within a group — label to value, caption below a thumbnail |
| `pagePadding` | `24px` | Outer page inset before any panel begins |
| `sliderTrackHeight` | `4px` | Thin — reads as an instrument, not a toy. Phase E |
| `sliderThumbSize` | `16px` | Visual diameter of the slider thumb. Phase E |
| `sliderThumbHitArea` | `44px` | Minimum tappable area around the thumb (ui-ux-pro-max: 44×44px touch target minimum). Phase E |
| `sliderLabelGap` | `8px` | Label-to-track distance — reuses `tightGap`'s value |

Everything else — `gap-3`, `p-4`, `gap-1.5`, and so on — is ordinary Tailwind spacing, used freely. These five (well, nine) are the ones with a name because they carry meaning beyond "the number that looked right."

### Typography

| Property | Value |
|---|---|
| Family | Inter, with system-ui fallback stack |
| `xs` | `12px` — labels, timestamps |
| `sm` | `14px` — body, buttons, wordmark |
| `base` | `16px` — prompt input (the floor for iOS to not auto-zoom on focus) |
| `lg` | `18px` |
| `xl` | `20px` |
| `2xl` | `24px` |
| Weight 400 | Body |
| Weight 500 | UI elements, wordmark |
| Weight 600 | Emphasis |
| Line-height tight | `1.2` |
| Line-height normal | `1.5` |
| Line-height relaxed | `1.7` |
| Tracking default | `0` |
| Tracking tight | `-0.01em` — wordmark |
| Tracking wide | `0.02em` — labels, anything set in uppercase |

Tailwind's stock `text-xs` through `text-2xl` already produce exactly these pixel values — no `@theme` override was needed for the scale itself.

### Motion

| Name | Value | Usage |
|---|---|---|
| `durationDefault` | `150ms` | The system default. Everything snaps, nothing floats |
| `durationLong` | `300ms` | Placeholder rotation fade — anything that needs to read as deliberate rather than instant |
| `durationImageFade` | `400ms` | Generation reveal. Not yet implemented — no generation flow is wired into the built UI yet |
| `easingDefault` | `cubic-bezier(0.4, 0, 0.2, 1)` | Material's "standard" curve. Casually described as "ease-out" but technically has a non-zero start velocity — closer to ease-in-out in strict terms. Used anyway because it's the specified curve; noted here so nobody "fixes" it later thinking it's a typo |

### Layout

| Name | Value |
|---|---|
| `breakpointMobile` | `0` |
| `breakpointDesktop` | `768px` (Tailwind's `md:`, already in use throughout) |
| Mobile viewport height | `min-h-dvh`, never `h-screen` — 100vh is unreliable on mobile browsers whose chrome shows/hides on scroll; `dvh` accounts for that, and `min-height` (not a hard height) means content can never be clipped, it just scrolls |
| Safe area | No fixed-position elements exist in the built UI yet, so no safe-area padding is applied. A returning bottom-sheet drawer (Phase F) or fixed action bar needs `pb-[env(safe-area-inset-bottom)]` |
| Four-panel desktop grid | `grid-template-columns: 36% 1fr`, areas `"controls canvas" / "history edit"`. **Not implemented in `app/page.tsx` yet** — current build is Phase C's two-column grid (controls 36% / canvas 1fr), no history or edit row. This is the Phase D target |

---

## Component patterns

Each pattern below is marked **live** (built and in `components/`) or **planned** (documented for Phase D/E to build against). Don't build ahead of the phase plan just because the pattern exists here — that's what the doc is for.

### Wordmark — live

`components/shell/top-bar.tsx`. Plain text, no logomark, no pill background — "set it beautifully in the space, don't decorate it."

- Weight: 500 (medium)
- Size: `text-base` (16px) on mobile, `text-sm` (14px) on desktop — mobile gets the slightly larger size because it's the only chrome on a small screen and needs a touch more presence
- Tracking: tight (`-0.01em`)
- Color: `foregroundOnLight` today. On the dark controls panel (Phase D), switches to `foregroundOnDark` — same component, different token, no new component needed
- Alignment: centered within whatever column/card contains it, not the full viewport

### Style tile — live

`components/prompt/style-switcher.tsx`. One tile in v1 (Watercolor); the component is built to hold more without changing shape.

| State | Treatment |
|---|---|
| Default (unselected) | `border` 1px `borderOnLight`, `bg-transparent`, radius `md` (8px) |
| Selected | `bg-muted` (`surfaceMuted`) fill + a small checkmark badge (`bg-foreground`, white check icon) absolutely positioned top-right of the tile — a filled badge, not a colored border, so it doesn't read as a focus ring |
| Hover (unselected) | Border shifts to `borderOnLightHover` |
| Disabled | Not used in v1 — there's no scenario where a style tile is disabled; when style #2 ships it's either active (selectable) or not shown at all |

Size: `size-20` (80px) mobile-first, `size-24` (96px) on desktop. Internal thumbnail is `size-12` (48px), radius `lg` (12px) — chosen to preserve its pre-refactor appearance rather than drop to the new `md` (8px), since the thumbnail wasn't one of the elements the token consolidation explicitly re-specified. Label sits below the thumbnail at `text-xs font-medium`.

Accessibility: `role="radiogroup"` on the row, each tile `role="radio"` with `aria-checked`, visible `focus-visible` ring in `foregroundOnLight` with offset — the selected-state checkmark is a visual *and* semantic signal (ui-ux-pro-max: don't convey state by color/shape alone).

### Sample image card — live

`components/prompt/sample-images-row.tsx`. Horizontally scrollable row, one card per curated example.

- Image: `size-24` (desktop) / `size-32` (mobile — the row is the primary browse mechanism there, so cards run bigger), radius `md` (8px), `object-cover`, 1px `borderOnLight`
- Label: `text-xs mutedForegroundOnLight`, `line-clamp-2`, `mt-2` below the image
- Hover/active: `active:scale-95 active:opacity-80` — same press feedback as every other tappable element in the product, no card-specific treatment
- Row itself: `items-start` so cards whose captions wrap to different line counts still top-align at the image, not the caption baseline

### Prompt input container — live

`components/prompt/prompt-input.tsx`. Bounded box holding the textarea and the Generate button together — the whole block is the "input," not just the text field.

- Container: `bg-input` (`#e8e4e4` — deliberately warmer/darker than `surfaceMuted` so it reads as a field, not just another panel), radius `lg` (12px), `p-4`, `min-h-45` (180px)
- Textarea: no border, transparent background, `text-base` (16px, iOS zoom floor), custom rotating-placeholder overlay (native `placeholder` attribute isn't used — see the component for why) fading over `durationLong` (300ms)
- Generate button: embedded bottom-right *inside* the same container, not a separate element below it — see Buttons → primary

### Canvas — live (empty state) / planned (result state)

`components/canvas/canvas.tsx`. Square panel, `aspect-square`, `bg-surface-light` (pure white — post-refactor; previously incorrectly shared `pageBackground`), radius `lg` (12px), `relative` positioning so `CanvasControls` can sit absolutely inside it.

- Empty state (live): centered icon (`ImageIcon`, size-8, strokeWidth 1.5) + `text-sm mutedForegroundOnLight` reading "Illustration appears here..." — an icon plus text, not text alone, so the empty state reads as a deliberate placeholder rather than a blank box
- Result state (planned, Phase D+): the component already accepts a `children` prop for this — when a real generation exists, it renders in place of the empty state. Compositing (filters, border, background — the six-lever edit system) lands in Phase E

### Buttons

Four variants, each with a specific, non-overlapping job. Never two of the same visual weight competing for attention on one screen (PRD §4: "one input, one output").

| Variant | Style | Used for | States |
|---|---|---|---|
| **Primary** | `bg-foreground text-background`, radius `full` | Generate | `active:scale-95 active:opacity-80`, `disabled` while a generation is in flight (reduced opacity, no pointer events) |
| **Accent** | `bg-accent text-foregroundOnDark`, radius `full` | Export **only** | Same press feedback as primary. Disabled/hidden when no generation exists |
| **Secondary** | `border borderOnLight`, transparent fill, radius `full` | Aspect ratio selector | Currently `disabled` (v1 scaffolding, not yet functional) — reduced-opacity text, no press feedback while disabled |
| **Icon** | `size-8` or `size-9` circle, `border borderOnLight`, radius `full`, no fill | Share (planned), pagination arrows (live) | `active:scale-95 active:opacity-80`; `aria-label` required since there's no visible text |

All four share the same `duration-150` transition and the same press-feedback language (`active:scale-95`) — one motion vocabulary across every button, not a per-component reinvention.

### Slider (Rotate, Saturation, Tint, B&W) — planned, Phase E

No slider exists in code yet. Drawn from the Frontend Design Skill (restraint: sliders stay neutral, the accent color doesn't leak into every interactive element just because it's *an* interaction) and ui-ux-pro-max (touch-target minimums).

- Track: `sliderTrack` (`#e5e5e5`), height `sliderTrackHeight` (4px) — thin and precise, not a fat rounded pill; a slider that looks like an instrument reads as "a considered lever," a fat gradient-filled one reads as a toy
- Active/filled portion of the track: `foregroundOnLight`, same value as the thumb — the filled track and the thumb are visually one continuous "current value" indicator
- Thumb: `sliderThumb` (`#0a0a0a`, = `foregroundOnLight`), visual diameter `sliderThumbSize` (16px), circular, no shadow (project-wide "no shadows" rule) — definition comes from being a solid dark circle against the light track, not from elevation
- Hit area: invisible padding extending the thumb's tappable region to `sliderThumbHitArea` (44px), per touch-target minimums — the visual thumb stays small and precise, the tap target doesn't
- Label placement: label + current value sit `sliderLabelGap` (8px) above the track, `text-xs`, value right-aligned opposite the label
- Drag behavior: no easing while dragging — the thumb tracks the pointer 1:1, snapping only applies to hover/press *feedback* elsewhere in the system, never to a value actively being dragged (see Motion below)
- Disabled state: reduced-opacity track and thumb, no drag — used if a slider is ever gated behind a precondition (none currently planned, documented for completeness)

### Color swatch picker (Border colour, Background colour) — planned, Phase E

- 8 preset swatches in a grid, each `size-8`ish circle or rounded square (finalize exact shape when building — not yet decided), plus one "custom" swatch that opens a native or custom color picker
- Selected state: a `foregroundOnLight` ring around the selected swatch (2px, offset) — the exact same "ring, not fill, not the accent color" language already established for style-tile selection and focus-visible states. **Never** the accent green — accent stays exclusive to Export
- Unset/default state (both Border and Background colour default to `null`): shown as a distinct "none" swatch — a diagonal-line or empty-circle glyph, not just an absence of selection, so "no border" reads as a deliberate choice rather than "nothing loaded yet"

### History log entry — planned, Phase D

- Thumbnail ~48px, radius `md` (8px) — same radius family as style tiles and sample cards
- Relative timestamp (`text-xs mutedForegroundOnLight`, e.g. "2m ago") + truncated prompt (`text-xs`, single line, ellipsis)
- Hover: background shifts to a step darker/lighter than the panel's own `surfaceMuted` (exact value TBD when built — needs a fourth neutral step that doesn't exist yet; flag for `tokens.ts` if one gets added)
- Active (this entry is the one currently shown in canvas): left border or background treatment in `foregroundOnLight` — needs to be visually distinct from hover without using the accent color

### Toast notification — planned, Phase E (Share button)

For "Link copied" and equivalent brief confirmations.

- Auto-dismiss after 3 seconds (ui-ux-pro-max: 3–5s window; picked the shorter end since the message itself is short and doesn't need reading time)
- `bg-foreground text-background` (inverted, high-contrast, momentary) or `surfaceLight` with a border — finalize when built against whatever surface it appears over (it may need to work on both light and dark panels depending on where Share ends up)
- No manual dismiss control needed at this length/duration; doesn't block interaction underneath it

### Panels

| Panel | Surface | Status |
|---|---|---|
| Controls (dark) | `surfaceDark`, `foregroundOnDark` text | Planned, Phase D |
| Canvas (light) | `surfaceLight` | Live |
| History (muted) | `surfaceMuted` | Planned, Phase D |
| Edit (muted) | `surfaceMuted` | Planned, Phase D |

Each panel is its own rounded region (radius `lg`, 12px) with its own padding (`cardGap`, 32px, internally) — panels don't share a single outer card the way the current Phase C build does. Today's actual `app/page.tsx` still wraps controls + canvas in one `surfaceMuted` card because Phase D hasn't restructured it yet; this table describes the target, not the current DOM.

---

## Layout patterns

**Desktop:** four-panel grid — top-left controls (dark), top-right canvas (light), bottom-left history (muted), bottom-right edit (muted). `panelGap` (24px) between all four. See Tokens → Layout for the grid template. Not yet built.

**Mobile:** single column. Controls panel content (style switcher, prompt input, sample images) stacks with `sectionGap` (112px) between major sections — a gap large enough that each section reads as its own zone, not a continuous form. History and edit become bottom-sheet drawers, triggered by a tab or button rather than always-visible panels — there isn't screen real estate for four panels stacked vertically on a phone. Specified now, per this task's instruction, so the pattern exists before Phase F builds it: drawers slide up from the bottom, dismiss via swipe-down or a close affordation, and must not be nested (only one drawer open at a time).

---

## Motion

- **Default:** 150ms, `ease-out`, on every element via a base-layer `*` rule — nothing needs to opt in
- **Image reveal:** 400ms fade-in when a generation completes (not yet implemented — no generation flow is wired into the built UI). The one deliberate "slow" moment in an otherwise fast system; still four times faster than a typical "editorial" fade, because Genmage isn't going for that
- **Slider drag:** no easing while the pointer is down — 1:1 tracking. Easing is for *state changes* (hover, selection, panel open/close), not for a value the user is actively controlling in real time
- **The rule:** everything snaps, nothing floats. If a transition takes longer than 300ms and isn't the image reveal, that's a bug, not a style choice

---

## Rules

**Always:**
- Use `design/tokens.ts` / the Tailwind classes it generates — never inline values
- Consult the Frontend Design Skill and UI/UX Pro Max Skill before building a new visual component or pattern (CLAUDE.md rule 2) — and note what was drawn from each, not just that they were opened
- Give every interactive element visible `active`/`hover`/`focus-visible` feedback — no dead-feeling controls

**Never:**
- Introduce a new color without adding it to `tokens.ts` first, with a usage comment
- Use `!important`
- Put the green accent anywhere except the Export button
- Put drop shadows or gradients on anything — definition comes from color/border differences between surfaces, never elevation
- Build a Phase D/E component pattern documented here as "planned" without checking this doc first — the pattern already has a decision made; don't re-derive it from scratch mid-build

---

## How to extend

Adding a new token: decide the value, add it to the relevant section of `design/tokens.ts` with a one-line usage comment explaining *what it's for* (not just what it looks like), mirror it into `app/globals.css`'s `@theme` block under the matching CSS variable name, then add a row to the Tokens table above. Adding a new component pattern: consult both mandated skills first, document the pattern here (states, sizes, which existing tokens it uses) before or alongside writing the component — not after, so the next person building something adjacent has something to check against rather than reverse-engineering intent from finished code.
