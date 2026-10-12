import { getCutout } from "@/lib/client/cutout";
import { patchEditState } from "@/lib/client/generation-api";
import { renderEditedImage } from "@/lib/client/render-edited-image";
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
    const blob = await renderEditedImage(await getCutout(generation.imageUrl), generation.editState);
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `genmage-${generation.slug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
    return true;
  } catch {
    return false;
  }
}
