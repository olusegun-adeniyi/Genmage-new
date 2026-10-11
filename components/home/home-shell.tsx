"use client"; // owns generation/history/edit state and every user interaction on the page

import { useEffect, useRef, useState } from "react";

import { layout } from "@/design/tokens";

import type { StyleOption } from "@/components/prompt/style-grid";
import { Toast, useToast } from "@/components/ui/toast";
import { copyPermalink, downloadGeneration } from "@/lib/client/generation-actions";
import { GenerateApiError, requestGeneration } from "@/lib/client/generation-api";
import { useHistory, type HistoryItem } from "@/lib/hooks/use-history";
import { DEFAULT_EDIT_STATE, type EditState } from "@/lib/validation/edit-state";

import { AdjustmentsPanel } from "./adjustments-panel";
import { CanvasPanel } from "./canvas-panel";
import { GeneratePanel } from "./generate-panel";
import { RecentPanel } from "./recent-panel";

type HomeShellProps = {
  styles: StyleOption[];
};

// Refusals/cost-cap get their exact UI-REVIEW.md copy; everything else falls
// back to the generic "try a different prompt" message.
const ERROR_MESSAGES: Record<string, string> = {
  refused: "That prompt didn't work — try something else.",
  cost_cap_reached: "The studio's closed for the day — come back tomorrow.",
  network_error: "Something went wrong — try again.",
};
const DEFAULT_ERROR_MESSAGE = "That one didn't work — try a different prompt.";
const SHARE_COPIED_MS = 1500;

export function HomeShell({ styles }: HomeShellProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedStyleId, setSelectedStyleId] = useState(styles[0]?.id ?? "watercolor");
  const [currentGeneration, setCurrentGeneration] = useState<HistoryItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const shareTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useRef<HTMLElement>(null);
  const { history, addEntry, updateEntryEditState } = useHistory();
  const { message: toastMessage, showToast } = useToast();

  useEffect(() => () => clearTimeout(shareTimeoutRef.current ?? undefined), []);

  const styleNames = Object.fromEntries(styles.map(({ id, name }) => [id, name]));
  const selectedStyleName = styleNames[selectedStyleId] ?? selectedStyleId;

  // Stacked layout only: the canvas sits below the prompt, so bring it on screen
  // when something is about to appear there. On desktop it's always visible.
  function revealCanvas() {
    if (window.matchMedia(`(min-width: ${layout.breakpointDesktop}px)`).matches) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    canvasRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  async function handleGenerate() {
    const trimmed = prompt.trim();
    if (!trimmed || isGenerating) return;

    setIsGenerating(true);
    revealCanvas();
    try {
      const result = await requestGeneration(trimmed, selectedStyleId);
      const entry: HistoryItem = {
        slug: result.slug,
        imageUrl: result.imageUrl,
        prompt: result.prompt,
        style: result.style,
        editState: result.editState,
        createdAt: new Date().toISOString(),
      };
      setCurrentGeneration(entry);
      addEntry(entry);
    } catch (error) {
      const code = error instanceof GenerateApiError ? error.code : "network_error";
      showToast(ERROR_MESSAGES[code] ?? DEFAULT_ERROR_MESSAGE);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleRestore(item: HistoryItem) {
    setCurrentGeneration(item);
    setPrompt(item.prompt);
    setSelectedStyleId(item.style);
    revealCanvas();
  }

  function handleEditChange(patch: Partial<EditState>) {
    if (!currentGeneration) return;
    const editState = { ...currentGeneration.editState, ...patch };
    setCurrentGeneration({ ...currentGeneration, editState });
    updateEntryEditState(currentGeneration.slug, editState);
  }

  async function handleShare() {
    if (!currentGeneration) return;
    if (!(await copyPermalink(currentGeneration))) {
      showToast("Couldn't copy the link — try again.");
      return;
    }
    setShareCopied(true);
    clearTimeout(shareTimeoutRef.current ?? undefined);
    shareTimeoutRef.current = setTimeout(() => setShareCopied(false), SHARE_COPIED_MS);
  }

  async function handleExport() {
    if (!currentGeneration) return;
    if (!(await downloadGeneration(currentGeneration))) showToast("Couldn't download the image — try again.");
  }

  return (
    // Below lg: one stacked column. At lg: two sections in one grid row filling
    // the viewport — left 20% (256px floor), canvas the rest, 20px apart (see tokens.layout).
    <div className="flex w-full max-w-xl flex-col gap-3 lg:grid lg:h-full lg:max-w-none lg:grid-cols-(--studio-columns) lg:grid-rows-(--studio-rows) lg:gap-5">
      {/* Left column: two panels sharing the row height. */}
      <div className="flex min-h-0 flex-col gap-3">
        <GeneratePanel
          styles={styles}
          selectedStyleId={selectedStyleId}
          onSelectStyle={setSelectedStyleId}
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
        <RecentPanel
          history={history}
          styleNames={styleNames}
          activeSlug={currentGeneration?.slug ?? null}
          onRestore={handleRestore}
        />
      </div>
      <CanvasPanel
        ref={canvasRef}
        generation={currentGeneration}
        isGenerating={isGenerating}
        generatingStyleName={selectedStyleName}
        onAspectChange={(aspectRatio) => handleEditChange({ aspectRatio })}
        shareCopied={shareCopied}
        onShare={handleShare}
        onExport={handleExport}
        controls={
          <AdjustmentsPanel
            editState={currentGeneration?.editState ?? DEFAULT_EDIT_STATE}
            onChange={handleEditChange}
            disabled={currentGeneration === null || isGenerating}
          />
        }
      />
      <Toast message={toastMessage} />
    </div>
  );
}
