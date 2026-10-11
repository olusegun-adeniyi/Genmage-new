import { removePaperBackground } from "@/lib/edit/remove-paper-background";

// One cutout per image per session — processing a 1024² image is ~50–100ms, and
// slider edits re-render the canvas constantly. Keyed by the original URL.
const cutouts = new Map<string, Promise<string>>();

async function buildCutout(imageUrl: string): Promise<string> {
  // Supabase Storage serves `access-control-allow-origin: *`, so the pixels are
  // readable; without that the canvas would be tainted and this would throw.
  const response = await fetch(imageUrl, { mode: "cors" });
  const bitmap = await createImageBitmap(await response.blob());

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2d canvas unavailable");

  context.drawImage(bitmap, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  if (!removePaperBackground(pixels.data, canvas.width, canvas.height)) return imageUrl;
  context.putImageData(pixels, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("PNG encode failed");
  return URL.createObjectURL(blob);
}

/**
 * Resolves to an object URL of the illustration with its paper background made
 * transparent — or the original URL if there was no paper margin to remove or
 * processing failed. Never rejects: the original image is always a safe fallback.
 */
export function getCutout(imageUrl: string): Promise<string> {
  let cutout = cutouts.get(imageUrl);
  if (!cutout) {
    cutout = buildCutout(imageUrl).catch(() => imageUrl);
    cutouts.set(imageUrl, cutout);
  }
  return cutout;
}
