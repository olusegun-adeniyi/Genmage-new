import { spacing, type SpacingToken } from "@/design/tokens";
import { SectionHeading } from "@/components/gallery/primitives";

// camelCase token → the CSS variable globals.css defines for it.
function cssVariable(token: SpacingToken): string {
  return `--spacing-${token.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
}

export function TokensSpacingSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="tokens-spacing"
        title="Spacing"
        description="Named layout dimensions measured from the handoff. Anything on the 4px grid (gap-2, p-4, h-10) uses Tailwind's own scale without a name."
      />
      <div className="overflow-hidden rounded-lg shadow-grid">
        {(Object.keys(spacing) as SpacingToken[]).map((token, index) => (
          <div
            key={token}
            className={`flex justify-between gap-4 px-4 py-2.5 ${index % 2 === 0 ? "bg-background" : "bg-field"}`}
          >
            <span className="text-foreground-strong">{cssVariable(token)}</span>
            <span className="text-muted-foreground">{spacing[token]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
