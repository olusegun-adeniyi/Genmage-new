"use client"; // owns open state and option focus

import { ChevronDown } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useDismiss } from "@/lib/hooks/use-dismiss";
import { ASPECT_LABELS, ASPECT_RATIOS, type AspectRatio } from "@/lib/validation/edit-state";

type AspectMenuProps = {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
  disabled?: boolean;
};

export function AspectMenu({ value, onChange, disabled }: AspectMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback(() => setOpen(false), []);
  const focusTrigger = useCallback(() => triggerRef.current?.focus(), []);
  useDismiss(open, containerRef, close, focusTrigger);

  useEffect(() => {
    if (open) optionRefs.current[ASPECT_RATIOS.indexOf(value)]?.focus();
  }, [open, value]);

  function pick(next: AspectRatio) {
    onChange(next);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const current = optionRefs.current.findIndex((option) => option === document.activeElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    const next = (current + step + ASPECT_RATIOS.length) % ASPECT_RATIOS.length;
    optionRefs.current[next]?.focus();
  }

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <Button
        ref={triggerRef}
        variant="toolbar"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="w-full gap-1"
      >
        {ASPECT_LABELS[value]}
        <ChevronDown className="size-4" strokeWidth={1.5} aria-hidden="true" />
      </Button>
      {open && (
        // Opens upward — the action bar sits at the bottom of the canvas.
        <div
          role="listbox"
          aria-label="Aspect ratio"
          onKeyDown={moveFocus}
          className="absolute -right-1.5 bottom-12.5 -left-1.5 z-10 flex flex-col gap-0.5 rounded-lg bg-background p-1 shadow-menu"
        >
          {ASPECT_RATIOS.map((ratio, index) => (
            <button
              key={ratio}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="option"
              aria-selected={ratio === value}
              onClick={() => pick(ratio)}
              className={`flex h-8 cursor-pointer items-center rounded-sm px-2 text-left text-foreground transition-colors duration-150 ease-out hover:bg-field focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground ${
                ratio === value ? "bg-field" : "bg-transparent"
              }`}
            >
              {ASPECT_LABELS[ratio]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
