import { applyColorFilters } from "@/lib/edit/color-filters";
import { coverFit, exportFrame } from "@/lib/edit/export-frame";
import { overlayLayers } from "@/lib/edit/fill-colour";
import { previewStyle } from "@/lib/edit/preview-style";
import type { EditState } from "@/lib/validation/edit-state";

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2d canvas unavailable");
  return { canvas, context };
}

// An <img> rather than createImageBitmap: it decodes SVG (flat-style vectors)
// as well as PNG/object URLs in every browser, and rasterises the vector at
// whatever size it's drawn. crossOrigin keeps Supabase images untainted (CORS *).
async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = src;
  await image.decode();
  return image;
}

// object-fit: cover — the same crop the preview's <Image className="object-cover"> makes.
function drawCover(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
  const fit = coverFit(image.naturalWidth, image.naturalHeight, width, height);
  context.drawImage(image, fit.x, fit.y, image.naturalWidth * fit.scale, image.naturalHeight * fit.scale);
}

/**
 * Renders an illustration with its edits applied, mirroring IllustrationFrame:
 * a frame at the chosen aspect ratio, background colour behind, the image
 * cover-cropped inside the border, colour-filtered, overlay-tinted (masked to
 * the illustration's alpha), rotated about its centre, clipped to the frame.
 */
export async function renderEditedImage(imageSrc: string, editState: EditState, outlineSrc?: string | null): Promise<Blob> {
  const style = previewStyle(editState);
  const image = await loadImage(imageSrc);

  const { width, height, border, innerWidth, innerHeight } = exportFrame(style);

  // 1. The illustration layer: cover crop, colour filters, then overlays.
  const layer = createCanvas(innerWidth, innerHeight);
  drawCover(layer.context, image, innerWidth, innerHeight);
  const pixels = layer.context.getImageData(0, 0, innerWidth, innerHeight);
  applyColorFilters(pixels.data, style);
  layer.context.putImageData(pixels, 0, 0);

  const overlays = overlayLayers(style);
  if (overlays.some(([, opacity]) => opacity > 0)) {
    // Mirrors the preview: stack the tints normally, mask them to the
    // illustration's alpha, then soft-light the result onto the illustration once.
    const tint = createCanvas(innerWidth, innerHeight);
    for (const [color, opacity] of overlays) {
      if (opacity <= 0) continue;
      tint.context.globalAlpha = opacity;
      tint.context.fillStyle = color;
      tint.context.fillRect(0, 0, innerWidth, innerHeight);
    }
    tint.context.globalCompositeOperation = "destination-in";
    tint.context.globalAlpha = 1;
    drawCover(tint.context, image, innerWidth, innerHeight);

    layer.context.globalCompositeOperation = "soft-light";
    layer.context.drawImage(tint.canvas, 0, 0);
    layer.context.globalCompositeOperation = "source-over";
  }

  // The wrap outline goes underneath, after the colour work, so it stays white —
  // the same layering as the preview.
  if (outlineSrc) {
    const outline = await loadImage(outlineSrc);
    layer.context.globalCompositeOperation = "destination-over";
    drawCover(layer.context, outline, innerWidth, innerHeight);
    layer.context.globalCompositeOperation = "source-over";
  }

  // 2. The frame: background, rotated layer clipped to the inner box, border.
  const frame = createCanvas(width, height);
  const { context } = frame;
  if (editState.backgroundColor) {
    context.fillStyle = editState.backgroundColor;
    context.fillRect(0, 0, width, height);
  }

  context.save();
  context.beginPath();
  context.rect(border, border, innerWidth, innerHeight);
  context.clip();
  context.translate(border + innerWidth / 2, border + innerHeight / 2);
  context.rotate((style.rotate * Math.PI) / 180);
  context.scale(style.fitScale, style.fitScale);
  context.drawImage(layer.canvas, -innerWidth / 2, -innerHeight / 2);
  context.restore();

  if (border > 0) {
    context.fillStyle = editState.borderColor;
    context.beginPath();
    context.rect(0, 0, width, height);
    context.rect(border, border, innerWidth, innerHeight);
    context.fill("evenodd");
  }

  const blob = await new Promise<Blob | null>((resolve) => frame.canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("PNG encode failed");
  return blob;
}
