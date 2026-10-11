import { ArrowUpRight, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading, Subsection } from "@/components/gallery/primitives";

export function ComponentButtonsSection() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        id="components-buttons"
        title="Buttons"
        description="Two variants with a 10px radius: primary (32px, inside the prompt box) exists once on the page (Generate); toolbar (36px) lives in the canvas action bar."
        status="live"
      />
      <Subsection label="Primary" note="Active only when the prompt is ≥3 characters and nothing is generating">
        <div className="flex gap-3">
          <Button variant="primary">Generate</Button>
          <Button variant="primary" disabled>
            Generate
          </Button>
          <Button variant="primary" disabled>
            Generating…
          </Button>
        </div>
      </Subsection>
      <Subsection label="Toolbar" note="White on the #F0F0F0 bar, #EAEAEA on hover; disabled until there's a generation">
        <div className="flex gap-2 rounded-xl bg-toolbar p-2">
          <Button variant="toolbar" className="w-share-button gap-2.5">
            <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
            Share
          </Button>
          <Button variant="toolbar" className="w-export-button gap-1.5">
            Export
            <Download className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </Button>
          <Button variant="toolbar" disabled className="w-export-button gap-1.5">
            Export
            <Download className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </div>
      </Subsection>
    </section>
  );
}
