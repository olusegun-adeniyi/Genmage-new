import { colors, spacing } from "@/design/tokens";
import { SectionHeading, Subsection } from "@/components/gallery/primitives";

type SliderMockProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  stateLabel: string;
  disabled?: boolean;
};

// Spec, not implementation — no drag logic exists. Positions are computed once
// from static props to demonstrate the four states side by side.
function SliderMock({ label, value, min, max, unit, stateLabel, disabled }: SliderMockProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={`flex flex-col gap-2 ${disabled ? "opacity-40" : ""}`}>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-muted-foreground">
          {value > 0 && unit === "°" ? "+" : ""}
          {value}
          {unit}
        </span>
      </div>
      <div
        className="relative w-full rounded-full"
        style={{ height: spacing.sliderThumbHitArea, marginInline: `calc(${spacing.sliderThumbSize} / -2)` }}
      >
        <div
          className="absolute top-1/2 right-0 left-0 -translate-y-1/2 rounded-full"
          style={{ height: spacing.sliderTrackHeight, backgroundColor: colors.sliderTrack }}
        />
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full"
          style={{ height: spacing.sliderTrackHeight, width: `${percent}%`, backgroundColor: colors.sliderThumb }}
        />
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${percent}%`,
            width: spacing.sliderThumbSize,
            height: spacing.sliderThumbSize,
            backgroundColor: colors.sliderThumb,
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{stateLabel}</p>
    </div>
  );
}

export function ComponentSliderSection() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        id="components-slider"
        title="Slider"
        description="Neutral track and thumb — the accent color is reserved for Export, never spent on interactive controls. Thin track (4px) and 16px thumb read as an instrument, not a toy."
        status="planned"
      />
      <Subsection label="Rotate" note="Degree indicator, range −45° to 45°">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <SliderMock label="Rotate" value={0} min={-45} max={45} unit="°" stateLabel="Default (midpoint)" />
          <SliderMock label="Rotate" value={-45} min={-45} max={45} unit="°" stateLabel="Min" />
          <SliderMock label="Rotate" value={45} min={-45} max={45} unit="°" stateLabel="Max" />
          <SliderMock label="Rotate" value={0} min={-45} max={45} unit="°" stateLabel="Disabled" disabled />
        </div>
      </Subsection>
      <Subsection label="Saturation" note="Percent indicator, range 0% to 200%, 100% is neutral">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <SliderMock label="Saturation" value={100} min={0} max={200} unit="%" stateLabel="Default (midpoint)" />
          <SliderMock label="Saturation" value={0} min={0} max={200} unit="%" stateLabel="Min" />
          <SliderMock label="Saturation" value={200} min={0} max={200} unit="%" stateLabel="Max" />
          <SliderMock label="Saturation" value={100} min={0} max={200} unit="%" stateLabel="Disabled" disabled />
        </div>
      </Subsection>
    </section>
  );
}
