/**
 * Genmage design tokens — single source of truth for values.
 *
 * app/globals.css mirrors this file as CSS custom properties (Tailwind v4
 * @theme block) so components consume it via Tailwind classes, not by
 * importing this file directly. This file exists for (a) documentation,
 * (b) any JS/TS logic that needs a raw token value (slider geometry, preview
 * overlay colours), and (c) the /design-system gallery, which renders from it.
 *
 * Source: design_handoff_illustration_studio/README.md (high-fidelity), then
 * scaled down ~20% on 2026-10-08 (Olusegun: "all in your face") so the studio
 * fits a laptop viewport without scrolling. Palette and proportions are the
 * handoff's; sizes are the scaled ones below.
 */

export const colors = {
  // Surfaces, lightest → darkest
  page: "#f5f5f5", // off-white page surface behind the panels, under the dot grid
  pageDot: "#dcdcdc", // dot-grid dots — kept low contrast so the white panels stay the figure
  background: "#ffffff", // panels, toolbar buttons, recent list
  canvas: "#ffffff", // canvas panel — white, bordered like the other panels (was #fafafa)
  field: "#f6f6f6", // prompt box, sliders, colour rows, hover/selected list + menu items
  toolbar: "#f0f0f0", // canvas action bar
  border: "#eaeaea", // panel borders, hairlines, toolbar button hover
  divider: "#e6e6e6", // adjustments divider, disabled primary button
  tick: "#d0d0d0", // slider tick dots, slider focus ring

  // Foregrounds, lightest → darkest
  iconMuted: "#6b6b6b", // secondary icons: empty states (canvas, recent list) and history card actions — a step darker than muted text
  disabledForeground: "#939393", // disabled primary button label
  mutedForeground: "#8b8b8b", // secondary text, placeholders, slider + colour row labels
  sliderFill: "#5a5a5a", // slider fill
  foregroundSoft: "#2b2b2b", // input text, slider values, empty thumbnail
  foreground: "#181818", // primary text, style tiles, tile selection ring
  foregroundStrong: "#000000", // section labels

  // Primary — the active Generate button. Exclusively. Export is deliberately a
  // plain toolbar button in the handoff; don't spread this colour to it.
  primary: "#6600ff",
  primaryForeground: "#ffffff",

  danger: "#b91c1c", // error states

  // Live-preview overlays for the Adjustments panel (soft-light blended over the
  // illustration). Not UI colours — never use them on chrome.
  editWarm: "#ff8a00", // Temperature
  editTint: "#ff2d9b", // Tint (magenta axis, as in photo-editing "tint")
  editHighlight: "#ffffff", // Highlight

  // Wrap outline (die-cut sticker edge around the illustration). Illustration
  // only, like the overlays above — identical in both themes.
  wrapOutline: "#ffffff", // the outline itself
  wrapOutlineShadow: "#181818", // its soft shadow — what makes a white edge read on the white canvas
} as const;

// Dark theme (<html data-theme="dark">, set by the canvas toggle). Same keys as
// `colors` — the type forces every token to have a dark value. Mirrored in the
// :root[data-theme="dark"] block of globals.css.
// Most inversions fall out of the token names: the slider fill goes light and
// its on-fill label (text-field) goes dark; ink style tiles go light with dark
// captions; the toast inverts.
export const darkColors: Record<keyof typeof colors, string> = {
  page: "#111111",
  pageDot: "#262626",
  background: "#1a1a1a", // panels
  canvas: "#ffffff", // stays white by decision — illustrations (and their paper-removed edges) look identical in both themes; the dark UI frames the art
  field: "#232323",
  toolbar: "#262626",
  border: "#2a2a2a",
  divider: "#2e2e2e",
  tick: "#4a4a4a",

  iconMuted: "#858585", // lifted from #6b6b6b so card actions clear 3:1 on dark fields (~4.2:1 on #232323); still reads on the white canvas
  disabledForeground: "#5c5c5c",
  mutedForeground: "#8f8f8f",
  sliderFill: "#d4d4d4", // light fill on a dark track
  foregroundSoft: "#d6d6d6",
  foreground: "#ededed",
  foregroundStrong: "#ffffff",

  primary: "#6600ff", // unchanged; white label still clears 4.5:1
  primaryForeground: "#ffffff",

  danger: "#f87171", // lighter red so it reads on dark panels

  editWarm: "#ff8a00", // illustration overlays don't change with the UI theme
  editTint: "#ff2d9b",
  editHighlight: "#ffffff",

  wrapOutline: "#ffffff", // illustration treatment — doesn't change with the UI theme
  wrapOutlineShadow: "#181818",
};

