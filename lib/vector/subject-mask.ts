import { removePaperBackground } from "@/lib/edit/remove-paper-background";

// The subject's silhouette as a black-on-white mask, from the same paper-removal
// flood fill the browser uses for raster styles. Traced, it becomes the clip that
// gives a stacked vector its true see-through gaps (between legs, under handles).
// Returns null for full-bleed images with no paper margin — nothing to clip.
const SUBJECT_ALPHA_THRESHOLD = 128;

export function subjectMask(rgba: Uint8Array, width: number, height: number): Buffer | null {
  const pixels = new Uint8ClampedArray(rgba); // copy — the caller's pixels stay intact
  if (!removePaperBackground(pixels, width, height)) return null;

  const mask = Buffer.alloc(width * height * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    const value = pixels[i + 3] >= SUBJECT_ALPHA_THRESHOLD ? 0 : 255;
    mask[i] = value;
    mask[i + 1] = value;
    mask[i + 2] = value;
    mask[i + 3] = 255;
  }
  return mask;
}
