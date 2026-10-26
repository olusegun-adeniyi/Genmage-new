import { getCutout } from "@/lib/client/cutout";
import { patchEditState } from "@/lib/client/generation-api";
import { renderEditedImage } from "@/lib/client/render-edited-image";
import { renderEditedVector } from "@/lib/client/render-edited-vector";
import { getWrapOutline } from "@/lib/client/wrap-outline";
import type { HistoryItem } from "@/lib/hooks/use-history";

// Share and Export both persist the current edit state first (PRD §7) — the
// permalink should show what the person was looking at when they shared it.

export async function copyPermalink(generation: HistoryItem): Promise<boolean> {
  const origin = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  await patchEditState(generation.slug, generation.editState);

  try {
    await navigator.clipboard.writeText(`${origin}/g/${generation.slug}`);
    return true;
  } catch {
    return false;
  }
}

// Downloads exactly what the canvas shows: the paper-removed cutout with every
// Illustration depth edit, the aspect crop, border and background baked in
// (PRD Phase E #39). Transparent where there's no background colour.
export async function downloadGeneration(generation: HistoryItem): Promise<boolean> {
  await patchEditState(generation.slug, generation.editState);

  try {
    // Flat styles render from their vector (crisp at any size, already
    // background-free); raster styles from the paper-removed cutout.
    const source = generation.vectorUrl ?? (await getCutout(generation.imageUrl));
    const outline = generation.editState.wrapOutline ? await getWrapOutline(source) : null;
    saveBlob(await renderEditedImage(source, generation.editState, outline), `genmage-${generation.slug}.png`);
    return true;
  } catch {
    return false;
  }
}

// The editable vector with the same edits baked in as the PNG — colour edits
// into each shape's fill, crop/rotate/border/background as plain SVG geometry.
export async function downloadVector(generation: HistoryItem): Promise<boolean> {
  if (!generation.vectorUrl) return false;
  await patchEditState(generation.slug, generation.editState);

  try {
    saveBlob(await renderEditedVector(generation.vectorUrl, generation.editState), `genmage-${generation.slug}.svg`);
    return true;
  } catch {
    return false;
  }
}

function saveBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}
