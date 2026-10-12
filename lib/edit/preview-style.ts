import { ASPECT_VALUES, type EditState } from "@/lib/validation/edit-state";

// One source of truth for how an EditState looks: the canvas preview renders
// these values with CSS, and the export (lib/client/render-edited-image.ts)
// renders the same numbers into pixels, so a download matches the screen.
export type PreviewStyle = {
  ratio: number;
  saturate: number;
  brightness: number;
  contrast: number;
  rotate: number; // degrees
  fitScale: number;
  warmOpacity: number;
  tintOpacity: number;
  highlightOpacity: number;
  borderFraction: number; // border width as a fraction of the frame width
  // CSS forms of the above, for the preview.
  filter: string;
  transform: string;
};

// Ceilings keep every lever a nudge, not an overhaul (PRD "nudge, not overhaul").
const MAX_BRIGHTNESS_GAIN = 0.5;
const MAX_CONTRAST_GAIN = 0.5;
const MAX_WARM_OPACITY = 0.45;
const MAX_TINT_OPACITY = 0.4;
const MAX_HIGHLIGHT_OPACITY = 0.5;

// Border weight is in px *at this frame width* and scales with the frame, so
// the border is the same proportion of the illustration on any screen and in
// the 1024px export (weight 10 ≈ 2% of the width).
export const BORDER_REFERENCE_WIDTH = 512;

// Largest scale at which a w:h box rotated by `degrees` still fits inside the
// same w:h frame — so rotating never crops the illustration, it reveals the
// background colour around it instead.
export function rotationFitScale(ratio: number, degrees: number): number {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  return Math.min(ratio / (ratio * cos + sin), 1 / (ratio * sin + cos));
}

// Intensity is the master strength for every colour lever (not rotate, not
// border): 100 applies the other sliders fully, 0 neutralises them.
export function previewStyle(edit: EditState): PreviewStyle {
  const strength = edit.intensity / 100;
  const ratio = ASPECT_VALUES[edit.aspectRatio];

  const saturate = 1 + ((edit.saturation - 50) / 50) * strength;
  const brightness = 1 + (edit.brightness / 100) * MAX_BRIGHTNESS_GAIN * strength;
  const contrast = 1 + (edit.contrast / 100) * MAX_CONTRAST_GAIN * strength;
  const fitScale = rotationFitScale(ratio, edit.rotate);

  return {
    ratio,
    saturate,
    brightness,
    contrast,
    rotate: edit.rotate,
    fitScale,
    warmOpacity: (edit.temperature / 100) * MAX_WARM_OPACITY * strength,
    tintOpacity: (edit.tint / 100) * MAX_TINT_OPACITY * strength,
    highlightOpacity: (edit.highlight / 100) * MAX_HIGHLIGHT_OPACITY * strength,
    borderFraction: edit.borderWeight / BORDER_REFERENCE_WIDTH,
    filter: `saturate(${saturate}) brightness(${brightness}) contrast(${contrast})`,
    transform: `rotate(${edit.rotate}deg) scale(${fitScale})`,
  };
}