// Theme-dependent values that aren't colour utilities (CSS vars in globals.css).
export const themeExtras = {
  menuDrop: { light: "rgba(24, 24, 24, 0.08)", dark: "rgba(0, 0, 0, 0.5)" }, // aspect menu drop shadow
  swatchEdge: { light: "rgba(0, 0, 0, 0.06)", dark: "rgba(255, 255, 255, 0.14)" }, // colour swatch inset edge
} as const;

export const radii = {
  // One step smaller than the handoff (8/10/12/16/20/24) to match the scaled sizes.
  xs: "6px", // style tile thumbnail
  sm: "8px", // recent list items, menu items
  md: "10px", // buttons, sliders, style tiles, colour rows
  lg: "14px", // prompt box, action bar, aspect menu
  xl: "16px", // reserved
  "2xl": "20px", // the three panels, canvas
  full: "9999px", // colour swatches, slider tick dots
} as const;

// Built from colour vars, so each shadow follows the active theme.
export const shadows = {
  grid: "inset 0 0 0 1px var(--color-border)", // inset 1px outline that adds no size — gallery swatches/tables only now (style grid and recent list are outline-free)
  tileSelected: "0 0 0 2px var(--color-background), 0 0 0 4px var(--color-foreground)", // 2px panel-coloured gap, then a 2px ink ring (light ring in dark)
  menu: "inset 0 0 0 1px var(--color-border), 0 8px 24px var(--menu-drop)", // the only real shadow in the system
  swatch: "inset 0 0 0 1px var(--swatch-edge)", // keeps a swatch matching its row visible
  fieldFocus: "inset 0 0 0 1px var(--color-tick)", // focus on grey fields — slider, prompt box
} as const;

export const spacing = {
  // Named layout dimensions only — everything that lands on Tailwind's 4px scale
  // (gap-2, p-3.5, h-8, top-2.5…) uses that scale directly.
  // ≥ lg the layout is fluid: a 20px margin on every side (p-5), a 20px gap
  // (gap-5), the left column at 20% (layout.studioColumns), canvas filling the
  // rest. No max width/height — the margin stays equal at every screen size.
  leftColumnMin: "256px", // floor for the 20% left column — below ~1300px wide, 20% would squeeze the style tiles to ~50px
  adjustmentsPanel: "280px", // Adjustments panel width, floating inside the canvas at lg

  tileThumb: "39px", // style tile thumbnail height (60px tile − 20px caption − 1px gap)
  promptBox: "88px",

  actionBarWidth: "288px",
  shareButton: "78px",
  exportButton: "82px",

  // Inside the canvas (≥ lg) everything keeps a 16px padding from its edge.
  // The illustration area sits left of the Adjustments panel (so the panel never
  // covers the artwork) and above the action bar.
  canvasImageTop: "calc(16px + 40px + 16px)", // padding + 40px theme toggle + gap
  canvasImageTopCompact: "calc(12px + 40px + 12px)", // stacked
  canvasImageRight: "calc(16px + 280px + 16px)", // padding + Adjustments panel + gap
  canvasImageBottom: "calc(16px + 48px + 16px)", // padding + 48px action bar + gap
  canvasImageBottomCompact: "calc(12px + 48px + 12px)", // stacked
} as const;

