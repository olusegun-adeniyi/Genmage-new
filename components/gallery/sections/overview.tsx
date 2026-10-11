import { SectionHeading } from "@/components/gallery/primitives";

const ANCHORS = [
  { label: "Three columns", detail: "Generate · Canvas · Adjustments, filling exactly one viewport from 1024px up. Below that, one stacked column." },
  { label: "One type style", detail: "13/18, weight 400, system SF Pro. Hierarchy comes from colour — black, ink, grey — never size or weight." },
  { label: "One colour", detail: "Purple #6600FF marks the active Generate button. Everything else is a step on one neutral ramp." },
];

export function OverviewSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading id="overview" title="Overview" />
      <p className="max-w-2xl leading-relaxed text-muted-foreground">
        Genmage is a single-screen illustration studio built from the Illustration Studio handoff, scaled down about 20% so it fits a laptop screen. Panels are white on
        white, separated by 1px #EAEAEA borders rather than shadows; controls sit on #F6F6F6 fields. Type never
        changes size. The only saturated colour in the chrome is the active Generate button, so the illustration on the
        canvas is always the most colourful thing on screen.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ANCHORS.map((anchor) => (
          <div key={anchor.label} className="rounded-lg border border-border p-4">
            <p className="text-foreground-strong">{anchor.label}</p>
            <p className="mt-1.5 text-muted-foreground">{anchor.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
