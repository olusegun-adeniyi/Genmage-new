// sRGB hex → CIELAB (D65), and the CIE76 colour difference between two colours.
// ΔE ≈ 10 is the threshold palette grouping uses: below it two traced fills are
// the same paint (anti-aliasing / tracing noise); above it they're distinct.

export type Lab = [number, number, number];

const toLinear = (channel: number) =>
  channel > 0.04045 ? ((channel + 0.055) / 1.055) ** 2.4 : channel / 12.92;
const labPivot = (value: number) => (value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116);

export function hexToLab(hex: string): Lab {
  const [r, g, b] = [1, 3, 5].map((offset) => toLinear(parseInt(hex.slice(offset, offset + 2), 16) / 255));
  const x = labPivot((r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047);
  const y = labPivot(r * 0.2126 + g * 0.7152 + b * 0.0722);
  const z = labPivot((r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

export function deltaE(a: Lab, b: Lab): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}
