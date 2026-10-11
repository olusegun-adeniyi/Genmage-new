# Genmage Design System

> **Superseded (2026-10-08).** The product now follows the Illustration Studio handoff (`design_handoff_illustration_studio/README.md`): all-light three-column layout, one purple primary, one type style. `design/tokens.ts` and the `/design-system` gallery reflect the new system; the sections below still describe the earlier dual-tone system and need a rewrite.

Canonical reference for every visual decision in the product. If a component's styling contradicts this document, the document wins — fix the component. If this document is missing something a component needs, add it here first (see "How to extend"), then use it.

Source of truth for raw values: [`design/tokens.ts`](design/tokens.ts). This document explains *why* those values are what they are and *how* to apply them; `tokens.ts` and `app/globals.css` are what components actually consume.

Built consulting the **Frontend Design Skill** and **UI/UX Pro Max Skill** (mandatory per CLAUDE.md rule 2) — specific attributions are called out throughout, not just claimed once here.

---

## Overview

Genmage is dual-tone by design: a dark controls panel paired with light canvas, history, and edit surfaces, sitting as distinct rounded regions within a shared white page background — they don't blend into one wash of color, they're deliberately different regions with different jobs. Restraint is the actual design tool here, not an absence of one: per the Frontend Design Skill's "spend your boldness in one place" principle, exactly one accent color (green, `#16a34a`) exists in the entire product, and it appears only on the app's two primary actions — Generate and Export — plus the selected style tile. Everywhere else is monochrome, and that restraint is what makes the accent mean something when it shows up. Inter is the only typeface, used at every weight and size the product needs, because a second typeface would be a second decision nobody's making. Motion is fast and precise — 150ms is the default, nothing floats or eases in slowly — because the product's job is to get out of the way of the artwork, not perform for the user. Whitespace is generous rather than cramped; a dashboard-dense layout would fight the "one considered lever per control" philosophy the editing system is built on.

---

## Tokens

Full detail lives in `design/tokens.ts`. This table is the at-a-glance version.

### Colors

| Name | Value | Usage |
|---|---|---|
| `pageBackground` | `#ffffff` | Whole-page background, outside all panels — was `#fafaf9`, changed to pure white by direct instruction |
| `surfaceDark` | `#0a0a0a` | Controls panel (dark) — live, Phase D |
| `surfaceLight` | `#ffffff` | Canvas panel. Same value as `pageBackground` now — kept as a separate token in case they diverge again |
| `surfaceMuted` | `#f5f5f4` | History + edit panels — lighter than page, warmer than canvas |
| `foregroundOnLight` | `#0a0a0a` | Text/icons on `pageBackground`, `surfaceLight`, `surfaceMuted` |
| `foregroundOnDark` | `#fafaf9` | Text/icons on `surfaceDark` — live, Phase D |
| `mutedForegroundOnLight` | `#737373` | Secondary text on light surfaces — labels, captions, timestamps |
| `mutedForegroundOnDark` | `#a3a3a3` | Secondary text on `surfaceDark` — live, Phase D |
| `borderOnLight` | `rgba(0,0,0,0.08)` | Hairline borders on light surfaces |
| `borderOnLightHover` | `rgba(0,0,0,0.12)` | Hover state of the above |
| `borderOnDark` | `rgba(255,255,255,0.08)` | Hairline borders on `surfaceDark` — live, Phase D |
| `borderOnDarkHover` | `rgba(255,255,255,0.12)` | Hover state of the above — live, Phase D |
| `accent` | `#16a34a` | **Generate, Export, and the selected style tile only.** See "Never" list below |
| `inputBackground` | `#e8e4e4` | Prompt input specifically — its own semantic slot, not a `surfaceMuted` reuse |
| `inputBackgroundOnDark` | `#1a1a1a` | Prompt input on the dark controls panel — its own value, not `surfaceDark` reused |
| `sliderTrack` | `#e5e5e5` | Inactive slider track. Rendered disabled in the Edit panel (Phase D); drag interaction is Phase E |
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
| `sectionGap` | `112px` | Mobile stacked controls layout (Phase F, not yet built) |
| `panelGap` | `24px` | Between the four panels on desktop |
| `panelPadding` | `20px` | Outer padding inside a panel's own container — currently ControlsPanel. Distinct from `cardGap` (content-to-content gaps within a panel) and `pagePadding` (outer page inset) |
| `cardGap` | `32px` | Inside a card's own internal layout — includes the desktop ControlsPanel's style/prompt/samples stack. `sectionGap` was tried here first but its 3×112px total made Controls taller than a typical browser window |
| `tightGap` | `8px` | Text-to-text within a group — label to value, caption below a thumbnail |
| `pagePadding` | `24px` | Outer page inset before any panel begins |
| `sliderTrackHeight` | `4px` | Thin — reads as an instrument, not a toy. Rendered disabled, Phase D; interactive, Phase E |
| `sliderThumbSize` | `16px` | Visual diameter of the slider thumb. Rendered disabled, Phase D; interactive, Phase E |
| `sliderThumbHitArea` | `44px` | Minimum tappable area around the thumb (ui-ux-pro-max: 44×44px touch target minimum). Applies once drag ships, Phase E |
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
| `durationImageFade` | `400ms` | Generation reveal — live, Phase D (`components/canvas/canvas.tsx`) |
| `easingDefault` | `cubic-bezier(0.4, 0, 0.2, 1)` | Material's "standard" curve. Casually described as "ease-out" but technically has a non-zero start velocity — closer to ease-in-out in strict terms. Used anyway because it's the specified curve; noted here so nobody "fixes" it later thinking it's a typo |

