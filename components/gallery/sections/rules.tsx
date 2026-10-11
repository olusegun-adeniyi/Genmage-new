import { Check, X } from "lucide-react";

import { SectionHeading } from "@/components/gallery/primitives";

const ALWAYS = [
  "Use design/tokens.ts / the Tailwind classes it generates — never inline values",
  "Consult the Frontend Design Skill and UI/UX Pro Max Skill before a new visual component or pattern — and note what was drawn from each",
  "Give every interactive element visible hover and focus-visible feedback",
  "Build hierarchy with the neutral ramp (foregroundStrong → foreground → mutedForeground), not size or weight",
];

const NEVER = [
  "Introduce a new color without adding it to tokens.ts first, with a usage comment",
  "Use the primary purple anywhere except the active Generate button",
  "Add a second type size or weight",
  "Put drop shadows on anything but floating menus, or use gradients",
  "Use the edit overlay colours on interface chrome",
];

export function RulesSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading id="rules" title="Rules" description="From DESIGN-SYSTEM.md." />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-5">
          <p className="mb-3 text-foreground-strong">Always</p>
          <ul className="flex flex-col gap-2.5">
            {ALWAYS.map((rule) => (
              <li key={rule} className="flex items-start gap-2 text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-foreground" strokeWidth={1.5} />
                {rule}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border p-5">
          <p className="mb-3 text-foreground-strong">Never</p>
          <ul className="flex flex-col gap-2.5">
            {NEVER.map((rule) => (
              <li key={rule} className="flex items-start gap-2 text-muted-foreground">
                <X className="mt-0.5 size-4 shrink-0 text-danger" strokeWidth={1.5} />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
