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

// Pan range on one axis. The frame (size `size`, resting centre `rest`) stays
// inside the canvas [start, end] when it fits; when it's bigger, it keeps the
// canvas covered — either way the illustration never leaves the canvas.
function panRange(rest: number, size: number, start: number, end: number): [number, number] {
  const insideMin = start - rest + size / 2; // frame's leading edge on the canvas's
  const insideMax = end - rest - size / 2; // trailing edge on the canvas's
  return insideMin <= insideMax ? [insideMin, insideMax] : [insideMax, insideMin];
}

/**
 * Keeps the illustration within the canvas, whatever the pan or zoom. The
 * frame is the aspect-fit box centred in the area (the same min() the aspect-fit
 * utility uses), scaled by the zoom.
 */
function clampPan(view: CanvasView, area: DOMRect, canvas: DOMRect, ratio: number): CanvasView {
  const frameWidth = Math.min(area.width, area.height * ratio) * view.zoom;
  const frameHeight = frameWidth / ratio;
  const [minX, maxX] = panRange(area.left + area.width / 2, frameWidth, canvas.left, canvas.right);
  const [minY, maxY] = panRange(area.top + area.height / 2, frameHeight, canvas.top, canvas.bottom);
  return {
    zoom: view.zoom,
    x: Math.min(maxX, Math.max(minX, view.x)),
    y: Math.min(maxY, Math.max(minY, view.y)),
  };
}

// Zooming in keeps the point under (clientX, clientY) fixed on screen. Zooming
// out shrinks the pan with the zoom instead, so it undoes that drift: zoom in on
// a corner, zoom back out, and the illustration returns to where it was.
function zoomAround(view: CanvasView, factor: number, area: DOMRect, clientX: number, clientY: number): CanvasView {
  const zoom = clampZoom(view.zoom * factor);
  const applied = zoom / view.zoom;
  if (applied < 1) return { zoom, x: view.x * applied, y: view.y * applied };
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
      // The canvas is the area's positioned parent (the stage the area is inset in).
      const bounds = area?.getBoundingClientRect();
      const canvas = area?.parentElement?.getBoundingClientRect();
      setState({
        key: keyRef.current,
        view: bounds && canvas ? clampPan(next, bounds, canvas, ratioRef.current) : next,
        animate: animated,
      });
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

  // Drag moves the illustration around the canvas at any zoom. On touch, only
  // while zoomed in: at fit a finger on the canvas still scrolls the page.
  const drag = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const canPan = resetKey !== null;
  const touchPans = view.zoom > 1;

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (keyRef.current === null || event.button !== 0) return;
      if (event.pointerType === "touch" && viewRef.current.zoom <= 1) return;
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
    touchPans,
    dragging,
    attachArea: setArea, // callback ref for the illustration area
    panHandlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
    zoomIn: () => zoomBy(canvasZoom.buttonFactor),
    zoomOut: () => zoomBy(1 / canvasZoom.buttonFactor),
    reset: () => commit(FIT, true),
  };
}

export type CanvasZoom = ReturnType<typeof useCanvasZoom>;
