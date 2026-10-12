"use client"; // builds the transparent cutout in the browser and holds per-image loaded state

import NextImage from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { getCutout } from "@/lib/client/cutout";
import { previewStyle } from "@/lib/edit/preview-style";
import type { EditState } from "@/lib/validation/edit-state";

type IllustrationFrameProps = {
  imageUrl: string;
  vectorUrl?: string;
  prompt: string;
  editState: EditState;
};

// Keyed by imageUrl at the call site — a fresh mount per image gives each result
// its own fade-in (and cutout lookup) without effects to reset state.
export function IllustrationFrame({ imageUrl, vectorUrl, prompt, editState }: IllustrationFrameProps) {
  // Flat styles render their vector directly — it's already background-free,
  // so the in-browser paper removal is only for raster styles.
  const [artworkSrc, setArtworkSrc] = useState<string | null>(vectorUrl ?? null);
  const [loaded, setLoaded] = useState(false);
  const preview = previewStyle(editState);

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
    <div className="fit-container absolute inset-x-3 top-canvas-image-top-compact bottom-canvas-image-bottom-compact flex items-center justify-center lg:top-canvas-image-top lg:right-canvas-image-right lg:bottom-canvas-image-bottom lg:left-4">
      <div className="relative aspect-fit overflow-hidden border-solid" style={frameStyle}>
        <div className="absolute inset-0" style={{ transform: preview.transform }}>
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
