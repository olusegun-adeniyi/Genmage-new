import { deltaE, hexToLab, type Lab } from "./colour";
import type { TracedSvg } from "./parse-traced-svg";
import type { VectorDocument, VectorShape } from "./types";

// Traced fills closer than this are the same paint (see colour.ts).
const SAME_PAINT_DELTA_E = 10;
// "Paper": near-white, near-neutral (incl. Gemini's pale-grey backdrop blobs,
// L≈95). Only paper that reaches the image edge is dropped here, to keep the
// document small — enclosed backdrop (between legs, under handles) is removed
// by the silhouette clip, which can tell it apart from a white cup; colour can't.
const PAPER_MIN_LIGHTNESS = 94;
const PAPER_MAX_CHROMA = 6;
const EDGE_TOLERANCE_PX = 1;

type Box = { minX: number; minY: number; maxX: number; maxY: number };

// Bounding box from the path's coordinate pairs (control points included —
// slightly generous, which is fine for edge tests and area weighting).
function boundingBox(d: string, x: number, y: number): Box {
  const numbers = d.match(/-?\d*\.?\d+(?:e-?\d+)?/gi)?.map(Number) ?? [];
  const box = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  for (let i = 0; i + 1 < numbers.length; i += 2) {
    box.minX = Math.min(box.minX, numbers[i] + x);
    box.maxX = Math.max(box.maxX, numbers[i] + x);
    box.minY = Math.min(box.minY, numbers[i + 1] + y);
    box.maxY = Math.max(box.maxY, numbers[i + 1] + y);
  }
  return box;
}

function isNeutralWhite(lab: Lab): boolean {
  return lab[0] >= PAPER_MIN_LIGHTNESS && Math.hypot(lab[1], lab[2]) <= PAPER_MAX_CHROMA;
}

function touchesEdge(box: Box, width: number, height: number): boolean {
  return (
    box.minX <= EDGE_TOLERANCE_PX ||
    box.minY <= EDGE_TOLERANCE_PX ||
    box.maxX >= width - EDGE_TOLERANCE_PX ||
    box.maxY >= height - EDGE_TOLERANCE_PX
  );
}

/**
 * Traced SVG (+ traced silhouette) → editable document: drops edge paper,
 * groups fills into the real palette (the largest shape's colour represents its
 * group), keeps each shape's exact fill, and assigns stable ids. Paint order is kept.
 */
export function cleanTrace({ width, height, shapes }: TracedSvg, silhouette: TracedSvg | null): VectorDocument {
  const measured = shapes
    .map((shape, order) => {
      const box = boundingBox(shape.d, shape.x, shape.y);
      const area = Math.max(0, box.maxX - box.minX) * Math.max(0, box.maxY - box.minY);
      return { ...shape, order, lab: hexToLab(shape.fill), box, area };
    })
    .filter((shape) => !(isNeutralWhite(shape.lab) && touchesEdge(shape.box, width, height)));

  // Cluster largest-first so big, deliberate colour areas set the palette.
  const groups: { id: string; hex: string; lab: Lab }[] = [];
  const groupOf = new Map<number, string>();
  for (const shape of [...measured].sort((a, b) => b.area - a.area)) {
    let group = groups.find((candidate) => deltaE(candidate.lab, shape.lab) < SAME_PAINT_DELTA_E);
    if (!group) {
      group = { id: `g${groups.length + 1}`, hex: shape.fill, lab: shape.lab };
      groups.push(group);
    }
    groupOf.set(shape.order, group.id);
  }

  const vectorShapes: VectorShape[] = measured.map((shape, index) => ({
    id: `s${index + 1}`,
    groupId: groupOf.get(shape.order) ?? groups[0].id,
    fill: shape.fill,
    d: shape.d,
    x: shape.x,
    y: shape.y,
  }));

  return {
    width,
    height,
    silhouette: silhouette ? silhouette.shapes.map(({ d, x, y }) => ({ d, x, y })) : null,
    palette: groups.map(({ id, hex }) => ({ id, hex })),
    shapes: vectorShapes,
  };
}
