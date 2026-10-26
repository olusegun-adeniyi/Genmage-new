"use client"; // pointer, wheel and Safari gesture listeners on the canvas

import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { canvasZoom } from "@/design/tokens";

export type CanvasView = { zoom: number; x: number; y: number }; // x/y: pan in CSS px from centre

const FIT: CanvasView = { zoom: 1, x: 0, y: 0 };

// Safari's trackpad pinch arrives as non-standard GestureEvents, not Ctrl-wheel.
type GestureEventLike = Event & { scale: number; clientX: number; clientY: number };
const isGestureEvent = (event: Event): event is GestureEventLike => "scale" in event && "clientX" in event;

const clampZoom = (zoom: number) => Math.min(canvasZoom.max, Math.max(canvasZoom.min, zoom));

/**
 * Keeps at least minVisiblePx of the illustration inside the area, whatever the
 * pan. The frame is the aspect-fit box — the same min() the aspect-fit utility uses.
 */
function clampPan(view: CanvasView, area: DOMRect, ratio: number): CanvasView {
  const frameWidth = Math.min(area.width, area.height * ratio) * view.zoom;
  const frameHeight = frameWidth / ratio;
  const limitX = Math.max(0, (frameWidth + area.width) / 2 - canvasZoom.minVisiblePx);
  const limitY = Math.max(0, (frameHeight + area.height) / 2 - canvasZoom.minVisiblePx);
  return {
    zoom: view.zoom,
    x: Math.min(limitX, Math.max(-limitX, view.x)),
    y: Math.min(limitY, Math.max(-limitY, view.y)),
  };
}

// Zoom by `factor` keeping the point under (clientX, clientY) fixed on screen.
function zoomAround(view: CanvasView, factor: number, area: DOMRect, clientX: number, clientY: number): CanvasView {
  const zoom = clampZoom(view.zoom * factor);
  const applied = zoom / view.zoom;
  const px = clientX - (area.left + area.width / 2);
  const py = clientY - (area.top + area.height / 2);
  return { zoom, x: px - (px - view.x) * applied, y: py - (py - view.y) * applied };
}

/**
 * View zoom and pan for the illustration area. Resets whenever `resetKey`
 * changes (a new illustration opens at fit). `ratio` is the frame's w:h.
 */
export function useCanvasZoom(resetKey: string | null, ratio: number) {
  const [state, setState] = useState({ key: resetKey, view: FIT, animate: false });
  const view = state.key === resetKey ? state.view : FIT;
  const animate = state.key === resetKey && state.animate;

  const [area, setArea] = useState<HTMLDivElement | null>(null);
  // Latest values for the native listeners and handlers, synced after each render.
  const viewRef = useRef(view);
  const ratioRef = useRef(ratio);
  const keyRef = useRef(resetKey);
  useLayoutEffect(() => {
    viewRef.current = view;
    ratioRef.current = ratio;
    keyRef.current = resetKey;
  });

  const commit = useCallback(
    (next: CanvasView, animated: boolean) => {
      const bounds = area?.getBoundingClientRect();
      setState({ key: keyRef.current, view: bounds ? clampPan(next, bounds, ratioRef.current) : next, animate: animated });
    },
    [area],
  );

  // Buttons zoom around the centre of the area, animated.
  const zoomBy = useCallback(
    (factor: number) => {
      const bounds = area?.getBoundingClientRect();
      if (!bounds) return;
      commit(zoomAround(viewRef.current, factor, bounds, bounds.left + bounds.width / 2, bounds.top + bounds.height / 2), true);
    },
    [area, commit],
  );

  // Gestures. Native listeners: React's wheel handler is passive, so it can't
  // stop the browser zooming the whole page on pinch.
  useEffect(() => {
    if (!area) return;
    let gestureBase = 1;

    function handleWheel(event: WheelEvent) {
      if (!area) return;
      const bounds = area.getBoundingClientRect();
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        commit(zoomAround(viewRef.current, Math.exp(-event.deltaY * canvasZoom.wheelSensitivity), bounds, event.clientX, event.clientY), false);
      } else if (viewRef.current.zoom > 1) {
        // Zoomed in, a plain scroll pans; at fit or smaller it scrolls the page as usual.
        event.preventDefault();
        commit({ ...viewRef.current, x: viewRef.current.x - event.deltaX, y: viewRef.current.y - event.deltaY }, false);
      }
    }
    function handleGestureStart(event: Event) {
      event.preventDefault();
      gestureBase = viewRef.current.zoom;
    }
    function handleGestureChange(event: Event) {
      if (!area || !isGestureEvent(event)) return;
      event.preventDefault();
      const target = clampZoom(gestureBase * event.scale);
      commit(zoomAround(viewRef.current, target / viewRef.current.zoom, area.getBoundingClientRect(), event.clientX, event.clientY), false);
    }

    area.addEventListener("wheel", handleWheel, { passive: false });
    area.addEventListener("gesturestart", handleGestureStart);
    area.addEventListener("gesturechange", handleGestureChange);
    return () => {
      area.removeEventListener("wheel", handleWheel);
      area.removeEventListener("gesturestart", handleGestureStart);
      area.removeEventListener("gesturechange", handleGestureChange);
    };
  }, [area, commit]);

  // Drag to pan, only while zoomed in — at fit a click is just a click.
  const drag = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const canPan = view.zoom > 1;

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (viewRef.current.zoom <= 1 || event.button !== 0) return;
      event.preventDefault(); // no native image drag or text selection while panning
      event.currentTarget.setPointerCapture(event.pointerId);
      drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
      setDragging(true);
    },
    [],
  );
  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const start = drag.current;
      if (!start || start.pointerId !== event.pointerId) return;
      const current = viewRef.current;
      commit({ ...current, x: current.x + event.clientX - start.x, y: current.y + event.clientY - start.y }, false);
      drag.current = { ...start, x: event.clientX, y: event.clientY };
    },
    [commit],
  );
  const onPointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
  }, []);

  return {
    view,
    animate,
    canPan,
    dragging,
    attachArea: setArea, // callback ref for the illustration area
    panHandlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
    zoomIn: () => zoomBy(canvasZoom.buttonFactor),
    zoomOut: () => zoomBy(1 / canvasZoom.buttonFactor),
    reset: () => commit(FIT, true),
  };
}

export type CanvasZoom = ReturnType<typeof useCanvasZoom>;
