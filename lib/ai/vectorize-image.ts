import { ColorMode, Hierarchical, PathSimplifyMode, readImage, vectorize, vectorizeRaw, type Config } from "@neplex/vectorizer";

import { buildVectorSvg } from "@/lib/vector/build-svg";
import { cleanTrace } from "@/lib/vector/clean-trace";
import { parseTracedSvg } from "@/lib/vector/parse-traced-svg";
import { subjectMask } from "@/lib/vector/subject-mask";

// Styles drawn as flat colour shapes trace cleanly into an editable vector.
// Watercolor (washes, texture) doesn't — it traces into 1,000+ fragments — so it
// stays raster-only. Code config, not the style table, until a second flat style
// makes a column worth asking for.
const VECTOR_STYLE_IDS = new Set(["simple"]);

export function isVectorStyle(styleId: string): boolean {
  return VECTOR_STYLE_IDS.has(styleId);
}

// Tuned on Simple-style output: ~80–220 shapes per image, visually
// indistinguishable from the PNG, ~0.1s. Stacked, not cutout: cutout punches
// holes for clusters it later drops, leaving stray gaps inside the subject.
// Stacked has no internal gaps; the silhouette clip supplies the real ones.
const TRACE_CONFIG: Config = {
  colorMode: ColorMode.Color,
  hierarchical: Hierarchical.Stacked,
  mode: PathSimplifyMode.Spline,
  colorPrecision: 6,
  filterSpeckle: 6,
  layerDifference: 24,
  cornerThreshold: 60,
  lengthThreshold: 4,
  maxIterations: 2,
  spliceThreshold: 45,
  pathPrecision: 2,
};

const SILHOUETTE_CONFIG: Config = { ...TRACE_CONFIG, colorMode: ColorMode.Binary, filterSpeckle: 4 };

/** Base64 PNG → clean, editable SVG (paper removed, palette-grouped, id'd shapes). */
export async function vectorizeImage(base64Png: string): Promise<string> {
  const png = Buffer.from(base64Png, "base64");
  const [traced, image] = await Promise.all([vectorize(png, TRACE_CONFIG), readImage(png)]);

  const mask = subjectMask(image.pixels, image.width, image.height);
  const silhouette = mask
    ? parseTracedSvg(await vectorizeRaw(mask, { width: image.width, height: image.height }, SILHOUETTE_CONFIG))
    : null;

  return buildVectorSvg(cleanTrace(parseTracedSvg(traced), silhouette));
}