export const typography = {
  family: "'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif",
  // One style for the entire product. Hierarchy comes from colour
  // (foregroundStrong → foreground → mutedForeground), never size or weight.
  // Exception: the prompt textarea is 16px on touch screens (iOS focus zoom).
  size: "13px",
  lineHeight: "18px",
  weight: 400,
} as const;

export const patterns = {
  // Page dot grid: a repeating radial gradient on `page`, one `pageDot` dot per cell.
  // 1px solid core with a half-pixel soft edge so dots render round, not square.
  dotGrid: {
    cellSize: "24px",
    dotRadius: "1px",
    dotFade: "1.5px",
  },
} as const;

export const motion = {
  durationDefault: "150ms", // every hover/selection/state change
  durationLabel: "120ms", // slider label flipping light/dark as the fill passes under it
  durationImageFade: "400ms", // generation reveal — the one deliberate pause
  easingDefault: "ease-out",
} as const;

// Wrap outline geometry, as fractions of the illustration's width so it's the
// same proportion in the preview, the 1024px PNG and the SVG.
export const wrapOutline = {
  widthFraction: 0.024, // outline thickness — ~25px on a 1024px image, a chunky sticker edge
  smoothFraction: 0.012, // rounds the outline's inner corners (dilate further, then erode back)
  alphaThreshold: 96, // cutout alpha (0–255) that counts as illustration — ignores soft watercolour fringes
  shadowBlurFraction: 0.01, // soft, close shadow
  shadowOffsetFraction: 0.004, // nudged down, as if lit from above
  shadowOpacity: 0.18,
} as const;

// Canvas zoom — a view setting, never part of the edit state or the export.
// 1 = the illustration fitted to the canvas (shown as 100%).
export const canvasZoom = {
  min: 0.1, // 10% — room to see the whole frame small
  max: 8, // 800% — past the 1024px source detail, but people inspect edges up close
  buttonFactor: 1.25, // each − / + press
  wheelSensitivity: 0.0025, // Ctrl/⌘-wheel and trackpad pinch: zoom ×e^(−deltaY × this)
  minVisiblePx: 64, // panning always leaves at least this much of the illustration on screen
} as const;

export const slider = {
  // Fill width = fillMin + pct × (trackWidth − fillMin): a 10px stub stays visible
  // at value=min so the handle never disappears.
  fillMin: 10,
  // The label flips to light once the fill reaches (labelWidth − this) px.
  labelFlipOffset: 6,
  // Below this fraction the handle hugs the stub's edge (4px) instead of 10px.
  handleHugThreshold: 0.02,
  // Touch only: a drag must travel this far horizontally (and more horizontally
  // than vertically) before the slider takes it — otherwise it's a page scroll.
  dragThreshold: 6,
  // The value sits 16px (px-4) from the right edge — 16 not 12, so the handle
  // (10px in from the fill's edge) never touches the label or value text. Not in the handoff: it never
  // showed a near-max fill, where #2B2B2B on the #5A5A5A fill is unreadable, so
  // the value flips light by the same rule as the label.
  valueInset: 16,
} as const;

export const layout = {
  // ≥ lg: three columns filling the viewport (no page scroll). Below: one stacked
  // column (Generate → Canvas → Adjustments), max-w-xl, canvas 4:5 / 1:1 (sm+).
  breakpointDesktop: 1024, // Tailwind `lg:`
  // Two sections: left (Generate + Recently generated) and the canvas, which
  // hosts the Adjustments panel in its top-right corner.
  // minmax(floor, 20%): exactly 20% once that's wider than the floor (≳1300px
  // screens); below that the left column holds at 256px.
  studioColumns: "minmax(var(--spacing-left-column-min), 20%) minmax(0, 1fr)",
  heightRule:
    "lg only: the row is the viewport height minus the 20px margins. Left column and canvas fill it; Adjustments hugs its content at the canvas's top-right. On a too-short viewport, Adjustments and the recent list scroll internally — never the page.",
} as const;

export type ColorToken = keyof typeof colors;
export type RadiusToken = keyof typeof radii;
export type SpacingToken = keyof typeof spacing;
