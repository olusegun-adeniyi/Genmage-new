import { PromptBoxDemo, RecentListDemo } from "@/components/gallery/live-demos";
import { SectionHeading, Subsection } from "@/components/gallery/primitives";

export function ComponentGenerateSection() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        id="components-generate"
        title="Prompt box & recent list"
        description="⌘/Ctrl+Enter generates from the prompt box. The recent list fills whatever height the Generate panel has left and scrolls internally."
        status="live"
      />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Subsection label="Prompt box" note="Empty">
          <PromptBoxDemo />
        </Subsection>
        <Subsection label="Prompt box" note="Generating">
          <PromptBoxDemo initial="A foggy morning in a scottish farm" generating />
        </Subsection>
      </div>
      <Subsection label="Recent list" note="Live — the current generation is highlighted">
        <div className="w-80">
          <RecentListDemo />
        </div>
      </Subsection>
    </section>
  );
}
