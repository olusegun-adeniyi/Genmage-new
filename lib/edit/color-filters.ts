// Pixel versions of the CSS filter functions the preview uses — saturate(),
// brightness(), contrast() — so the export matches the screen in every browser
// (canvas `ctx.filter` isn't supported everywhere). Formulas follow the Filter
// Effects spec, in sRGB like the CSS shorthand filters, applied in the same
// order the preview lists them.

export type ColorFilterParams = {
  saturate: number;
  brightness: number;
  contrast: number;
};

const clampByte = (value: number) => (value < 0 ? 0 : value > 255 ? 255 : value);

/** Mutates RGBA `data` in place (unpremultiplied, as getImageData returns it). */
export function applyColorFilters(data: Uint8ClampedArray, { saturate: s, brightness, contrast }: ColorFilterParams) {
  if (s === 1 && brightness === 1 && contrast === 1) return;

  // saturate() matrix from the spec.
  const rr = 0.213 + 0.787 * s, rg = 0.715 - 0.715 * s, rb = 0.072 - 0.072 * s;
  const gr = 0.213 - 0.213 * s, gg = 0.715 + 0.285 * s, gb = 0.072 - 0.072 * s;
  const br = 0.213 - 0.213 * s, bg = 0.715 - 0.715 * s, bb = 0.072 + 0.928 * s;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];

    let r2 = clampByte(rr * r + rg * g + rb * b);
    let g2 = clampByte(gr * r + gg * g + gb * b);
    let b2 = clampByte(br * r + bg * g + bb * b);

    r2 = clampByte(r2 * brightness);
    g2 = clampByte(g2 * brightness);
    b2 = clampByte(b2 * brightness);

    data[i] = clampByte((r2 - 127.5) * contrast + 127.5);
    data[i + 1] = clampByte((g2 - 127.5) * contrast + 127.5);
    data[i + 2] = clampByte((b2 - 127.5) * contrast + 127.5);
  }
}
