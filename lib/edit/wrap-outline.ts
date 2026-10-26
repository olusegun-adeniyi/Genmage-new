import { colors, wrapOutline } from "@/design/tokens";

// Builds the die-cut sticker edge for a transparent cutout: a thick white
// silhouette that follows the illustration's outer shape, with interior gaps
// filled (a sticker is one piece) and a soft shadow so the white edge reads on
// a white canvas. Returned as its own RGBA layer, drawn *behind* the artwork, so
// colour edits never tint it.

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

// Three box blurs ≈ a Gaussian; separable, so it stays linear in pixel count.
function boxBlur(values: Float32Array, width: number, height: number, radius: number) {
  if (radius < 1) return;
  const temp = new Float32Array(values.length);
  const pass = (src: Float32Array, dst: Float32Array, horizontal: boolean) => {
    const lines = horizontal ? height : width;
    const length = horizontal ? width : height;
    const step = horizontal ? 1 : width;
    for (let line = 0; line < lines; line++) {
      const start = horizontal ? line * width : line;
      let sum = 0;
      for (let i = -radius; i <= radius; i++) sum += src[start + Math.min(length - 1, Math.max(0, i)) * step];
      for (let i = 0; i < length; i++) {
        dst[start + i * step] = sum / (radius * 2 + 1);
        const add = Math.min(length - 1, i + radius + 1);
        const drop = Math.max(0, i - radius);
        sum += src[start + add * step] - src[start + drop * step];
      }
    }
  };
  for (let i = 0; i < 3; i++) {
    pass(values, temp, true);
    pass(temp, values, false);
  }
}

const hexChannel = (hex: string, offset: number) => parseInt(hex.slice(offset, offset + 2), 16);

/**
 * Cutout RGBA (unpremultiplied) → the outline layer's RGBA, same size. Returns
 * null when there's nothing to outline (no transparent margin around the art).
 */
export function buildWrapOutline(rgba: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray | null {
  const pixelCount = width * height;
  const art = new Uint8Array(pixelCount);
  let artPixels = 0;
  for (let i = 0; i < pixelCount; i++) {
    if (rgba[i * 4 + 3] >= wrapOutline.alphaThreshold) {
      art[i] = 1;
      artPixels++;
    }
  }
  // Fully opaque (no paper removed) or empty: an outline would be invisible or meaningless.
  if (artPixels === 0 || artPixels === pixelCount) return null;

  const radius = wrapOutline.widthFraction * width;
  const smooth = wrapOutline.smoothFraction * width;

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
  const outline = new Float32Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) outline[i] = Math.min(1, Math.max(0, Math.sqrt(toEmpty[i]) - smooth + 0.5));

  // 3. Shadow: the outline blurred, nudged down, faint.
  const shadow = new Float32Array(pixelCount);
  const offset = Math.round(wrapOutline.shadowOffsetFraction * height);
  for (let y = 0; y < height; y++) {
    const sourceY = y - offset;
    if (sourceY < 0 || sourceY >= height) continue;
    shadow.set(outline.subarray(sourceY * width, sourceY * width + width), y * width);
  }
  boxBlur(shadow, width, height, Math.round(wrapOutline.shadowBlurFraction * width));

  // 4. Composite: white outline over its shadow.
  const [lr, lg, lb] = [1, 3, 5].map((o) => hexChannel(colors.wrapOutline, o));
  const [sr, sg, sb] = [1, 3, 5].map((o) => hexChannel(colors.wrapOutlineShadow, o));
  const out = new Uint8ClampedArray(pixelCount * 4);
  for (let i = 0; i < pixelCount; i++) {
    const line = outline[i];
    const shade = shadow[i] * wrapOutline.shadowOpacity * (1 - line);
    const alpha = line + shade;
    if (alpha <= 0) continue;
    out[i * 4] = (lr * line + sr * shade) / alpha;
    out[i * 4 + 1] = (lg * line + sg * shade) / alpha;
    out[i * 4 + 2] = (lb * line + sb * shade) / alpha;
    out[i * 4 + 3] = alpha * 255;
  }
  return out;
}
