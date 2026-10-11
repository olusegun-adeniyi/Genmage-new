"use client"; // pointer-capture drag (touch-aware), keyboard stepping, and measures itself for the label colour flip

import type { KeyboardEvent, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { slider } from "@/design/tokens";

type SliderRowProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  ticks: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function SliderRow({ label, value, min, max, unit = "", ticks, onChange, disabled = false }: SliderRowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  // null = no pointer down. For touch, `dragging` stays false until the gesture
  // proves horizontal — until then the browser may still claim it as a scroll.
  const gestureRef = useRef<{ startX: number; startY: number; dragging: boolean } | null>(null);
  const [size, setSize] = useState({ track: 0, label: 0 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(() => {
      setSize({ track: root.offsetWidth, label: labelRef.current?.offsetWidth ?? 0 });
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const pct = max === min ? 0 : (value - min) / (max - min);
  const fillPx = slider.fillMin + pct * (size.track - slider.fillMin);
  const labelOnFill = size.track > 0 && fillPx >= size.label - slider.labelFlipOffset;
  const valueOnFill = size.track > 0 && fillPx >= size.track - slider.valueInset - slider.labelFlipOffset;

  function commit(next: number) {
    const clamped = Math.round(Math.min(max, Math.max(min, next)));
    if (clamped !== value) onChange(clamped);
  }

  function valueFromPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    // The 5px inset on each side matches the fill's 10px minimum stub, so the
    // pointer lands where the handle will be drawn.
    const fraction = (event.clientX - rect.left - slider.fillMin / 2) / (rect.width - slider.fillMin);
    commit(min + fraction * (max - min));
  }

  function startDragging(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    gestureRef.current = { startX: event.clientX, startY: event.clientY, dragging: true };
    valueFromPointer(event);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (disabled) return;
    // Mouse/pen: press-to-set, as in the handoff. Touch: wait — a finger landing
    // on a slider while scrolling the Adjustments panel must not change it.
    if (event.pointerType !== "touch") {
      startDragging(event);
      return;
    }
    gestureRef.current = { startX: event.clientX, startY: event.clientY, dragging: false };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    if (!gesture) return;
    if (gesture.dragging) {
      valueFromPointer(event);
      return;
    }
    const dx = Math.abs(event.clientX - gesture.startX);
    const dy = Math.abs(event.clientY - gesture.startY);
    if (dx > slider.dragThreshold && dx > dy) startDragging(event);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    // A touch that never moved far enough to drag (and wasn't taken as a scroll,
    // which fires pointercancel instead) is a tap: set the value where it landed.
    if (gestureRef.current && !gestureRef.current.dragging) valueFromPointer(event);
    gestureRef.current = null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    const step = event.shiftKey ? 10 : 1;
    const keyActions: Record<string, () => void> = {
      ArrowRight: () => commit(value + step),
      ArrowUp: () => commit(value + step),
      ArrowLeft: () => commit(value - step),
      ArrowDown: () => commit(value - step),
      Home: () => commit(min),
      End: () => commit(max),
    };
    const action = keyActions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  }

  return (
    <div
      ref={rootRef}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value}${unit}`}
      aria-disabled={disabled || undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => (gestureRef.current = null)}
      onKeyDown={handleKeyDown}
      className={`relative flex h-8 w-full touch-pan-y items-center overflow-hidden rounded-md bg-field outline-none select-none focus-visible:shadow-field-focus ${
        disabled ? "cursor-default opacity-50" : "cursor-ew-resize"
      }`}
    >
      <div
        className="absolute top-0 left-0 h-8 rounded-md bg-slider-fill"
        style={{ width: `calc(${slider.fillMin}px + ${pct} * (100% - ${slider.fillMin}px))` }}
      >
        <div
          className={`absolute top-2.5 h-3 w-0.5 rounded-full bg-background ${
            pct < slider.handleHugThreshold ? "right-1" : "right-2.5"
          }`}
        />
      </div>
      <span
        ref={labelRef}
        className={`relative shrink-0 pr-2 pl-4 whitespace-nowrap transition-colors duration-120 ${
          labelOnFill ? "text-field" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
      <div className="relative flex min-w-0 flex-1 items-center gap-3 px-4">
        <div className="flex h-1 flex-1 items-center justify-between" aria-hidden="true">
          {Array.from({ length: ticks }, (_, index) => (
            <span key={index} className="size-1 shrink-0 rounded-full bg-tick" />
          ))}
        </div>
        <span
          className={`min-w-2.25 shrink-0 text-right whitespace-nowrap tabular-nums transition-colors duration-120 ${
            valueOnFill ? "text-field" : "text-foreground-soft"
          }`}
        >
          {value}
          {unit}
        </span>
      </div>
    </div>
  );
}
