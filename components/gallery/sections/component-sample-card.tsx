import { SampleImageCard } from "@/components/prompt/sample-image-card";
import { EXAMPLES } from "@/config/examples";
import { SectionHeading } from "@/components/gallery/primitives";

const SHORT = EXAMPLES[3]; // "Croissant" — genuinely one line
const LONG = EXAMPLES[0]; // "A slice of lemon tart cooling on the windowsill" — wraps and truncates

export function ComponentSampleCardSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="components-sample-card"
        title="Sample image card"
        description="Hover border treatment is a new small addition made during this consolidation — none existed before, added for consistency with the style tile's hover pattern."
        status="live"
      />
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        <div className="flex flex-col items-center gap-2">
          <SampleImageCard image={SHORT.image} prompt={SHORT.prompt} buttonWidthClass="w-24" boxClass="size-24" />
          <p className="text-xs text-muted-foreground">Default · short label</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SampleImageCard
            image={SHORT.image}
            prompt={SHORT.prompt}
            buttonWidthClass="w-24"
            boxClass="size-24"
            demoState="hover"
          />
          <p className="text-xs text-muted-foreground">Hover · short label</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SampleImageCard image={LONG.image} prompt={LONG.prompt} buttonWidthClass="w-24" boxClass="size-24" />
          <p className="text-xs text-muted-foreground">Default · long label (truncates at 2 lines)</p>
        </div>
      </div>
    </section>
  );
}
