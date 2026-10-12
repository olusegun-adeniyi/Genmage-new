import { colors } from "@/design/tokens";
import { applyColorFilters } from "@/lib/edit/color-filters";
import { previewStyle } from "@/lib/edit/preview-style";
import type { EditState } from "@/lib/validation/edit-state";

// PRD Phase E #39: exports are 1024px on the longest edge.
const EXPORT_LONG_EDGE = 1024;

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2d canvas unavailable");
  return { canvas, context };
}

// object-fit: cover — the same crop the preview's <Image className="object-cover"> makes.
function drawCover(context: CanvasRenderingContext2D, image: ImageBitmap, width: number, height: number) {
  const scale = Math.max(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

/**
 * Renders an illustration with its edits applied, mirroring IllustrationFrame:
 * a frame at the chosen aspect ratio, background colour behind, the image
 * cover-cropped inside the border, colour-filtered, overlay-tinted (masked to
 * the illustration's alpha), rotated about its centre, clipped to the frame.
 */
export async function renderEditedImage(imageSrc: string, editState: EditState): Promise<Blob> {
  const style = previewStyle(editState);
  const response = await fetch(imageSrc);
  const image = await createImageBitmap(await response.blob());

  const width = style.ratio >= 1 ? EXPORT_LONG_EDGE : Math.round(EXPORT_LONG_EDGE * style.ratio);
  const height = style.ratio >= 1 ? Math.round(EXPORT_LONG_EDGE / style.ratio) : EXPORT_LONG_EDGE;
  const border = Math.round(style.borderFraction * width);
  const innerWidth = width - border * 2;
  const innerHeight = height - border * 2;

  // 1. The illustration layer: cover crop, colour filters, then overlays.
  const layer = createCanvas(innerWidth, innerHeight);
  drawCover(layer.context, image, innerWidth, innerHeight);
  const pixels = layer.context.getImageData(0, 0, innerWidth, innerHeight);
  applyColorFilters(pixels.data, style);
  layer.context.putImageData(pixels, 0, 0);

  const overlays: [string, number][] = [
    [colors.editWarm, style.warmOpacity],
    [colors.editTint, style.tintOpacity],
    [colors.editHighlight, style.highlightOpacity],
  ];
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

  image.close();
  const blob = await new Promise<Blob | null>((resolve) => frame.canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("PNG encode failed");
  return blob;
}
