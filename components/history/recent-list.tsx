import type { HistoryItem } from "@/lib/hooks/use-history";

import { HistoryCard } from "./history-card";

type RecentListProps = {
  items: HistoryItem[];
  styleNames: Record<string, string>;
  activeSlug: string | null;
  onSelect: (item: HistoryItem) => void;
  onEdit: (item: HistoryItem) => void;
  onRemove: (item: HistoryItem) => void;
};

// lg: fills whatever height the Recently generated panel has and scrolls inside it.
// Stacked: there's no fixed height to fill, so the list caps itself and scrolls.
export function RecentList({ items, styleNames, activeSlug, onSelect, onEdit, onRemove }: RecentListProps) {
  return (
    <div className="mt-2 flex max-h-60 min-h-0 flex-col gap-1.5 overflow-y-auto lg:max-h-none lg:flex-1">
      {items.map((item) => (
        <HistoryCard
          key={item.slug}
          item={item}
          styleName={styleNames[item.style] ?? item.style}
          active={item.slug === activeSlug}
          onSelect={() => onSelect(item)}
          onEdit={() => onEdit(item)}
          onRemove={() => onRemove(item)}
        />
      ))}
    </div>
  );
}
