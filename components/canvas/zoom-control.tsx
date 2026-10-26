import { Minus, Plus } from "lucide-react";

import { canvasZoom } from "@/design/tokens";

type ZoomControlProps = {
  zoom: number; // 1 = fitted
  disabled: boolean;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onReset: () => void;
};

const BUTTON =
  "flex h-7.5 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-strong transition-colors duration-150 ease-out hover:bg-field focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent";

// Same 40px pill as the theme toggle beside it. The percentage is relative to the
// fitted view (fit = 100%) and doubles as the reset button.
export function ZoomControl({ zoom, disabled, onZoomOut, onZoomIn, onReset }: ZoomControlProps) {
  const percent = Math.round(zoom * 100);

  return (
    <div role="group" aria-label="Zoom" className="flex h-10 shrink-0 items-center gap-0.5 rounded-full border border-border bg-background p-1">
      <button type="button" aria-label="Zoom out" disabled={disabled || zoom <= canvasZoom.min} onClick={onZoomOut} className={`${BUTTON} w-7.5`}>
        <Minus className="size-4" strokeWidth={1.5} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label={`Zoom ${percent}%. Reset to fit`}
        title="Reset to fit"
        disabled={disabled}
        onClick={onReset}
        className={`${BUTTON} w-12`}
      >
        {percent}%
      </button>
      <button type="button" aria-label="Zoom in" disabled={disabled || zoom >= canvasZoom.max} onClick={onZoomIn} className={`${BUTTON} w-7.5`}>
        <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}
