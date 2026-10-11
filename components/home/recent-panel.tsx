import { RecentList } from "@/components/history/recent-list";
import { ArchiveBoxIcon } from "@/components/ui/icons";
import type { HistoryItem } from "@/lib/hooks/use-history";

type RecentPanelProps = {
  history: HistoryItem[];
  styleNames: Record<string, string>;
  activeSlug: string | null;
  onRestore: (item: HistoryItem) => void;
  onEdit: (item: HistoryItem) => void;
  onRemove: (item: HistoryItem) => void;
};

export function RecentPanel({ history, styleNames, activeSlug, onRestore, onEdit, onRemove }: RecentPanelProps) {
  const isEmpty = history.length === 0;

  return (
    // lg: fills whatever height the left column has left below Generate, showing
    // an empty state until there's history. Stacked: an empty panel would just
    // push the canvas down, so it's hidden until there's history.
    <section
      aria-label="Recently generated"
      className={`min-h-0 flex-col rounded-2xl border border-border bg-background px-3.5 pt-4 pb-3.5 lg:flex lg:flex-1 ${
        isEmpty ? "hidden" : "flex"
      }`}
    >
      <h2 className="text-foreground-strong">Recently generated</h2>
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <ArchiveBoxIcon className="size-13 text-icon-muted" />
          <p className="max-w-44 text-center text-balance text-muted-foreground">
            You haven&rsquo;t generated any illustrations yet.
          </p>
        </div>
      ) : (
        <RecentList
          items={history}
          styleNames={styleNames}
          activeSlug={activeSlug}
          onSelect={onRestore}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      )}
    </section>
  );
}