### Layout

| Name | Value |
|---|---|
| `breakpointMobile` | `0` |
| `breakpointDesktop` | `768px` (Tailwind's `md:`, already in use throughout) |
| Mobile viewport height | `min-h-dvh`, never `h-screen` — 100vh is unreliable on mobile browsers whose chrome shows/hides on scroll; `dvh` accounts for that, and `min-height` (not a hard height) means content can never be clipped, it just scrolls |
| Safe area | No fixed-position elements exist in the built UI yet, so no safe-area padding is applied. A returning bottom-sheet drawer (Phase F) or fixed action bar needs `pb-[env(safe-area-inset-bottom)]` |
| Four-panel desktop grid | Live, Phase D (`app/page.tsx` → `HomeShell`) — one unified grid, `gridTemplateColumns: "28% 1fr"`, `gridTemplateRows: "auto 1fr"`. Row 1 height = Controls' own content height (`auto`) — it never scrolls because the row is defined by it, not the other way around; Canvas stretches to match. Row 2 is one shared `1fr` track, so History and Edit are always exactly the same height by construction, not by matching numbers by hand. Column width narrowed to 28% from the Figma's 36% by direct instruction |

---

## Component patterns

Each pattern below is marked **live** (built and in `components/`) or **planned** (documented for Phase D/E to build against). Don't build ahead of the phase plan just because the pattern exists here — that's what the doc is for.

### Wordmark — component live, not currently placed anywhere

`components/shell/top-bar.tsx`. Plain text, no logomark, no pill background — "set it beautifully in the space, don't decorate it." Removed from the top of the controls panel by direct instruction — the component itself is untouched and still demoed in the gallery, it's just not rendered in the real page right now.

- Weight: 500 (medium)
- Size: `text-base` (16px) on mobile, `text-sm` (14px) on desktop — mobile gets the slightly larger size because it's the only chrome on a small screen and needs a touch more presence
- Tracking: tight (`-0.01em`)
- Color: `foregroundOnLight` by default (`variant="light"`). `variant="dark"` switches to `foregroundOnDark` for dark surfaces — same component, different token, no new component needed
- Alignment: centered within whatever column/card contains it, not the full viewport

### Style tile — live

`components/prompt/style-switcher.tsx` / `style-tile.tsx`. One tile in v1 (Watercolor); the component is built to hold more without changing shape. Rebuilt from the actual source of a Figma Make file ("Rebuild Component," fileKey `npml6CjA5G3ulJJVvW5Du5`) via `get_design_context` — not a screenshot reconstruction. Three values from that source were deliberately re-decided rather than copied verbatim; see the note below the table.

| State | Treatment |
|---|---|
| Default (unselected) | `bg-surface-light` (always white, regardless of `variant`), radius `md` (8px), `outline-2 outline-transparent`. Dark controls panel: stays transparent — white-on-black contrast alone is enough, matching the source exactly. Light context (gallery only): `outline-border`, since the source's own demo page is light gray and never needed one. Deliberately `outline`, not `border`, even for this addition — a real border (even at 1px, even fully transparent) still consumes box space under `border-box` sizing, which was silently eating 1px of the 4px padding on every edge in an earlier pass |
| Selected | `outline-2 outline-accent` — a CSS **outline**, not a border, matching the source exactly (outline never affects box size/layout, so no "transparent by default to reserve space" trick is needed the way a selected border would). Plus a filled `bg-accent` checkmark badge (white icon, `size-4`), positioned `top-1 right-1` **inside** the thumbnail's own corner — not poking outside it |
| Hover (unselected) | Light context only: border shifts to `borderOnLightHover`. Not specified in the source (it has no interactive states at all — it's a static two-instance demo) — kept as a reasonable addition since removing all hover feedback would be a real regression for a production control |
| Disabled | Not used in v1 — there's no scenario where a style tile is disabled; when style #2 ships it's either active (selectable) or not shown at all |

**Three deliberate deviations from the literal source**, each confirmed directly rather than assumed:
- **Color**: source uses `#098D00` for the selected outline/checkmark. Mapped to the existing `accent` token (`#16a34a`) instead — a second, slightly different green next to Generate/Export would read as inconsistent, not intentional.
- **Width**: source is exactly `90px` (`w-[90px]`) — not expressible via Tailwind's dynamic spacing scale since 90 isn't a multiple of 4px. Used as an explicit arbitrary-value exception to the "no arbitrary values" rule, confirmed directly rather than silently rounded to a token-friendly width.
- **Label size**: source uses `12px` (`text-xs`) — supersedes an earlier `text-sm` correction made before this source was available.

Sizing: fixed `w-[90px]`, `p-1` (4px) padding, `gap-1` (4px) between thumbnail and label — both map exactly onto ordinary Tailwind spacing already used elsewhere, no new tokens needed. Thumbnail is a fixed `h-[58px]` rectangle at `w-full` (not square — a deliberate source detail, not an oversight), radius `sm` (6px), rendered via Next.js Image's `fill` prop so its width still tracks the tile's actual content width responsively. Label is `text-xs font-medium text-foreground`, centered, `py-0.5` (2px).

Accessibility: `role="radiogroup"` on the row, each tile `role="radio"` with `aria-checked`, visible `focus-visible` ring via `ring` (`foregroundOnLight`/`foregroundOnDark` depending on `variant`) — kept on the box-shadow-based `ring` utility rather than `outline`, deliberately, since the selection state now owns `outline`; using it for focus too would make a selected tile's green ring vanish while keyboard-focused. The selected-state checkmark is a visual *and* semantic signal (ui-ux-pro-max: don't convey state by color/shape alone).

### Sample image card — live

`components/prompt/sample-images-row.tsx`. Horizontally scrollable row, one card per curated example. Clicking a card populates the prompt input with its caption (live, Phase D) — it does not generate automatically.

- Image: `size-24` (desktop) / `size-32` (mobile — the row is the primary browse mechanism there, so cards run bigger), radius `md` (8px), `object-cover`, 1px `borderOnLight` (or `borderOnDark` — same `variant` prop as the style tile; this row lives in the dark controls panel now)
- Label: `text-xs mutedForegroundOnLight`, `line-clamp-2`, `mt-2` below the image
- Hover/active: `active:scale-95 active:opacity-80` — same press feedback as every other tappable element in the product, no card-specific treatment
- Row itself: `items-start` so cards whose captions wrap to different line counts still top-align at the image, not the caption baseline

### Prompt input container — live

`components/prompt/prompt-input.tsx`. Bounded box holding the textarea and the Generate button together — the whole block is the "input," not just the text field.

- Container: `bg-input` (`#e8e4e4`) by default, `variant="dark"` switches to `bg-input-on-dark` (`#1a1a1a`) — used on the controls panel, its own value rather than `surfaceDark` reused. Radius `lg` (12px), `p-4`, `min-h-45` (180px)
- Textarea/placeholder text and the focus-within ring also switch to the `OnDark` token family in the dark variant — `text-foreground`/`text-muted-foreground` would be nearly invisible against `#1a1a1a` otherwise
- Textarea: no border, transparent background, `text-base` (16px, iOS zoom floor — load-bearing, don't reduce it), custom rotating-placeholder overlay at `text-sm` (14px, by direct instruction — the 16px floor is specifically about the focusable/editable element, and doesn't apply to this non-interactive overlay span) fading over `durationLong` (300ms)
- Generate button: embedded bottom-right *inside* the same container, not a separate element below it — see Buttons → primary

### Canvas — live

`components/canvas/canvas.tsx`. `bg-surface-light` (pure white), radius `lg` (12px), `relative overflow-hidden`. `CanvasControls` is no longer rendered inside it — the panel wrapper (`components/home/canvas-panel.tsx`) positions controls at `tightGap` (8px) from the panel's own edge, independent of the canvas's internal padding.

- Empty state: centered icon (`ImageIcon`, size-8, strokeWidth 1.5) + `text-sm mutedForegroundOnLight` reading "Illustration appears here..."
- Loading state: renders `TypewriterStatus` (rotating PRD copy — "mixing the pigments...", etc. — every 2s), no spinner
- Result state: `next/image` with `object-cover`, fades in over `durationImageFade` (400ms) on each new `imageUrl`. Container's aspect ratio switches between `aspect-square` / `aspect-[4/5]` / `aspect-[16/9]` based on the selected aspect ratio — a display-time crop only, the stored image is unchanged. Compositing (filters, border, background — the six-lever edit system) is still Phase E

### Buttons

Four variants. Primary and Accent deliberately share the same `bg-accent` green and, by direct instruction, the same size (`h-9`/`px-4`/`text-sm`) — Generate and Export are the app's two primary actions and now read as visually equivalent-weight controls. Kept as two separate variant names rather than merged into one, in case they need to diverge again later. Disabled swaps to `surfaceMuted` background + `mutedForegroundOnLight` text (light gray fill, visibly darker gray label) at full opacity — not a faded `bg-accent`. Two things had to change together to fix this properly: the color swap alone wasn't enough, because `disabled:opacity-40` used to live on every variant via the shared `BASE` class, and it was still fading the new gray fill against whatever's behind the button. Fading a saturated green reads as "light green, not disabled" — but fading *any* solid color that way risks the same kind of washed-out misread, so primary/accent now opt out of opacity-based dimming entirely (`disabled:opacity-100`) and rely purely on the flat gray fill + gray text to read as inactive. Secondary and icon still use `disabled:opacity-40` — they have no distinct disabled color of their own, so fading is the only signal they have. Everything else stays monochrome, which is what keeps the green legible as "the important one(s)" rather than becoming a starting palette.

| Variant | Style | Used for | States |
|---|---|---|---|
| **Primary** | `bg-accent text-foregroundOnDark`, radius `full`, larger (`h-11`/`h-10`, `text-base`) | Generate | `active:scale-95 active:opacity-80`, `disabled` while a generation is in flight (reduced opacity, no pointer events) |
| **Accent** | `bg-accent text-foregroundOnDark`, radius `full`, smaller (`h-9`, `text-sm`) | Export | Same press feedback as primary. Disabled/hidden when no generation exists |
| **Secondary** | `border borderOnLight`, `bg-background`, radius `full` | Aspect ratio selector trigger (`components/canvas/aspect-dropdown.tsx`); Share — icon + visible "Share" text, same treatment as Aspect rather than an icon-only circle | Disabled when no generation exists. Now that `pageBackground`/`bg-background` is pure white — same as the canvas it floats over — these pills read against the canvas by border alone, no fill contrast |
| **Icon** | `size-8` circle, `border borderOnLight` (or `borderOnDark` via `surface="dark"` — the only variant that ever renders directly on the dark panel), radius `full`, no fill | Pagination arrows (live) | `active:scale-95 active:opacity-80`; `aria-label` required since there's no visible text |

All four share the same `duration-150` transition and the same press-feedback language (`active:scale-95`) — one motion vocabulary across every button, not a per-component reinvention.

### Slider (Rotate, Saturation) — live (disabled), interaction Phase E

`components/edit/slider.tsx`. Rendered at default values, `disabled`, in the real Edit panel as of Phase D — this is the shipped visual, not a mock; only pointer/keyboard drag interaction is still Phase E. Tint and Black-and-white are temporarily pulled from the Edit panel by direct instruction — the component and PRD's six-lever spec are unchanged, only two of the four sliders are currently placed. Drawn from the Frontend Design Skill (restraint: sliders stay neutral, the accent color doesn't leak into every interactive element just because it's *an* interaction) and ui-ux-pro-max (touch-target minimums).

- Track: `sliderTrack` (`#e5e5e5`), height `sliderTrackHeight` (4px) — thin and precise, not a fat rounded pill; a slider that looks like an instrument reads as "a considered lever," a fat gradient-filled one reads as a toy
- Active/filled portion of the track: `foregroundOnLight`, same value as the thumb — the filled track and the thumb are visually one continuous "current value" indicator
- Thumb: `sliderThumb` (`#0a0a0a`, = `foregroundOnLight`), visual diameter `sliderThumbSize` (16px), circular, no shadow (project-wide "no shadows" rule) — definition comes from being a solid dark circle against the light track, not from elevation
- Hit area: invisible padding extending the thumb's tappable region to `sliderThumbHitArea` (44px), per touch-target minimums — the visual thumb stays small and precise, the tap target doesn't
- Label placement: label + current value sit `sliderLabelGap` (8px) above the track, `text-xs`, value right-aligned opposite the label
- Drag behavior: no easing while dragging — the thumb tracks the pointer 1:1, snapping only applies to hover/press *feedback* elsewhere in the system, never to a value actively being dragged (see Motion below)
- Disabled state: reduced-opacity track and thumb, no drag — used if a slider is ever gated behind a precondition (none currently planned, documented for completeness)

### Color swatch picker (Border colour, Background colour) — live (disabled), interaction Phase E

`components/edit/swatch-picker.tsx`. Same status as the Slider above — shipped visual, rendered `disabled` at default (`null`) values; `onChange` wiring is Phase E.

- 8 preset swatches in a grid, each `size-8`ish circle or rounded square (finalize exact shape when building — not yet decided), plus one "custom" swatch that opens a native or custom color picker
- Selected state: a `foregroundOnLight` ring around the selected swatch (2px, offset) — the exact same "ring, not fill, not the accent color" language already established for style-tile selection and focus-visible states. **Never** the accent green — accent stays reserved for Generate/Export only
- Unset/default state (both Border and Background colour default to `null`): shown as a distinct "none" swatch — a diagonal-line or empty-circle glyph, not just an absence of selection, so "no border" reads as a deliberate choice rather than "nothing loaded yet"

### History log entry — live

`components/history/history-entry.tsx`. Click-to-load is fully wired: selecting an entry sets it as the current generation, including its saved `editState` (aspect ratio, etc.).

- Thumbnail ~48px, radius `md` (8px) — same radius family as style tiles and sample cards
- Relative timestamp (`text-xs mutedForegroundOnLight`, e.g. "2m ago", computed by `lib/format-relative-time.ts`) + truncated prompt (`text-xs`, **two lines**, `line-clamp-2` — this is a deliberate refinement over this doc's earlier "single line" draft, made when the real component was built)
- Hover: `bg-background` (a real value now — not the "TBD fourth neutral step" this doc originally flagged; `background`/`surfaceMuted` already read as two distinct steps against each other, no new token needed)
- Active (this entry is the one currently shown in canvas): `bg-foreground/6` + `border-l-2 border-foreground` — visually distinct from hover without using the accent color

### Toast notification — live (shipped in Phase D, not Phase E)

`components/ui/toast.tsx`. This doc originally scheduled Toast for Phase E, but Share (Phase D) needs it for "Link copied" — shipping it a phase early rather than leaving Share half-built.

- Auto-dismiss after 3 seconds (ui-ux-pro-max: 3–5s window; picked the shorter end since the message itself is short and doesn't need reading time)
- `bg-foreground text-background` (inverted, high-contrast, momentary)
- `aria-live="polite"`, doesn't steal focus, doesn't block interaction underneath it
- Single-slot: only one message at a time, no queue — matches how small this product's toast surface actually is

### Panels

| Panel | Surface | Status |
|---|---|---|
| Controls (dark) | `surfaceDark`, `foregroundOnDark` text | Live |
| Canvas (light) | `surfaceLight` | Live |
| History (muted) | `surfaceMuted` | Live |
| Edit (muted) | `surfaceMuted` | Live (scaffold — see Slider / Color swatch picker) |

Each panel is its own rounded region (radius `sm`, 6px, by direct instruction — previously `lg`) — `app/page.tsx` → `HomeShell` now renders exactly this, no shared outer card.

---

## Layout patterns

**Desktop:** top-left controls (dark), top-right canvas (light), bottom-left history (muted), bottom-right edit (muted). `panelGap` (24px) between all four. Live, Phase D. Controls is fit-content and never scrolls; History/Canvas/Edit fill remaining space and scroll internally. See Tokens → Layout for the exact structure.

**Mobile:** single column. Controls panel content (style switcher, prompt input, sample images) stacks with `sectionGap` (112px) between major sections — a gap large enough that each section reads as its own zone, not a continuous form. History and edit become bottom-sheet drawers, triggered by a tab or button rather than always-visible panels — there isn't screen real estate for four panels stacked vertically on a phone. Specified now, per this task's instruction, so the pattern exists before Phase F builds it: drawers slide up from the bottom, dismiss via swipe-down or a close affordation, and must not be nested (only one drawer open at a time).

---

## Motion

- **Default:** 150ms, `ease-out`, on every element via a base-layer `*` rule — nothing needs to opt in
- **Image reveal:** 400ms fade-in when a generation completes — live, Phase D. The one deliberate "slow" moment in an otherwise fast system; still four times faster than a typical "editorial" fade, because Genmage isn't going for that
- **Slider drag:** no easing while the pointer is down — 1:1 tracking. Easing is for *state changes* (hover, selection, panel open/close), not for a value the user is actively controlling in real time. Still Phase E — Phase D's sliders don't drag yet
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
- Put the green accent anywhere except Generate, Export, and the selected style tile
- Put drop shadows or gradients on anything — definition comes from color/border differences between surfaces, never elevation
- Build a Phase D/E component pattern documented here as "planned" without checking this doc first — the pattern already has a decision made; don't re-derive it from scratch mid-build

---

## How to extend

Adding a new token: decide the value, add it to the relevant section of `design/tokens.ts` with a one-line usage comment explaining *what it's for* (not just what it looks like), mirror it into `app/globals.css`'s `@theme` block under the matching CSS variable name, then add a row to the Tokens table above. Adding a new component pattern: consult both mandated skills first, document the pattern here (states, sizes, which existing tokens it uses) before or alongside writing the component — not after, so the next person building something adjacent has something to check against rather than reverse-engineering intent from finished code.
