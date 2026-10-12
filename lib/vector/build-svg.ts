import type { VectorDocument } from "./types";

// Serialises a document we built ourselves from validated numbers and hex
// colours — never from user-supplied markup. Each path carries its id and
// palette group so the editor (V2) can read the structure back.
export function buildVectorSvg({ width, height, shapes, silhouette }: VectorDocument): string {
  const paths = shapes
    .map(
      (shape) =>
        `<path id="${shape.id}" data-group="${shape.groupId}" d="${shape.d}" fill="${shape.fill}" transform="translate(${shape.x},${shape.y})"/>`,
    )
    .join("\n");

  const open = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`;
  if (!silhouette) return `${open}\n${paths}\n</svg>\n`;

  // Even-odd so the silhouette's holes (gaps between legs) stay see-through.
  const clip = silhouette
    .map((outline) => `<path clip-rule="evenodd" d="${outline.d}" transform="translate(${outline.x},${outline.y})"/>`)
    .join("");
  return `${open}\n<defs><clipPath id="subject">${clip}</clipPath></defs>\n<g clip-path="url(#subject)">\n${paths}\n</g>\n</svg>\n`;
}
