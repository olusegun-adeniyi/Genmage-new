import Image from "next/image";

import { Canvas } from "@/components/canvas/canvas";
import { EXAMPLES } from "@/config/examples";
import { SectionHeading } from "@/components/gallery/primitives";

export function ComponentCanvasSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="components-canvas"
        title="Canvas"
        description="Populated state uses a sample image as a stand-in — the real generation-result rendering path doesn't exist yet."
        status="live"
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="max-w-64">
            <Canvas />
          </div>
          <p className="text-xs text-muted-foreground">Empty state</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="max-w-64">
            <Canvas>
              <Image
                src={EXAMPLES[2].image}
                alt={EXAMPLES[2].prompt}
                fill
                className="rounded-lg object-cover"
              />
            </Canvas>
          </div>
          <p className="text-xs text-muted-foreground">Populated (sample image standing in for a real generation)</p>
        </div>
      </div>
    </section>
  );
}
