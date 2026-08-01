import type { ReactNode } from "react";

type SectionHeadingProps = {
  id: string;
  title: string;
  description?: string;
  status?: "live" | "planned";
};

// scroll-mt-24 keeps the heading clear of nothing today (no fixed top bar), but
// reserves space so an in-page anchor jump never lands flush against the viewport edge.
export function SectionHeading({ id, title, description, status }: SectionHeadingProps) {
  return (
    <div id={id} className="scroll-mt-8">
      <div className="flex items-center gap-2.5">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {status && <StatusBadge status={status} />}
      </div>
      {description && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

export function StatusBadge({ status }: { status: "live" | "planned" }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase ${
        status === "live" ? "border-border text-muted-foreground" : "border-dashed border-border text-muted-foreground"
      }`}
    >
      {status === "live" ? "Live" : "Planned — spec"}
    </span>
  );
}

export function Subsection({
  label,
  note,
  children,
}: {
  label: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline gap-2">
        <p className="text-sm font-medium">{label}</p>
        {note && <p className="text-xs text-muted-foreground">{note}</p>}
      </div>
      {children}
    </div>
  );
}
