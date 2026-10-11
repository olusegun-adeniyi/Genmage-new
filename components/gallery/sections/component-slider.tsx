import { ColourRowDemo, SliderDemo } from "@/components/gallery/live-demos";
import { SectionHeading, Subsection } from "@/components/gallery/primitives";

export function ComponentSliderSection() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        id="components-slider"
        title="Slider & colour row"
        description="The whole 32px row is the slider: press anywhere to set, drag to scrub, arrows ±1 (Shift ±10), Home/End for min/max. The label flips light once the fill reaches it."
        status="live"
      />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Subsection label="Slider" note="Live">
          <SliderDemo />
        </Subsection>
        <Subsection label="Disabled" note="No generation on the canvas">
          <SliderDemo disabled />
        </Subsection>
      </div>
      <Subsection label="Colour row" note="Native colour picker over the whole row">
        <div className="w-adjustments-panel">
          <ColourRowDemo />
        </div>
      </Subsection>
    </section>
  );
}
