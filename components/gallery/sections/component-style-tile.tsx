import { StyleTile } from "@/components/prompt/style-tile";
import { StyleGridDemo } from "@/components/gallery/live-demos";
import { SectionHeading, Subsection } from "@/components/gallery/primitives";

const THUMB = "/examples/style-tile-watercolor.jpg";

export function ComponentStyleTileSection() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        id="components-style-tile"
        title="Style tile"
        description="Ink tile, 39px thumbnail, white caption. Selected gets a white gap and ink ring; unselected sits at 88% opacity."
        status="live"
      />
      <Subsection label="States">
        <div className="grid w-80 grid-cols-3 gap-2 p-2">
          <StyleTile name="Watercolor" imageSrc={THUMB} selected />
          <StyleTile name="Watercolor" imageSrc={THUMB} selected={false} />
          <StyleTile name="Doodle" selected={false} />
        </div>
      </Subsection>
      <Subsection label="Style grid" note="Live — active styles from the style table, nothing else">
        <div className="w-80 px-3.5">
          <StyleGridDemo />
        </div>
      </Subsection>
    </section>
  );
}
