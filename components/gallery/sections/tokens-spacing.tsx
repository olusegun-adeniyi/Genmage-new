import { spacing } from "@/design/tokens";
import { SectionHeading } from "@/components/gallery/primitives";

const ENTRIES: { token: keyof typeof spacing; usage: string }[] = [
  { token: "sectionGap", usage: "Major sections inside the controls panel" },
  { token: "panelGap", usage: "Between the four panels on desktop" },
  { token: "cardGap", usage: "Inside a card's own internal layout" },
  { token: "tightGap", usage: "Text-to-text within a group" },
  { token: "pagePadding", usage: "Outer page inset before panels begin" },
  { token: "sliderThumbHitArea", usage: "Minimum tappable area around the slider thumb — Phase E" },
];

export function TokensSpacingSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="tokens-spacing"
        title="Spacing"
        description="Named, meaningful gaps only. Everything else (gap-3, p-4) is ordinary Tailwind spacing, used freely without a name."
      />
      <div className="flex flex-col gap-6">
        {ENTRIES.map((entry) => (
          <div key={entry.token} className="flex flex-col gap-2">
            <p className="text-sm">
              <span className="font-mono font-medium">{entry.token}</span>
              <span className="ml-2 font-mono text-xs text-muted-foreground">{spacing[entry.token]}</span>
              <span className="ml-2 text-xs text-muted-foreground">— {entry.usage}</span>
            </p>
            <div className="flex items-center rounded-md bg-muted p-3" style={{ gap: spacing[entry.token] }}>
              <div className="size-6 shrink-0 rounded-sm bg-foreground" />
              <div className="size-6 shrink-0 rounded-sm bg-foreground" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
