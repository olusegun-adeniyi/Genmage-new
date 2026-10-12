import { coverFit, exportFrame } from "@/lib/edit/export-frame";
import { fillTransform } from "@/lib/edit/fill-colour";
import { previewStyle } from "@/lib/edit/preview-style";
import type { EditState } from "@/lib/validation/edit-state";

const SVG_NS = "http://www.w3.org/2000/svg";

function svgElement(document: XMLDocument, name: string, attributes: Record<string, string | number>) {
  const element = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
  return element;
}

/**
 * The vector twin of renderEditedImage: same frame size, cover crop, rotation,
 * background and border, with the colour edits baked into each shape's fill
 * rather than applied as SVG filters — so the file opens in Figma or
 * Illustrator looking like the canvas, and every shape is still editable
 * (ids and palette groups are kept).
 */
export async function renderEditedVector(vectorUrl: string, editState: EditState): Promise<Blob> {
  const response = await fetch(vectorUrl);
  if (!response.ok) throw new Error(`Vector fetch failed: ${response.status}`);

  const source = new DOMParser().parseFromString(await response.text(), "image/svg+xml");
  const sourceRoot = source.documentElement;
  if (sourceRoot.localName !== "svg" || source.getElementsByTagName("parsererror").length > 0) {
    throw new Error("Vector is not a valid SVG");
  }
  const [, , sourceWidth, sourceHeight] = (sourceRoot.getAttribute("viewBox") ?? "").split(/\s+/).map(Number);
  if (!sourceWidth || !sourceHeight) throw new Error("Vector has no viewBox");

  const style = previewStyle(editState);
  const recolour = fillTransform(style);
  for (const path of Array.from(sourceRoot.querySelectorAll("path[fill]"))) {
    const fill = path.getAttribute("fill");
    if (fill?.startsWith("#")) path.setAttribute("fill", recolour(fill));
  }

  const { width, height, border, innerWidth, innerHeight } = exportFrame(style);
  const fit = coverFit(sourceWidth, sourceHeight, innerWidth, innerHeight);

  const document = new DOMParser().parseFromString(
    `<svg xmlns="${SVG_NS}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"/>`,
    "image/svg+xml",
  );
  const root = document.documentElement;

  // The source's own defs (the subject silhouette clip) plus the two crop boxes.
  const defs = svgElement(document, "defs", {});
  for (const sourceDefs of Array.from(sourceRoot.querySelectorAll(":scope > defs"))) {
    for (const child of Array.from(sourceDefs.childNodes)) defs.appendChild(document.importNode(child, true));
    sourceDefs.remove();
  }
  const frameClip = svgElement(document, "clipPath", { id: "frame" });
  frameClip.appendChild(svgElement(document, "rect", { x: border, y: border, width: innerWidth, height: innerHeight }));
  const layerClip = svgElement(document, "clipPath", { id: "layer" });
  layerClip.appendChild(svgElement(document, "rect", { width: innerWidth, height: innerHeight }));
  defs.append(frameClip, layerClip);
  root.appendChild(defs);

  if (editState.backgroundColor) {
    root.appendChild(svgElement(document, "rect", { width, height, fill: editState.backgroundColor }));
  }

  // Same nesting as the canvas export: cover-crop into the inner box, clip to it,
  // rotate about its centre, then clip to the frame's inner box.
  const frame = svgElement(document, "g", { "clip-path": "url(#frame)" });
  const rotated = svgElement(document, "g", {
    transform: `translate(${border + innerWidth / 2} ${border + innerHeight / 2}) rotate(${style.rotate}) scale(${style.fitScale}) translate(${-innerWidth / 2} ${-innerHeight / 2})`,
  });
  const layer = svgElement(document, "g", { "clip-path": "url(#layer)" });
  const artwork = svgElement(document, "g", { transform: `translate(${fit.x} ${fit.y}) scale(${fit.scale})` });
  for (const child of Array.from(sourceRoot.childNodes)) artwork.appendChild(document.importNode(child, true));
  layer.appendChild(artwork);
  rotated.appendChild(layer);
  frame.appendChild(rotated);
  root.appendChild(frame);

  if (border > 0) {
    root.appendChild(
      svgElement(document, "path", {
        d: `M0 0H${width}V${height}H0Z M${border} ${border}H${width - border}V${height - border}H${border}Z`,
        "fill-rule": "evenodd",
        fill: editState.borderColor,
      }),
    );
  }

  return new Blob([new XMLSerializer().serializeToString(document)], { type: "image/svg+xml" });
}
