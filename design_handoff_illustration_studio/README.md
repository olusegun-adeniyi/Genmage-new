# Handoff: Illustration Studio

## Overview
A single-screen desktop tool for generating illustrations from a text prompt. The user picks an illustration style, writes a prompt, generates, then fine-tunes the result with adjustment sliders and exports or shares it. Recent generations are listed and can be restored.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy directly. Recreate them in the target codebase's existing environment (React, Vue, etc.) using its established patterns and libraries. If no environment exists, choose the most appropriate framework (React + TypeScript is a natural fit; the prototype logic is written as React-style class components).

`.dc.html` files open directly in a browser (they need `support.js` next to them, served over HTTP). Template markup lives inside `<x-dc>`; component logic lives in the `<script data-dc-script>` block at the bottom. `{{ name }}` holes in the template are values returned from `renderVals()`.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, radii and interactions. Recreate pixel-accurately. Generation itself is mocked (1.6s timeout) and must be wired to the real backend.

## Screen: Illustration Studio (desktop)

### Page
- Background `#FFFFFF`. Padding `108px 42px`. Content row centered, `max-width: 1637px`, `width: 100%`.
- Row: `display:flex; gap:12px; align-items:stretch`. Three columns: **Generate** (367px fixed) · **Canvas** (flex:1) · **Adjustments** (324px fixed).
- **Height rule:** the Adjustments panel hugs its content (`align-self:flex-start`). Generate and Canvas must be exactly the same height as Adjustments. In the prototype the row stretches; implement so the row height = Adjustments' content height (e.g. CSS grid row sized by Adjustments, or Generate/Canvas with `height:100%` and their internal scroll areas at `flex:1 1 0; min-height:0`). Current rendered height ≈ 859px.
- Font: `'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif`, 14px / 20px line-height, weight 400 everywhere. Default text `#181818`.

### 1. Generate panel (left)
- 367px wide, radius 24px, bg `#FFFFFF`, border `1px solid #EAEAEA`, padding `20px 17px 16px`, flex column.
- **Label** "Generate a style of illustration" — `#000000`. 8px gap below.
- **Style grid** — container radius 20px, `inset 0 0 0 1px #EAEAEA`, padding 8px, `grid-template-columns: repeat(3, 1fr)`, gap 8px. 6 tiles:
  - Tile: height 72px, radius 12px, bg `#181818`, column with 1px gap, cursor pointer.
  - Thumbnail: height 47px, radius 8px, bg `#2B2B2B`, image fills (object-fit cover). Thumbnails are user-supplied placeholders in the prototype.
  - Caption row: height 24px, padding `2px 8px`, white text, nowrap.
  - Names in order: Watercolor, Simple, Doodle, Line art, Simple, Doodle (from Figma; second-row duplicates likely need real names — confirm with design).
  - Selected: `box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 3px #181818`, opacity 1. Unselected: opacity 0.88. Transition opacity/box-shadow 150ms.
- **Prompt box** — 8px below grid. Height 107px, radius 16px, bg `#F6F6F6`.
  - Textarea: inset `13px 16px 56px 18.5px`, no border/outline/resize, text `#2B2B2B`, placeholder "A foggy morning in a scottish farm" in `#8B8B8B`.
  - **Generate button**: absolute, right 10.5px, bottom 11px. Height 40px, padding `10px 12px`, radius 12px, no border.
    - Active (prompt non-empty and not generating): bg `#6600FF`, text `#FFFFFF`, cursor pointer.
    - Disabled: bg `#E6E6E6`, text `#939393`, cursor default.
    - Label "Generate"; while generating "Generating…". Transition bg/color 150ms.
- **"Recently generated"** label — `#000000`, margin-top 54px.
- **Recent list** — margin-top 11px, fills remaining height (`flex:1 1 0; min-height:0; overflow-y:auto`). Radius 16px, bg `#FFFFFF`, hairline `0.5px #EAEAEA` (inset + outset), padding 6px, column gap 2px. Empty by default.
  - Item: button, radius 10px, padding `8px 10px`, left-aligned; line 1 prompt `#181818`, line 2 style name `#8B8B8B`. Hover bg `#F6F6F6`.

### 2. Canvas (center)
- flex:1, radius 24px, bg `#FAFAFA`, no border, overflow hidden, position relative.
- **Status text** centered vertically and horizontally, `#ADADAD`, padding 0 24px:
  - Idle: "Illustration appears here"
  - Generating: "Generating {style lowercase} illustration…"
  - Done: "{Style} · {prompt}" (replace with the generated image in production).
- **Action bar** — absolute, horizontally centered, bottom 51px. 325×58px, radius 20px, bg `#F0F0F0`, padding 8px, flex gap 8px. All buttons: height 40px, radius 12px, bg `#FFFFFF`, no border, text `#181818`, hover bg `#EAEAEA`. Icons 16px, stroke 1.5, currentColor.
  - **Aspect dropdown** (flex:1): "{aspect}" + chevron-down, gap 6px. Options: Square 1:1 (default), Portrait 3:4, Landscape 4:3, Wide 16:9. Menu opens upward: 56px above the button, extends 8px past each side, padding 6px, radius 16px, bg `#FFFFFF`, `inset 0 0 0 1px #EAEAEA, 0 8px 24px rgba(24,24,24,.08)`. Options 36px tall, radius 10px, padding `8px 10px`; current option bg `#F6F6F6`; hover `#F6F6F6`. Selecting closes the menu.
  - **Share** (89px): arrow-up-right icon + "Share", gap 10px. On click copies the link and shows "Copied" for 1.5s.
  - **Export** (90px): "Export" + download icon, gap 6px. No behavior in prototype.

