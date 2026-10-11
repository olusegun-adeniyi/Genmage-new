import { ActionBarDemo } from "@/components/gallery/live-demos";
import { SectionHeading, Subsection } from "@/components/gallery/primitives";

export function ComponentActionBarSection() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        id="components-action-bar"
        title="Canvas action bar"
        description="Pinned 20px from the canvas bottom (12px when stacked). The aspect menu opens upward (Escape or click outside closes, arrows move between options). Share swaps to “Copied” for 1.5s."
        status="live"
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Subsection label="With a generation" note="Live">
          <ActionBarDemo hasGeneration />
        </Subsection>
        <Subsection label="Empty canvas">
          <ActionBarDemo hasGeneration={false} />
        </Subsection>
      </div>
    </section>
  );
}
