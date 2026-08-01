import { StyleTile } from "@/components/prompt/style-tile";
import { SectionHeading } from "@/components/gallery/primitives";

const INSTANCES = [
  { label: "Default", props: { selected: false } },
  { label: "Selected", props: { selected: true } },
  { label: "Hover", props: { selected: false, demoState: "hover" as const } },
  { label: "Disabled", props: { selected: false, disabled: true } },
];

export function ComponentStyleTileSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="components-style-tile"
        title="Style tile"
        description={`Disabled isn't a real v1 scenario — DESIGN-SYSTEM.md notes inactive styles simply aren't shown, never disabled. Shown here as a visual mock for completeness.`}
        status="live"
      />
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {INSTANCES.map((instance) => (
          <div key={instance.label} className="flex flex-col items-center gap-2">
            <StyleTile name="Watercolor" imageSrc="/examples/example_01.png" {...instance.props} />
            <p className="text-xs text-muted-foreground">{instance.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
