import { Check, X } from "lucide-react";

import { SectionHeading } from "@/components/gallery/primitives";

const ALWAYS = [
  "Use design/tokens.ts / the Tailwind classes it generates — never inline values",
  "Consult the Frontend Design Skill and UI/UX Pro Max Skill before a new visual component or pattern — and note what was drawn from each",
  "Give every interactive element visible active / hover / focus-visible feedback",
];

const NEVER = [
  "Introduce a new color without adding it to tokens.ts first, with a usage comment",
  "Use !important",
  "Put the green accent anywhere except the Export button",
  "Put drop shadows or gradients on anything",
  "Build a \"planned\" pattern from scratch mid-build — check DESIGN-SYSTEM.md first, the decision is already made",
];

export function RulesSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading id="rules" title="Rules" description="From DESIGN-SYSTEM.md — verbatim, not paraphrased." />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-5">
          <p className="mb-3 text-sm font-medium">Always</p>
          <ul className="flex flex-col gap-2.5">
            {ALWAYS.map((rule) => (
              <li key={rule} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-foreground" strokeWidth={2} />
                {rule}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border p-5">
          <p className="mb-3 text-sm font-medium">Never</p>
          <ul className="flex flex-col gap-2.5">
            {NEVER.map((rule) => (
              <li key={rule} className="flex items-start gap-2 text-sm text-muted-foreground">
                <X className="mt-0.5 size-4 shrink-0 text-danger" strokeWidth={2} />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
