import { spacing } from "@/design/tokens";
import { SectionHeading, Subsection } from "@/components/gallery/primitives";

export function LayoutPatternsSection() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        id="layout-patterns"
        title="Layout patterns"
        description="Desktop is a four-panel grid; mobile collapses history and edit into bottom-sheet drawers. Neither is built yet — specified ahead of Phase D/F so there's something concrete to build against."
      />

      <Subsection label="Desktop — four-panel grid" note={`36% / 1fr columns, ${spacing.panelGap} gap`}>
        <div className="grid max-w-lg grid-cols-[36%_1fr] grid-rows-2 rounded-lg bg-background p-2" style={{ gap: spacing.panelGap }}>
          <div className="flex items-center justify-center rounded-lg bg-surface-dark p-6 text-xs text-foreground-on-dark">
            controls
          </div>
          <div className="flex items-center justify-center rounded-lg bg-surface-light p-6 text-xs text-foreground ring-1 ring-border">
            canvas
          </div>
          <div className="flex items-center justify-center rounded-lg bg-muted p-6 text-xs text-foreground">history</div>
          <div className="flex items-center justify-center rounded-lg bg-muted p-6 text-xs text-foreground">edit</div>
        </div>
      </Subsection>

      <Subsection label="Mobile — bottom-sheet drawer" note="Single column; history/edit reachable via a drawer, one open at a time">
        <div className="relative h-72 w-40 overflow-hidden rounded-2xl border border-border bg-background">
          <div className="flex flex-col gap-3 p-3">
            <div className="h-3 w-12 rounded-full bg-muted" />
            <div className="h-16 rounded-md bg-muted" />
            <div className="h-20 rounded-md bg-input" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex h-24 flex-col items-center gap-2 rounded-t-lg border-t border-border bg-muted pt-2">
            <div className="h-1 w-8 rounded-full bg-border" />
            <span className="text-[10px] text-muted-foreground">History drawer</span>
          </div>
        </div>
      </Subsection>
    </section>
  );
}
