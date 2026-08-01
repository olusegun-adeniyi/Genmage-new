import { TopBar } from "@/components/shell/top-bar";
import { SectionHeading } from "@/components/gallery/primitives";

export function ComponentWordmarkSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="components-wordmark"
        title="Wordmark"
        description="Plain text, no logomark. Same component, one variant prop swaps the color token for the dark surface."
        status="live"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex h-24 items-center justify-center rounded-lg bg-background">
          <TopBar />
          <span className="sr-only">Light surface</span>
        </div>
        <div className="flex h-24 items-center justify-center rounded-lg bg-surface-dark">
          <TopBar variant="dark" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2">
        <p className="text-xs text-muted-foreground">Light surface — variant=&quot;light&quot; (default)</p>
        <p className="text-xs text-muted-foreground">Dark surface — variant=&quot;dark&quot;</p>
      </div>
    </section>
  );
}
