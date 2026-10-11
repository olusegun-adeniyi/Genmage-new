import type { KeyboardEvent } from "react";

import { Button } from "@/components/ui/button";

// Mirrors the Zod bounds on POST /api/generate — the button only enables for a
// prompt the server will actually accept.
export const MIN_PROMPT_LENGTH = 3;
export const MAX_PROMPT_LENGTH = 200;

type PromptBoxProps = {
  value: string;
  onValueChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
};

export function PromptBox({ value, onValueChange, onGenerate, isGenerating }: PromptBoxProps) {
  const canGenerate = value.trim().length >= MIN_PROMPT_LENGTH && !isGenerating;

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey) && canGenerate) {
      event.preventDefault();
      onGenerate();
    }
  }

  return (
    <div className="relative h-prompt-box rounded-lg bg-field focus-within:shadow-field-focus">
      <textarea
        aria-label="Describe your illustration"
        // Same Firefox form-state restoration as the Generate button (ui/button.tsx).
        autoComplete="off"
        value={value}
        maxLength={MAX_PROMPT_LENGTH}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="A foggy morning in a scottish farm"
        // 16px on touch screens only — iOS zooms the page on focus for anything
        // smaller. The one deliberate exception to the single 14px type style.
        className="absolute top-2.5 right-3.5 bottom-11.5 left-3.5 resize-none border-none bg-transparent p-0 text-foreground-soft outline-none pointer-coarse:text-base"
      />
      <Button
        variant="primary"
        disabled={!canGenerate}
        onClick={onGenerate}
        className="absolute right-2 bottom-2"
      >
        {isGenerating ? "Generating…" : "Generate"}
      </Button>
    </div>
  );
}
