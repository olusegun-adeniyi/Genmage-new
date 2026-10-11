"use client"; // holds the per-card "confirm remove" state

import Image from "next/image";
import { useState } from "react";

import { BinIcon, PencilIcon } from "@/components/ui/icons";
import type { HistoryItem } from "@/lib/hooks/use-history";

type HistoryCardProps = {
  item: HistoryItem;
  styleName: string;
  active: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onRemove: () => void;
};

const ICON_BUTTON =
  "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm text-icon-muted transition-colors duration-150 ease-out hover:bg-border hover:text-foreground focus-visible:outline-2 focus-visible:outline-foreground";
const TEXT_BUTTON =
  "cursor-pointer rounded-xs px-1 -mx-1 transition-colors duration-150 ease-out hover:bg-border focus-visible:outline-2 focus-visible:outline-foreground";

export function HistoryCard({ item, styleName, active, onSelect, onEdit, onRemove }: HistoryCardProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    // Not a <button> itself — it contains the action buttons. The thumbnail +
    // text area is the "open" button; actions sit beside it.
    <div
      className={`flex shrink-0 items-center gap-2 rounded-md bg-field p-1.5 pr-2 transition-colors duration-150 ease-out ${
        active ? "shadow-field-focus" : ""
      }`}
      onKeyDown={(event) => {
        if (confirming && event.key === "Escape") setConfirming(false);
      }}
    >
      <button
        type="button"
        aria-current={active || undefined}
        onClick={onSelect}
        // While confirming it shrinks to just the thumbnail so the confirmation
        // gets the full text width.
        className={`flex min-w-0 cursor-pointer items-center gap-2 rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
          confirming ? "shrink-0" : "flex-1"
        }`}
      >
        <span className="relative size-10.5 shrink-0 overflow-hidden rounded-sm bg-divider">
          <Image src={item.imageUrl} alt="" fill sizes="42px" className="object-cover" />
        </span>
        {!confirming && (
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-foreground" title={item.prompt}>
              {item.prompt}
            </span>
            <span className="truncate text-muted-foreground">{styleName}</span>
          </span>
        )}
      </button>

      {confirming ? (
        // Replaces the title + actions so the confirmation fits the same two lines.
        <div role="group" aria-label="Confirm removal" className="flex min-w-0 flex-1 flex-col items-start">
          <span className="text-foreground">Remove from history?</span>
          <span className="flex gap-3">
            {/* Focus lands on the safe choice when the confirmation opens. */}
            <button type="button" autoFocus onClick={() => setConfirming(false)} className={`${TEXT_BUTTON} text-muted-foreground`}>
              Cancel
            </button>
            <button type="button" onClick={onRemove} className={`${TEXT_BUTTON} text-danger`}>
              Remove
            </button>
          </span>
        </div>
      ) : (
        <div className="flex shrink-0">
          <button type="button" onClick={onEdit} aria-label={`Edit “${item.prompt}”`} className={ICON_BUTTON}>
            <PencilIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label={`Remove “${item.prompt}” from history`}
            className={ICON_BUTTON}
          >
            <BinIcon className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
