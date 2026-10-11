"use client"; // builds the transparent cutout in the browser and holds per-image loaded state

import NextImage from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { getCutout } from "@/lib/client/cutout";
import { previewStyle } from "@/lib/edit/preview-style";
import type { EditState } from "@/lib/validation/edit-state";

type IllustrationFrameProps = {
  imageUrl: string;
  prompt: string;
  editState: EditState;
};

// Keyed by imageUrl at the call site — a fresh mount per image gives each result
// its own fade-in (and cutout lookup) without effects to reset state.
export function IllustrationFrame({ imageUrl, prompt, editState }: IllustrationFrameProps) {
  const [cutoutSrc, setCutoutSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const preview = previewStyle(editState);

  useEffect(() => {
    let cancelled = false;
    getCutout(imageUrl).then((src) => {
      if (!cancelled) setCutoutSrc(src);
    });
    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  // --ratio feeds the aspect-fit utility (globals.css); the rest is user edit
  // data, not design tokens, so it's applied inline. With the paper removed, the
  // background colour shows through the whole illustration, not just around a
  // rotated one.
  const frameStyle = {
    "--ratio": preview.ratio,
    backgroundColor: editState.backgroundColor ?? undefined,
    borderColor: editState.borderColor,
    borderWidth: editState.borderWeight,
  } as CSSProperties;

  // The colour overlays are full rectangles — masked to the cutout's alpha so
  // Temperature/Tint/Highlight tint the illustration, not the empty space.
  const overlayMask: CSSProperties | undefined = cutoutSrc
    ? {
        maskImage: `url("${cutoutSrc}")`,
        WebkitMaskImage: `url("${cutoutSrc}")`,
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
          {cutoutSrc && (
            <NextImage
              src={cutoutSrc}
              alt={prompt}
              fill
              sizes="(min-width: 1024px) 50vw, (min-width: 640px) 576px, 100vw"
              onLoad={() => setLoaded(true)}
              style={{ filter: preview.filter }}
              className={`object-cover transition-opacity duration-400 ease-out ${loaded ? "opacity-100" : "opacity-0"}`}
            />
          )}
          <div className="absolute inset-0" style={overlayMask}>
            <div className="absolute inset-0 bg-edit-warm mix-blend-soft-light" style={{ opacity: preview.warmOpacity }} />
            <div className="absolute inset-0 bg-edit-tint mix-blend-soft-light" style={{ opacity: preview.tintOpacity }} />
            <div
              className="absolute inset-0 bg-edit-highlight mix-blend-soft-light"
              style={{ opacity: preview.highlightOpacity }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
