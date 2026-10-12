import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AspectRatio } from "@/lib/validation/edit-state";

import { AspectMenu } from "./aspect-menu";
import { ExportMenu } from "./export-menu";

type ActionBarProps = {
  hasGeneration: boolean;
  aspectRatio: AspectRatio;
  onAspectChange: (value: AspectRatio) => void;
  shareCopied: boolean;
  onShare: () => void;
  onExport: () => void;
  onExportVector?: () => void; // flat-style generations with an editable vector
};

export function ActionBar({
  hasGeneration,
  aspectRatio,
  onAspectChange,
  shareCopied,
  onShare,
  onExport,
  onExportVector,
}: ActionBarProps) {
  return (
    <div className="absolute inset-x-3 bottom-3 mx-auto flex h-12 max-w-action-bar-width gap-1.5 rounded-lg bg-toolbar p-1.5 lg:right-canvas-image-right lg:bottom-4 lg:left-4">
      <AspectMenu value={aspectRatio} onChange={onAspectChange} disabled={!hasGeneration} />
      <Button variant="toolbar" disabled={!hasGeneration} onClick={onShare} className="w-share-button gap-2">
        <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
        <span aria-live="polite">{shareCopied ? "Copied" : "Share"}</span>
      </Button>
      <ExportMenu disabled={!hasGeneration} onExportPng={onExport} onExportSvg={onExportVector} />
    </div>
  );
}
