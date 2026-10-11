import { getCutout } from "@/lib/client/cutout";
import { patchEditState } from "@/lib/client/generation-api";
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

// Downloads the transparent cutout (paper removed, same as the canvas shows).
// Slider edits, border and background aren't baked in yet — that composite export
// is PRD Phase E item 39.
export async function downloadGeneration(generation: HistoryItem): Promise<boolean> {
  await patchEditState(generation.slug, generation.editState);

  try {
    const response = await fetch(await getCutout(generation.imageUrl));
    const objectUrl = URL.createObjectURL(await response.blob());
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
