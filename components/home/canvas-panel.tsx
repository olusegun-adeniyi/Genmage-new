import type { ReactNode, Ref } from "react";

import { ActionBar } from "@/components/canvas/action-bar";
import { IllustrationFrame } from "@/components/canvas/illustration-frame";
import { ZoomControl } from "@/components/canvas/zoom-control";
import { MountainsIcon } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useCanvasZoom } from "@/lib/hooks/use-canvas-zoom";
import type { HistoryItem } from "@/lib/hooks/use-history";
import { ASPECT_VALUES, DEFAULT_EDIT_STATE, type AspectRatio } from "@/lib/validation/edit-state";

type CanvasPanelProps = {
  ref?: Ref<HTMLElement>;
  generation: HistoryItem | null;
  isGenerating: boolean;
  generatingStyleName: string;
  onAspectChange: (value: AspectRatio) => void;
  shareCopied: boolean;
  onShare: () => void;
  onExport: () => void;
  onExportVector: () => void;
  // The Adjustments panel. ≥ lg it floats in the canvas's top-right corner;
  // stacked, it sits below the canvas.
  controls: ReactNode;
};

export function CanvasPanel({
  ref,
  generation,
  isGenerating,
  generatingStyleName,
  onAspectChange,
  shareCopied,
  onShare,
  onExport,
  onExportVector,
  controls,
}: CanvasPanelProps) {
  const showImage = generation !== null && !isGenerating;
  // Each illustration opens fitted; the aspect ratio sizes the frame for pan limits.
  const aspectRatio = generation?.editState.aspectRatio ?? DEFAULT_EDIT_STATE.aspectRatio;
  const zoom = useCanvasZoom(showImage ? generation.imageUrl : null, ASPECT_VALUES[aspectRatio]);
  const status = isGenerating
    ? `Generating ${generatingStyleName.toLowerCase()} illustration…`
    : showImage
      ? ""
      : "Illustration appears here";

  return (
    // ≥ lg this section *is* the canvas surface (fills the row). Stacked, it's
    // just a column: the stage below carries the canvas surface and its own
    // proportions, with the controls after it.
    <section
      ref={ref}
      aria-label="Canvas"
      className="relative flex min-w-0 flex-col gap-3 lg:block lg:overflow-hidden lg:rounded-2xl lg:border lg:border-border lg:bg-canvas"
    >
      <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-border bg-canvas sm:aspect-square lg:absolute lg:inset-0 lg:aspect-auto lg:rounded-none lg:border-0 lg:bg-transparent">
        {/* Top-left corner; the illustration area starts below it (canvasImageTop). */}
        <div className="absolute top-3 left-3 z-10 flex gap-2 lg:top-4 lg:left-4">
          <ThemeToggle />
          <ZoomControl
            zoom={zoom.view.zoom}
            disabled={!showImage}
            onZoomOut={zoom.zoomOut}
            onZoomIn={zoom.zoomIn}
            onReset={zoom.reset}
          />
        </div>
        {showImage && (
          <IllustrationFrame
            key={generation.imageUrl}
            imageUrl={generation.imageUrl}
            vectorUrl={generation.vectorUrl}
            prompt={generation.prompt}
            editState={generation.editState}
            zoom={zoom}
          />
        )}
        {/* Centred in the illustration area, not the whole canvas. The status line
            stays mounted so screen readers hear the transition into "Generating…";
            the icon only marks the empty canvas. No gap: the MingCute glyph already
            carries ~13px of empty space below it inside its 24-unit box. */}
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-0 px-6 lg:right-canvas-image-right lg:left-4">
          {!showImage && !isGenerating && <MountainsIcon className="size-20 text-icon-muted" />}
          <p role="status" aria-live="polite" className="text-center text-pretty text-muted-foreground">
            {status}
          </p>
        </div>
        <ActionBar
          hasGeneration={showImage}
          aspectRatio={aspectRatio}
          onAspectChange={onAspectChange}
          shareCopied={shareCopied}
          onShare={onShare}
          onExport={onExport}
          onExportVector={generation?.vectorUrl ? onExportVector : undefined}
        />
      </div>
      {/* Spans the canvas height (16px padding top and bottom) so the panel can cap
          at it and scroll on short viewports; the empty space below the panel
          passes clicks through. */}
      <div className="lg:pointer-events-none lg:absolute lg:top-4 lg:right-4 lg:bottom-4 lg:flex lg:items-start">
        <div className="lg:pointer-events-auto lg:flex lg:max-h-full">{controls}</div>
      </div>
    </section>
  );
}
