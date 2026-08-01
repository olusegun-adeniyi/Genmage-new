import { typography } from "@/design/tokens";
import { SectionHeading, Subsection } from "@/components/gallery/primitives";

const SAMPLE = "The quick brown fox";

// Tailwind's scanner needs complete literal class names — a template-string
// `text-${step}` would never be picked up, so each step is spelled out here.
const SCALE_STEPS: { step: keyof typeof typography.scale; className: string }[] = [
  { step: "xs", className: "text-xs" },
  { step: "sm", className: "text-sm" },
  { step: "base", className: "text-base" },
  { step: "lg", className: "text-lg" },
  { step: "xl", className: "text-xl" },
  { step: "2xl", className: "text-2xl" },
];

const IN_USE = [
  { className: "text-sm font-medium tracking-tight", label: "text-sm / medium / tracking-tight", source: "Wordmark (desktop)" },
  { className: "text-base font-medium tracking-tight", label: "text-base / medium / tracking-tight", source: "Wordmark (mobile)" },
  { className: "text-sm text-muted-foreground", label: "text-sm / muted-foreground", source: "Section labels (\"Select a style\")" },
  { className: "text-base", label: "text-base", source: "Prompt input + placeholder" },
  { className: "text-base font-medium", label: "text-base / medium", source: "Generate button" },
  { className: "text-sm", label: "text-sm", source: "Aspect / Export button labels" },
  { className: "text-xs font-medium", label: "text-xs / medium", source: "Style tile label" },
  { className: "text-xs text-muted-foreground", label: "text-xs / muted-foreground", source: "Sample card caption" },
];

export function TokensTypographySection() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        id="tokens-typography"
        title="Typography"
        description="Inter only, one family for everything. Tailwind's stock text-xs…text-2xl already matches the token scale exactly — no override was needed."
      />
      <Subsection label="Scale">
        <div className="flex flex-col gap-3">
          {SCALE_STEPS.map(({ step, className }) => (
            <div key={step} className="flex items-baseline gap-4">
              <span className="w-24 shrink-0 font-mono text-xs text-muted-foreground">
                {className} · {typography.scale[step]}
              </span>
              <span className={className}>{SAMPLE}</span>
            </div>
          ))}
        </div>
      </Subsection>
      <Subsection label="In use" note="Real class combinations pulled from live components, not a generic cross-product.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {IN_USE.map((item) => (
            <div key={item.label} className="rounded-md border border-border p-3">
              <p className={item.className}>{SAMPLE}</p>
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">{item.label}</p>
              <p className="text-[11px] text-muted-foreground">{item.source}</p>
            </div>
          ))}
        </div>
      </Subsection>
    </section>
  );
}
