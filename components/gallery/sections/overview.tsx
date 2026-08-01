import { SectionHeading } from "@/components/gallery/primitives";

const ANCHORS = [
  { label: "Restraint", detail: "Linear/Vercel-family precision — information-dense without feeling cramped, motion that feels instant, not performative." },
  { label: "Dual-tone", detail: "A dark controls panel paired with light canvas, history, and edit surfaces — distinct regions, not one wash of color." },
  { label: "Single accent", detail: "Exactly one accent color exists in the product, and it appears in exactly one place: the Export button." },
];

export function OverviewSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading id="overview" title="Overview" />
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Genmage is dual-tone by design: a dark controls panel paired with light canvas, history, and edit surfaces,
        sitting as distinct rounded regions within a shared warm-off-white page background — they don&apos;t blend
        into one wash of color, they&apos;re deliberately different regions with different jobs. Restraint is the
        actual design tool here, not an absence of one: exactly one accent color exists in the entire product, and
        it appears in exactly one place — the Export button. Inter is the only typeface, used at every weight and
        size the product needs. Motion is fast and precise — 150ms is the default, nothing floats or eases in
        slowly. Whitespace is generous rather than cramped; a dashboard-dense layout would fight the
        &quot;one considered lever per control&quot; philosophy the editing system is built on.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ANCHORS.map((anchor) => (
          <div key={anchor.label} className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium">{anchor.label}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">{anchor.detail}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        This page is itself dual-toned — the sidebar is the first place `surfaceDark` / `foregroundOnDark` render
        anywhere in the app, ahead of the real Phase D controls panel.
      </p>
    </section>
  );
}
