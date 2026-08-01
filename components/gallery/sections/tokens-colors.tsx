import { colors } from "@/design/tokens";
import { SectionHeading, Subsection } from "@/components/gallery/primitives";

type ColorEntry = { token: keyof typeof colors; usage: string };

const GROUPS: { label: string; entries: ColorEntry[] }[] = [
  {
    label: "Surfaces",
    entries: [
      { token: "pageBackground", usage: "Whole-page background, outside all panels" },
      { token: "surfaceDark", usage: "Controls panel (dark) — Phase D" },
      { token: "surfaceLight", usage: "Canvas panel" },
      { token: "surfaceMuted", usage: "History + edit panels" },
    ],
  },
  {
    label: "Foregrounds",
    entries: [
      { token: "foregroundOnLight", usage: "Text/icons on light surfaces" },
      { token: "foregroundOnDark", usage: "Text/icons on surfaceDark — Phase D" },
      { token: "mutedForegroundOnLight", usage: "Secondary text on light surfaces" },
      { token: "mutedForegroundOnDark", usage: "Secondary text on surfaceDark — Phase D" },
    ],
  },
  {
    label: "Borders",
    entries: [
      { token: "borderOnLight", usage: "Hairline borders on light surfaces" },
      { token: "borderOnLightHover", usage: "Hover state of the above" },
      { token: "borderOnDark", usage: "Hairline borders on surfaceDark — Phase D" },
      { token: "borderOnDarkHover", usage: "Hover state of the above — Phase D" },
    ],
  },
  {
    label: "Accent",
    entries: [{ token: "accent", usage: "Export button. Exclusively. Nowhere else." }],
  },
  {
    label: "Interactive",
    entries: [
      { token: "inputBackground", usage: "Prompt input — its own semantic slot" },
      { token: "sliderTrack", usage: "Inactive slider track — Phase E" },
      { token: "sliderThumb", usage: "Slider thumb — Phase E" },
    ],
  },
  {
    label: "Danger",
    entries: [{ token: "danger", usage: "Destructive/error states" }],
  },
];

function ColorSwatch({ entry }: { entry: ColorEntry }) {
  const value = colors[entry.token];
  const isBorderToken = entry.token.startsWith("border");

  return (
    <div className="flex items-start gap-3">
      <div
        className="size-12 shrink-0 rounded-md border border-border"
        style={
          isBorderToken
            ? { borderWidth: "3px", borderColor: value, backgroundColor: colors.surfaceLight }
            : { backgroundColor: value }
        }
      />
      <div className="min-w-0">
        <p className="text-sm font-medium">{entry.token}</p>
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
        <p className="mt-0.5 text-xs text-muted-foreground">{entry.usage}</p>
      </div>
    </div>
  );
}

export function TokensColorsSection() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        id="tokens-colors"
        title="Colors"
        description="Every color in the product, grouped by role. Six token families, one deliberate exception (accent) — see DESIGN-SYSTEM.md → Rules."
      />
      <div className="flex flex-col gap-8">
        {GROUPS.map((group) => (
          <Subsection key={group.label} label={group.label}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.entries.map((entry) => (
                <ColorSwatch key={entry.token} entry={entry} />
              ))}
            </div>
          </Subsection>
        ))}
      </div>
    </section>
  );
}
