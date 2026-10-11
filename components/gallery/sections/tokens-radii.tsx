import { radii, shadows, type RadiusToken } from "@/design/tokens";
import { SectionHeading, Subsection } from "@/components/gallery/primitives";

const RADIUS_USAGE: Record<RadiusToken, string> = {
  xs: "Style tile thumbnail",
  sm: "Recent + menu items",
  md: "Buttons, sliders, tiles, colour rows",
  lg: "Prompt box, action bar, aspect menu",
  xl: "Reserved",
  "2xl": "Panels",
  full: "Swatches, tick dots",
};

const SHADOW_USAGE: Record<keyof typeof shadows, string> = {
  grid: "Inset outline (gallery only)",
  tileSelected: "Selected style tile",
  menu: "Aspect menu — the only elevated surface",
  swatch: "Colour swatch edge",
  fieldFocus: "Slider + prompt box focus",
};

export function TokensRadiiSection() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        id="tokens-radii"
        title="Radii & shadows"
        description="Radius grows with container size, so nested shapes stay concentric. Shadows are almost all hairlines — the aspect menu is the only thing that floats."
      />
      <Subsection label="Radii">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
          {(Object.keys(radii) as RadiusToken[]).map((token) => (
            <div key={token} className="flex flex-col items-start gap-2">
              <div className="size-16 bg-field shadow-grid" style={{ borderRadius: radii[token] }} />
              <p className="text-foreground-strong">rounded-{token}</p>
              <p className="text-muted-foreground">
                {radii[token]} · {RADIUS_USAGE[token]}
              </p>
            </div>
          ))}
        </div>
      </Subsection>
      <Subsection label="Shadows">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {(Object.keys(shadows) as (keyof typeof shadows)[]).map((token) => (
            <div key={token} className="flex flex-col items-start gap-2">
              <div className="size-16 rounded-md bg-background" style={{ boxShadow: shadows[token] }} />
              <p className="text-foreground-strong">{token}</p>
              <p className="text-muted-foreground">{SHADOW_USAGE[token]}</p>
            </div>
          ))}
        </div>
      </Subsection>
    </section>
  );
}
