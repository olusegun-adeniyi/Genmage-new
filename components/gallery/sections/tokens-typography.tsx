import { typography } from "@/design/tokens";
import { SectionHeading } from "@/components/gallery/primitives";

const ROLES = [
  { className: "text-foreground-strong", label: "foregroundStrong", sample: "Generate a style of illustration" },
  { className: "text-foreground", label: "foreground", sample: "A foggy morning in a scottish farm" },
  { className: "text-foreground-soft", label: "foregroundSoft", sample: "36º" },
  { className: "text-muted-foreground", label: "mutedForeground", sample: "Saturation" },
];

export function TokensTypographySection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="tokens-typography"
        title="Typography"
        description={`One style: ${typography.size}/${typography.lineHeight}, weight ${typography.weight}, ${typography.family.split(",")[0]} with system fallbacks. Numbers are tabular everywhere.`}
      />
      <div className="flex flex-col divide-y divide-border rounded-lg shadow-grid">
        {ROLES.map((role) => (
          <div key={role.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
            <span className={role.className}>{role.sample}</span>
            <span className="shrink-0 text-muted-foreground">{role.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
