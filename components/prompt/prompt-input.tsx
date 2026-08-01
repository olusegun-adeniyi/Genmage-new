"use client"; // rotating placeholder + textarea autoresize need client-side timers and DOM measurement

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const PLACEHOLDERS = [
  "a Porsche 911 parked outside a Lisbon café",
  "an old man reading by a window",
  "wildflowers in a jam jar",
  "a foggy morning by a Scottish loch",
  "a red fox curled in autumn leaves",
];

const ROTATE_INTERVAL_MS = 4000;
const FADE_MS = 300;

type PromptInputProps = {
  // Gallery-only: seeds the "filled" demo instance. Production always starts empty.
  initialValue?: string;
  // Gallery-only: autofocuses the "focused" demo instance so its real focus-within
  // ring renders for the screenshot, rather than faking the state.
  autoFocus?: boolean;
};

export function PromptInput({ initialValue = "", autoFocus = false }: PromptInputProps) {
  const [value, setValue] = useState(initialValue);
  const [index, setIndex] = useState(0);
  const [fadedIn, setFadedIn] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadedIn(false);
      const fadeTimeout = setTimeout(() => {
        setIndex((current) => (current + 1) % PLACEHOLDERS.length);
        setFadedIn(true);
      }, FADE_MS);
      return () => clearTimeout(fadeTimeout);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(event.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  return (
    <div className="flex min-h-45 flex-col gap-4 rounded-lg bg-input p-4 transition-shadow duration-150 ease-out focus-within:ring-2 focus-within:ring-foreground/20">
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          rows={3}
          enterKeyHint="go"
          autoComplete="off"
          spellCheck
          autoFocus={autoFocus}
          className="size-full resize-none border-none bg-transparent text-base text-foreground focus:outline-none focus:ring-0"
        />
        {value === "" && (
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute left-0 top-0 text-base text-muted-foreground transition-opacity duration-300 ease-out ${
              fadedIn ? "opacity-100" : "opacity-0"
            }`}
          >
            {PLACEHOLDERS[index]}
          </span>
        )}
      </div>
      <div className="flex justify-end">
        <Button variant="primary">Generate</Button>
      </div>
    </div>
  );
}
