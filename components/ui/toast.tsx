"use client"; // owns a timer to auto-dismiss

import { Check } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const TOAST_DURATION_MS = 3000;

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((next: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage(next);
    timeoutRef.current = setTimeout(() => setMessage(null), TOAST_DURATION_MS);
  }, []);

  return { message, showToast };
}

type ToastProps = {
  message: string | null;
  // Gallery-only: swaps fixed-to-viewport for absolute-to-container so the demo
  // sits inside its preview box instead of pinning to the real browser viewport.
  contained?: boolean;
};

export function Toast({ message, contained = false }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none inset-x-0 bottom-6 z-50 flex justify-center ${contained ? "absolute" : "fixed"}`}
    >
      <div className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-background">
        <Check className="size-4" strokeWidth={2.5} />
        {message}
      </div>
    </div>
  );
}
