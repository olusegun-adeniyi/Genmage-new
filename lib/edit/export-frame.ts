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

// object-fit: cover — scale and offset that fill `inner` with a `source`-sized image.
export function coverFit(sourceWidth: number, sourceHeight: number, innerWidth: number, innerHeight: number) {
  const scale = Math.max(innerWidth / sourceWidth, innerHeight / sourceHeight);
  return {
    scale,
    x: (innerWidth - sourceWidth * scale) / 2,
    y: (innerHeight - sourceHeight * scale) / 2,
  };
}
