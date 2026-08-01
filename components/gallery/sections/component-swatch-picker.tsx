import { Ban, Plus } from "lucide-react";

import { SectionHeading, Subsection } from "@/components/gallery/primitives";

// Not a locked token set — Phase E hasn't decided real preset colors yet
// (DESIGN-SYSTEM.md marks border/background swatch colors as TBD). This is a
// proposed starting palette for review, not a decision made here.
const PRESETS = [
  { hex: "#ffffff", name: "White" },
  { hex: "#0a0a0a", name: "Ink" },
  { hex: "#737373", name: "Stone" },
  { hex: "#e8e4e4", name: "Warm grey" },
  { hex: "#c9a97e", name: "Sand" },
  { hex: "#8a9a8b", name: "Sage" },
  { hex: "#9db4c0", name: "Dusty blue" },
  { hex: "#c98a7d", name: "Terracotta" },
];

function SwatchGrid({ selectedHex }: { selectedHex?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-label="No color"
        aria-pressed={selectedHex === "none"}
        className={`flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground ${
          selectedHex === "none" ? "ring-2 ring-foreground ring-offset-2" : ""
        }`}
      >
        <Ban className="size-3.5" />
      </button>
      {PRESETS.map((preset) => (
        <button
          key={preset.hex}
          type="button"
          aria-label={preset.name}
          aria-pressed={selectedHex === preset.hex}
          className={`size-8 rounded-full border border-border ${
            selectedHex === preset.hex ? "ring-2 ring-foreground ring-offset-2" : ""
          }`}
          style={{ backgroundColor: preset.hex }}
        />
      ))}
      <button
        type="button"
        aria-label="Custom color"
        className="flex size-8 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export function ComponentSwatchPickerSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="components-swatch-picker"
        title="Color swatch picker"
        description="Selection reads via a ring, never the accent color — color alone never carries the state (Frontend Design Skill + UI/UX Pro Max: don't convey selection by color alone)."
        status="planned"
      />
      <div className="flex flex-col gap-6">
        <Subsection label="Default" note="Nothing selected — the &quot;no color&quot; swatch reads as a deliberate choice, not a loading gap">
          <SwatchGrid />
        </Subsection>
        <Subsection label="Selected" note="Sage swatch selected — ring, not fill">
          <SwatchGrid selectedHex="#8a9a8b" />
        </Subsection>
      </div>
    </section>
  );
}
