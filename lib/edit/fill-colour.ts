import { colors } from "@/design/tokens";

import { applyColorFilters } from "./color-filters";
import type { PreviewStyle } from "./preview-style";

// The colour overlays, in stacking order — shared by the preview-matching PNG
// export and the per-fill SVG export.
export function overlayLayers(style: PreviewStyle): [string, number][] {
  return [
    [colors.editWarm, style.warmOpacity],
    [colors.editTint, style.tintOpacity],
    [colors.editHighlight, style.highlightOpacity],
  ];
}

type Rgb = [number, number, number]; // 0–1

const hexToRgb = (hex: string): Rgb => [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255) as Rgb;
const rgbToHex = (rgb: Rgb) =>
  `#${rgb.map((channel) => Math.round(Math.min(1, Math.max(0, channel)) * 255).toString(16).padStart(2, "0")).join("")}`;

// The overlays stacked source-over onto transparency: one colour plus its coverage.
function stackOverlays(style: PreviewStyle): { rgb: Rgb; alpha: number } | null {
  let rgb: Rgb = [0, 0, 0];
  let alpha = 0;
  for (const [hex, opacity] of overlayLayers(style)) {
    if (opacity <= 0) continue;
    const next = opacity + alpha * (1 - opacity);
    const source = hexToRgb(hex);
    rgb = rgb.map((channel, i) => (source[i] * opacity + channel * alpha * (1 - opacity)) / next) as Rgb;
    alpha = next;
  }
  return alpha > 0 ? { rgb, alpha } : null;
}

// W3C Compositing soft-light, per channel.
function softLight(backdrop: number, source: number): number {
  if (source <= 0.5) return backdrop - (1 - 2 * source) * backdrop * (1 - backdrop);
  const d = backdrop <= 0.25 ? ((16 * backdrop - 12) * backdrop + 4) * backdrop : Math.sqrt(backdrop);
  return backdrop + (2 * source - 1) * (d - backdrop);
}

/**
 * Edit state → a function that recolours one flat fill exactly as the PNG export
 * recolours its pixels: saturate/brightness/contrast, then the stacked overlays
 * soft-lit on top. Every pixel of a flat shape gets the same result, so a vector
 * with recoloured fills matches the raster export — and stays editable.
 */
export function fillTransform(style: PreviewStyle): (hex: string) => string {
  const overlay = stackOverlays(style);
  const cache = new Map<string, string>();

  return (hex) => {
    const cached = cache.get(hex);
    if (cached) return cached;

    const pixel = new Uint8ClampedArray([...hexToRgb(hex).map((channel) => channel * 255), 255]);
    applyColorFilters(pixel, style);
    let rgb: Rgb = [pixel[0] / 255, pixel[1] / 255, pixel[2] / 255];
    if (overlay) {
      rgb = rgb.map(
        (backdrop, i) => (1 - overlay.alpha) * backdrop + overlay.alpha * softLight(backdrop, overlay.rgb[i]),
      ) as Rgb;
    }

    const result = rgbToHex(rgb);
    cache.set(hex, result);
    return result;
  };
}
