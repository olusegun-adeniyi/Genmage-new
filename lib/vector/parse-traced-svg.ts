// Strict reader for VTracer's SVG output. Only the exact shape it emits is
// accepted — numeric path commands, a hex fill, a numeric translate — so nothing
// from the tracer (or anything else) can smuggle markup into a stored SVG.

export type TracedShape = {
  d: string;
  fill: string; // #rrggbb, lowercase
  x: number;
  y: number;
};

export type TracedSvg = {
  width: number;
  height: number;
  shapes: TracedShape[];
};

const SIZE = /<svg[^>]*\bwidth="(\d+)"[^>]*\bheight="(\d+)"/;
const PATH = /<path d="([^"]*)" fill="(#[0-9a-fA-F]{6})" transform="translate\((-?[\d.]+),(-?[\d.]+)\)"\s*\/>/g;
const SAFE_PATH_DATA = /^[MCLZmclz0-9eE.,\s-]+$/;

export function parseTracedSvg(svg: string): TracedSvg {
  const size = SIZE.exec(svg);
  if (!size) throw new Error("Traced SVG has no width/height");

  const shapes: TracedShape[] = [];
  for (const [, d, fill, x, y] of svg.matchAll(PATH)) {
    if (!SAFE_PATH_DATA.test(d)) continue;
    shapes.push({ d: d.trim(), fill: fill.toLowerCase(), x: Number(x), y: Number(y) });
  }
  if (shapes.length === 0) throw new Error("Traced SVG has no paths");

  return { width: Number(size[1]), height: Number(size[2]), shapes };
}
