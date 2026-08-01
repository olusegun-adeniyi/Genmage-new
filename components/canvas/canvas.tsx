import { Image as ImageIcon } from "lucide-react";
import type { ReactNode } from "react";

import { CanvasControls } from "./canvas-controls";

type CanvasProps = {
  children?: ReactNode;
  className?: string;
};

export function Canvas({ children, className }: CanvasProps) {
  return (
    <div
      className={`relative aspect-square rounded-lg bg-surface-light ${className ?? ""}`}
    >
      <CanvasControls />
      {children ?? (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
          <ImageIcon className="size-8" strokeWidth={1.5} />
          <p className="text-sm">Illustration appears here...</p>
        </div>
      )}
    </div>
  );
}