### 3. Adjustments panel (right) — "Illustration depth"
- 324px wide, hugs content, radius 24px, bg `#FFFFFF`, border `1px solid #EAEAEA`, padding 16px, column gap 24px.
- Title "Illustration depth" `#000000`.
- 8 sliders, gap 24px:

| Label | Default | Range | Unit | Tick dots |
|---|---|---|---|---|
| Intensity | 10 | 0–100 | | 6 |
| Rotate | 30 | 0–90 | º | 5 |
| Saturation | 36 | 0–100 | | 6 |
| Brightness | 0 | 0–100 | | 6 |
| Contrast | 0 | 0–100 | | 5 |
| Tint | 0 | 0–100 | | 6 |
| Temperature | 0 | 0–100 | | 5 |
| Highlight | 0 | 0–100 | | 5 |

- Divider: 2px tall, `#E6E6E6`.
- Border weight slider: default 0, range 0–10, 4 ticks.
- **Border colour** / **Background colour** rows: height 40px, radius 12px, bg `#F6F6F6`, padding `10px 16px`, space-between. Label `#8B8B8B`; 20px circular swatch on the right with `inset 0 0 0 1px rgba(0,0,0,.06)`. Clicking opens a color picker. Defaults: border `#FFAE00`, background `#BB80FF`.

### Slider component (SliderRow)
- Full-width, height 40px, radius 12px, bg `#F6F6F6`, `cursor: ew-resize`, overflow hidden.
- **Fill**: from left, bg `#5A5A5A`, radius 12px, width = `10px + pct × (trackWidth − 10px)` (min 10px at value=min).
- **Handle**: inside the fill's right edge, 2×12px white bar, radius 8px, top 14px, right 10px (4px when pct < 2%).
- **Label**: left, padding `10px 8px 10px 16px`. Color `#8B8B8B`; switches to `#F6F6F6` once fill width ≥ label width − 6px (so it stays legible over the dark fill). 120ms transition.
- **Tick dots**: 4×4px circles `#D0D0D0`, spread evenly (space-between) across the area between label and value; padding `10px 16px`, gap 16px to the value.
- **Value**: right-aligned, `#2B2B2B`, tabular numerals, with unit suffix.
- Focus: `inset 0 0 0 1px #D0D0D0`.
- Interaction: pointer down anywhere sets value from x position and starts drag (pointer capture); drag updates continuously; values rounded to integers and clamped. Keyboard: ←/↓ −1, →/↑ +1 (Shift = ±10), Home = min, End = max. ARIA `role="slider"` with valuemin/max/now.

## Interactions & Behavior
- Select style: click tile → becomes selected.
- Generate: enabled only when trimmed prompt is non-empty and not already generating. Click or ⌘/Ctrl+Enter in the textarea. Sets generating state, then on success shows the result and prepends `{prompt, style}` to Recent (max 20).
- Editing the prompt after a result resets status to idle (unless generating).
- Clicking a Recent item restores its prompt and style and shows that result.
- Sliders/colours should apply live to the current illustration (not wired in the prototype).

## State Management
- `selectedStyle: number` (default 0)
- `prompt: string`
- `status: 'idle' | 'generating' | 'done'`
- `recent: {prompt, style, imageUrl?}[]` (max 20, newest first; persist in production)
- `aspect: 'Square 1:1' | 'Portrait 3:4' | 'Landscape 4:3' | 'Wide 16:9'`, `aspectMenuOpen: boolean`
- `adjustments: { intensity, rotate, saturation, brightness, contrast, tint, temperature, highlight, borderWeight }`
- `borderColor`, `backgroundColor` (hex)
- `shareCopied: boolean` (1.5s)
- Data: a generate endpoint taking prompt, style, aspect (and probably adjustments); returns an image.

## Design Tokens
Colors:
- `#FFFFFF` page, panels, action buttons
- `#FAFAFA` canvas
- `#F6F6F6` inputs, sliders, colour rows, hover/selected menu items
- `#F0F0F0` action bar
- `#EAEAEA` panel borders, hairlines, button hover
- `#E6E6E6` divider, disabled button bg
- `#D0D0D0` tick dots, slider focus ring
- `#ADADAD` canvas placeholder text
- `#939393` disabled button text
- `#8B8B8B` secondary text, placeholders
- `#5A5A5A` slider fill
- `#2B2B2B` input text, slider values, thumbnail bg
- `#181818` primary text, style tiles
- `#000000` section labels
- `#6600FF` primary action (active Generate)

Radius: 8 (thumbnail), 10 (list/menu items), 12 (buttons, sliders, tiles, rows), 16 (prompt box, recent list, menu), 20 (style grid, action bar), 24 (panels).
Spacing: 2, 6, 8, 11, 12, 16, 24, 54px (see per-component values).
Type: single style — 14px/20px, weight 400.
Shadows: menu `0 8px 24px rgba(24,24,24,.08)`; everything else is borders/hairlines.

## Assets
- Style thumbnails: placeholders — real artwork needed for each of the 6 styles.
- Icons (inline SVG, 24-unit viewBox, 1.5 stroke): chevron-down, arrow-up-right (Share), download (Export). Use the codebase's icon set equivalents (e.g. Mingcute ArrowRightUpLine / Circum Download per the Figma).

## Files
- `Illustration Studio.dc.html` — the full screen (layout, state, behavior)
- `SliderRow.dc.html` — the slider component
- `support.js` — runtime needed to open the `.dc.html` files in a browser
- `image-slot.js` — placeholder image component used for style thumbnails (prototype only)
