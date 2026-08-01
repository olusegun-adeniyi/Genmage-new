/**
 * Genmage design tokens — single source of truth for values.
 *
 * app/globals.css mirrors this file as CSS custom properties (Tailwind v4
 * @theme block) so components consume it via Tailwind classes, not by
 * importing this file directly. This file exists for (a) documentation,
 * (b) any JS/TS logic that needs a raw token value — canvas compositing,
 * slider min/max/default, swatch hex arrays — not just CSS classes.
 *
 * Some tokens below (surfaceDark, accent, sliderTrack/Thumb, layout.fourPanelDesktopGrid)
 * aren't used by any component yet — Phase D hasn't built the dark controls
 * panel, history log, or edit panel. They're infrastructure for that work,
 * not retrofitted onto components that don't exist. See DESIGN-SYSTEM.md.
 */

export const colors = {
  // Surfaces
  pageBackground: "#fafaf9", // whole-page background, outside all panels
  surfaceDark: "#0a0a0a", // controls panel — not yet applied in code (Phase D)
  surfaceLight: "#ffffff", // canvas panel — pure white, deliberately distinct from pageBackground
  surfaceMuted: "#f5f5f4", // history + edit panels; lighter than page, warmer than canvas

  // Foregrounds
  foregroundOnLight: "#0a0a0a", // text/icons on pageBackground, surfaceLight, surfaceMuted
  foregroundOnDark: "#fafaf9", // text/icons on surfaceDark — not yet applied in code (Phase D)
  mutedForegroundOnLight: "#737373", // secondary text on light surfaces (labels, captions, timestamps)
  mutedForegroundOnDark: "#a3a3a3", // secondary text on surfaceDark — not yet applied in code (Phase D)

  // Borders
  borderOnLight: "rgba(0, 0, 0, 0.08)", // hairline borders on light surfaces
  borderOnLightHover: "rgba(0, 0, 0, 0.12)",
  borderOnDark: "rgba(255, 255, 255, 0.08)", // hairline borders on surfaceDark — Phase D
  borderOnDarkHover: "rgba(255, 255, 255, 0.12)",

  // Accent — Frontend Design Skill: "spend your boldness in one place." Reserved
  // exclusively for the Export button. Never a starting palette to expand from.
  accent: "#16a34a",

  // Interactive
  inputBackground: "#e8e4e4", // prompt input specifically — not a reuse of surfaceMuted, its own semantic slot
  // Sliders (Rotate/Saturation/Tint/B&W, §Post-generation editing) stay neutral —
  // Frontend Design Skill's restraint principle rules out spending the reserved
  // accent color here. Thumb reuses foregroundOnLight's exact value rather than
  // inventing a second "interactive" color.
  sliderTrack: "#e5e5e5", // inactive track — visible against surfaceMuted without competing
  sliderThumb: "#0a0a0a", // same value as foregroundOnLight, named separately for call-site clarity

  // Danger
  danger: "#b91c1c", // destructive/error states — subtle, reads as intentional not alarming
} as const;

export const radii = {
  sm: "6px", // smallest interactive elements; not yet used by any built component
  md: "8px", // style tiles, sample image cards (formalizes the Phase C tuning pass's rounded-[8px])
  lg: "12px", // cards — the outer panel containers, canvas panel
  xl: "20px", // reserved for a larger container tier if one shows up; none currently
  full: "9999px", // pill buttons — Generate, Export, Aspect selector, icon buttons
} as const;

export const spacing = {
  // Semantic constants only — arbitrary/numeric spacing (gap-3, p-4, etc.) still
  // comes from Tailwind's own scale. These are the named, meaningful ones.
  sectionGap: "112px", // major sections inside the controls panel (style switcher / prompt / samples)
  panelGap: "24px", // between the four panels on desktop (controls/canvas/history/edit)
  cardGap: "32px", // spacing inside a card's own internal layout
  tightGap: "8px", // text-to-text within a group (label to value, caption below thumbnail)
  pagePadding: "24px", // outer page inset before the panel(s) begin

  // Slider-specific (ui-ux-pro-max: 44x44px minimum touch target; visual track/thumb
  // can be smaller than the tappable hit area).
  sliderTrackHeight: "4px", // thin, precise — reads as an instrument, not a toy
  sliderThumbSize: "16px", // visual diameter
  sliderThumbHitArea: "44px", // minimum tappable area around the thumb, per touch-target guidance
  sliderLabelGap: "8px", // label-to-track distance — reuses tightGap's value
} as const;

export const typography = {
  family: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",

  scale: {
    xs: "12px", // labels, timestamps
    sm: "14px", // body, buttons, wordmark
    base: "16px", // prompt input — the floor for iOS to not auto-zoom on focus
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
  },

  weight: {
    normal: 400, // body
    medium: 500, // UI elements, wordmark
    semibold: 600, // emphasis
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },

  tracking: {
    default: "0",
    tight: "-0.01em", // wordmark
    wide: "0.02em", // labels, anything set in uppercase
  },
} as const;

export const motion = {
  durationDefault: "150ms", // the system default — snap, not float
  durationLong: "300ms", // placeholder rotation fade, anything that needs to read as deliberate
  durationImageFade: "400ms", // generation reveal — not yet implemented, no generation flow wired up
  easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)", // Material's "standard" curve; loosely "ease-out" in feel
} as const;

export const layout = {
  breakpointMobile: 0,
  breakpointDesktop: 768, // matches Tailwind's `md:` — already in use throughout

  // min-h-dvh over min-h-screen/h-screen: 100vh is unreliable on mobile browsers
  // whose chrome shows/hides on scroll. dvh accounts for that; already in use.
  mobileViewportHeightNote:
    "Use min-h-dvh, never h-screen. min-height (not a hard height) so content can never be clipped — page scrolls instead.",

  safeAreaNote:
    "No fixed-position elements currently exist in the built UI, so no safe-area-inset padding is applied yet. If a bottom-sheet drawer (Phase F, mobile history/edit) or a fixed action bar returns, it needs pb-[env(safe-area-inset-bottom)].",

  // Phase D target — NOT implemented in app/page.tsx yet. Current desktop build
  // is a two-column grid (controls 36% / canvas 1fr), no history or edit panel.
  fourPanelDesktopGrid: {
    gridTemplateColumns: "36% 1fr",
    gridTemplateAreas: `"controls canvas" "history edit"`,
    note: "Controls (dark) and history (muted) share the left 36% column; canvas (light) and edit (muted) share the right 1fr column.",
  },
} as const;

export type ColorToken = keyof typeof colors;
export type RadiusToken = keyof typeof radii;
export type SpacingToken = keyof typeof spacing;
export type FontSizeToken = keyof typeof typography.scale;
export type FontWeightToken = keyof typeof typography.weight;
