import { colors, darkColors, type ColorToken } from "@/design/tokens";
import { SectionHeading, Subsection } from "@/components/gallery/primitives";

const GROUPS: { label: string; tokens: ColorToken[] }[] = [
  { label: "Surfaces", tokens: ["page", "pageDot", "background", "canvas", "field", "toolbar", "border", "divider", "tick"] },
  {
    label: "Foregrounds",
    tokens: ["iconMuted", "disabledForeground", "mutedForeground", "sliderFill", "foregroundSoft", "foreground", "foregroundStrong"],
  },
  { label: "Primary", tokens: ["primary", "primaryForeground"] },
  { label: "Status", tokens: ["danger"] },
  { label: "Preview overlays (illustration only)", tokens: ["editWarm", "editTint", "editHighlight"] },
  { label: "Wrap outline (illustration only)", tokens: ["wrapOutline", "wrapOutlineEdge"] },
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
  iconMuted: "Secondary icons — empty states, history card actions",
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
  wrapOutline: "Die-cut sticker edge around the illustration",
  wrapOutlineEdge: "Hairline on the sticker edge's outer rim",
};

export function TokensColorsSection() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        id="tokens-colors"
        title="Colors"
        description="One neutral ramp plus a single primary, each with a light and dark value (left · right). Every value is a token in design/tokens.ts, mirrored in globals.css."
      />
      {GROUPS.map((group) => (
        <Subsection key={group.label} label={group.label}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.tokens.map((token) => (
              <div key={token} className="flex items-start gap-3">
                {/* Light | dark halves. Inline hex (not the utility) so both show
                    regardless of the active theme. */}
                <div className="flex size-12 shrink-0 overflow-hidden rounded-md shadow-grid">
                  <span className="flex-1" style={{ backgroundColor: colors[token] }} />
                  <span className="flex-1" style={{ backgroundColor: darkColors[token] }} />
                </div>
                <div className="min-w-0">
                  <p className="text-foreground-strong">{token}</p>
                  <p className="text-muted-foreground uppercase">
                    {colors[token]} · {darkColors[token]}
                  </p>
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
