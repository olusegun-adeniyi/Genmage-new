import type { PreviewStyle } from "./preview-style";

// PRD Phase E #39: exports are 1024px on the longest edge.
const EXPORT_LONG_EDGE = 1024;

export type ExportFrame = {
  width: number;
  height: number;
  border: number;
  innerWidth: number;
  innerHeight: number;
};

// Shared by the PNG and SVG exports so both come out the same size, with the
// border and inner (illustration) box in the same place.
export function exportFrame(style: PreviewStyle): ExportFrame {
  const width = style.ratio >= 1 ? EXPORT_LONG_EDGE : Math.round(EXPORT_LONG_EDGE * style.ratio);
  const height = style.ratio >= 1 ? Math.round(EXPORT_LONG_EDGE / style.ratio) : EXPORT_LONG_EDGE;
  const border = Math.round(style.borderFraction * width);
  return { width, height, border, innerWidth: width - border * 2, innerHeight: height - border * 2 };
}

// object-fit: contain — scale and offset that fit a `source`-sized image wholly
// inside `inner`, centred. The illustration is never cropped: aspect ratios
// letterbox it (the background colour, if any, fills the rest).
export function containFit(sourceWidth: number, sourceHeight: number, innerWidth: number, innerHeight: number) {
  const scale = Math.min(innerWidth / sourceWidth, innerHeight / sourceHeight);
  return {
    scale,
    x: (innerWidth - sourceWidth * scale) / 2,
    y: (innerHeight - sourceHeight * scale) / 2,
  };
}

export type ArtPlacement = {
  scale: number; // source px → frame px
  x: number; // artwork's top-left inside the inner box
  y: number;
  outline: { x: number; y: number; width: number; height: number }; // = the artwork when pad is 0
};

/**
 * Where the artwork goes inside the inner box. With a wrap outline (`pad` > 0,
 * in source px) the whole sticker — artwork plus outline on every side — is
 * what gets fitted, so the outline is never cut at the frame edge either.
 */
export function placeArt(artWidth: number, artHeight: number, pad: number, innerWidth: number, innerHeight: number): ArtPlacement {
  const fit = containFit(artWidth + pad * 2, artHeight + pad * 2, innerWidth, innerHeight);
  return {
    scale: fit.scale,
    x: fit.x + pad * fit.scale,
    y: fit.y + pad * fit.scale,
    outline: { x: fit.x, y: fit.y, width: (artWidth + pad * 2) * fit.scale, height: (artHeight + pad * 2) * fit.scale },
  };
}
