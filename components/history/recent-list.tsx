import type { HistoryItem } from "@/lib/hooks/use-history";

type RecentListProps = {
  items: HistoryItem[];
  styleNames: Record<string, string>;
  activeSlug: string | null;
  onSelect: (item: HistoryItem) => void;
};

// lg: fills whatever height the Recently generated panel has and scrolls inside it.
// Stacked: there's no fixed height to fill, so the list caps itself and scrolls.
// No container outline: -mx-2 cancels the items' px-2, so prompt text lines up
// with the panel heading and the hover fill bleeds slightly past it.
export function RecentList({ items, styleNames, activeSlug, onSelect }: RecentListProps) {
  return (
    <div className="-mx-2 mt-2 flex max-h-52 min-h-0 flex-col gap-0.5 overflow-y-auto lg:max-h-none lg:flex-1">
      {items.map((item) => {
        const isActive = item.slug === activeSlug;
        return (
          <button
            key={item.slug}
            type="button"
            aria-current={isActive || undefined}
            onClick={() => onSelect(item)}
            className={`flex shrink-0 cursor-pointer flex-col items-start rounded-sm px-2 py-1.5 text-left transition-colors duration-150 ease-out hover:bg-field focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground ${
              isActive ? "bg-field" : "bg-transparent"
            }`}
          >
            <span className="line-clamp-2 text-foreground">{item.prompt}</span>
            <span className="text-muted-foreground">{styleNames[item.style] ?? item.style}</span>
          </button>
        );
      })}
    </div>
  );
}
