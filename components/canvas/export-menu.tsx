"use client"; // owns open state and menu keyboard focus

import { Download } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useDismiss } from "@/lib/hooks/use-dismiss";

type ExportMenuProps = {
  disabled: boolean;
  onExportPng: () => void;
  // Present only for flat-style generations that have an editable vector.
  onExportSvg?: () => void;
};

const ITEMS = [
  { key: "png", label: "PNG image" },
  { key: "svg", label: "SVG vector" },
] as const;

// Raster generations export straight to PNG (one click, as before). Vector ones
// open a small upward menu so the SVG is one step away without crowding the bar.
export function ExportMenu({ disabled, onExportPng, onExportSvg }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const close = useCallback(() => setOpen(false), []);
  const focusTrigger = useCallback(() => triggerRef.current?.focus(), []);
  useDismiss(open, containerRef, close, focusTrigger);

  useEffect(() => {
    if (open) itemRefs.current[0]?.focus();
  }, [open]);

  function choose(key: (typeof ITEMS)[number]["key"]) {
    setOpen(false);
    triggerRef.current?.focus();
    if (key === "svg") onExportSvg?.();
    else onExportPng();
  }

  function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const current = itemRefs.current.findIndex((item) => item === document.activeElement);
    const next = (current + (event.key === "ArrowDown" ? 1 : -1) + ITEMS.length) % ITEMS.length;
    itemRefs.current[next]?.focus();
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <Button
        ref={triggerRef}
        variant="toolbar"
        disabled={disabled}
        aria-haspopup={onExportSvg ? "menu" : undefined}
        aria-expanded={onExportSvg ? open : undefined}
        onClick={() => (onExportSvg ? setOpen((current) => !current) : onExportPng())}
        className="w-export-button gap-1.5"
      >
        Export
        <Download className="size-4" strokeWidth={1.5} aria-hidden="true" />
      </Button>
      {open && (
        <div
          role="menu"
          aria-label="Export format"
          onKeyDown={moveFocus}
          className="absolute right-0 bottom-12.5 z-10 flex w-36 flex-col gap-0.5 rounded-lg bg-background p-1 shadow-menu"
        >
          {ITEMS.map((item, index) => (
            <button
              key={item.key}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              type="button"
              role="menuitem"
              onClick={() => choose(item.key)}
              className="flex h-8 cursor-pointer items-center rounded-sm px-2 text-left text-foreground transition-colors duration-150 ease-out hover:bg-field focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
