import { colors, wrapOutline } from "@/design/tokens";

// Builds the die-cut sticker edge for a transparent cutout: a thick, flat
// silhouette that follows the illustration's outer shape, with interior gaps
// filled (a sticker is one piece). Returned as its own RGBA layer, drawn
// *behind* the artwork, so colour edits never tint it.

const INF = 1e20;

// Felzenszwalb–Huttenlocher 1D squared distance transform (in place via buffers).
function edt1d(f: Float64Array, n: number, d: Float64Array, v: Int32Array, z: Float64Array) {
  let k = 0;
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
}

/** Squared Euclidean distance from every pixel to the nearest pixel where `inside` is 1. */
function squaredDistanceTo(inside: Uint8Array, width: number, height: number): Float64Array {
  const grid = new Float64Array(width * height);
  for (let i = 0; i < grid.length; i++) grid[i] = inside[i] ? 0 : INF;

  const size = Math.max(width, height);
  const f = new Float64Array(size);
  const d = new Float64Array(size);
  const v = new Int32Array(size);
  const z = new Float64Array(size + 1);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) f[y] = grid[y * width + x];
    edt1d(f, height, d, v, z);
    for (let y = 0; y < height; y++) grid[y * width + x] = d[y];
  }
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) f[x] = grid[row + x];
    edt1d(f, width, d, v, z);
    for (let x = 0; x < width; x++) grid[row + x] = d[x];
  }
  return grid;
}

// Anything not reachable from the image edge through empty pixels is a hole — fill it.
function fillHoles(mask: Uint8Array, width: number, height: number) {
  const outside = new Uint8Array(mask.length);
  const stack = new Int32Array(mask.length);
  let top = 0;
  const seed = (i: number) => {
    if (!mask[i] && !outside[i]) {
      outside[i] = 1;
      stack[top++] = i;
    }
  };
  for (let x = 0; x < width; x++) {
    seed(x);
    seed((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    seed(y * width);
    seed(y * width + width - 1);
  }
  while (top > 0) {
    const i = stack[--top];
    const x = i % width;
    if (x > 0) seed(i - 1);
    if (x < width - 1) seed(i + 1);
    if (i >= width) seed(i - width);
    if (i < mask.length - width) seed(i + width);
  }
  for (let i = 0; i < mask.length; i++) if (!outside[i]) mask[i] = 1;
}

const hexChannel = (hex: string, offset: number) => parseInt(hex.slice(offset, offset + 2), 16);

/**
 * Room the outline needs on every side of an artwork `artWidth` wide (outline
 * width + 2px for the anti-aliased edge). The outline layer is the artwork plus
 * this on each side, and exports fit that whole sticker inside the frame.
 */
export function wrapOutlinePad(artWidth: number): number {
  return Math.ceil(wrapOutline.widthFraction * artWidth) + 2;
}

/** Outline thickness and corner rounding in px, for an artwork `artWidth` wide. */
export function wrapOutlineSize(artWidth: number) {
  return {
    radius: wrapOutline.widthFraction * artWidth,
    smooth: wrapOutline.smoothFraction * artWidth,
    edge: wrapOutline.edgeFraction * artWidth,
  };
}

/**
 * Cutout RGBA (unpremultiplied) → the outline layer's RGBA, same size. The
 * caller pads the canvas by at least `radius` so the outline is never cut at
 * the image edge. Returns null when there's nothing to outline — no art, or art
 * covering every one of the `artPixelArea` source pixels (no paper removed).
 */
export function buildWrapOutline(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  { radius, smooth, edge }: { radius: number; smooth: number; edge: number },
  artPixelArea: number,
): Uint8ClampedArray | null {
  const pixelCount = width * height;
  const art = new Uint8Array(pixelCount);
  let artPixels = 0;
  for (let i = 0; i < pixelCount; i++) {
    if (rgba[i * 4 + 3] >= wrapOutline.alphaThreshold) {
      art[i] = 1;
      artPixels++;
    }
  }
  if (artPixels === 0 || artPixels >= artPixelArea) return null;

  // 1. Grow past the outline width by `smooth`, and fill interior gaps.
  const toArt = squaredDistanceTo(art, width, height);
  const grown = new Uint8Array(pixelCount);
  const growLimit = (radius + smooth) ** 2;
  for (let i = 0; i < pixelCount; i++) grown[i] = toArt[i] <= growLimit ? 1 : 0;
  fillHoles(grown, width, height);

  // 2. Shrink back by `smooth` (rounds concave corners), with a 1px anti-aliased edge.
  const empty = new Uint8Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) empty[i] = grown[i] ? 0 : 1;
  const toEmpty = squaredDistanceTo(empty, width, height);

  // 3. Flat fill with a hairline on its outer rim, both anti-aliased. `inset` is
  // the distance in from the outline's outer edge.
  const fill = [1, 3, 5].map((o) => hexChannel(colors.wrapOutline, o));
  const rim = [1, 3, 5].map((o) => hexChannel(colors.wrapOutlineEdge, o));
  const out = new Uint8ClampedArray(pixelCount * 4);
  for (let i = 0; i < pixelCount; i++) {
    const inset = Math.sqrt(toEmpty[i]) - smooth;
    const coverage = Math.min(1, Math.max(0, inset + 0.5));
    if (coverage <= 0) continue;
    const inner = Math.min(1, Math.max(0, inset - edge + 0.5)); // 0 on the rim, 1 inside it
    for (let c = 0; c < 3; c++) out[i * 4 + c] = rim[c] + (fill[c] - rim[c]) * inner;
    out[i * 4 + 3] = coverage * 255;
  }
  return out;
}
