import { Check } from "lucide-react";

import { SectionHeading } from "@/components/gallery/primitives";

export function ComponentToastSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="components-toast"
        title="Toast notification"
        description="Positioned as it will appear in-app: bottom-center, inverted for momentary high contrast. Auto-dismisses in 3s — short because the message itself takes no time to read."
        status="planned"
      />
      <div className="relative flex h-32 items-end justify-center overflow-hidden rounded-lg bg-muted p-6">
        <div className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm text-background">
          <Check className="size-4" strokeWidth={2.5} />
          Link copied
        </div>
      </div>
    </section>
  );
}
