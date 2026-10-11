import { colors, type ColorToken } from "@/design/tokens";
import { SectionHeading, Subsection } from "@/components/gallery/primitives";

const GROUPS: { label: string; tokens: ColorToken[] }[] = [
  { label: "Surfaces", tokens: ["page", "pageDot", "background", "canvas", "field", "toolbar", "border", "divider", "tick"] },
  {
    label: "Foregrounds",
    tokens: ["emptyIcon", "disabledForeground", "mutedForeground", "sliderFill", "foregroundSoft", "foreground", "foregroundStrong"],
  },
  { label: "Primary", tokens: ["primary", "primaryForeground"] },
  { label: "Status", tokens: ["danger"] },
  { label: "Preview overlays (illustration only)", tokens: ["editWarm", "editTint", "editHighlight"] },
];

const USAGE: Record<ColorToken, string> = {
  page: "Off-white page surface, under the dot grid",
  pageDot: "Dot-grid dots — low contrast on purpose",
  background: "Panels, toolbar buttons, recent list",
  canvas: "Canvas panel",
  field: "Prompt box, sliders, colour rows, hover/selected items",
  toolbar: "Canvas action bar",
  border: "Panel borders, hairlines, toolbar button hover",
  divider: "Adjustments divider, disabled Generate",
  tick: "Slider tick dots, field focus ring",
  emptyIcon: "Empty-state icons (canvas, recent list)",
  disabledForeground: "Disabled button labels",
  mutedForeground: "Secondary text, placeholders, control labels",
  sliderFill: "Slider fill",
  foregroundSoft: "Input text, slider values, empty thumbnails",
  foreground: "Primary text, style tiles, selection ring",
  foregroundStrong: "Section labels",
  primary: "Active Generate button. Nowhere else.",
  primaryForeground: "Generate label",
  danger: "Error states",
  editWarm: "Temperature overlay",
  editTint: "Tint overlay",
  editHighlight: "Highlight overlay",
};

export function TokensColorsSection() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        id="tokens-colors"
        title="Colors"
        description="One neutral ramp plus a single primary. Every value is a token in design/tokens.ts, mirrored in globals.css."
      />
      {GROUPS.map((group) => (
        <Subsection key={group.label} label={group.label}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.tokens.map((token) => (
              <div key={token} className="flex items-start gap-3">
                <div className="size-12 shrink-0 rounded-md shadow-grid" style={{ backgroundColor: colors[token] }} />
                <div className="min-w-0">
                  <p className="text-foreground-strong">{token}</p>
                  <p className="text-muted-foreground uppercase">{colors[token]}</p>
                  <p className="mt-0.5 text-muted-foreground">{USAGE[token]}</p>
                </div>
              </div>
            ))}
          </div>
        </Subsection>
      ))}
    </section>
  );
}
