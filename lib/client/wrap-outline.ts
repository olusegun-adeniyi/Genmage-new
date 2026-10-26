import { buildWrapOutline, wrapOutlineSize } from "@/lib/edit/wrap-outline";

// The outline layer and how it sits against the artwork: it's the artwork's
// size plus `pad` px on every side, so the outline is never cut at the image edge.
export type WrapOutlineLayer = {
  src: string;
  artWidth: number;
  artHeight: number;
  pad: number;
};

// One outline per artwork per session — building it is ~100–200ms on a 1024²
// image, and the toggle (or any slider) re-renders the canvas constantly.
const outlines = new Map<string, Promise<WrapOutlineLayer | null>>();

async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.crossOrigin = "anonymous"; // Supabase serves CORS *, so the pixels stay readable
  image.src = src;
  await image.decode();
  return image;
}

async function buildOutline(artworkSrc: string): Promise<WrapOutlineLayer | null> {
  // Works for both the raster cutout and the flat-style SVG, drawn at natural size.
  const image = await loadImage(artworkSrc);
  const artWidth = image.naturalWidth;
  const artHeight = image.naturalHeight;
  const size = wrapOutlineSize(artWidth);
  const pad = Math.ceil(size.radius) + 2;

  const canvas = document.createElement("canvas");
  canvas.width = artWidth + pad * 2;
  canvas.height = artHeight + pad * 2;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;

  context.drawImage(image, pad, pad, artWidth, artHeight);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const outline = buildWrapOutline(pixels, canvas.width, canvas.height, size, artWidth * artHeight);
  if (!outline) return null;

  const layer = context.createImageData(canvas.width, canvas.height);
  layer.data.set(outline);
  context.putImageData(layer, 0, 0);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  return blob ? { src: URL.createObjectURL(blob), artWidth, artHeight, pad } : null;
}

/**
 * The wrap-outline layer for a transparent artwork, or null when the artwork
 * has no transparent margin (nothing to wrap) or processing failed. Never rejects.
 */
export function getWrapOutline(artworkSrc: string): Promise<WrapOutlineLayer | null> {
  let outline = outlines.get(artworkSrc);
  if (!outline) {
    outline = buildOutline(artworkSrc).catch(() => null);
    outlines.set(artworkSrc, outline);
  }
  return outline;
}
