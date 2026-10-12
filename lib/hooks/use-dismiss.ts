"use client"; // document-level pointer and key listeners

import { useEffect, type RefObject } from "react";

/**
 * Closes an open popover on a pointer press outside `containerRef` or on Escape.
 * `onEscape` runs only for Escape — the place to return focus to the trigger.
 */
export function useDismiss(
  open: boolean,
  containerRef: RefObject<HTMLElement | null>,
  close: () => void,
  onEscape?: () => void,
) {
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) close();
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      close();
      onEscape?.();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, containerRef, close, onEscape]);
}
