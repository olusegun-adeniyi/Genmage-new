"use client"; // builds the transparent cutout in the browser and holds per-image loaded state

import NextImage from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { motion } from "@/design/tokens";
import { getCutout } from "@/lib/client/cutout";
import { getWrapOutline, type WrapOutlineLayer } from "@/lib/client/wrap-outline";
import type { CanvasZoom } from "@/lib/hooks/use-canvas-zoom";
import { previewStyle } from "@/lib/edit/preview-style";
import type { EditState } from "@/lib/validation/edit-state";

type IllustrationFrameProps = {
  imageUrl: string;
  vectorUrl?: string;
  prompt: string;
  editState: EditState;
  zoom: CanvasZoom; // view zoom/pan — owned by CanvasPanel so its control can sit by the theme toggle
};

// Keyed by imageUrl at the call site — a fresh mount per image gives each result
// its own fade-in (and cutout lookup) without effects to reset state.
export function IllustrationFrame({ imageUrl, vectorUrl, prompt, editState, zoom }: IllustrationFrameProps) {
  // Flat styles render their vector directly — it's already background-free,
  // so the in-browser paper removal is only for raster styles.
  const [artworkSrc, setArtworkSrc] = useState<string | null>(vectorUrl ?? null);
  const [loaded, setLoaded] = useState(false);
  const [outline, setOutline] = useState<WrapOutlineLayer | null>(null);
  const preview = previewStyle(editState);
  const wrapOutline = editState.wrapOutline;
  const { view, animate, canPan, dragging, attachArea, panHandlers } = zoom;

  useEffect(() => {
    if (vectorUrl) return;
    let cancelled = false;
    getCutout(imageUrl).then((src) => {
      if (!cancelled) setArtworkSrc(src);
    });
    return () => {
      cancelled = true;
    };
  }, [imageUrl, vectorUrl]);

  // Built on first use, then kept: toggling off just fades it out, so toggling
  // back on is instant (the outline itself is cached per artwork).
  useEffect(() => {
    if (!wrapOutline || !artworkSrc || outline) return;
    let cancelled = false;
    getWrapOutline(artworkSrc).then((layer) => {
      if (!cancelled) setOutline(layer);
    });
    return () => {
      cancelled = true;
    };
  }, [wrapOutline, artworkSrc, outline]);

  // --ratio feeds the aspect-fit utility (globals.css); the rest is user edit
  // data, not design tokens, so it's applied inline. With the paper removed, the
  // background colour shows through the whole illustration, not just around a
  // rotated one.
  const frameStyle = {
    "--ratio": preview.ratio,
    backgroundColor: editState.backgroundColor ?? undefined,
    borderColor: editState.borderColor,
    // Proportional to the frame width (the same min() the aspect-fit utility uses
    // for the width), so the border matches the export at any screen size.
    borderWidth: `calc(${preview.borderFraction} * min(100cqw, 100cqh * ${preview.ratio}))`,
    // View zoom/pan sits on the whole frame (border and background included) and
    // never touches the edit state or the export.
    transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
    // Buttons glide (default motion); gestures track the input directly.
    transition: animate ? `transform ${motion.durationDefault} ${motion.easingDefault}` : "none",
  } as CSSProperties;

  // The colour overlays are full rectangles — masked to the cutout's alpha so
  // Temperature/Tint/Highlight tint the illustration, not the empty space. The
  // soft-light blend sits on the masked group itself: a mask isolates its
  // children, so blending on the children would only see a transparent backdrop
  // and degrade to a flat wash. render-edited-image.ts composites the same way.
  const overlayMask: CSSProperties | undefined = artworkSrc
    ? {
        maskImage: `url("${artworkSrc}")`,
        WebkitMaskImage: `url("${artworkSrc}")`,
        maskSize: "cover",
        WebkitMaskSize: "cover",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }
    : undefined;

  return (
    // Nothing here clips: zoomed in, the illustration spreads across the whole
    // canvas (under the floating panels, like a design tool), and a wrap outline
    // can run past the frame's edge.
    <div
      ref={attachArea}
      {...panHandlers}
      className={`fit-container absolute inset-x-3 top-canvas-image-top-compact bottom-canvas-image-bottom-compact flex items-center justify-center select-none lg:top-canvas-image-top lg:right-canvas-image-right lg:bottom-canvas-image-bottom lg:left-4 ${
        canPan ? `touch-none ${dragging ? "cursor-grabbing" : "cursor-grab"}` : ""
      }`}
    >
      <div className="relative aspect-fit border-solid" style={frameStyle}>
        {/* A size container, so the outline below can size itself against the
            artwork's cover box with container units. */}
        <div className="fit-container absolute inset-0" style={{ transform: preview.transform }}>
          {/* The sticker edge sits behind the artwork and outside its colour
              filter and overlays, so edits never tint it. It's the artwork plus
              `pad` on every side: centred on the artwork's object-cover box
              (max(100cqw, 100cqh × aspect)) and grown by the same pad. */}
          {outline && (
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute top-1/2 left-1/2 -translate-1/2 transition-opacity duration-150 ease-out ${
                wrapOutline && loaded ? "opacity-100" : "opacity-0"
              }`}
              style={{
                width: `calc(max(100cqw, 100cqh * ${outline.artWidth / outline.artHeight}) * ${
                  (outline.artWidth + outline.pad * 2) / outline.artWidth
                })`,
                aspectRatio: `${outline.artWidth + outline.pad * 2} / ${outline.artHeight + outline.pad * 2}`,
              }}
            >
              <NextImage src={outline.src} alt="" fill unoptimized className="object-fill" />
            </div>
          )}
          {artworkSrc && (
            <NextImage
              src={artworkSrc}
              alt={prompt}
              fill
              sizes="(min-width: 1024px) 50vw, (min-width: 640px) 576px, 100vw"
              unoptimized={Boolean(vectorUrl)} // next/image won't optimise SVG; serve it as-is
              onLoad={() => setLoaded(true)}
              style={{ filter: preview.filter }}
              className={`object-cover transition-opacity duration-400 ease-out ${loaded ? "opacity-100" : "opacity-0"}`}
            />
          )}
          <div className="absolute inset-0 mix-blend-soft-light" style={overlayMask}>
            <div className="absolute inset-0 bg-edit-warm" style={{ opacity: preview.warmOpacity }} />
            <div className="absolute inset-0 bg-edit-tint" style={{ opacity: preview.tintOpacity }} />
            <div className="absolute inset-0 bg-edit-highlight" style={{ opacity: preview.highlightOpacity }} />
          </div>
        </div>
      </div>
    </div>
  );
}
