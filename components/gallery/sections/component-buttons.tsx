import { ChevronLeft, Share2 } from "lucide-react";
import { Children, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { SectionHeading, StatusBadge } from "@/components/gallery/primitives";

const STATES = ["Default", "Active", "Disabled"] as const;

export function ComponentButtonsSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="components-buttons"
        title="Buttons"
        description="Four variants, one shared component. None define a distinct :hover look — press feedback (active) is the only motion, consistent with the system's snap-not-float rule."
        status="live"
      />

      <div className="grid grid-cols-1 gap-y-8">
        <ButtonRow label="Primary — Generate">
          <Button variant="primary">Generate</Button>
          <Button variant="primary" demoState="active">
            Generate
          </Button>
          <Button variant="primary" disabled>
            Generate
          </Button>
        </ButtonRow>

        <ButtonRow label="Accent — Export (the only place green appears)">
          <Button variant="accent">Export ↓</Button>
          <Button variant="accent" demoState="active">
            Export ↓
          </Button>
          <Button variant="accent" disabled>
            Export ↓
          </Button>
        </ButtonRow>

        <ButtonRow label="Secondary — Aspect ratio selector">
          <Button variant="secondary">Square 1:1 ▾</Button>
          <Button variant="secondary" demoState="active">
            Square 1:1 ▾
          </Button>
          <Button variant="secondary" disabled>
            Square 1:1 ▾
          </Button>
        </ButtonRow>

        <ButtonRow label="Icon — pagination arrow">
          <Button variant="icon" aria-label="Scroll left">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="icon" demoState="active" aria-label="Scroll left">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="icon" disabled aria-label="Scroll left">
            <ChevronLeft className="size-4" />
          </Button>
        </ButtonRow>

        <ButtonRow
          label={
            <>
              Icon — Share <StatusBadge status="planned" />
            </>
          }
        >
          <Button variant="icon" aria-label="Share">
            <Share2 className="size-4" />
          </Button>
          <Button variant="icon" demoState="active" aria-label="Share">
            <Share2 className="size-4" />
          </Button>
          <Button variant="icon" disabled aria-label="Share">
            <Share2 className="size-4" />
          </Button>
        </ButtonRow>
      </div>
    </section>
  );
}

function ButtonRow({ label, children }: { label: ReactNode; children: ReactNode }) {
  const buttons = Children.toArray(children);
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-2 text-sm font-medium">{label}</p>
      <div className="grid grid-cols-3 items-center gap-4">
        {buttons.map((button, index) => (
          <div key={index} className="flex flex-col items-start gap-2">
            {button}
            <p className="text-xs text-muted-foreground">{STATES[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
