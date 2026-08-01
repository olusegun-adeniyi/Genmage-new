import { SectionHeading } from "@/components/gallery/primitives";

const PANELS = [
  { label: "Controls", surface: "bg-surface-dark text-foreground-on-dark", status: "Planned — Phase D" },
  { label: "Canvas", surface: "bg-surface-light text-foreground", status: "Live" },
  { label: "History", surface: "bg-muted text-foreground", status: "Planned — Phase D" },
  { label: "Edit", surface: "bg-muted text-foreground", status: "Planned — Phase D" },
];

export function ComponentPanelsSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="components-panels"
        title="Panels"
        description="Four independent rounded regions, not one shared card — today's built app still wraps controls+canvas in a single muted card, since Phase D hasn't restructured app/page.tsx yet."
        status="planned"
      />
      <div className="grid max-w-md grid-cols-[36%_1fr] grid-rows-2 gap-2 rounded-lg bg-background p-2">
        {PANELS.map((panel) => (
          <div key={panel.label} className={`flex flex-col items-start justify-between gap-1 rounded-lg p-3 ${panel.surface}`}>
            <span className="text-xs font-medium">{panel.label}</span>
            <span className="text-[10px] opacity-70">{panel.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
