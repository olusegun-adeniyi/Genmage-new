import Image from "next/image";

import { EXAMPLES } from "@/config/examples";
import { SectionHeading } from "@/components/gallery/primitives";

const ROWS = [
  { image: EXAMPLES[0].image, prompt: EXAMPLES[0].prompt, timestamp: "2m ago", state: "default" as const },
  { image: EXAMPLES[1].image, prompt: EXAMPLES[1].prompt, timestamp: "5m ago", state: "hover" as const },
  { image: EXAMPLES[2].image, prompt: EXAMPLES[2].prompt, timestamp: "1h ago", state: "active" as const },
];

const STATE_CLASSES = {
  default: "bg-transparent",
  hover: "bg-muted",
  // Fourth neutral step doesn't exist yet — see DESIGN-SYSTEM.md → History log entry.
  // Reusing foreground at low opacity as a stand-in for the active/current-selection treatment.
  active: "bg-foreground/[0.06] border-l-2 border-foreground pl-[calc(0.75rem-2px)]",
};

const STATE_LABEL = { default: "Default", hover: "Hover", active: "Active (currently shown in canvas)" };

export function ComponentHistoryEntrySection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="components-history-entry"
        title="History log entry"
        description="The active-state treatment needs a fourth neutral color step that doesn't exist in tokens.ts yet — this uses foreground at low opacity as a placeholder, flagged for a real decision in Phase D."
        status="planned"
      />
      <div className="max-w-sm overflow-hidden rounded-lg border border-border">
        {ROWS.map((row) => (
          <div key={row.timestamp} className={`flex items-center gap-3 p-3 ${STATE_CLASSES[row.state]}`}>
            <div className="size-12 shrink-0 overflow-hidden rounded-md border border-border">
              <Image src={row.image} alt="" width={48} height={48} className="size-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs">{row.prompt}</p>
              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{row.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-6 text-xs text-muted-foreground">
        {ROWS.map((row) => (
          <span key={row.timestamp}>{STATE_LABEL[row.state]}</span>
        ))}
      </div>
    </section>
  );
}
