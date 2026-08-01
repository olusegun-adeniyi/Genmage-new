import { radii } from "@/design/tokens";
import { SectionHeading } from "@/components/gallery/primitives";

const ENTRIES: { token: keyof typeof radii; usage: string }[] = [
  { token: "sm", usage: "Smallest interactive elements — not yet used" },
  { token: "md", usage: "Style tiles, sample image cards" },
  { token: "lg", usage: "Cards — outer panels, canvas" },
  { token: "xl", usage: "Reserved — nothing currently uses it" },
  { token: "full", usage: "Pill buttons, icon buttons" },
];

export function TokensRadiiSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="tokens-radii"
        title="Radii"
        description="A 5-tier scale. md dropped from 12px to 8px in the token consolidation — every rounded-* call site was individually re-checked, not bulk-renamed."
      />
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {ENTRIES.map((entry) => (
          <div key={entry.token} className="flex flex-col items-start gap-2">
            <div className="flex size-16 items-center justify-center border border-border bg-muted" style={{ borderRadius: radii[entry.token] }}>
              <span className="font-mono text-[10px] text-muted-foreground">{radii[entry.token]}</span>
            </div>
            <div>
              <p className="font-mono text-xs font-medium">rounded-{entry.token}</p>
              <p className="text-xs text-muted-foreground">{entry.usage}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
