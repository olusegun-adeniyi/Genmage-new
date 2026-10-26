import { buildWrapOutline } from "@/lib/edit/wrap-outline";

// One outline per artwork per session — building it is ~100–200ms on a 1024²
// image, and the toggle (or any slider) re-renders the canvas constantly.
const outlines = new Map<string, Promise<string | null>>();

async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.crossOrigin = "anonymous"; // Supabase serves CORS *, so the pixels stay readable
  image.src = src;
  await image.decode();
  return image;
}

async function buildOutline(artworkSrc: string): Promise<string | null> {
  // Works for both the raster cutout and the flat-style SVG: either is drawn at
  // its natural size, so the outline lines up 1:1 when drawn over the same box.
  const image = await loadImage(artworkSrc);
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;

  context.drawImage(image, 0, 0, width, height);
  const outline = buildWrapOutline(context.getImageData(0, 0, width, height).data, width, height);
  if (!outline) return null;

  const layer = context.createImageData(width, height);
  layer.data.set(outline);
  context.putImageData(layer, 0, 0);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  return blob ? URL.createObjectURL(blob) : null;
}

/**
 * Object URL of the wrap-outline layer for a transparent artwork, or null when
 * the artwork has no transparent margin (nothing to wrap) or processing failed.
 * Never rejects.
 */
export function getWrapOutline(artworkSrc: string): Promise<string | null> {
  let outline = outlines.get(artworkSrc);
  if (!outline) {
    outline = buildOutline(artworkSrc).catch(() => null);
    outlines.set(artworkSrc, outline);
  }
  return outline;
}
